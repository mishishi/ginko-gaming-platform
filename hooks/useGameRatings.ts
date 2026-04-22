'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

const RATINGS_KEY = 'yinqiu-ratings'

export interface GameRatings {
  [gameSlug: string]: {
    ratings: number[] // array of user ratings (1-5)
    lastUpdated: string
  }
}

export interface RatingStats {
  average: number
  count: number
  userRating: number | null
}

export function useGameRatings() {
  const [ratings, setRatings] = useState<GameRatings>({})

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RATINGS_KEY)
      if (stored) {
        setRatings(JSON.parse(stored))
      }
    } catch (e) {
      console.warn('Failed to load ratings from localStorage:', e)
    }
  }, [])

  const rateGame = useCallback((gameSlug: string, rating: number) => {
    const clampedRating = Math.max(1, Math.min(5, rating))

    setRatings(prev => {
      const newRatings = { ...prev }
      const existing = newRatings[gameSlug] || { ratings: [], lastUpdated: '' }
      const ratingsArray = [...existing.ratings]

      // Replace user's last rating (simplified - just update last entry)
      // For a more complex system, we'd track userId per rating
      if (ratingsArray.length > 0) {
        ratingsArray[ratingsArray.length - 1] = clampedRating
      } else {
        ratingsArray.push(clampedRating)
      }

      newRatings[gameSlug] = {
        ratings: ratingsArray,
        lastUpdated: new Date().toISOString(),
      }

      try {
        localStorage.setItem(RATINGS_KEY, JSON.stringify(newRatings))
      } catch (e) {
        console.warn('Failed to save rating to localStorage:', e)
      }

      return newRatings
    })
  }, [])

  const getRatingStats = useCallback((gameSlug: string, userId?: string): RatingStats => {
    const gameData = ratings[gameSlug]
    if (!gameData || gameData.ratings.length === 0) {
      return { average: 0, count: 0, userRating: null }
    }

    const sum = gameData.ratings.reduce((a, b) => a + b, 0)
    const average = sum / gameData.ratings.length

    // User rating is their last rating
    const userRating = gameData.ratings.length > 0 ? gameData.ratings[gameData.ratings.length - 1] : null

    return {
      average: Math.round(average * 10) / 10, // round to 1 decimal
      count: gameData.ratings.length,
      userRating,
    }
  }, [ratings])

  return { ratings, rateGame, getRatingStats }
}
