const express = require('express');
const cors = require('cors');
const path = require('node:path');
const { db, DB_PATH } = require('./db');
require('./seed'); // Ensure database is initialized & seeded
const { calculateSM2 } = require('./sm2');
const { exportDatabaseJSON, importDatabaseJSON, createLocalSnapshot } = require('./backup');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Helper: check correctness
function evaluateAnswer(q, userAnswer) {
  if (userAnswer === null || userAnswer === undefined || userAnswer === '') {
    return false;
  }
  if (q.type === 'MCQ') {
    return String(userAnswer).trim().toUpperCase() === String(q.correct_answer).trim().toUpperCase();
  } else if (q.type === 'MSQ') {
    try {
      const correctArr = JSON.parse(q.correct_answer).sort();
      const userArr = (Array.isArray(userAnswer) ? userAnswer : JSON.parse(userAnswer)).sort();
      return JSON.stringify(correctArr) === JSON.stringify(userArr);
    } catch {
      return false;
    }
  } else if (q.type === 'NAT') {
    const correctVal = parseFloat(q.correct_answer);
    const userVal = parseFloat(userAnswer);
    if (isNaN(correctVal) || isNaN(userVal)) {
      return String(userAnswer).trim() === String(q.correct_answer).trim();
    }
    return Math.abs(correctVal - userVal) < 0.01;
  }
  return false;
}

// 1. Dashboard Overview
app.get('/api/overview', (req, res) => {
  try {
    const totalLessons = db.prepare('SELECT COUNT(*) as c FROM lessons').get().c;
    const completedLessons = db.prepare("SELECT COUNT(*) as c FROM user_lesson_progress WHERE status = 'completed'").get().c;

    // Breakdown by tier
    const tierStats = db.prepare(`
      SELECT s.tier, COUNT(DISTINCT l.id) as total_lessons,
             SUM(CASE WHEN p.status = 'completed' THEN 1 ELSE 0 END) as completed_lessons
      FROM subjects s
      JOIN topics t ON s.id = t.subject_id
      LEFT JOIN lessons l ON t.id = l.topic_id
      LEFT JOIN user_lesson_progress p ON l.id = p.lesson_id
      GROUP BY s.tier
      ORDER BY s.tier ASC
    `).all();

    // Spaced repetition due count
    const nowIso = new Date().toISOString();
    const dueReviews = db.prepare(`
      SELECT COUNT(*) as c FROM spaced_repetition_cards WHERE due_date <= ?
    `).get(nowIso).c;

    // Weak areas (Topics where question accuracy is < 60% with at least 1 attempt)
    const weakTopics = db.prepare(`
      SELECT t.id, t.name as topic_name, s.name as subject_name, s.tier, t.is_high_yield,
             COUNT(a.id) as total_attempts,
             SUM(a.is_correct) as correct_attempts,
             ROUND(CAST(SUM(a.is_correct) AS REAL) * 100.0 / COUNT(a.id), 1) as accuracy
      FROM topics t
      JOIN subjects s ON t.subject_id = s.id
      JOIN questions q ON t.id = q.topic_id
      JOIN user_question_attempts a ON q.id = a.question_id
      GROUP BY t.id
      HAVING accuracy < 60.0 AND total_attempts >= 1
      ORDER BY t.is_high_yield DESC, accuracy ASC
      LIMIT 5
    `).all();

    // Overall attempt accuracy
    const overallStats = db.prepare(`
      SELECT COUNT(*) as total_attempts,
             COALESCE(SUM(is_correct), 0) as total_correct
      FROM user_question_attempts
    `).get();

    // Mock summary
    const mockSummary = db.prepare(`
      SELECT COUNT(*) as total_mocks,
             COALESCE(MAX(score_obtained), 0) as high_score,
             COALESCE((SELECT score_obtained FROM mock_sessions ORDER BY created_at DESC LIMIT 1), 0) as latest_score,
             COALESCE((SELECT passed_cutoff FROM mock_sessions ORDER BY created_at DESC LIMIT 1), 0) as latest_passed
      FROM mock_sessions
    `).get();

    // Consistency streak: count distinct days in last 30 days
    const recentActivityDays = db.prepare(`
      SELECT DISTINCT SUBSTR(attempted_at, 1, 10) as day
      FROM user_question_attempts
      ORDER BY day DESC
      LIMIT 30
    `).all().map(r => r.day);

    let streak = 0;
    const todayStr = new Date().toISOString().substring(0, 10);
    let checkDate = new Date();
    // Check if activity today or yesterday to maintain active streak
    let activeDay = recentActivityDays.includes(todayStr);
    if (!activeDay) {
      checkDate.setDate(checkDate.getDate() - 1);
      const yesterdayStr = checkDate.toISOString().substring(0, 10);
      if (recentActivityDays.includes(yesterdayStr)) {
        activeDay = true;
      }
    }
    if (activeDay) {
      streak = recentActivityDays.length; // simplified streak count
    }

    const settingsRows = db.prepare('SELECT * FROM study_settings').all();
    const settings = {};
    settingsRows.forEach(s => { settings[s.key] = s.value; });

    res.json({
      totalLessons,
      completedLessons,
      overallProgressPct: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
      tierStats,
      dueReviews,
      weakTopics,
      overallAttempts: overallStats.total_attempts,
      overallCorrect: overallStats.total_correct,
      overallAccuracy: overallStats.total_attempts > 0 ? Math.round((overallStats.total_correct / overallStats.total_attempts) * 100) : 0,
      mockSummary,
      streak,
      settings
    });
  } catch (err) {
    console.error('Error in /api/overview:', err);
    res.status(500).json({ error: err.message });
  }
});

