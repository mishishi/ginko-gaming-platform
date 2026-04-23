'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { ACHIEVEMENTS_CONFIG, type AchievementRarity, type AchievementId } from '@/components/AchievementBadge'

const STATS_KEY = 'yinqiu-stats'

export interface GameSession {
  gameSlug: string
  date: string        // ISO date "2026-04-23"
  duration: number     // 秒
  score: number
  won?: boolean       // 游戏有胜负时
}

export interface WeeklyStats {
  weekStart: string   // 周一日期 "2026-04-21"
  totalPlays: number
  totalDuration: number
}

export interface GameStats {
  playCount: Record<string, number>
  highScore: Record<string, number>
  lastPlayedAt: Record<string, string>
  achievements: string[]
  // 扩展字段
  totalPlayTime: Record<string, number>    // 每游戏总时长（秒）
  gameSessions: GameSession[]               // 游玩记录
  weeklyStats: WeeklyStats[]                // 每周统计
  wins: Record<string, number>              // 每游戏胜利次数
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  rarity: AchievementRarity
  condition: (stats: GameStatsContext) => boolean
}

export interface GameStatsContext {
  playCount: number
  gameHighScores: Record<string, number>
  gamesPlayed: string[]
  totalHighScore: number
  // 扩展字段
  totalPlayTime: number
  consecutiveDays: number
  winRate: number
}

export interface RecordPlayResult {
  newlyUnlocked: Achievement[]
  storageError: boolean
}

// Convert ACHIEVEMENTS_CONFIG to Achievement array with conditions
const ACHIEVEMENTS: Achievement[] = [
  {
    ...ACHIEVEMENTS_CONFIG.first_play,
    condition: (stats) => stats.playCount >= 1,
  },
  {
    ...ACHIEVEMENTS_CONFIG.first_score,
    condition: (stats) => stats.totalHighScore > 0,
  },
  {
    ...ACHIEVEMENTS_CONFIG.idol_master,
    condition: (stats) => (stats.gameHighScores['idol'] || 0) >= 100,
  },
  {
    ...ACHIEVEMENTS_CONFIG.quiz_master,
    condition: (stats) => (stats.gameHighScores['quiz'] || 0) >= 100,
  },
  {
    ...ACHIEVEMENTS_CONFIG.fate_explorer,
    condition: (stats) => (stats.gameHighScores['fate'] || 0) >= 100,
  },
  {
    ...ACHIEVEMENTS_CONFIG.all_games,
    condition: (stats) => stats.gamesPlayed.length >= 3,
  },
  {
    ...ACHIEVEMENTS_CONFIG.perfect_score,
    condition: (stats) => Object.values(stats.gameHighScores).some(score => score >= 100),
  },
  {
    ...ACHIEVEMENTS_CONFIG.play_10_times,
    condition: (stats) => stats.playCount >= 10,
  },
  {
    ...ACHIEVEMENTS_CONFIG.play_50_times,
    condition: (stats) => stats.playCount >= 50,
  },
  {
    ...ACHIEVEMENTS_CONFIG.high_scorer,
    condition: (stats) => stats.totalHighScore >= 500,
  },
  {
    ...ACHIEVEMENTS_CONFIG.marathoner,
    condition: (stats) => stats.playCount >= 100,
  },
  // 新成就：连续游玩天数
  {
    ...ACHIEVEMENTS_CONFIG.consecutive_3_days,
    condition: (stats) => stats.consecutiveDays >= 3,
  },
  {
    ...ACHIEVEMENTS_CONFIG.consecutive_7_days,
    condition: (stats) => stats.consecutiveDays >= 7,
  },
  {
    ...ACHIEVEMENTS_CONFIG.consecutive_30_days,
    condition: (stats) => stats.consecutiveDays >= 30,
  },
  // 新成就：累计游戏时长
  {
    ...ACHIEVEMENTS_CONFIG.play_10_hours,
    condition: (stats) => stats.totalPlayTime >= 36000, // 10小时 = 36000秒
  },
]

