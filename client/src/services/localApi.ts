import curriculum from '../data/curriculumSeed.json';

// Local Persistence Keys
const KEYS = {
  LESSON_PROGRESS: 'gate_user_lesson_progress',
  QUESTION_ATTEMPTS: 'gate_user_question_attempts',
  SPACED_CARDS: 'gate_spaced_repetition_cards',
  MOCK_SESSIONS: 'gate_mock_sessions',
  MOCK_ANSWERS: 'gate_mock_answers',
  SETTINGS: 'gate_study_settings',
};

// Safe JSON LocalStorage Helpers
function getStore<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return defaultValue;
  }
}

function setStore<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err);
  }
}

// SM-2 Spaced Repetition calculation
function calculateSM2({ repetition = 0, intervalDays = 0, easeFactor = 2.5, rating = 3 }) {
  const qualityMap: Record<number, number> = { 1: 1, 2: 3, 3: 4, 4: 5 };
  const q = qualityMap[rating] || 3;

  let newRepetition = repetition;
  let newIntervalDays = intervalDays;
  let newEaseFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (newEaseFactor < 1.3) newEaseFactor = 1.3;

  if (q < 3) {
    newRepetition = 0;
    newIntervalDays = 1;
  } else {
    if (newRepetition === 0) {
      newIntervalDays = 1;
    } else if (newRepetition === 1) {
      newIntervalDays = 6;
    } else {
      newIntervalDays = Math.round(intervalDays * newEaseFactor);
      if (rating === 4) newIntervalDays = Math.round(newIntervalDays * 1.3);
      else if (rating === 2) newIntervalDays = Math.max(1, Math.round(intervalDays * 1.2));
    }
    newRepetition += 1;
  }

  const nextDueDate = new Date();
  nextDueDate.setDate(nextDueDate.getDate() + newIntervalDays);

  return {
    repetition: newRepetition,
    intervalDays: newIntervalDays,
    easeFactor: parseFloat(newEaseFactor.toFixed(2)),
    dueDate: nextDueDate.toISOString(),
  };
}

// Initialize seed spaced repetition cards if empty
export function initLocalStoreIfNeeded() {
  const existingCards = getStore<any[]>(KEYS.SPACED_CARDS, []);
  if (existingCards.length === 0) {
    const now = new Date().toISOString();
    const initialCards = curriculum.flashcards.map((fc, index) => {
      // Stagger some due dates
      const dueDate = new Date();
      if (index < 10) {
        dueDate.setMinutes(dueDate.getMinutes() - 10); // due immediately
      } else {
        dueDate.setDate(dueDate.getDate() + (index % 5));
      }
      return {
        id: `sr_${fc.id}`,
        item_type: 'flashcard',
        item_id: fc.id,
        repetition: 0,
        interval_days: 0,
        ease_factor: 2.5,
        due_date: dueDate.toISOString(),
        last_reviewed_at: null,
        last_rating: null,
      };
    });
    setStore(KEYS.SPACED_CARDS, initialCards);
  }

  const existingSettings = getStore<any>(KEYS.SETTINGS, null);
  if (!existingSettings) {
    setStore(KEYS.SETTINGS, {
      current_mode: 'full',
      target_exam_date: '2027-02-06',
      target_cutoff: '35.0',
      busy_periods: [],
    });
  }
}

// Parse request URL and parameters
function parseUrl(urlString: string) {
  const url = new URL(urlString, 'http://localhost');
  return {
    pathname: url.pathname,
    searchParams: url.searchParams,
  };
}

