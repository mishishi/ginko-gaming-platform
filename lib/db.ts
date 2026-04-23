import Database from 'better-sqlite3'
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs'
import { join, dirname } from 'path'

let db: Database.Database | null = null

// Use a file path for Node.js persistence
const DB_PATH = join(process.cwd(), '.yinqiu.db')
const MIGRATIONS_DIR = join(process.cwd(), 'migrations')

export interface ScoreEntry {
  id?: number
  gameSlug: string
  playerName: string
  score: number
  updatedAt: string
}

function initDb(): Database.Database {
  // Ensure directory exists
  const dbDir = dirname(DB_PATH)
  if (!existsSync(dbDir)) {
    mkdirSync(dbDir, { recursive: true })
  }

  // Try to load existing database from file (Node.js)
  let database: Database.Database

  try {
    if (existsSync(DB_PATH)) {
      database = new Database(DB_PATH)
    } else {
      database = new Database(DB_PATH)
    }
  } catch (e) {
    console.warn('Failed to load leaderboard DB, creating new one:', e)
    database = new Database(DB_PATH)
  }

  // Create scores table
  database.exec(`
    CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      game_slug TEXT NOT NULL,
      player_name TEXT DEFAULT '匿名玩家',
      score INTEGER NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Create index for fast ranking queries
  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_game_score ON scores(game_slug, score DESC)
  `)

  // Enable WAL mode for better performance
  database.pragma('journal_mode = WAL')

  // Auto-migrate: apply any pending migrations
  autoMigrate(database)

  return database
}

function autoMigrate(database: Database.Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version TEXT PRIMARY KEY,
      applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  const applied = new Set(
    (database.prepare('SELECT version FROM schema_migrations').all() as { version: string }[]).map(r => r.version)
  )
  console.log('[db] Already applied migrations:', Array.from(applied))

  let files: string[] = []
  try {
    files = readdirSync(MIGRATIONS_DIR)
      .filter(f => f.endsWith('.sql'))
      .sort()
    console.log('[db] Found migration files:', files)
  } catch (e) {
    console.warn('[db] Cannot read migrations directory:', e)
    return
  }

  if (files.length === 0) {
    console.warn('[db] No migration files found')
    return
  }

  for (const file of files) {
    const version = file.replace('.sql', '')
    console.log('[db] Checking migration:', version, 'applied:', applied.has(version))
    if (!applied.has(version)) {
      console.log('[db] Applying migration:', version)
      const sql = readFileSync(join(MIGRATIONS_DIR, file), 'utf8')
      try {
        database.exec(sql)
        database.prepare('INSERT INTO schema_migrations (version) VALUES (?)').run(version)
        console.log('[db] Applied migration:', version)
      } catch (e) {
        console.error('[db] Migration failed:', version, e)
        throw e
      }
    }
  }
}

function saveDb(database: Database.Database) {
  try {
    database.backup(DB_PATH)
  } catch (e) {
    console.warn('Failed to save leaderboard DB to file:', e)
  }
}

export function getDb(): Database.Database {
  if (db) return db
  db = initDb()
  return db
}

export function getTopScores(gameSlug: string, limit: number = 10): ScoreEntry[] {
  const database = getDb()

  const stmt = database.prepare(`
    SELECT id, game_slug, player_name, score, updated_at
    FROM scores
    WHERE game_slug = ?
    ORDER BY score DESC
    LIMIT ?
  `)

  const rows = stmt.all(gameSlug, limit) as Array<{
    id: number
    game_slug: string
    player_name: string
    score: number
    updated_at: string
  }>

  return rows.map(row => ({
    id: row.id,
    gameSlug: row.game_slug,
    playerName: row.player_name,
    score: row.score,
    updatedAt: row.updated_at,
  }))
}

