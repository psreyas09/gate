const fs = require('node:fs');
const path = require('node:path');
const { db, DB_PATH } = require('./db');

async function exportDatabaseJSON() {
  const lessonProgress = await db.prepare('SELECT * FROM user_lesson_progress').all();
  const questionAttempts = await db.prepare('SELECT * FROM user_question_attempts').all();
  const spacedRepetition = await db.prepare('SELECT * FROM spaced_repetition_cards').all();
  const mockSessions = await db.prepare('SELECT * FROM mock_sessions').all();
  const mockAnswers = await db.prepare('SELECT * FROM mock_answers').all();
  const studySettings = await db.prepare('SELECT * FROM study_settings').all();

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

async function importDatabaseJSON(payload) {
  if (!payload || !payload.version) {
    throw new Error('Invalid backup file format: Missing version or payload.');
  }

  const stmts = [];

  if (Array.isArray(payload.user_lesson_progress)) {
    stmts.push({ sql: 'DELETE FROM user_lesson_progress;', args: [] });
    payload.user_lesson_progress.forEach(p => {
      stmts.push({
        sql: `INSERT INTO user_lesson_progress (lesson_id, user_id, status, quick_checks_passed, completed_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?)`,
        args: [p.lesson_id, p.user_id || 'guest', p.status, p.quick_checks_passed, p.completed_at, p.updated_at],
      });
    });
  }

  if (Array.isArray(payload.user_question_attempts)) {
    stmts.push({ sql: 'DELETE FROM user_question_attempts;', args: [] });
    payload.user_question_attempts.forEach(a => {
      stmts.push({
        sql: `INSERT INTO user_question_attempts (id, user_id, question_id, user_answer, is_correct, time_spent_secs, mode, session_id, attempted_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [a.id, a.user_id || 'guest', a.question_id, a.user_answer, a.is_correct, a.time_spent_secs, a.mode, a.session_id, a.attempted_at],
      });
    });
  }

  if (Array.isArray(payload.spaced_repetition_cards)) {
    stmts.push({ sql: 'DELETE FROM spaced_repetition_cards;', args: [] });
    payload.spaced_repetition_cards.forEach(c => {
      stmts.push({
        sql: `INSERT INTO spaced_repetition_cards (id, user_id, item_type, item_id, repetition, interval_days, ease_factor, due_date, last_reviewed_at, last_rating)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [c.id, c.user_id || 'guest', c.item_type, c.item_id, c.repetition, c.interval_days, c.ease_factor, c.due_date, c.last_reviewed_at, c.last_rating],
      });
    });
  }

  if (Array.isArray(payload.mock_sessions)) {
    stmts.push({ sql: 'DELETE FROM mock_sessions;', args: [] });
    payload.mock_sessions.forEach(m => {
      stmts.push({
        sql: `INSERT INTO mock_sessions (id, user_id, title, total_marks, score_obtained, target_cutoff, passed_cutoff, duration_seconds, time_spent_seconds, subject_breakdown, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [m.id, m.user_id || 'guest', m.title, m.total_marks, m.score_obtained, m.target_cutoff, m.passed_cutoff, m.duration_seconds, m.time_spent_seconds, m.subject_breakdown, m.created_at],
      });
    });
  }

  if (Array.isArray(payload.mock_answers)) {
    stmts.push({ sql: 'DELETE FROM mock_answers;', args: [] });
    payload.mock_answers.forEach(a => {
      stmts.push({
        sql: `INSERT INTO mock_answers (id, session_id, question_id, user_answer, is_attempted, is_correct, marks_allocated, marks_obtained, time_spent_secs, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [a.id, a.session_id, a.question_id, a.user_answer, a.is_attempted, a.is_correct, a.marks_allocated, a.marks_obtained, a.time_spent_secs, a.created_at],
      });
    });
  }

  if (Array.isArray(payload.study_settings)) {
    stmts.push({ sql: 'DELETE FROM study_settings;', args: [] });
    payload.study_settings.forEach(s => {
      stmts.push({
        sql: 'INSERT INTO study_settings (key, user_id, value) VALUES (?, ?, ?)',
        args: [s.key, s.user_id || 'guest', s.value],
      });
    });
  }

  if (stmts.length > 0) {
    await db.batch(stmts);
  }

  return { success: true, message: 'Backup successfully restored.' };
}

async function createLocalSnapshot() {
  const backupsDir = path.join(__dirname, '..', 'data', 'backups');
  if (!fs.existsSync(backupsDir)) {
    fs.mkdirSync(backupsDir, { recursive: true });
  }
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const snapshotFile = path.join(backupsDir, `gate_study_${timestamp}.json`);
  const data = await exportDatabaseJSON();
  fs.writeFileSync(snapshotFile, JSON.stringify(data, null, 2), 'utf-8');
  return snapshotFile;
}

module.exports = {
  exportDatabaseJSON,
  importDatabaseJSON,
  createLocalSnapshot,
  DB_PATH
};
