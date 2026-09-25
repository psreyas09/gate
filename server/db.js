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

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      email TEXT,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      created_at TEXT NOT NULL,
      last_login_at TEXT
    );

    CREATE TABLE IF NOT EXISTS user_lesson_progress (
      lesson_id TEXT,
      user_id TEXT NOT NULL DEFAULT 'guest',
      status TEXT NOT NULL DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed'
      quick_checks_passed INTEGER DEFAULT 0,
      completed_at TEXT,
      updated_at TEXT,
      PRIMARY KEY (user_id, lesson_id),
      FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_question_attempts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL DEFAULT 'guest',
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
      user_id TEXT NOT NULL DEFAULT 'guest',
      item_type TEXT NOT NULL, -- 'flashcard' | 'question'
      item_id TEXT NOT NULL,
      repetition INTEGER DEFAULT 0,
      interval_days REAL DEFAULT 0,
      ease_factor REAL DEFAULT 2.5,
      due_date TEXT NOT NULL,
      last_reviewed_at TEXT,
      last_rating INTEGER -- 1=Again, 2=Hard, 3=Good, 4=Easy
    );

    CREATE TABLE IF NOT EXISTS mock_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL DEFAULT 'guest',
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
      key TEXT NOT NULL,
      user_id TEXT NOT NULL DEFAULT 'guest',
      value TEXT NOT NULL,
      PRIMARY KEY (user_id, key)
    );

    CREATE INDEX IF NOT EXISTS idx_topics_subject ON topics(subject_id);
    CREATE INDEX IF NOT EXISTS idx_questions_topic ON questions(topic_id);
    CREATE INDEX IF NOT EXISTS idx_questions_subject ON questions(subject_id);
    CREATE INDEX IF NOT EXISTS idx_attempts_question ON user_question_attempts(question_id);
    CREATE INDEX IF NOT EXISTS idx_attempts_user ON user_question_attempts(user_id);
    CREATE INDEX IF NOT EXISTS idx_sr_due ON spaced_repetition_cards(due_date);
    CREATE INDEX IF NOT EXISTS idx_sr_user_due ON spaced_repetition_cards(user_id, due_date);
    CREATE INDEX IF NOT EXISTS idx_mock_user ON mock_sessions(user_id);
  `);

  // Ensure user_id column exists if table was created in an earlier schema version
  const ensureColumn = (table, column, definition) => {
    try {
      const cols = db.prepare(`PRAGMA table_info(${table})`).all();
      if (!cols.some(c => c.name === column)) {
        db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition};`);
      }
    } catch (err) {
      console.error(`Migration error adding ${column} to ${table}:`, err.message);
    }
  };

  ensureColumn('user_lesson_progress', 'user_id', "TEXT NOT NULL DEFAULT 'guest'");
  ensureColumn('user_question_attempts', 'user_id', "TEXT NOT NULL DEFAULT 'guest'");
  ensureColumn('spaced_repetition_cards', 'user_id', "TEXT NOT NULL DEFAULT 'guest'");
  ensureColumn('mock_sessions', 'user_id', "TEXT NOT NULL DEFAULT 'guest'");
  ensureColumn('study_settings', 'user_id', "TEXT NOT NULL DEFAULT 'guest'");

  // Table structure migration for tables that initially had single-column primary keys or unique constraints
  try {
    const ulpSql = db.prepare("SELECT sql FROM sqlite_master WHERE name='user_lesson_progress'").get()?.sql || '';
    if (ulpSql.includes('lesson_id TEXT PRIMARY KEY')) {
      db.exec(`
        CREATE TABLE _new_ulp (
          lesson_id TEXT NOT NULL,
          user_id TEXT NOT NULL DEFAULT 'guest',
          status TEXT NOT NULL DEFAULT 'not_started',
          quick_checks_passed INTEGER DEFAULT 0,
          completed_at TEXT,
          updated_at TEXT,
          PRIMARY KEY (user_id, lesson_id),
          FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
        );
        INSERT OR IGNORE INTO _new_ulp (lesson_id, user_id, status, quick_checks_passed, completed_at, updated_at)
          SELECT lesson_id, COALESCE(user_id, 'guest'), status, quick_checks_passed, completed_at, updated_at FROM user_lesson_progress;
        DROP TABLE user_lesson_progress;
        ALTER TABLE _new_ulp RENAME TO user_lesson_progress;
        CREATE INDEX IF NOT EXISTS idx_ulp_user ON user_lesson_progress(user_id);
      `);
    }

    const ssSql = db.prepare("SELECT sql FROM sqlite_master WHERE name='study_settings'").get()?.sql || '';
    if (ssSql.includes('key TEXT PRIMARY KEY')) {
      db.exec(`
        CREATE TABLE _new_ss (
          key TEXT NOT NULL,
          user_id TEXT NOT NULL DEFAULT 'guest',
          value TEXT NOT NULL,
          PRIMARY KEY (user_id, key)
        );
        INSERT OR IGNORE INTO _new_ss (key, user_id, value)
          SELECT key, COALESCE(user_id, 'guest'), value FROM study_settings;
        DROP TABLE study_settings;
        ALTER TABLE _new_ss RENAME TO study_settings;
        CREATE INDEX IF NOT EXISTS idx_settings_user ON study_settings(user_id);
      `);
    }

    const srcSql = db.prepare("SELECT sql FROM sqlite_master WHERE name='spaced_repetition_cards'").get()?.sql || '';
    if (srcSql.includes('UNIQUE(item_type, item_id)') && !srcSql.includes('UNIQUE(user_id, item_type, item_id)')) {
      db.exec(`
        CREATE TABLE _new_src (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL DEFAULT 'guest',
          item_type TEXT NOT NULL,
          item_id TEXT NOT NULL,
          repetition INTEGER DEFAULT 0,
          interval_days REAL DEFAULT 0,
          ease_factor REAL DEFAULT 2.5,
          due_date TEXT NOT NULL,
          last_reviewed_at TEXT,
          last_rating INTEGER,
          UNIQUE(user_id, item_type, item_id)
        );
        INSERT OR IGNORE INTO _new_src (id, user_id, item_type, item_id, repetition, interval_days, ease_factor, due_date, last_reviewed_at, last_rating)
          SELECT id, COALESCE(user_id, 'guest'), item_type, item_id, repetition, interval_days, ease_factor, due_date, last_reviewed_at, last_rating FROM spaced_repetition_cards;
        DROP TABLE spaced_repetition_cards;
        ALTER TABLE _new_src RENAME TO spaced_repetition_cards;
        CREATE INDEX IF NOT EXISTS idx_sr_due ON spaced_repetition_cards(due_date);
        CREATE INDEX IF NOT EXISTS idx_sr_user_due ON spaced_repetition_cards(user_id, due_date);
      `);
    }
  } catch (err) {
    console.error('Error during table constraint migration:', err);
  }
}

initSchema();

module.exports = { db, DB_PATH };