// 2. Subjects List
app.get('/api/subjects', (req, res) => {
  try {
    const subjects = db.prepare(`
      SELECT s.*, 
             COUNT(DISTINCT t.id) as topic_count,
             COUNT(DISTINCT l.id) as lesson_count,
             COUNT(DISTINCT q.id) as question_count,
             SUM(CASE WHEN p.status = 'completed' THEN 1 ELSE 0 END) as completed_lessons
      FROM subjects s
      LEFT JOIN topics t ON s.id = t.subject_id
      LEFT JOIN lessons l ON t.id = l.topic_id
      LEFT JOIN questions q ON s.id = q.subject_id
      LEFT JOIN user_lesson_progress p ON l.id = p.lesson_id
      GROUP BY s.id
      ORDER BY s.tier ASC, s.priority_weight DESC
    `).all();

    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Topics with Lessons and Progress
app.get('/api/topics', (req, res) => {
  try {
    const { subject_id } = req.query;
    let query = `
      SELECT t.*, s.name as subject_name, s.tier as subject_tier, s.reference_book,
             l.id as lesson_id, l.title as lesson_title, l.citation as lesson_citation,
             COALESCE(p.status, 'not_started') as lesson_status,
             p.quick_checks_passed,
             (SELECT COUNT(*) FROM questions q WHERE q.topic_id = t.id) as question_count,
             (SELECT COUNT(*) FROM flashcards fc WHERE fc.topic_id = t.id) as flashcard_count
      FROM topics t
      JOIN subjects s ON t.subject_id = s.id
      LEFT JOIN lessons l ON t.id = l.topic_id
      LEFT JOIN user_lesson_progress p ON l.id = p.lesson_id
    `;
    const params = [];
    if (subject_id) {
      query += ' WHERE t.subject_id = ?';
      params.push(subject_id);
    }
    query += ' ORDER BY s.tier ASC, t.is_high_yield DESC, t.order_index ASC';

    const topics = db.prepare(query).all(...params);
    res.json(topics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Single Lesson Details
app.get('/api/lessons/:lessonId', (req, res) => {
  try {
    const lesson = db.prepare(`
      SELECT l.*, t.name as topic_name, t.is_high_yield, s.name as subject_name, s.tier, s.reference_book,
             p.status, p.quick_checks_passed, p.completed_at
      FROM lessons l
      JOIN topics t ON l.topic_id = t.id
      JOIN subjects s ON t.subject_id = s.id
      LEFT JOIN user_lesson_progress p ON l.id = p.lesson_id
      WHERE l.id = ?
    `).get(req.params.lessonId);

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    lesson.quick_check_questions = JSON.parse(lesson.quick_check_questions || '[]');
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Complete Lesson with Quick-Checks verification
app.post('/api/lessons/:lessonId/complete', (req, res) => {
  try {
    const { answers, timeSpentSecs = 60 } = req.body; // answers is an object: { [qc_id]: selected_index }
    const lesson = db.prepare('SELECT * FROM lessons WHERE id = ?').get(req.params.lessonId);
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    const quickChecks = JSON.parse(lesson.quick_check_questions || '[]');
    let passedCount = 0;
    const feedback = [];

    quickChecks.forEach((qc, idx) => {
      const userSelected = answers ? answers[qc.id] : undefined;
      const isCorrect = userSelected === qc.correct_index;
      if (isCorrect) passedCount++;

      feedback.push({
        id: qc.id,
        question: qc.question,
        userSelected,
        correctIndex: qc.correct_index,
        isCorrect,
        explanation: qc.explanation,
      });

      // Record question attempt
      const attemptId = `att_qc_${Date.now()}_${idx}`;
      db.prepare(`
        INSERT INTO user_question_attempts (id, question_id, user_answer, is_correct, time_spent_secs, mode, session_id, attempted_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        attemptId,
        qc.id,
        String(userSelected),
        isCorrect ? 1 : 0,
        Math.round(timeSpentSecs / quickChecks.length),
        'lesson_check',
        null,
        new Date().toISOString()
      );
    });

    const allCorrect = passedCount === quickChecks.length;
    const nowIso = new Date().toISOString();

    if (allCorrect) {
      // Upsert progress as completed
      db.prepare(`
        INSERT INTO user_lesson_progress (lesson_id, status, quick_checks_passed, completed_at, updated_at)
        VALUES (?, 'completed', ?, ?, ?)
        ON CONFLICT(lesson_id) DO UPDATE SET
          status = 'completed',
          quick_checks_passed = excluded.quick_checks_passed,
          completed_at = excluded.completed_at,
          updated_at = excluded.updated_at
      `).run(lesson.id, passedCount, nowIso, nowIso);

      // Create an automatic spaced repetition review card for this lesson so it resurfaces in 1 day!
      const srId = `sr_lesson_${lesson.id}`;
      const existingSr = db.prepare('SELECT * FROM spaced_repetition_cards WHERE id = ?').get(srId);
      if (!existingSr) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        db.prepare(`
          INSERT INTO spaced_repetition_cards (id, item_type, item_id, repetition, interval_days, ease_factor, due_date, last_reviewed_at, last_rating)
          VALUES (?, 'lesson', ?, 0, 1, 2.5, ?, ?, 3)
        `).run(srId, lesson.id, tomorrow.toISOString(), nowIso);
      }
    } else {
      // Mark in_progress
      db.prepare(`
        INSERT INTO user_lesson_progress (lesson_id, status, quick_checks_passed, completed_at, updated_at)
        VALUES (?, 'in_progress', ?, NULL, ?)
        ON CONFLICT(lesson_id) DO UPDATE SET
          status = 'in_progress',
          quick_checks_passed = excluded.quick_checks_passed,
          updated_at = excluded.updated_at
      `).run(lesson.id, passedCount, nowIso);
    }

    res.json({
      allCorrect,
      passedCount,
      totalCount: quickChecks.length,
      feedback,
      message: allCorrect
        ? 'All quick checks passed! Lesson marked as Completed.'
        : 'Some quick checks were incorrect. Review explanations below and retry.'
    });
  } catch (err) {
    console.error('Error completing lesson:', err);
    res.status(500).json({ error: err.message });
  }
});

// 6. Spaced Repetition Due Reviews
app.get('/api/reviews/due', (req, res) => {
  try {
    const nowIso = new Date().toISOString();
    const dueCards = db.prepare(`
      SELECT sr.*, 
             CASE 
               WHEN sr.item_type = 'flashcard' THEN COALESCE(fc.front, 'Concept Review')
               WHEN sr.item_type = 'lesson' THEN 'Review High-Yield Concept: ' || COALESCE(l.title, 'Lesson Review')
               WHEN sr.item_type = 'question' THEN COALESCE(q.question_text, 'Practice Question')
               ELSE 'Review Item' 
             END as flashcard_front,
             CASE 
               WHEN sr.item_type = 'flashcard' THEN COALESCE(fc.back, 'No explanation available')
               WHEN sr.item_type = 'lesson' THEN COALESCE(l.content_markdown, 'Lesson content summary')
               WHEN sr.item_type = 'question' THEN COALESCE(q.explanation, 'Correct answer: ' || COALESCE(q.correct_answer, ''))
               ELSE 'No explanation available' 
             END as flashcard_back,
             CASE 
               WHEN sr.item_type = 'flashcard' THEN fc.citation
               WHEN sr.item_type = 'lesson' THEN l.citation
               ELSE NULL 
             END as flashcard_citation,
             q.question_text, q.options as question_options, q.type as question_type, q.correct_answer, q.explanation as question_explanation,
             COALESCE(t.name, t_q.name, t_l.name) as topic_name,
             COALESCE(s.name, s_q.name, s_l.name) as subject_name,
             COALESCE(s.tier, s_q.tier, s_l.tier) as subject_tier,
             COALESCE(t.is_high_yield, t_q.is_high_yield, t_l.is_high_yield) as is_high_yield
      FROM spaced_repetition_cards sr
      LEFT JOIN flashcards fc ON sr.item_type = 'flashcard' AND sr.item_id = fc.id
      LEFT JOIN topics t ON fc.topic_id = t.id
      LEFT JOIN subjects s ON fc.subject_id = s.id
      LEFT JOIN questions q ON sr.item_type = 'question' AND sr.item_id = q.id
      LEFT JOIN topics t_q ON q.topic_id = t_q.id
      LEFT JOIN subjects s_q ON q.subject_id = s_q.id
      LEFT JOIN lessons l ON sr.item_type = 'lesson' AND sr.item_id = l.id
      LEFT JOIN topics t_l ON l.topic_id = t_l.id
      LEFT JOIN subjects s_l ON t_l.subject_id = s_l.id
      WHERE sr.due_date <= ? OR sr.repetition = 0
      ORDER BY sr.repetition ASC, sr.due_date ASC
      LIMIT 20
    `).all(nowIso);

    dueCards.forEach(c => {
      if (c.question_options) {
        try { c.question_options = JSON.parse(c.question_options); } catch {}
      }
    });

    res.json(dueCards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Rate Spaced Repetition Card (SM-2)
app.post('/api/reviews/:cardId/rate', (req, res) => {
  try {
    const { rating } = req.body; // 1 = Again, 2 = Hard, 3 = Good, 4 = Easy
    if (![1, 2, 3, 4].includes(Number(rating))) {
      return res.status(400).json({ error: 'Rating must be 1, 2, 3, or 4' });
    }

    const card = db.prepare('SELECT * FROM spaced_repetition_cards WHERE id = ?').get(req.params.cardId);
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    const sm2Result = calculateSM2({
      repetition: card.repetition,
      intervalDays: card.interval_days,
      easeFactor: card.ease_factor,
      rating: Number(rating),
    });

    const nowIso = new Date().toISOString();
    db.prepare(`
      UPDATE spaced_repetition_cards
      SET repetition = ?, interval_days = ?, ease_factor = ?, due_date = ?, last_reviewed_at = ?, last_rating = ?
      WHERE id = ?
    `).run(
      sm2Result.repetition,
      sm2Result.intervalDays,
      sm2Result.easeFactor,
      sm2Result.dueDate,
      nowIso,
      Number(rating),
      card.id
    );

    res.json({
      success: true,
      cardId: card.id,
      sm2: sm2Result,
      message: `Card scheduled in ${sm2Result.intervalDays} day(s) (Repetition: ${sm2Result.repetition}, EF: ${sm2Result.easeFactor})`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Questions Query (Practice & PYQ Bank)
app.get('/api/questions', (req, res) => {
  try {
    const { subject_id, topic_id, tier, type, difficulty, is_pyq, is_high_yield, interleaving, limit = 50 } = req.query;

    let query = `
      SELECT q.*, s.name as subject_name, s.tier, s.reference_book, t.name as topic_name, t.is_high_yield,
             (SELECT COUNT(*) FROM user_question_attempts a WHERE a.question_id = q.id) as user_attempts_count,
             (SELECT is_correct FROM user_question_attempts a WHERE a.question_id = q.id ORDER BY attempted_at DESC LIMIT 1) as last_attempt_correct
      FROM questions q
      JOIN subjects s ON q.subject_id = s.id
      JOIN topics t ON q.topic_id = t.id
      WHERE 1=1
    `;
    const params = [];

    if (subject_id) {
      query += ' AND q.subject_id = ?';
      params.push(subject_id);
    }
    if (topic_id) {
      query += ' AND q.topic_id = ?';
      params.push(topic_id);
    }
    if (tier) {
      query += ' AND s.tier = ?';
      params.push(Number(tier));
    }
    if (type) {
      query += ' AND q.type = ?';
      params.push(type);
    }
    if (difficulty) {
      query += ' AND q.difficulty = ?';
      params.push(difficulty);
    }
    if (is_pyq !== undefined && is_pyq !== '') {
      query += ' AND q.is_pyq = ?';
      params.push(Number(is_pyq));
    }
    if (is_high_yield !== undefined && is_high_yield !== '') {
      query += ' AND t.is_high_yield = ?';
      params.push(Number(is_high_yield));
    }

    if (interleaving === 'true') {
      // Interleaving mode: mix subjects randomly weighted by priority
      query += ' ORDER BY RANDOM()';
    } else {
      query += ' ORDER BY s.tier ASC, t.is_high_yield DESC, q.marks ASC';
    }

    query += ' LIMIT ?';
    params.push(Number(limit));

    const questions = db.prepare(query).all(...params);
    questions.forEach(q => {
      if (q.options) {
        try { q.options = JSON.parse(q.options); } catch {}
      }
    });

    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 9. Attempt Question
app.post('/api/questions/:questionId/attempt', (req, res) => {
  try {
    const { userAnswer, timeSpentSecs = 30, mode = 'practice', sessionId = null } = req.body;
    const q = db.prepare('SELECT * FROM questions WHERE id = ?').get(req.params.questionId);
    if (!q) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const isCorrect = evaluateAnswer(q, userAnswer);
    const attemptId = `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const nowIso = new Date().toISOString();

    db.prepare(`
      INSERT INTO user_question_attempts (id, question_id, user_answer, is_correct, time_spent_secs, mode, session_id, attempted_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      attemptId,
      q.id,
      typeof userAnswer === 'object' ? JSON.stringify(userAnswer) : String(userAnswer),
      isCorrect ? 1 : 0,
      timeSpentSecs,
      mode,
      sessionId,
      nowIso
    );

    // If missed or in practice mode, create/update a spaced repetition card so it resurfaces!
    const srId = `sr_q_${q.id}`;
    const existingSr = db.prepare('SELECT * FROM spaced_repetition_cards WHERE id = ?').get(srId);
    if (!isCorrect) {
      // Schedule for review tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      if (existingSr) {
        db.prepare('UPDATE spaced_repetition_cards SET due_date = ?, repetition = 0 WHERE id = ?').run(tomorrow.toISOString(), srId);
      } else {
        db.prepare(`
          INSERT INTO spaced_repetition_cards (id, item_type, item_id, repetition, interval_days, ease_factor, due_date, last_reviewed_at, last_rating)
          VALUES (?, 'question', ?, 0, 1, 2.5, ?, ?, 1)
        `).run(srId, q.id, tomorrow.toISOString(), nowIso);
      }
    }

    res.json({
      attemptId,
      isCorrect,
      correctAnswer: q.correct_answer,
      explanation: q.explanation,
      marks: q.marks,
      type: q.type
    });
  } catch (err) {
    console.error('Error attempting question:', err);
    res.status(500).json({ error: err.message });
  }
});

// 10. Weak Area Drill
app.get('/api/weak-areas/drill', (req, res) => {
  try {
    // Pull disproportionately from low-accuracy topics or topics not yet mastered
    const drillQuestions = db.prepare(`
      SELECT q.*, s.name as subject_name, s.tier, t.name as topic_name, t.is_high_yield,
             (SELECT COUNT(*) FROM user_question_attempts a WHERE a.question_id = q.id) as attempts_count,
             (SELECT SUM(a.is_correct) FROM user_question_attempts a WHERE a.question_id = q.id) as correct_count
      FROM questions q
      JOIN topics t ON q.topic_id = t.id
      JOIN subjects s ON q.subject_id = s.id
      WHERE t.id IN (
        SELECT t2.id FROM topics t2
        JOIN questions q2 ON t2.id = q2.topic_id
        LEFT JOIN user_question_attempts a2 ON q2.id = a2.question_id
        GROUP BY t2.id
        ORDER BY (COALESCE(SUM(a2.is_correct), 0) * 1.0 / MAX(COUNT(a2.id), 1)) ASC, t2.is_high_yield DESC
        LIMIT 4
      )
      ORDER BY RANDOM()
      LIMIT 10
    `).all();

    drillQuestions.forEach(q => {
      if (q.options) {
        try { q.options = JSON.parse(q.options); } catch {}
      }
    });

    res.json(drillQuestions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 11. Mock Test: Start Session
app.post('/api/mock/start', (req, res) => {
  try {
    const { title = 'GATE CSE High-Yield Mock Test', questionCount = 10, durationMinutes = 30 } = req.body;
    // Pull questions respecting Tier priority: 60% Tier 1, 30% Tier 2, 10% Tier 3
    const questions = db.prepare(`
      SELECT q.*, s.name as subject_name, s.tier, t.name as topic_name
      FROM questions q
      JOIN subjects s ON q.subject_id = s.id
      JOIN topics t ON q.topic_id = t.id
      ORDER BY RANDOM()
      LIMIT ?
    `).all(Number(questionCount));

    const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
    const sessionId = `mock_${Date.now()}`;

    questions.forEach(q => {
      if (q.options) {
        try { q.options = JSON.parse(q.options); } catch {}
      }
    });

    res.json({
      sessionId,
      title,
      totalMarks,
      durationMinutes,
      questions
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 12. Mock Test: Submit & Score with real GATE Negative Marking
app.post('/api/mock/:sessionId/submit', (req, res) => {
  try {
    const { answers, timeSpentSeconds = 0, title = 'GATE CSE Mock Test' } = req.body; // answers: { [qId]: { userAnswer, timeSpent } }
    const sessionId = req.params.sessionId;

    const questionIds = Object.keys(answers || {});
    if (questionIds.length === 0) {
      return res.status(400).json({ error: 'No answers provided' });
    }

    const placeholders = questionIds.map(() => '?').join(',');
    const questions = db.prepare(`
      SELECT q.*, s.name as subject_name, s.tier, t.name as topic_name
      FROM questions q
      JOIN subjects s ON q.subject_id = s.id
      JOIN topics t ON q.topic_id = t.id
      WHERE q.id IN (${placeholders})
    `).all(...questionIds);

    let totalMarks = 0;
    let scoreObtained = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;
    const subjectStats = {};
    const recordedAnswers = [];
    const nowIso = new Date().toISOString();

    const insertMockAnswer = db.prepare(`
      INSERT INTO mock_answers (id, session_id, question_id, user_answer, is_attempted, is_correct, marks_allocated, marks_obtained, time_spent_secs, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    questions.forEach(q => {
      const ansObj = answers[q.id] || {};
      const userAnswer = ansObj.userAnswer;
      const qTimeSpent = ansObj.timeSpent || 0;
      totalMarks += q.marks;

      const isAttempted = userAnswer !== null && userAnswer !== undefined && userAnswer !== '';
      let isCorrect = false;
      let marksObtained = 0;

      if (!isAttempted) {
        unattemptedCount++;
      } else {
        isCorrect = evaluateAnswer(q, userAnswer);
        if (isCorrect) {
          correctCount++;
          marksObtained = q.marks;
        } else {
          incorrectCount++;
          // Real GATE Negative Marking rules:
          // 1-mark MCQ: -1/3 (-0.33)
          // 2-mark MCQ: -2/3 (-0.66)
          // MSQ and NAT: NO negative marking (0 penalty)
          if (q.type === 'MCQ') {
            marksObtained = q.marks === 1.0 ? -(1.0 / 3.0) : -(2.0 / 3.0);
          } else {
            marksObtained = 0;
          }
        }
      }

      scoreObtained += marksObtained;

      // Subject breakdown
      if (!subjectStats[q.subject_name]) {
        subjectStats[q.subject_name] = { total: 0, correct: 0, marksScored: 0, maxMarks: 0, tier: q.tier };
      }
      subjectStats[q.subject_name].total++;
      if (isCorrect) subjectStats[q.subject_name].correct++;
      subjectStats[q.subject_name].marksScored += marksObtained;
      subjectStats[q.subject_name].maxMarks += q.marks;
      recordedAnswers.push({
        questionId: q.id,
        questionText: q.question_text,
        type: q.type,
        marks: q.marks,
        subjectName: q.subject_name,
        userAnswer,
        correctAnswer: q.correct_answer,
        isCorrect,
        isAttempted,
        marksObtained: parseFloat(marksObtained.toFixed(2)),
        timeSpentSecs: qTimeSpent,
        explanation: q.explanation
      });
    });

    // Qualifying cutoff check (Target 35/100 or scaled)
    const targetCutoff = 35.0;
    // Scale cutoff to mock's total marks if less than 100 marks
    const scaledCutoff = (totalMarks < 100) ? parseFloat(((targetCutoff / 100) * totalMarks).toFixed(1)) : targetCutoff;
    const passedCutoff = scoreObtained >= scaledCutoff ? 1 : 0;

    // 1. Save parent session first
    db.prepare(`
      INSERT INTO mock_sessions (id, title, total_marks, score_obtained, target_cutoff, passed_cutoff, duration_seconds, time_spent_seconds, subject_breakdown, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      sessionId,
      title,
      parseFloat(totalMarks.toFixed(2)),
      parseFloat(scoreObtained.toFixed(2)),
      scaledCutoff,
      passedCutoff,
      timeSpentSeconds,
      timeSpentSeconds,
      JSON.stringify(subjectStats),
      nowIso
    );

    // 2. Now insert child mock answers
    recordedAnswers.forEach(ra => {
      const ansRecordId = `ma_${sessionId}_${ra.questionId}`;
      insertMockAnswer.run(
        ansRecordId,
        sessionId,
        ra.questionId,
        ra.userAnswer ? String(ra.userAnswer) : null,
        ra.isAttempted ? 1 : 0,
        ra.isCorrect ? 1 : 0,
        ra.marks,
        ra.marksObtained,
        ra.timeSpentSecs,
        nowIso
      );
    });

    res.json({
      sessionId,
      totalMarks: parseFloat(totalMarks.toFixed(2)),
      scoreObtained: parseFloat(scoreObtained.toFixed(2)),
      scaledCutoff,
      passedCutoff: Boolean(passedCutoff),
      correctCount,
      incorrectCount,
      unattemptedCount,
      subjectBreakdown: subjectStats,
      recordedAnswers
    });
  } catch (err) {
    console.error('Error submitting mock test:', err);
    res.status(500).json({ error: err.message });
  }
});

// 13. Mock History
app.get('/api/mock/history', (req, res) => {
  try {
    const history = db.prepare('SELECT * FROM mock_sessions ORDER BY created_at DESC').all();
    history.forEach(h => {
      if (h.subject_breakdown) {
        try { h.subject_breakdown = JSON.parse(h.subject_breakdown); } catch {}
      }
    });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 14. Study Calendar & Settings
app.get('/api/calendar', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM study_settings').all();
    const config = {};
    rows.forEach(r => {
      try {
        config[r.key] = JSON.parse(r.value);
      } catch {
        config[r.key] = r.value;
      }
    });
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/calendar', (req, res) => {
  try {
    const { target_exam_date, target_cutoff, current_mode, busy_periods } = req.body;
    const stmt = db.prepare(`
      INSERT INTO study_settings (key, value) VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `);

    if (target_exam_date) stmt.run('target_exam_date', String(target_exam_date));
    if (target_cutoff) stmt.run('target_cutoff', String(target_cutoff));
    if (current_mode) stmt.run('current_mode', String(current_mode));
    if (busy_periods) stmt.run('busy_periods', JSON.stringify(busy_periods));

    res.json({ success: true, message: 'Settings saved' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 15. Concrete Backup & Export Endpoints
app.get('/api/backup/export', (req, res) => {
  try {
    const backupData = exportDatabaseJSON();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="gate_cse_2027_backup_${new Date().toISOString().substring(0, 10)}.json"`);
    res.json(backupData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/backup/import', (req, res) => {
  try {
    const result = importDatabaseJSON(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/backup/download-db', (req, res) => {
  try {
    res.download(DB_PATH, 'gate_study.db');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/backup/snapshot', (req, res) => {
  try {
    const snapshotPath = createLocalSnapshot();
    res.json({ success: true, path: snapshotPath });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve static client assets if built
const clientDist = path.join(__dirname, '..', 'client', 'dist');
const fs = require('node:fs');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(clientDist, 'index.html'));
    }
    next();
  });
}


app.listen(PORT, () => {
  console.log(`GATE CSE 2027 Study Platform API running on http://localhost:${PORT}`);
});

