'use client'

import { useState, useEffect, useCallback } from 'react'

const FAVORITES_KEY = 'game-favorites'

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    // Load favorites from localStorage on mount
    try {
      const stored = localStorage.getItem(FAVORITES_KEY)
      if (stored) {
        setFavorites(JSON.parse(stored))
      }
    } catch {
      // localStorage not available or parse error
    }
  }, [])

  const toggleFavorite = useCallback((slug: string) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [...prev, slug]
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites))
      } catch {
        // localStorage not available
      }
      return newFavorites
    })
  }, [])

  return { favorites, toggleFavorite }
}
