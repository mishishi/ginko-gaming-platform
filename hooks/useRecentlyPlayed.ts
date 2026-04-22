'use client'

import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/contexts/ToastContext'

const RECENTLY_PLAYED_KEY = 'recently-played'
const MAX_RECENT = 5

export interface RecentlyPlayedEntry {
  slug: string
  timestamp: number
}

export function useRecentlyPlayed() {
  const [recentlyPlayed, setRecentlyPlayed] = useState<RecentlyPlayedEntry[]>([])
  const { showToast } = useToast()

  useEffect(() => {
    // Load recently played from localStorage on mount
    try {
      const stored = localStorage.getItem(RECENTLY_PLAYED_KEY)
      if (stored) {
        setRecentlyPlayed(JSON.parse(stored))
      }
    } catch {
      showToast('无法加载最近游玩记录', 'error')
    }
  }, [showToast])

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
        showToast('无法保存最近游玩记录', 'error')
      }
      return newRecentlyPlayed
    })
  }, [showToast])

  const clearRecentlyPlayed = useCallback(() => {
    setRecentlyPlayed([])
    try {
      localStorage.removeItem(RECENTLY_PLAYED_KEY)
    } catch {
      showToast('无法清除最近游玩记录', 'error')
    }
  }, [showToast])

  return { recentlyPlayed, markPlayed, clearRecentlyPlayed }
}
