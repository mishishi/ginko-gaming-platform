'use client'

import { useState, useEffect, useCallback } from 'react'

export type LeaderboardFilter = 'all' | 'week' | 'friends'

export interface LeaderboardEntry {
  rank: number
  playerName: string
  score: number
  gameSlug: string
  updatedAt: string
}

export interface UseLeaderboardReturn {
  rankings: LeaderboardEntry[]
  playerRank: number | null
  isLoading: boolean
  error: string | null
  submitScore: (gameSlug: string, score: number, playerName?: string) => Promise<{
    success: boolean
    rank: number
    isNewHighScore: boolean
  } | null>
  refresh: () => void
}

export function useLeaderboard(
  gameSlug?: string,
  limit: number = 10,
  filter: LeaderboardFilter = 'all',
  friendIds: string[] = [],
  friendNicknames: string[] = []
): UseLeaderboardReturn {
  const [rankings, setRankings] = useState<LeaderboardEntry[]>([])
  const [playerRank, setPlayerRank] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLeaderboard = useCallback(async (slug: string, filterType: LeaderboardFilter, friendIdList: string[], friendNicknameList: string[]) => {
    setIsLoading(true)
    setError(null)
    try {
      // For friends filter, we fetch all and filter locally since we don't have backend friends data
      const fetchFilter = filterType === 'friends' ? 'all' : filterType
      const response = await fetch(`/api/leaderboard?game=${encodeURIComponent(slug)}&limit=${limit}&filter=${fetchFilter}`)
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard')
      }
      const data = await response.json()
      let rankings = data.rankings

      // Apply friends filter locally
      if (filterType === 'friends' && (friendIdList.length > 0 || friendNicknameList.length > 0)) {
        rankings = rankings.filter((entry: LeaderboardEntry) =>
          friendIdList.includes(entry.playerName) || friendNicknameList.includes(entry.playerName)
        )
        // Re-rank after filtering
        rankings = rankings.map((entry: LeaderboardEntry, index: number) => ({
          ...entry,
          rank: index + 1,
        }))
      }

      setRankings(rankings)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }, [limit])

  const fetchPlayerRank = useCallback(async (slug: string, playerName: string) => {
    try {
      const response = await fetch(`/api/score/player?game=${encodeURIComponent(slug)}&player=${encodeURIComponent(playerName)}`)
      if (response.ok) {
        const data = await response.json()
        setPlayerRank(data.rank)
      }
    } catch {
      // Silently fail for player rank
    }
  }, [])

  useEffect(() => {
    if (gameSlug) {
      fetchLeaderboard(gameSlug, filter, friendIds, friendNicknames)
    }
  }, [gameSlug, filter, friendIds, friendNicknames, fetchLeaderboard])

  const submitScore = useCallback(async (
    slug: string,
    score: number,
    playerName?: string
  ): Promise<{ success: boolean; rank: number; isNewHighScore: boolean } | null> => {
    try {
      const response = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameSlug: slug,
          score,
          playerName: playerName || '匿名玩家',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit score')
      }

      const result = await response.json()

      // Refresh leaderboard after score submission
      fetchLeaderboard(slug, filter, friendIds, friendNicknames)

      // Refresh player rank
      if (playerName) {
        fetchPlayerRank(slug, playerName)
      }

      return result
    } catch (err) {
      console.error('Score submission error:', err)
      return null
    }
  }, [fetchLeaderboard, fetchPlayerRank, filter, friendIds, friendNicknames])

  const refresh = useCallback(() => {
    if (gameSlug) {
      fetchLeaderboard(gameSlug, filter, friendIds, friendNicknames)
    }
  }, [gameSlug, filter, friendIds, friendNicknames, fetchLeaderboard])

  return {
    rankings,
    playerRank,
    isLoading,
    error,
    submitScore,
    refresh,
  }
}
