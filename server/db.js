const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');

const DB_PATH = path.join(__dirname, '..', 'data', 'gate_study.db');

// Ensure data folder exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new DatabaseSync(DB_PATH);

// Enable WAL mode and foreign keys for performance and integrity
db.exec('PRAGMA foreign_keys = ON;');

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS subjects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      tier INTEGER NOT NULL, -- 1, 2, 3
      priority_weight REAL NOT NULL,
      reference_book TEXT NOT NULL,
      citation_info TEXT
    );

    CREATE TABLE IF NOT EXISTS topics (
      id TEXT PRIMARY KEY,
      subject_id TEXT NOT NULL,
      name TEXT NOT NULL,
      order_index INTEGER NOT NULL,
      is_high_yield INTEGER NOT NULL DEFAULT 0, -- 1 if high-yield priority booster
      estimated_study_mins INTEGER DEFAULT 25,
      FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS lessons (
      id TEXT PRIMARY KEY,
      topic_id TEXT NOT NULL,
      title TEXT NOT NULL,
      content_markdown TEXT NOT NULL,
      quick_check_questions TEXT NOT NULL, -- JSON array of 3-5 check questions
      citation TEXT,
      FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS questions (
      id TEXT PRIMARY KEY,
      subject_id TEXT NOT NULL,
      topic_id TEXT NOT NULL,
      type TEXT NOT NULL, -- 'MCQ' | 'MSQ' | 'NAT'
      marks REAL NOT NULL DEFAULT 1.0, -- 1.0 or 2.0
      difficulty TEXT NOT NULL DEFAULT 'medium', -- 'easy' | 'medium' | 'hard'
      question_text TEXT NOT NULL,
      options TEXT, -- JSON array for MCQ/MSQ; null for NAT
      correct_answer TEXT NOT NULL, -- "A" or JSON array '["A","C"]' or numeric "16"
      explanation TEXT NOT NULL,
      is_pyq INTEGER NOT NULL DEFAULT 0,
      pyq_year INTEGER,
      pyq_session TEXT,
      FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
      FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS flashcards (
      id TEXT PRIMARY KEY,
      subject_id TEXT NOT NULL,
      topic_id TEXT NOT NULL,
      front TEXT NOT NULL,
      back TEXT NOT NULL,
      citation TEXT,
      FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
      FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_lesson_progress (
      lesson_id TEXT PRIMARY KEY,
      status TEXT NOT NULL DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed'
      quick_checks_passed INTEGER DEFAULT 0,
      completed_at TEXT,
      updated_at TEXT,
      FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_question_attempts (
      id TEXT PRIMARY KEY,
      question_id TEXT NOT NULL,
      user_answer TEXT,
      is_correct INTEGER NOT NULL,
      time_spent_secs INTEGER DEFAULT 0,
      mode TEXT NOT NULL, -- 'practice', 'lesson_check', 'mock', 'weak_drill', 'pyq'
      session_id TEXT,
      attempted_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS spaced_repetition_cards (
      id TEXT PRIMARY KEY,
      item_type TEXT NOT NULL, -- 'flashcard' | 'question'
      item_id TEXT NOT NULL,
      repetition INTEGER DEFAULT 0,
      interval_days REAL DEFAULT 0,
      ease_factor REAL DEFAULT 2.5,
      due_date TEXT NOT NULL,
      last_reviewed_at TEXT,
      last_rating INTEGER, -- 1=Again, 2=Hard, 3=Good, 4=Easy
      UNIQUE(item_type, item_id)
    );

    CREATE TABLE IF NOT EXISTS mock_sessions (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      total_marks REAL NOT NULL DEFAULT 100.0,
      score_obtained REAL NOT NULL,
      target_cutoff REAL NOT NULL DEFAULT 35.0,
      passed_cutoff INTEGER NOT NULL,
      duration_seconds INTEGER NOT NULL,
      time_spent_seconds INTEGER NOT NULL,
      subject_breakdown TEXT, -- JSON
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS mock_answers (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      question_id TEXT NOT NULL,
      user_answer TEXT,
      is_attempted INTEGER NOT NULL,
      is_correct INTEGER NOT NULL,
      marks_allocated REAL NOT NULL,
      marks_obtained REAL NOT NULL,
      time_spent_secs INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      FOREIGN KEY (session_id) REFERENCES mock_sessions(id) ON DELETE CASCADE,
      FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS study_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_topics_subject ON topics(subject_id);
    CREATE INDEX IF NOT EXISTS idx_questions_topic ON questions(topic_id);
    CREATE INDEX IF NOT EXISTS idx_questions_subject ON questions(subject_id);
    CREATE INDEX IF NOT EXISTS idx_attempts_question ON user_question_attempts(question_id);
    CREATE INDEX IF NOT EXISTS idx_sr_due ON spaced_repetition_cards(due_date);
  `);
}

initSchema();

module.exports = { db, DB_PATH };