export function getTopScoresThisWeek(gameSlug: string, limit: number = 10): ScoreEntry[] {
  const database = getDb()

  // Get start of current week (Monday 00:00:00)
  const now = new Date()
  const dayOfWeek = now.getDay()
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - daysToMonday)
  startOfWeek.setHours(0, 0, 0, 0)

  const stmt = database.prepare(`
    SELECT id, game_slug, player_name, score, updated_at
    FROM scores
    WHERE game_slug = ?
      AND updated_at >= ?
    ORDER BY score DESC
    LIMIT ?
  `)

  const rows = stmt.all(gameSlug, startOfWeek.toISOString(), limit) as Array<{
    id: number
    game_slug: string
    player_name: string
    score: number
    updated_at: string
  }>

  return rows.map(row => ({
    id: row.id,
    gameSlug: row.game_slug,
    playerName: row.player_name,
    score: row.score,
    updatedAt: row.updated_at,
  }))
}

export function submitScore(
  gameSlug: string,
  playerName: string,
  score: number
): { success: boolean; rank: number; isNewHighScore: boolean } {
  const database = getDb()

  // Check if player already has a score for this game
  const existingRow = database.prepare(`
    SELECT id, score FROM scores
    WHERE game_slug = ? AND player_name = ?
    ORDER BY score DESC
    LIMIT 1
  `).get(gameSlug, playerName) as { id: number; score: number } | undefined

  let existingScore: number | null = existingRow?.score ?? null
  let existingId: number | null = existingRow?.id ?? null

  const isNewHighScore = existingScore === null || score > existingScore

  if (isNewHighScore) {
    if (existingId) {
      // Update existing score
      database.prepare(`
        UPDATE scores
        SET score = ?, updated_at = datetime('now')
        WHERE id = ?
      `).run(score, existingId)
    } else {
      // Insert new score
      database.prepare(`
        INSERT INTO scores (game_slug, player_name, score)
        VALUES (?, ?, ?)
      `).run(gameSlug, playerName, score)
    }

    saveDb(database)
  }

  // Calculate rank
  const rankRow = database.prepare(`
    SELECT COUNT(*) + 1 as rank
    FROM scores
    WHERE game_slug = ? AND score > ?
  `).get(gameSlug, score) as { rank: number }

  return {
    success: true,
    rank: rankRow.rank,
    isNewHighScore,
  }
}

export function getPlayerRank(gameSlug: string, playerName: string): number | null {
  const database = getDb()

  const scoreRow = database.prepare(`
    SELECT score FROM scores
    WHERE game_slug = ? AND player_name = ?
    ORDER BY score DESC
    LIMIT 1
  `).get(gameSlug, playerName) as { score: number } | undefined

  if (!scoreRow) return null

  const rankRow = database.prepare(`
    SELECT COUNT(*) + 1 as rank
    FROM scores
    WHERE game_slug = ? AND score > ?
  `).get(gameSlug, scoreRow.score) as { rank: number }

  return rankRow.rank
}

// ============================================
// User Management
// ============================================

export interface User {
  id?: number
  anonymous_id: string
  nickname: string | null
  password_hash: string | null
  title: string
  level: number
  exp: number
  login_history: string
  created_at: string
  last_active_at: string
  deleted_at?: string | null
}

export interface UserData {
  id?: number
  user_id: number
  data_type: 'stats' | 'checkin' | 'achievements'
  data_json: string
  updated_at: string
}

export interface DailyActive {
  user_id: number
  date: string
  games_played: number
  play_time: number
  checked_in: boolean
}

// User CRUD operations
export function createUser(anonymousId: string, nickname?: string): User {
  const database = getDb()

  const stmt = database.prepare(`
    INSERT INTO users (anonymous_id, nickname, title, level, exp, login_history, created_at, last_active_at)
    VALUES (?, ?, '新晋旅人', 1, 0, '[]', datetime('now'), datetime('now'))
  `)

  const result = stmt.run(anonymousId, nickname || null)
  saveDb(database)

  return getUserById(result.lastInsertRowid as number)!
}

export function getUserById(id: number): User | null {
  const database = getDb()
  const row = database.prepare(`
    SELECT id, anonymous_id, nickname, password_hash, title, level, exp, login_history, created_at, last_active_at, deleted_at
    FROM users WHERE id = ?
  `).get(id) as {
    id: number
    anonymous_id: string
    nickname: string | null
    password_hash: string | null
    title: string
    level: number
    exp: number
    login_history: string
    created_at: string
    last_active_at: string
    deleted_at: string | null
  } | undefined

  if (!row) return null
  return {
    id: row.id,
    anonymous_id: row.anonymous_id,
    nickname: row.nickname,
    password_hash: row.password_hash,
    title: row.title,
    level: row.level,
    exp: row.exp,
    login_history: row.login_history,
    created_at: row.created_at,
    last_active_at: row.last_active_at,
    deleted_at: row.deleted_at,
  }
}

