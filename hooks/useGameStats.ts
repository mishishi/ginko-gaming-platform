'use client'

import { useState, useEffect, useCallback } from 'react'

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

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_play',
    name: 'First Steps',
    description: 'Play your first game',
    condition: (stats) => stats.playCount === 1,
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
    playCount: {},
    highScore: {},
    lastPlayedAt: {},
    achievements: [],
  })

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

  const recordPlay = useCallback((gameSlug: string, score: number) => {
    setStats((prev) => {
      const newStats = {
        ...prev,
        playCount: { ...prev.playCount },
        highScore: { ...prev.highScore },
        lastPlayedAt: { ...prev.lastPlayedAt },
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
        .map((a) => a.id)

      if (newlyUnlocked.length > 0) {
        newStats.achievements = [...newStats.achievements, ...newlyUnlocked]
      }

      try {
        localStorage.setItem(STATS_KEY, JSON.stringify(newStats))
      } catch (e) {
        console.warn('Failed to save stats to localStorage:', e)
      }

      return newStats
    })
  }, [])

  const unlockedIds = stats.achievements

  return { stats, recordPlay, achievements: ACHIEVEMENTS, unlockedIds }
}
