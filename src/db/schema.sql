-- SQLite schema for Narratype

CREATE TABLE IF NOT EXISTS texts (
  id INTEGER PRIMARY KEY,
  filename TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  author TEXT,
  category TEXT,
  word_count INTEGER,
  difficulty TEXT,
  is_favorite BOOLEAN DEFAULT 0,
  last_practiced DATETIME,
  times_practiced INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS practice_sessions (
  id INTEGER PRIMARY KEY,
  text_id INTEGER NOT NULL,
  started_at DATETIME NOT NULL,
  ended_at DATETIME,
  exercise_type TEXT,
  lesson_number INTEGER,
  exercise_number INTEGER,
  wpm REAL,
  accuracy REAL,
  characters_typed INTEGER,
  errors INTEGER,
  completed BOOLEAN DEFAULT 0,
  FOREIGN KEY (text_id) REFERENCES texts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_progress (
  id INTEGER PRIMARY KEY,
  date DATE UNIQUE NOT NULL,
  total_practice_time INTEGER,
  average_wpm REAL,
  average_accuracy REAL,
  texts_practiced INTEGER,
  exercises_completed INTEGER
);

CREATE INDEX IF NOT EXISTS idx_sessions_text ON practice_sessions(text_id);
CREATE INDEX IF NOT EXISTS idx_texts_category ON texts(category);
CREATE INDEX IF NOT EXISTS idx_texts_difficulty ON texts(difficulty);