export function useGameStats() {
  const [stats, setStats] = useState<GameStats>({
    playCount: {},
    highScore: {},
    lastPlayedAt: {},
    achievements: [],
    totalPlayTime: {},
    gameSessions: [],
    weeklyStats: [],
    wins: {},
  })
  const storageErrorRef = useRef(false)
  const statsRef = useRef(stats)

  useEffect(() => {
    statsRef.current = stats
  }, [stats])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STATS_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Ensure new fields exist
        if (!parsed.totalPlayTime) parsed.totalPlayTime = {}
        if (!parsed.gameSessions) parsed.gameSessions = []
        if (!parsed.weeklyStats) parsed.weeklyStats = []
        if (!parsed.wins) parsed.wins = {}
        setStats(parsed)
      }
    } catch (e) {
      console.warn('Failed to load stats from localStorage:', e)
    }
  }, [])

  const recordPlay = useCallback((gameSlug: string, score: number, options?: { duration?: number; won?: boolean }): RecordPlayResult => {
    const currentStats = statsRef.current
    let result: RecordPlayResult = { newlyUnlocked: [], storageError: false }

    const newStats: GameStats = {
      playCount: { ...currentStats.playCount },
      highScore: { ...currentStats.highScore },
      lastPlayedAt: { ...currentStats.lastPlayedAt },
      achievements: [...currentStats.achievements],
      totalPlayTime: { ...currentStats.totalPlayTime },
      gameSessions: [...currentStats.gameSessions],
      weeklyStats: [...currentStats.weeklyStats],
      wins: { ...currentStats.wins },
    }

    const now = new Date()
    const todayStr = now.toISOString().split('T')[0]

    // Update per-game play count
    newStats.playCount[gameSlug] = (newStats.playCount[gameSlug] || 0) + 1

    // Update per-game high score
    const prevHigh = newStats.highScore[gameSlug] || 0
    if (score > prevHigh) {
      newStats.highScore[gameSlug] = score
    }

    // Update per-game last played timestamp
    newStats.lastPlayedAt[gameSlug] = now.toISOString()

    // Update total play time
    if (options?.duration) {
      newStats.totalPlayTime[gameSlug] = (newStats.totalPlayTime[gameSlug] || 0) + options.duration
    }

    // Record session
    if (options?.duration) {
      const session: GameSession = {
        gameSlug,
        date: todayStr,
        duration: options.duration,
        score,
        won: options.won,
      }
      newStats.gameSessions.push(session)
    }

    // Update wins
    if (options?.won === true) {
      newStats.wins[gameSlug] = (newStats.wins[gameSlug] || 0) + 1
    }

    // Calculate weekly stats
    const weekStart = getWeekStart(now)
    const weekStartStr = weekStart.toISOString().split('T')[0]
    const existingWeekIndex = newStats.weeklyStats.findIndex(w => w.weekStart === weekStartStr)
    if (existingWeekIndex >= 0) {
      newStats.weeklyStats[existingWeekIndex].totalPlays += 1
      newStats.weeklyStats[existingWeekIndex].totalDuration += options?.duration || 0
    } else {
      newStats.weeklyStats.push({
        weekStart: weekStartStr,
        totalPlays: 1,
        totalDuration: options?.duration || 0,
      })
    }

    // Build gameHighScores and gamesPlayed for achievements check
    const gameHighScores: Record<string, number> = {}
    const gamesPlayed: string[] = []
    const gameSlugs = Object.keys(newStats.playCount)
    for (const slug of gameSlugs) {
      if (newStats.highScore[slug] !== undefined) {
        gameHighScores[slug] = newStats.highScore[slug]
        gamesPlayed.push(slug)
      }
    }

    // Calculate total high score
    const totalHighScore = Object.values(newStats.highScore).reduce((a, b) => a + b, 0)

    // Calculate consecutive days
    const consecutiveDays = calculateConsecutiveDays(newStats.gameSessions)

    // Calculate total play time in seconds
    const totalPlayTime = Object.values(newStats.totalPlayTime).reduce((a, b) => a + b, 0)

    // Calculate overall win rate
    const totalWins = Object.values(newStats.wins).reduce((a, b) => a + b, 0)
    const totalGamesWithResult = newStats.gameSessions.filter(s => s.won !== undefined).length
    const winRate = totalGamesWithResult > 0 ? (totalWins / totalGamesWithResult) * 100 : 0

    // Check achievements
    const statsContext: GameStatsContext = {
      playCount: Object.values(newStats.playCount).reduce((a, b) => a + b, 0),
      gameHighScores,
      gamesPlayed,
      totalHighScore,
      totalPlayTime,
      consecutiveDays,
      winRate,
    }

    const newlyUnlocked = ACHIEVEMENTS
      .filter((a) => !newStats.achievements.includes(a.id))
      .filter((a) => a.condition(statsContext))

    if (newlyUnlocked.length > 0) {
      newStats.achievements = [...currentStats.achievements, ...newlyUnlocked.map((a) => a.id)]
    }

    // Persist to localStorage
    let localStorageFailed = false
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(newStats))
    } catch (e) {
      console.warn('Failed to save stats to localStorage:', e)
      localStorageFailed = true
      storageErrorRef.current = true
    }

    // Update state
    setStats(newStats)

    result = { newlyUnlocked, storageError: localStorageFailed }
    return result
  }, [])

  const unlockedIds = stats.achievements as AchievementId[]
  const hasStorageError = storageErrorRef.current

  return { stats, recordPlay, achievements: ACHIEVEMENTS, unlockedIds, hasStorageError }
}

// Helper: Get Monday of the week for a given date
function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Adjust for Sunday
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

// Helper: Calculate consecutive days from game sessions
function calculateConsecutiveDays(sessions: GameSession[]): number {
  if (sessions.length === 0) return 0

  // Get unique dates sorted in descending order
  const uniqueDates = Array.from(new Set(sessions.map(s => s.date))).sort().reverse()

  if (uniqueDates.length === 0) return 0

  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  // Check if the most recent session is today or yesterday
  if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) {
    return 0 // Streak is broken
  }

  let consecutive = 1
  for (let i = 1; i < uniqueDates.length; i++) {
    const current = new Date(uniqueDates[i - 1])
    const prev = new Date(uniqueDates[i])
    const diffDays = Math.floor((current.getTime() - prev.getTime()) / 86400000)

    if (diffDays === 1) {
      consecutive++
    } else {
      break
    }
  }

  return consecutive
}