export function getUserByAnonymousId(anonymousId: string): User | null {
  const database = getDb()
  const row = database.prepare(`
    SELECT id, anonymous_id, nickname, password_hash, title, level, exp, login_history, created_at, last_active_at, deleted_at
    FROM users WHERE anonymous_id = ?
  `).get(anonymousId) as {
    id: number
    anonymous_id: string
    nickname: string | null
    password_hash: string | null
    title: string
    level: number
    exp: number
    login_history: string
    created_at: string
    last_active_at: string
    deleted_at: string | null
  } | undefined

  if (!row) return null
  return {
    id: row.id,
    anonymous_id: row.anonymous_id,
    nickname: row.nickname,
    password_hash: row.password_hash,
    title: row.title,
    level: row.level,
    exp: row.exp,
    login_history: row.login_history,
    created_at: row.created_at,
    last_active_at: row.last_active_at,
    deleted_at: row.deleted_at,
  }
}

export function getUserByNickname(nickname: string): User | null {
  const database = getDb()
  const row = database.prepare(`
    SELECT id, anonymous_id, nickname, password_hash, title, level, exp, login_history, created_at, last_active_at, deleted_at
    FROM users WHERE nickname = ?
  `).get(nickname) as {
    id: number
    anonymous_id: string
    nickname: string | null
    password_hash: string | null
    title: string
    level: number
    exp: number
    login_history: string
    created_at: string
    last_active_at: string
    deleted_at: string | null
  } | undefined

  if (!row) return null
  return {
    id: row.id,
    anonymous_id: row.anonymous_id,
    nickname: row.nickname,
    password_hash: row.password_hash,
    title: row.title,
    level: row.level,
    exp: row.exp,
    login_history: row.login_history,
    created_at: row.created_at,
    last_active_at: row.last_active_at,
    deleted_at: row.deleted_at,
  }
}

export function updateUserProfile(
  userId: number,
  updates: { nickname?: string; title?: string; level?: number; exp?: number }
): User | null {
  const database = getDb()

  const setClauses: string[] = []
  const values: (string | number | null)[] = []

  if (updates.nickname !== undefined) {
    setClauses.push('nickname = ?')
    values.push(updates.nickname)
  }
  if (updates.title !== undefined) {
    setClauses.push('title = ?')
    values.push(updates.title)
  }
  if (updates.level !== undefined) {
    setClauses.push('level = ?')
    values.push(updates.level)
  }
  if (updates.exp !== undefined) {
    setClauses.push('exp = ?')
    values.push(updates.exp)
  }

  if (setClauses.length === 0) return getUserById(userId)

  setClauses.push("last_active_at = datetime('now')")
  values.push(userId)

  database.prepare(`
    UPDATE users SET ${setClauses.join(', ')} WHERE id = ?
  `).run(...values)

  saveDb(database)
  return getUserById(userId)
}

export function addExp(userId: number, expToAdd: number): User | null {
  const database = getDb()
  const user = getUserById(userId)
  if (!user) return null

  const newExp = user.exp + expToAdd
  const newLevel = calculateLevel(newExp)

  database.prepare(`
    UPDATE users SET exp = ?, level = ?, last_active_at = datetime('now') WHERE id = ?
  `).run(newExp, newLevel, userId)

  saveDb(database)
  return getUserById(userId)
}

export function calculateLevel(exp: number): number {
  // Level thresholds: 0, 100, 300, 600, 1000, 1500...
  if (exp < 100) return 1
  if (exp < 300) return 2
  if (exp < 600) return 3
  if (exp < 1000) return 4
  if (exp < 1500) return 5
  return 6
}

export function calculateTitle(level: number, consecutiveDays: number, legendaryAchievements: number): string {
  if (level >= 6) return '客栈传奇'
  if (consecutiveDays >= 30) return '满月之旅'
  if (consecutiveDays >= 7) return '迷雾行者'
  if (legendaryAchievements >= 5) return '命运探索者'
  if (level >= 3) return '银古居士'
  if (level >= 2) return '客栈常客'
  return '新晋旅人'
}

