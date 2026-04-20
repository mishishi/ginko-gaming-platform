'use client'

import { useState, useEffect, useCallback } from 'react'

const RECENTLY_PLAYED_KEY = 'recently-played'
const MAX_RECENT = 5

export interface RecentlyPlayedEntry {
  slug: string
  timestamp: number
}

export function useRecentlyPlayed() {
  const [recentlyPlayed, setRecentlyPlayed] = useState<RecentlyPlayedEntry[]>([])

  useEffect(() => {
    // Load recently played from localStorage on mount
    try {
      const stored = localStorage.getItem(RECENTLY_PLAYED_KEY)
      if (stored) {
        setRecentlyPlayed(JSON.parse(stored))
      }
    } catch {
      // localStorage not available or parse error
    }
  }, [])

  const markPlayed = useCallback((slug: string) => {
    setRecentlyPlayed((prev) => {
      // Remove existing entry for this slug if present
      const filtered = prev.filter((entry) => entry.slug !== slug)
      // Add new entry at the beginning
      const newRecentlyPlayed = [
        { slug, timestamp: Date.now() },
        ...filtered,
      ].slice(0, MAX_RECENT)
      try {
        localStorage.setItem(RECENTLY_PLAYED_KEY, JSON.stringify(newRecentlyPlayed))
      } catch {
        // localStorage not available
      }
      return newRecentlyPlayed
    })
  }, [])

  return { recentlyPlayed, markPlayed }
}
