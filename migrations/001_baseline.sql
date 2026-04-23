-- Baseline schema for 银古客栈
-- Run this first if starting fresh

-- Scores table
CREATE TABLE IF NOT EXISTS scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  game_slug TEXT NOT NULL,
  player_name TEXT DEFAULT '匿名玩家',
  score INTEGER NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_game_score ON scores(game_slug, score DESC);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  anonymous_id TEXT UNIQUE,
  nickname TEXT UNIQUE,
  title TEXT DEFAULT '新晋旅人',
  level INTEGER DEFAULT 1,
  exp INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_active_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User data table (for stats backup)
CREATE TABLE IF NOT EXISTS user_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  data_type TEXT NOT NULL,
  data_json TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Daily active table
CREATE TABLE IF NOT EXISTS daily_active (
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  games_played INTEGER DEFAULT 0,
  play_time INTEGER DEFAULT 0,
  checked_in BOOLEAN DEFAULT 0,
  PRIMARY KEY (user_id, date)
);

-- Migrations tracking table
CREATE TABLE IF NOT EXISTS schema_migrations (
  version TEXT PRIMARY KEY,
  applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
