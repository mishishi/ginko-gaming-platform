-- User system enhancements: password, login history, soft delete
-- Version: 002

-- Add password hash column for account security
ALTER TABLE users ADD COLUMN password_hash TEXT;

-- Add login history for tracking login activity
ALTER TABLE users ADD COLUMN login_history TEXT DEFAULT '[]';

-- Add soft delete column for account deletion (preserves leaderboard data)
ALTER TABLE users ADD COLUMN deleted_at DATETIME;
