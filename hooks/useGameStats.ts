'use client'

import { useState, useEffect, useCallback } from 'react'

const STATS_KEY = 'yinqiu-stats'

export interface GameStats {
  playCount: number
  highScore: number
  lastPlayedAt: string | null
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

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_play',
    name: 'First Steps',
    description: 'Play your first game',
    condition: () => true,
  },
  {
    id: 'idol_master',
    name: 'Idol Master',
    description: 'Reach 100 points in idol game',
    condition: (stats) => (stats.gameHighScores['idol'] || 0) >= 100,
  },
  {
    id: 'quiz_master',
    name: 'Quiz Master',
    description: 'Reach 100 points in quiz game',
    condition: (stats) => (stats.gameHighScores['quiz'] || 0) >= 100,
  },
  {
    id: 'fate_explorer',
    name: 'Fate Explorer',
    description: 'Reach 100 points in fate game',
    condition: (stats) => (stats.gameHighScores['fate'] || 0) >= 100,
  },
  {
    id: 'all_games',
    name: 'Explorer',
    description: 'Play all 3 games',
    condition: (stats) => stats.gamesPlayed.length >= 3,
  },
]

export function useGameStats() {
  const [stats, setStats] = useState<GameStats>({
    playCount: 0,
    highScore: 0,
    lastPlayedAt: null,
    achievements: [],
  })

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STATS_KEY)
      if (stored) {
        setStats(JSON.parse(stored))
      }
    } catch {
      // localStorage not available or parse error
    }
  }, [])

  const recordPlay = useCallback((gameSlug: string, score: number) => {
    setStats((prev) => {
      const newStats = { ...prev }
      newStats.playCount += 1
      newStats.lastPlayedAt = new Date().toISOString()

      // Track per-game high scores and games played
      const gameKey = `game_${gameSlug}`
      const prevExt = prev as unknown as Record<string, number>
      const currentGameHigh = prevExt[gameKey] || 0
      if (score > currentGameHigh) {
        ;(newStats as unknown as Record<string, number>)[gameKey] = score
      }

      if (score > newStats.highScore) {
        newStats.highScore = score
      }

      // Build gameHighScores from stored per-game keys
      const gameHighScores: Record<string, number> = {}
      const gameSlugs = ['idol', 'quiz', 'fate']
      const newStatsExt = newStats as unknown as Record<string, number>
      for (const slug of gameSlugs) {
        const key = `game_${slug}`
        if (newStatsExt[key] !== undefined) {
          gameHighScores[slug] = newStatsExt[key]
        }
      }

      // Check achievements
      const gamesPlayed = Object.keys(gameHighScores)
      const statsContext: GameStatsContext = {
        playCount: newStats.playCount,
        gameHighScores,
        gamesPlayed,
      }

      const newlyUnlocked = ACHIEVEMENTS
        .filter((a) => !newStats.achievements.includes(a.id))
        .filter((a) => a.condition(statsContext))
        .map((a) => a.id)

      if (newlyUnlocked.length > 0) {
        newStats.achievements = [...newStats.achievements, ...newlyUnlocked]
      }

      try {
        localStorage.setItem(STATS_KEY, JSON.stringify(newStats))
      } catch {
        // localStorage not available
      }

      return newStats
    })
  }, [])

  const unlockedIds = stats.achievements

  return { stats, recordPlay, achievements: ACHIEVEMENTS, unlockedIds }
}
