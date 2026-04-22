import initSqlJs, { Database as SqlJsDatabase } from 'sql.js'

let db: SqlJsDatabase | null = null
let dbInitPromise: Promise<SqlJsDatabase> | null = null

const DB_KEY = 'yinqiu-leaderboard'

export interface ScoreEntry {
  id?: number
  gameSlug: string
  playerName: string
  score: number
  updatedAt: string
}

async function initDb(): Promise<SqlJsDatabase> {
  const SQL = await initSqlJs({
    locateFile: (file: string) => `https://sql.js.org/dist/${file}`,
  })

  // Try to load existing database from localStorage
  try {
    const savedDb = localStorage.getItem(DB_KEY)
    if (savedDb) {
      const data = Uint8Array.from(atob(savedDb), c => c.charCodeAt(0))
      return new SQL.Database(data)
    }
  } catch (e) {
    console.warn('Failed to load leaderboard DB from localStorage:', e)
  }

  // Create new database
  const database = new SQL.Database()

  // Create scores table
  database.run(`
    CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      game_slug TEXT NOT NULL,
      player_name TEXT DEFAULT '匿名玩家',
      score INTEGER NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Create index for fast ranking queries
  database.run(`
    CREATE INDEX IF NOT EXISTS idx_game_score ON scores(game_slug, score DESC)
  `)

  return database
}

function saveDb(database: SqlJsDatabase) {
  try {
    const data = database.export()
    const base64 = btoa(String.fromCharCode(...Array.from(data)))
    localStorage.setItem(DB_KEY, base64)
  } catch (e) {
    console.warn('Failed to save leaderboard DB to localStorage:', e)
  }
}

export async function getDb(): Promise<SqlJsDatabase> {
  if (db) return db

  if (dbInitPromise) return dbInitPromise

  dbInitPromise = initDb().then(database => {
    db = database
    return database
  })

  return dbInitPromise
}

export async function getTopScores(gameSlug: string, limit: number = 10): Promise<ScoreEntry[]> {
  const database = await getDb()

  const stmt = database.prepare(`
    SELECT id, game_slug, player_name, score, updated_at
    FROM scores
    WHERE game_slug = ?
    ORDER BY score DESC
    LIMIT ?
  `)

  stmt.bind([gameSlug, limit])

  const results: ScoreEntry[] = []
  while (stmt.step()) {
    const row = stmt.getAsObject()
    results.push({
      id: row.id as number,
      gameSlug: row.game_slug as string,
      playerName: row.player_name as string,
      score: row.score as number,
      updatedAt: row.updated_at as string,
    })
  }
  stmt.free()

  return results
}

export async function submitScore(
  gameSlug: string,
  playerName: string,
  score: number
): Promise<{ success: boolean; rank: number; isNewHighScore: boolean }> {
  const database = await getDb()

  // Check if player already has a score for this game
  const existingStmt = database.prepare(`
    SELECT id, score FROM scores
    WHERE game_slug = ? AND player_name = ?
    ORDER BY score DESC
    LIMIT 1
  `)
  existingStmt.bind([gameSlug, playerName])

  let existingScore: number | null = null
  let existingId: number | null = null

  if (existingStmt.step()) {
    const row = existingStmt.getAsObject()
    existingScore = row.score as number
    existingId = row.id as number
  }
  existingStmt.free()

  const isNewHighScore = existingScore === null || score > existingScore

  if (isNewHighScore) {
    if (existingId) {
      // Update existing score
      database.run(`
        UPDATE scores
        SET score = ?, updated_at = datetime('now')
        WHERE id = ?
      `, [score, existingId])
    } else {
      // Insert new score
      database.run(`
        INSERT INTO scores (game_slug, player_name, score)
        VALUES (?, ?, ?)
      `, [gameSlug, playerName, score])
    }

    saveDb(database)
  }

  // Calculate rank
  const rankStmt = database.prepare(`
    SELECT COUNT(*) + 1 as rank
    FROM scores
    WHERE game_slug = ? AND score > ?
  `)
  rankStmt.bind([gameSlug, score])
  rankStmt.step()
  const rankRow = rankStmt.getAsObject()
  const rank = rankRow.rank as number
  rankStmt.free()

  return {
    success: true,
    rank,
    isNewHighScore,
  }
}

export async function getPlayerRank(gameSlug: string, playerName: string): Promise<number | null> {
  const database = await getDb()

  const stmt = database.prepare(`
    SELECT score FROM scores
    WHERE game_slug = ? AND player_name = ?
    ORDER BY score DESC
    LIMIT 1
  `)
  stmt.bind([gameSlug, playerName])

  let playerScore: number | null = null
  if (stmt.step()) {
    const row = stmt.getAsObject()
    playerScore = row.score as number
  }
  stmt.free()

  if (playerScore === null) return null

  const rankStmt = database.prepare(`
    SELECT COUNT(*) + 1 as rank
    FROM scores
    WHERE game_slug = ? AND score > ?
  `)
  rankStmt.bind([gameSlug, playerScore])
  rankStmt.step()
  const rankRow = rankStmt.getAsObject()
  const rank = rankRow.rank as number
  rankStmt.free()

  return rank
}