// Handle all /api requests locally in the browser
export async function handleLocalApi(urlString: string, options?: RequestInit): Promise<Response> {
  initLocalStoreIfNeeded();
  const { pathname, searchParams } = parseUrl(urlString);
  const method = (options?.method || 'GET').toUpperCase();
  const body = options?.body ? JSON.parse(options.body as string) : {};

  // 1. GET /api/overview
  if (pathname === '/api/overview' && method === 'GET') {
    const lessonProgress = getStore<any[]>(KEYS.LESSON_PROGRESS, []);
    const attempts = getStore<any[]>(KEYS.QUESTION_ATTEMPTS, []);
    const spacedCards = getStore<any[]>(KEYS.SPACED_CARDS, []);
    const mockSessions = getStore<any[]>(KEYS.MOCK_SESSIONS, []);
    const settings = getStore<any>(KEYS.SETTINGS, { busy_mode: 0, qualifying_target: 35 });

    const totalTopics = curriculum.topics.length;
    const completedTopics = lessonProgress.filter(p => p.status === 'completed').length;
    const overallProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    // Tier breakdown
    const tierMap: Record<number, { total: number; completed: number }> = {
      1: { total: 0, completed: 0 },
      2: { total: 0, completed: 0 },
      3: { total: 0, completed: 0 },
    };

    const completedTopicIds = new Set(lessonProgress.filter(p => p.status === 'completed').map(p => {
      const lesson = curriculum.lessons.find(l => l.id === p.lesson_id);
      return lesson ? lesson.topic_id : p.lesson_id;
    }));

    curriculum.topics.forEach(t => {
      const subject = curriculum.subjects.find(s => s.id === t.subject_id);
      const tier = subject?.tier || 1;
      if (tierMap[tier]) {
        tierMap[tier].total++;
        if (completedTopicIds.has(t.id)) {
          tierMap[tier].completed++;
        }
      }
    });

    const tierBreakdown = [1, 2, 3].map(tier => ({
      tier,
      total_topics: tierMap[tier].total,
      completed_topics: tierMap[tier].completed,
      completion_pct: tierMap[tier].total > 0 ? Math.round((tierMap[tier].completed / tierMap[tier].total) * 100) : 0,
    }));

    // Spaced repetition due
    const nowIso = new Date().toISOString();
    const dueReviewsCount = spacedCards.filter(c => c.due_date <= nowIso).length;

    // Mock summary
    let bestMockScore = null;
    let recentMockScore = null;
    if (mockSessions.length > 0) {
      const scores = mockSessions.map(s => s.marks_obtained);
      bestMockScore = Math.max(...scores);
      recentMockScore = mockSessions[mockSessions.length - 1].marks_obtained;
    }

    // Weak areas
    const topicAccuracyMap: Record<string, { total: number; correct: number; name: string; subject: string }> = {};
    attempts.forEach(a => {
      const q = curriculum.questions.find(q => q.id === a.question_id);
      if (q) {
        if (!topicAccuracyMap[q.topic_id]) {
          const t = curriculum.topics.find(top => top.id === q.topic_id);
          const s = curriculum.subjects.find(sub => sub.id === q.subject_id);
          topicAccuracyMap[q.topic_id] = {
            total: 0,
            correct: 0,
            name: t?.name || q.topic_id,
            subject: s?.name || q.subject_id,
          };
        }
        topicAccuracyMap[q.topic_id].total++;
        if (a.is_correct) topicAccuracyMap[q.topic_id].correct++;
      }
    });

    const weakTopics = Object.entries(topicAccuracyMap)
      .map(([topicId, stats]) => {
        const top = curriculum.topics.find(t => t.id === topicId);
        const sub = curriculum.subjects.find(s => s.id === top?.subject_id);
        return {
          id: topicId,
          topic_name: stats.name,
          subject_name: stats.subject,
          tier: (sub?.tier || 1) as 1 | 2 | 3,
          is_high_yield: top?.is_high_yield || 0,
          total_attempts: stats.total,
          correct_attempts: stats.correct,
          accuracy: Math.round((stats.correct / stats.total) * 100),
        };
      })
      .filter(item => item.total_attempts >= 1 && item.accuracy < 60)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 5);

    // Consistency streak
    let streakDays = 0;
    if (attempts.length > 0 || lessonProgress.length > 0) {
      const activeDates = new Set<string>();
      attempts.forEach(a => activeDates.add((a.attempted_at || '').substring(0, 10)));
      lessonProgress.forEach(p => activeDates.add((p.completed_at || p.updated_at || '').substring(0, 10)));

      let checkDate = new Date();
      while (true) {
        const dateStr = checkDate.toISOString().substring(0, 10);
        if (activeDates.has(dateStr)) {
          streakDays++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          if (streakDays === 0) {
            checkDate.setDate(checkDate.getDate() - 1);
            const yDateStr = checkDate.toISOString().substring(0, 10);
            if (activeDates.has(yDateStr)) {
              streakDays++;
              checkDate.setDate(checkDate.getDate() - 1);
              continue;
            }
          }
          break;
        }
      }
    }

    const totalLessons = curriculum.lessons.length;
    const completedLessons = lessonProgress.filter(p => p.status === 'completed').length;
    const overallProgressPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    const tierStats = ([1, 2, 3] as const).map(tier => ({
      tier,
      total_lessons: tierMap[tier].total,
      completed_lessons: tierMap[tier].completed,
    }));

    const overallAttempts = attempts.length;
    const overallCorrect = attempts.filter(a => a.is_correct).length;
    const overallAccuracy = overallAttempts > 0 ? Math.round((overallCorrect / overallAttempts) * 100) : 0;

    const mockSummary = {
      total_mocks: mockSessions.length,
      high_score: bestMockScore || 0,
      latest_score: recentMockScore || 0,
      latest_passed: recentMockScore !== null ? (recentMockScore >= 35 ? 1 : 0) : 0,
    };

    const overviewSettings = {
      target_exam_date: settings.target_exam_date || '2027-02-06',
      target_cutoff: String(settings.target_cutoff || '35.0'),
      current_mode: (settings.current_mode || 'full') as 'full' | 'light',
      daily_target_lessons: '2',
      daily_target_reviews: '10',
      busy_periods: typeof settings.busy_periods === 'string' ? settings.busy_periods : JSON.stringify(settings.busy_periods || []),
    };

    return jsonResponse({
      totalLessons,
      completedLessons,
      overallProgressPct,
      tierStats,
      dueReviews: dueReviewsCount,
      weakTopics,
      overallAttempts,
      overallCorrect,
      overallAccuracy,
      mockSummary,
      streak: streakDays,
      settings: overviewSettings,
    });
  }

  // 2. GET /api/subjects
  if (pathname === '/api/subjects' && method === 'GET') {
    return jsonResponse(curriculum.subjects);
  }

  // 3. GET /api/topics
  if (pathname === '/api/topics' && method === 'GET') {
    const subjectId = searchParams.get('subject_id');
    const lessonProgress = getStore<any[]>(KEYS.LESSON_PROGRESS, []);
    let topics = curriculum.topics;
    if (subjectId) {
      topics = topics.filter(t => t.subject_id === subjectId);
    }

    const progressMap = new Map(lessonProgress.map(p => [p.lesson_id, p]));

    const result = topics.map(t => {
      const lesson = curriculum.lessons.find(l => l.topic_id === t.id);
      const prog = lesson ? progressMap.get(lesson.id) : null;
      return {
        ...t,
        lesson_id: lesson?.id || null,
        status: prog?.status || 'not_started',
        quick_checks_passed: prog?.quick_checks_passed || 0,
      };
    });

    return jsonResponse(result);
  }

  // 4. GET /api/lessons/:id
  if (pathname.startsWith('/api/lessons/') && method === 'GET') {
    const parts = pathname.split('/');
    const lessonId = parts[3];
    const lesson = curriculum.lessons.find(l => l.id === lessonId || l.topic_id === lessonId);
    if (!lesson) {
      return jsonResponse({ error: 'Lesson not found' }, 404);
    }

    const topic = curriculum.topics.find(t => t.id === lesson.topic_id);
    const subject = curriculum.subjects.find(s => s.id === topic?.subject_id);
    const lessonProgress = getStore<any[]>(KEYS.LESSON_PROGRESS, []);
    const prog = lessonProgress.find(p => p.lesson_id === lesson.id);

    return jsonResponse({
      ...lesson,
      topic_name: topic?.name,
      subject_id: subject?.id,
      subject_name: subject?.name,
      tier: subject?.tier,
      status: prog?.status || 'not_started',
      quick_checks_passed: prog?.quick_checks_passed || 0,
    });
  }

  // 5. POST /api/lessons/:id/complete
  if (pathname.startsWith('/api/lessons/') && pathname.endsWith('/complete') && method === 'POST') {
    const parts = pathname.split('/');
    const lessonId = parts[3];
    const lessonProgress = getStore<any[]>(KEYS.LESSON_PROGRESS, []);
    const now = new Date().toISOString();

    const existingIdx = lessonProgress.findIndex(p => p.lesson_id === lessonId);
    if (existingIdx >= 0) {
      lessonProgress[existingIdx] = {
        ...lessonProgress[existingIdx],
        status: 'completed',
        quick_checks_passed: 1,
        completed_at: lessonProgress[existingIdx].completed_at || now,
        updated_at: now,
      };
    } else {
      lessonProgress.push({
        lesson_id: lessonId,
        status: 'completed',
        quick_checks_passed: 1,
        completed_at: now,
        updated_at: now,
      });
    }
    setStore(KEYS.LESSON_PROGRESS, lessonProgress);

    // Create an automatic spaced repetition review card for this lesson
    const spacedCards = getStore<any[]>(KEYS.SPACED_CARDS, []);
    const srId = `sr_lesson_${lessonId}`;
    if (!spacedCards.some(c => c.id === srId)) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      spacedCards.push({
        id: srId,
        item_type: 'lesson',
        item_id: lessonId,
        repetition: 0,
        interval_days: 1,
        ease_factor: 2.5,
        due_date: tomorrow.toISOString(),
        last_reviewed_at: now,
        last_rating: 3,
      });
      setStore(KEYS.SPACED_CARDS, spacedCards);
    }

    return jsonResponse({ success: true, message: 'Lesson completed successfully' });
  }

  // 6. GET /api/reviews/due
  if (pathname === '/api/reviews/due' && method === 'GET') {
    const spacedCards = getStore<any[]>(KEYS.SPACED_CARDS, []);
    const nowIso = new Date().toISOString();

    let dueCards = spacedCards.filter(c => c.due_date <= nowIso || c.repetition === 0);
    if (dueCards.length === 0 && spacedCards.length > 0) {
      // If nothing due, show next 5 cards for review
      dueCards = [...spacedCards].sort((a, b) => a.due_date.localeCompare(b.due_date)).slice(0, 5);
    }

    const enriched = dueCards.map(c => {
      if (c.item_type === 'lesson') {
        const lesson = curriculum.lessons.find(l => l.id === c.item_id);
        const topic = lesson ? curriculum.topics.find(t => t.id === lesson.topic_id) : null;
        const subject = topic ? curriculum.subjects.find(s => s.id === topic.subject_id) : null;
        return {
          ...c,
          flashcard_front: lesson ? `Review High-Yield Concept: ${lesson.title}` : 'Concept Review',
          flashcard_back: lesson ? lesson.content_markdown : 'Lesson explanation',
          flashcard_citation: lesson?.citation || '',
          front: lesson ? `Review High-Yield Concept: ${lesson.title}` : 'Concept Review',
          back: lesson ? lesson.content_markdown : 'Lesson explanation',
          citation: lesson?.citation || '',
          subject_id: topic?.subject_id,
          subject_name: subject?.name || 'General',
          subject_tier: subject?.tier || 1,
          topic_name: topic?.name || '',
          is_high_yield: topic?.is_high_yield || 0,
        };
      } else if (c.item_type === 'question') {
        const q = curriculum.questions.find(item => item.id === c.item_id);
        const topic = q ? curriculum.topics.find(t => t.id === q.topic_id) : null;
        const subject = q ? curriculum.subjects.find(s => s.id === q.subject_id) : null;
        let options = q?.options;
        if (typeof options === 'string') {
          try { options = JSON.parse(options); } catch {}
        }
        return {
          ...c,
          flashcard_front: q?.question_text || 'Practice Question',
          flashcard_back: q?.explanation || (q?.correct_answer ? `Correct answer: ${q.correct_answer}` : 'Solution explanation'),
          front: q?.question_text || 'Practice Question',
          back: q?.explanation || (q?.correct_answer ? `Correct answer: ${q.correct_answer}` : 'Solution explanation'),
          question_text: q?.question_text,
          question_options: options,
          question_type: q?.type,
          correct_answer: q?.correct_answer,
          question_explanation: q?.explanation,
          subject_id: q?.subject_id,
          subject_name: subject?.name || 'General',
          subject_tier: subject?.tier || 1,
          topic_name: topic?.name || '',
          is_high_yield: topic?.is_high_yield || 0,
        };
      } else {
        const fc = curriculum.flashcards.find(f => f.id === c.item_id);
        const topic = fc ? curriculum.topics.find(t => t.id === fc.topic_id) : null;
        const subject = fc ? curriculum.subjects.find(s => s.id === fc.subject_id) : null;
        return {
          ...c,
          flashcard_front: fc?.front || 'Concept review',
          flashcard_back: fc?.back || 'Lesson explanation',
          flashcard_citation: fc?.citation || '',
          front: fc?.front || 'Concept review',
          back: fc?.back || 'Lesson explanation',
          citation: fc?.citation || '',
          subject_id: fc?.subject_id,
          subject_name: subject?.name || 'General',
          subject_tier: subject?.tier || 1,
          topic_name: topic?.name || '',
          is_high_yield: topic?.is_high_yield || 0,
        };
      }
    });

    return jsonResponse(enriched);
  }

  // 7. POST /api/reviews/:id/rate
  if (pathname.startsWith('/api/reviews/') && pathname.endsWith('/rate') && method === 'POST') {
    const parts = pathname.split('/');
    const cardId = parts[3];
    const rating = Number(body.rating) || 3;

    const spacedCards = getStore<any[]>(KEYS.SPACED_CARDS, []);
    const cardIdx = spacedCards.findIndex(c => c.id === cardId);

    if (cardIdx >= 0) {
      const card = spacedCards[cardIdx];
      const sm2 = calculateSM2({
        repetition: card.repetition || 0,
        intervalDays: card.interval_days || 0,
        easeFactor: card.ease_factor || 2.5,
        rating,
      });

      spacedCards[cardIdx] = {
        ...card,
        repetition: sm2.repetition,
        interval_days: sm2.intervalDays,
        ease_factor: sm2.easeFactor,
        due_date: sm2.dueDate,
        last_reviewed_at: new Date().toISOString(),
        last_rating: rating,
      };

      setStore(KEYS.SPACED_CARDS, spacedCards);
      return jsonResponse({
        success: true,
        card: spacedCards[cardIdx],
        nextReviewInDays: sm2.intervalDays,
      });
    }

    return jsonResponse({ error: 'Card not found' }, 404);
  }

  // 8. GET /api/questions
  if (pathname === '/api/questions' && method === 'GET') {
    const subjectId = searchParams.get('subject_id');
    const topicId = searchParams.get('topic_id');
    const tier = searchParams.get('tier');
    const type = searchParams.get('type');
    const difficulty = searchParams.get('difficulty');
    const isPyq = searchParams.get('is_pyq');
    const limit = Number(searchParams.get('limit')) || 50;

    let filtered = [...curriculum.questions];

    if (subjectId) filtered = filtered.filter(q => q.subject_id === subjectId);
    if (topicId) filtered = filtered.filter(q => q.topic_id === topicId);
    if (type) filtered = filtered.filter(q => q.type === type);
    if (difficulty) filtered = filtered.filter(q => q.difficulty === difficulty);
    if (isPyq !== null && isPyq !== '') filtered = filtered.filter(q => String(q.is_pyq) === isPyq);

    if (tier) {
      filtered = filtered.filter(q => {
        const sub = curriculum.subjects.find(s => s.id === q.subject_id);
        return sub && String(sub.tier) === tier;
      });
    }

    // Attach subject and topic names
    const result = filtered.slice(0, limit).map(q => {
      const sub = curriculum.subjects.find(s => s.id === q.subject_id);
      const top = curriculum.topics.find(t => t.id === q.topic_id);
      return {
        ...q,
        subject_name: sub?.name || '',
        tier: sub?.tier || 1,
        topic_name: top?.name || '',
        is_high_yield: top?.is_high_yield || 0,
      };
    });

    return jsonResponse(result);
  }

  // 9. POST /api/questions/:id/attempt
  if (pathname.startsWith('/api/questions/') && pathname.endsWith('/attempt') && method === 'POST') {
    const parts = pathname.split('/');
    const questionId = parts[3];
    const { userAnswer, timeSpentSeconds = 0, mode = 'practice' } = body;

    const q = curriculum.questions.find(item => item.id === questionId);
    if (!q) {
      return jsonResponse({ error: 'Question not found' }, 404);
    }

    let isCorrect = false;
    if (q.type === 'MCQ' || q.type === 'NAT') {
      isCorrect = String(userAnswer).trim().toLowerCase() === String(q.correct_answer).trim().toLowerCase();
    } else if (q.type === 'MSQ') {
      let expectedArr: string[] = [];
      let actualArr: string[] = [];
      try {
        expectedArr = (typeof q.correct_answer === 'string' ? JSON.parse(q.correct_answer) : q.correct_answer) || [];
      } catch {
        expectedArr = [q.correct_answer];
      }
      try {
        actualArr = (typeof userAnswer === 'string' ? JSON.parse(userAnswer) : userAnswer) || [];
      } catch {
        actualArr = [userAnswer];
      }
      expectedArr.sort();
      actualArr.sort();
      isCorrect = JSON.stringify(expectedArr) === JSON.stringify(actualArr);
    }

    const attempts = getStore<any[]>(KEYS.QUESTION_ATTEMPTS, []);
    attempts.push({
      id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      question_id: questionId,
      user_answer: typeof userAnswer === 'object' ? JSON.stringify(userAnswer) : String(userAnswer),
      is_correct: isCorrect ? 1 : 0,
      time_spent_secs: timeSpentSeconds,
      mode,
      attempted_at: new Date().toISOString(),
    });
    setStore(KEYS.QUESTION_ATTEMPTS, attempts);

    if (!isCorrect) {
      const spacedCards = getStore<any[]>(KEYS.SPACED_CARDS, []);
      const srId = `sr_q_${questionId}`;
      const existingSrIdx = spacedCards.findIndex(c => c.id === srId);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      if (existingSrIdx >= 0) {
        spacedCards[existingSrIdx].due_date = tomorrow.toISOString();
        spacedCards[existingSrIdx].repetition = 0;
      } else {
        spacedCards.push({
          id: srId,
          item_type: 'question',
          item_id: questionId,
          repetition: 0,
          interval_days: 1,
          ease_factor: 2.5,
          due_date: tomorrow.toISOString(),
          last_reviewed_at: new Date().toISOString(),
          last_rating: 1,
        });
      }
      setStore(KEYS.SPACED_CARDS, spacedCards);
    }

    return jsonResponse({
      isCorrect,
      correctAnswer: q.correct_answer,
      explanation: q.explanation,
      marksObtained: isCorrect ? q.marks : 0,
    });
  }

  // 10. GET /api/mock/history
  if (pathname === '/api/mock/history' && method === 'GET') {
    const sessions = getStore<any[]>(KEYS.MOCK_SESSIONS, []);
    return jsonResponse(sessions);
  }

  // 11. POST /api/mock/start
  if (pathname === '/api/mock/start' && method === 'POST') {
    const { title = 'GATE CSE High-Yield Mock Test', questionCount = 15, durationMinutes = 30 } = body;
    // Shuffle and pick questions
    const shuffled = [...curriculum.questions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Number(questionCount)).map(q => {
      const sub = curriculum.subjects.find(s => s.id === q.subject_id);
      const top = curriculum.topics.find(t => t.id === q.topic_id);
      return {
        ...q,
        subject_name: sub?.name,
        tier: sub?.tier,
        topic_name: top?.name,
      };
    });

    const totalMarks = selected.reduce((sum, q) => sum + (q.marks || 1), 0);
    const sessionId = `mock_${Date.now()}`;

    return jsonResponse({
      sessionId,
      title,
      totalMarks,
      durationMinutes,
      questions: selected,
    });
  }

  // 12. POST /api/mock/:sessionId/submit
  if (pathname.startsWith('/api/mock/') && pathname.endsWith('/submit') && method === 'POST') {
    const parts = pathname.split('/');
    const sessionId = parts[3];
    const { answers = {}, timeSpentSeconds = 0, title = 'GATE CSE Mock Test' } = body;

    let totalMarks = 0;
    let marksObtained = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let skippedCount = 0;
    const subjectStats: Record<string, { total: number; correct: number; marks: number; name: string }> = {};

    const mockAnswers = getStore<any[]>(KEYS.MOCK_ANSWERS, []);
    const questionAttempts = getStore<any[]>(KEYS.QUESTION_ATTEMPTS, []);

    Object.entries(answers).forEach(([qId, ansObj]: [string, any]) => {
      const q = curriculum.questions.find(item => item.id === qId);
      if (!q) return;

      const userAns = ansObj.userAnswer;
      const isAttempted = userAns !== null && userAns !== undefined && userAns !== '';
      const marksAllocated = q.marks || 1.0;
      totalMarks += marksAllocated;

      if (!subjectStats[q.subject_id]) {
        const sub = curriculum.subjects.find(s => s.id === q.subject_id);
        subjectStats[q.subject_id] = { total: 0, correct: 0, marks: 0, name: sub?.name || q.subject_id };
      }
      subjectStats[q.subject_id].total += marksAllocated;

      if (!isAttempted) {
        skippedCount++;
        mockAnswers.push({
          id: `ma_${Date.now()}_${qId}`,
          session_id: sessionId,
          question_id: qId,
          user_answer: null,
          is_attempted: 0,
          is_correct: 0,
          marks_allocated: marksAllocated,
          marks_obtained: 0,
          time_spent_secs: ansObj.timeSpent || 0,
          created_at: new Date().toISOString(),
        });
        return;
      }

      // Check correctness
      let isCorrect = false;
      if (q.type === 'MCQ' || q.type === 'NAT') {
        isCorrect = String(userAns).trim().toLowerCase() === String(q.correct_answer).trim().toLowerCase();
      } else if (q.type === 'MSQ') {
        let expectedArr: string[] = [];
        let actualArr: string[] = [];
        try { expectedArr = typeof q.correct_answer === 'string' ? JSON.parse(q.correct_answer) : q.correct_answer; } catch { expectedArr = [q.correct_answer]; }
        try { actualArr = typeof userAns === 'string' ? JSON.parse(userAns) : userAns; } catch { actualArr = [userAns]; }
        expectedArr.sort();
        actualArr.sort();
        isCorrect = JSON.stringify(expectedArr) === JSON.stringify(actualArr);
      }

      let marksEarned = 0;
      if (isCorrect) {
        correctCount++;
        marksEarned = marksAllocated;
      } else {
        incorrectCount++;
        // GATE Negative Marking
        if (q.type === 'MCQ') {
          marksEarned = marksAllocated === 1.0 ? -0.333 : -0.667;
        } else {
          marksEarned = 0; // MSQ & NAT have 0 penalty
        }
      }

      marksObtained += marksEarned;
      subjectStats[q.subject_id].marks += marksEarned;
      if (isCorrect) subjectStats[q.subject_id].correct += 1;

      mockAnswers.push({
        id: `ma_${Date.now()}_${qId}`,
        session_id: sessionId,
        question_id: qId,
        user_answer: typeof userAns === 'object' ? JSON.stringify(userAns) : String(userAns),
        is_attempted: 1,
        is_correct: isCorrect ? 1 : 0,
        marks_allocated: marksAllocated,
        marks_obtained: marksEarned,
        time_spent_secs: ansObj.timeSpent || 0,
        created_at: new Date().toISOString(),
      });

      questionAttempts.push({
        id: `att_mock_${Date.now()}_${qId}`,
        question_id: qId,
        user_answer: typeof userAns === 'object' ? JSON.stringify(userAns) : String(userAns),
        is_correct: isCorrect ? 1 : 0,
        time_spent_secs: ansObj.timeSpent || 0,
        mode: 'mock',
        session_id: sessionId,
        attempted_at: new Date().toISOString(),
      });
    });

    const settings = getStore<any>(KEYS.SETTINGS, { qualifying_target: 35 });
    const qualifyingCutoff = settings.qualifying_target || 35;
    const finalScore = parseFloat(marksObtained.toFixed(2));
    const isQualified = finalScore >= qualifyingCutoff;

    const mockSession = {
      id: sessionId,
      title,
      total_marks: totalMarks,
      marks_obtained: finalScore,
      qualifying_cutoff: qualifyingCutoff,
      is_qualified: isQualified ? 1 : 0,
      total_questions: Object.keys(answers).length,
      correct_count: correctCount,
      incorrect_count: incorrectCount,
      skipped_count: skippedCount,
      time_spent_secs: timeSpentSeconds,
      completed_at: new Date().toISOString(),
      subject_breakdown: subjectStats,
    };

    const mockSessions = getStore<any[]>(KEYS.MOCK_SESSIONS, []);
    mockSessions.push(mockSession);
    setStore(KEYS.MOCK_SESSIONS, mockSessions);
    setStore(KEYS.MOCK_ANSWERS, mockAnswers);
    setStore(KEYS.QUESTION_ATTEMPTS, questionAttempts);

    return jsonResponse({
      sessionId,
      totalMarks,
      marksObtained: finalScore,
      qualifyingCutoff,
      isQualified,
      correctCount,
      incorrectCount,
      skippedCount,
      timeSpentSeconds,
      subjectBreakdown: subjectStats,
    });
  }

  // 13. GET /api/calendar
  if (pathname === '/api/calendar' && method === 'GET') {
    const settings = getStore<any>(KEYS.SETTINGS, {
      current_mode: 'full',
      target_exam_date: '2027-02-06',
      target_cutoff: '35.0',
      busy_periods: [],
    });

    return jsonResponse({
      target_exam_date: settings.target_exam_date || '2027-02-06',
      target_cutoff: String(settings.target_cutoff || '35.0'),
      current_mode: settings.current_mode || 'full',
      busy_periods: Array.isArray(settings.busy_periods) ? settings.busy_periods : [],
    });
  }

  // 14. POST /api/calendar
  if (pathname === '/api/calendar' && method === 'POST') {
    const current = getStore<any>(KEYS.SETTINGS, {});
    const updated = {
      ...current,
      ...body,
      current_mode: body.current_mode || current.current_mode || 'full',
      target_exam_date: body.target_exam_date || current.target_exam_date || '2027-02-06',
      target_cutoff: body.target_cutoff || current.target_cutoff || '35.0',
      busy_periods: body.busy_periods !== undefined ? body.busy_periods : current.busy_periods || [],
    };
    setStore(KEYS.SETTINGS, updated);
    return jsonResponse({ success: true, message: 'Settings saved', ...updated });
  }

  // 15. POST /api/backup/snapshot (Export full state)
  if (pathname === '/api/backup/snapshot' && method === 'POST') {
    const snapshot = {
      version: '1.0.0',
      app: 'GATE CSE 2027 Study Platform',
      exported_at: new Date().toISOString(),
      user_lesson_progress: getStore(KEYS.LESSON_PROGRESS, []),
      user_question_attempts: getStore(KEYS.QUESTION_ATTEMPTS, []),
      spaced_repetition_cards: getStore(KEYS.SPACED_CARDS, []),
      mock_sessions: getStore(KEYS.MOCK_SESSIONS, []),
      mock_answers: getStore(KEYS.MOCK_ANSWERS, []),
      study_settings: getStore(KEYS.SETTINGS, {}),
    };
    return jsonResponse(snapshot);
  }

  // 16. POST /api/backup/import (Restore state)
  if (pathname === '/api/backup/import' && method === 'POST') {
    if (!body || !body.version) {
      return jsonResponse({ error: 'Invalid backup format' }, 400);
    }
    if (body.user_lesson_progress) setStore(KEYS.LESSON_PROGRESS, body.user_lesson_progress);
    if (body.user_question_attempts) setStore(KEYS.QUESTION_ATTEMPTS, body.user_question_attempts);
    if (body.spaced_repetition_cards) setStore(KEYS.SPACED_CARDS, body.spaced_repetition_cards);
    if (body.mock_sessions) setStore(KEYS.MOCK_SESSIONS, body.mock_sessions);
    if (body.mock_answers) setStore(KEYS.MOCK_ANSWERS, body.mock_answers);
    if (body.study_settings) setStore(KEYS.SETTINGS, body.study_settings);

    return jsonResponse({
      success: true,
      message: 'Backup restored successfully into browser local storage.',
    });
  }

  return jsonResponse({ error: `Not found: ${method} ${pathname}` }, 404);
}

function jsonResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
