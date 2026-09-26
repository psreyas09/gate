const { createClient } = require('@libsql/client');
const path = require('node:path');
const fs = require('node:fs');

const DB_PATH = path.join(__dirname, '..', 'data', 'gate_study.db');

const isRemote = Boolean(process.env.TURSO_DATABASE_URL);

let client;
if (isRemote) {
  client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
} else {
  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  client = createClient({
    url: `file:${DB_PATH}`,
  });
}

function normalizeArgs(params) {
  if (params.length === 0) return [];
  if (params.length === 1 && Array.isArray(params[0])) return params[0];
  return params;
}

const db = {
  client,
  isRemote,
  DB_PATH,

  async all(sql, ...params) {
    const args = normalizeArgs(params);
    const res = await client.execute({ sql, args });
    return res.rows;
  },

  async get(sql, ...params) {
    const args = normalizeArgs(params);
    const res = await client.execute({ sql, args });
    return res.rows.length > 0 ? res.rows[0] : null;
  },

  async run(sql, ...params) {
    const args = normalizeArgs(params);
    const res = await client.execute({ sql, args });
    return {
      changes: res.rowsAffected,
      lastInsertRowid: res.lastInsertRowid,
    };
  },

  async exec(sql) {
    return await client.executeMultiple(sql);
  },

  async batch(statements) {
    return await client.batch(statements);
  },

  prepare(sql) {
    return {
      all: (...params) => db.all(sql, ...params),
      get: (...params) => db.get(sql, ...params),
      run: (...params) => db.run(sql, ...params),
    };
  },
};

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS subjects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tier INTEGER NOT NULL,
  priority_weight REAL NOT NULL,
  reference_book TEXT NOT NULL,
  citation_info TEXT
);

CREATE TABLE IF NOT EXISTS topics (
  id TEXT PRIMARY KEY,
  subject_id TEXT NOT NULL,
  name TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  is_high_yield INTEGER NOT NULL DEFAULT 0,
  estimated_study_mins INTEGER DEFAULT 25,
  scope TEXT DEFAULT 'scoring',
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS lessons (
  id TEXT PRIMARY KEY,
  topic_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content_markdown TEXT NOT NULL,
  quick_check_questions TEXT NOT NULL,
  citation TEXT,
  FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  subject_id TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  type TEXT NOT NULL,
  marks REAL NOT NULL DEFAULT 1.0,
  difficulty TEXT NOT NULL DEFAULT 'medium',
  question_text TEXT NOT NULL,
  options TEXT,
  correct_answer TEXT NOT NULL,
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
  lesson_id TEXT NOT NULL,
  user_id TEXT NOT NULL DEFAULT 'guest',
  status TEXT NOT NULL DEFAULT 'not_started',
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
  mode TEXT NOT NULL,
  session_id TEXT,
  attempted_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS spaced_repetition_cards (
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
  subject_breakdown TEXT,
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

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_lower_username ON users(LOWER(username));
CREATE INDEX IF NOT EXISTS idx_ulp_user ON user_lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_ulp_user_status ON user_lesson_progress(user_id, status);
CREATE INDEX IF NOT EXISTS idx_lessons_topic ON lessons(topic_id);
CREATE INDEX IF NOT EXISTS idx_topics_subject ON topics(subject_id);
CREATE INDEX IF NOT EXISTS idx_questions_topic ON questions(topic_id);
CREATE INDEX IF NOT EXISTS idx_questions_subject ON questions(subject_id);
CREATE INDEX IF NOT EXISTS idx_attempts_question ON user_question_attempts(question_id);
CREATE INDEX IF NOT EXISTS idx_attempts_user ON user_question_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_sr_due ON spaced_repetition_cards(due_date);
CREATE INDEX IF NOT EXISTS idx_sr_user_due ON spaced_repetition_cards(user_id, due_date);
CREATE INDEX IF NOT EXISTS idx_mock_user ON mock_sessions(user_id);
`;

async function initSchema() {
  await client.executeMultiple(SCHEMA_SQL);
  try {
    await client.execute("ALTER TABLE topics ADD COLUMN scope TEXT DEFAULT 'scoring'");
  } catch (e) {
    // Column already exists, safe to ignore
  }
  try {
    await client.execute("CREATE INDEX IF NOT EXISTS idx_topics_scope ON topics(scope)");
  } catch (e) {}
}

module.exports = {
  db,
  client,
  isRemote,
  DB_PATH,
  initSchema,
};
