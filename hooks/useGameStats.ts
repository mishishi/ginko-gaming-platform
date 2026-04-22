'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { ACHIEVEMENTS_CONFIG, type AchievementRarity, type AchievementId } from '@/components/AchievementBadge'

const STATS_KEY = 'yinqiu-stats'

export interface GameStats {
  playCount: Record<string, number>
  highScore: Record<string, number>
  lastPlayedAt: Record<string, string>
  achievements: string[]
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
]

export function useGameStats() {
  const [stats, setStats] = useState<GameStats>({
    playCount: {},
    highScore: {},
    lastPlayedAt: {},
    achievements: [],
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
        setStats(JSON.parse(stored))
      }
    } catch (e) {
      console.warn('Failed to load stats from localStorage:', e)
    }
  }, [])

  const recordPlay = useCallback((gameSlug: string, score: number): RecordPlayResult => {
    const currentStats = statsRef.current
    let result: RecordPlayResult = { newlyUnlocked: [], storageError: false }

    const newStats = {
      playCount: { ...currentStats.playCount },
      highScore: { ...currentStats.highScore },
      lastPlayedAt: { ...currentStats.lastPlayedAt },
      achievements: [...currentStats.achievements],
    }

    // Update per-game play count
    newStats.playCount[gameSlug] = (newStats.playCount[gameSlug] || 0) + 1

    // Update per-game high score
    const prevHigh = newStats.highScore[gameSlug] || 0
    if (score > prevHigh) {
      newStats.highScore[gameSlug] = score
    }

    // Update per-game last played timestamp
    newStats.lastPlayedAt[gameSlug] = new Date().toISOString()

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

    // Check achievements
    const statsContext: GameStatsContext = {
      playCount: Object.values(newStats.playCount).reduce((a, b) => a + b, 0),
      gameHighScores,
      gamesPlayed,
      totalHighScore,
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
