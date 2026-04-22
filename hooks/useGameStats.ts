'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

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
  condition: (stats: GameStatsContext) => boolean
}

export interface GameStatsContext {
  playCount: number
  gameHighScores: Record<string, number>
  gamesPlayed: string[]
}

export interface RecordPlayResult {
  newlyUnlocked: Achievement[]
  storageError: boolean
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_play',
    name: '初入客栈',
    description: '首次开始任意游戏',
    condition: (stats) => stats.playCount === 1,
  },
  {
    id: 'idol_master',
    name: '偶像达人',
    description: '偶像游戏达到100分',
    condition: (stats) => (stats.gameHighScores['idol'] || 0) >= 100,
  },
  {
    id: 'quiz_master',
    name: '知识大师',
    description: '竞技游戏达到100分',
    condition: (stats) => (stats.gameHighScores['quiz'] || 0) >= 100,
  },
  {
    id: 'fate_explorer',
    name: '命运探索者',
    description: '命运游戏达到100分',
    condition: (stats) => (stats.gameHighScores['fate'] || 0) >= 100,
  },
  {
    id: 'all_games',
    name: '全能旅人',
    description: '三个游戏都玩过',
    condition: (stats) => stats.gamesPlayed.length >= 3,
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

    // Check achievements
    const statsContext: GameStatsContext = {
      playCount: Object.values(newStats.playCount).reduce((a, b) => a + b, 0),
      gameHighScores,
      gamesPlayed,
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

  const unlockedIds = stats.achievements
  const hasStorageError = storageErrorRef.current

  return { stats, recordPlay, achievements: ACHIEVEMENTS, unlockedIds, hasStorageError }
}
