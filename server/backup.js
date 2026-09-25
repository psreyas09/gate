const fs = require('node:fs');
const path = require('node:path');
const { db, DB_PATH } = require('./db');

function exportDatabaseJSON() {
  const lessonProgress = db.prepare('SELECT * FROM user_lesson_progress').all();
  const questionAttempts = db.prepare('SELECT * FROM user_question_attempts').all();
  const spacedRepetition = db.prepare('SELECT * FROM spaced_repetition_cards').all();
  const mockSessions = db.prepare('SELECT * FROM mock_sessions').all();
  const mockAnswers = db.prepare('SELECT * FROM mock_answers').all();
  const studySettings = db.prepare('SELECT * FROM study_settings').all();

  return {
    version: '1.0.0',
    app: 'GATE CSE 2027 Study Platform',
    exported_at: new Date().toISOString(),
    user_lesson_progress: lessonProgress,
    user_question_attempts: questionAttempts,
    spaced_repetition_cards: spacedRepetition,
    mock_sessions: mockSessions,
    mock_answers: mockAnswers,
    study_settings: studySettings,
  };
}

function importDatabaseJSON(payload) {
  if (!payload || !payload.version) {
    throw new Error('Invalid backup file format: Missing version or payload.');
  }

  // Atomic restore
  db.exec('BEGIN TRANSACTION;');
  try {
    if (Array.isArray(payload.user_lesson_progress)) {
      db.exec('DELETE FROM user_lesson_progress;');
      const stmt = db.prepare(`
        INSERT INTO user_lesson_progress (lesson_id, user_id, status, quick_checks_passed, completed_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      payload.user_lesson_progress.forEach(p => {
        stmt.run(p.lesson_id, p.user_id || 'guest', p.status, p.quick_checks_passed, p.completed_at, p.updated_at);
      });
    }

    if (Array.isArray(payload.user_question_attempts)) {
      db.exec('DELETE FROM user_question_attempts;');
      const stmt = db.prepare(`
        INSERT INTO user_question_attempts (id, user_id, question_id, user_answer, is_correct, time_spent_secs, mode, session_id, attempted_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      payload.user_question_attempts.forEach(a => {
        stmt.run(a.id, a.user_id || 'guest', a.question_id, a.user_answer, a.is_correct, a.time_spent_secs, a.mode, a.session_id, a.attempted_at);
      });
    }

    if (Array.isArray(payload.spaced_repetition_cards)) {
      db.exec('DELETE FROM spaced_repetition_cards;');
      const stmt = db.prepare(`
        INSERT INTO spaced_repetition_cards (id, user_id, item_type, item_id, repetition, interval_days, ease_factor, due_date, last_reviewed_at, last_rating)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      payload.spaced_repetition_cards.forEach(c => {
        stmt.run(c.id, c.user_id || 'guest', c.item_type, c.item_id, c.repetition, c.interval_days, c.ease_factor, c.due_date, c.last_reviewed_at, c.last_rating);
      });
    }

    if (Array.isArray(payload.mock_sessions)) {
      db.exec('DELETE FROM mock_sessions;');
      const stmt = db.prepare(`
        INSERT INTO mock_sessions (id, user_id, title, total_marks, score_obtained, target_cutoff, passed_cutoff, duration_seconds, time_spent_seconds, subject_breakdown, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      payload.mock_sessions.forEach(m => {
        stmt.run(m.id, m.user_id || 'guest', m.title, m.total_marks, m.score_obtained, m.target_cutoff, m.passed_cutoff, m.duration_seconds, m.time_spent_seconds, m.subject_breakdown, m.created_at);
      });
    }

    if (Array.isArray(payload.mock_answers)) {
      db.exec('DELETE FROM mock_answers;');
      const stmt = db.prepare(`
        INSERT INTO mock_answers (id, session_id, question_id, user_answer, is_attempted, is_correct, marks_allocated, marks_obtained, time_spent_secs, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      payload.mock_answers.forEach(a => {
        stmt.run(a.id, a.session_id, a.question_id, a.user_answer, a.is_attempted, a.is_correct, a.marks_allocated, a.marks_obtained, a.time_spent_secs, a.created_at);
      });
    }

    if (Array.isArray(payload.study_settings)) {
      db.exec('DELETE FROM study_settings;');
      const stmt = db.prepare('INSERT INTO study_settings (key, user_id, value) VALUES (?, ?, ?)');
      payload.study_settings.forEach(s => {
        stmt.run(s.key, s.user_id || 'guest', s.value);
      });
    }

    db.exec('COMMIT;');
    return { success: true, message: 'Backup successfully restored.' };
  } catch (err) {
    db.exec('ROLLBACK;');
    throw err;
  }
}

function createLocalSnapshot() {
  const backupsDir = path.join(__dirname, '..', 'data', 'backups');
  if (!fs.existsSync(backupsDir)) {
    fs.mkdirSync(backupsDir, { recursive: true });
  }
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const snapshotFile = path.join(backupsDir, `gate_study_${timestamp}.json`);
  const data = exportDatabaseJSON();
  fs.writeFileSync(snapshotFile, JSON.stringify(data, null, 2), 'utf-8');
  return snapshotFile;
}

module.exports = {
  exportDatabaseJSON,
  importDatabaseJSON,
  createLocalSnapshot,
  DB_PATH
};