// User data operations
export function saveUserData(userId: number, dataType: 'stats' | 'checkin' | 'achievements', dataJson: string): void {
  const database = getDb()

  // Upsert: delete existing then insert new
  database.prepare(`DELETE FROM user_data WHERE user_id = ? AND data_type = ?`).run(userId, dataType)
  database.prepare(`
    INSERT INTO user_data (user_id, data_type, data_json, updated_at)
    VALUES (?, ?, ?, datetime('now'))
  `).run(userId, dataType, dataJson)

  saveDb(database)
}

export function getUserData(userId: number, dataType: 'stats' | 'checkin' | 'achievements'): string | null {
  const database = getDb()
  const row = database.prepare(`
    SELECT data_json FROM user_data WHERE user_id = ? AND data_type = ?
  `).get(userId, dataType) as { data_json: string } | undefined

  return row?.data_json ?? null
}

// Daily active operations
export function recordDailyActive(
  userId: number,
  date: string,
  gamesPlayed: number = 0,
  playTime: number = 0,
  checkedIn: boolean = false
): void {
  const database = getDb()

  database.prepare(`
    INSERT INTO daily_active (user_id, date, games_played, play_time, checked_in)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(user_id, date) DO UPDATE SET
      games_played = games_played + excluded.games_played,
      play_time = play_time + excluded.play_time,
      checked_in = checked_in OR excluded.checked_in
  `).run(userId, date, gamesPlayed, playTime, checkedIn ? 1 : 0)

  saveDb(database)
}

export function getDailyActive(userId: number, date: string): DailyActive | null {
  const database = getDb()
  const row = database.prepare(`
    SELECT user_id, date, games_played, play_time, checked_in
    FROM daily_active WHERE user_id = ? AND date = ?
  `).get(userId, date) as {
    user_id: number
    date: string
    games_played: number
    play_time: number
    checked_in: number
  } | undefined

  if (!row) return null
  return {
    user_id: row.user_id,
    date: row.date,
    games_played: row.games_played,
    play_time: row.play_time,
    checked_in: !!row.checked_in,
  }
}

export function getActiveDaysInRange(userId: number, startDate: string, endDate: string): number {
  const database = getDb()
  const result = database.prepare(`
    SELECT COUNT(*) as count FROM daily_active
    WHERE user_id = ? AND date >= ? AND date <= ? AND games_played > 0
  `).get(userId, startDate, endDate) as { count: number }

  return result.count
}

// Login history functions
export function addLoginHistory(userId: number, entry: { timestamp: string; userAgent: string; ip: string }): void {
  const database = getDb()
  const user = getUserById(userId)
  if (!user) return

  let history: Array<{ timestamp: string; userAgent: string; ip: string }> = []
  try {
    history = JSON.parse(user.login_history || '[]')
  } catch {
    history = []
  }

  // Add new entry and keep only last 10
  history.unshift(entry)
  if (history.length > 10) {
    history = history.slice(0, 10)
  }

  database.prepare(`
    UPDATE users SET login_history = ? WHERE id = ?
  `).run(JSON.stringify(history), userId)

  saveDb(database)
}

export function getLoginHistory(userId: number): Array<{ timestamp: string; userAgent: string; ip: string }> {
  const user = getUserById(userId)
  if (!user) return []

  try {
    return JSON.parse(user.login_history || '[]')
  } catch {
    return []
  }
}

// Password functions
export function setPasswordHash(userId: number, passwordHash: string): void {
  const database = getDb()
  database.prepare(`
    UPDATE users SET password_hash = ? WHERE id = ?
  `).run(passwordHash, userId)
  saveDb(database)
}

export function getPasswordHash(userId: number): string | null {
  const user = getUserById(userId)
  return user?.password_hash || null
}

// Soft delete user
export function softDeleteUser(userId: number): void {
  const database = getDb()
  database.prepare(`
    UPDATE users SET deleted_at = datetime('now') WHERE id = ?
  `).run(userId)
  saveDb(database)
}
