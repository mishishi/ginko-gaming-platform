'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
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
  const toastRef = useRef(showToast)
  toastRef.current = showToast

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENTLY_PLAYED_KEY)
      if (stored) {
        setRecentlyPlayed(JSON.parse(stored))
      }
    } catch {
      toastRef.current('无法加载最近游玩记录', 'error')
    }
  }, [])

  const markPlayed = useCallback((slug: string) => {
    setRecentlyPlayed((prev) => {
      const filtered = prev.filter((entry) => entry.slug !== slug)
      const newRecentlyPlayed = [
        { slug, timestamp: Date.now() },
        ...filtered,
      ].slice(0, MAX_RECENT)
      try {
        localStorage.setItem(RECENTLY_PLAYED_KEY, JSON.stringify(newRecentlyPlayed))
      } catch {
        toastRef.current('无法保存最近游玩记录', 'error')
      }
      return newRecentlyPlayed
    })
  }, [])

  const clearRecentlyPlayed = useCallback(() => {
    setRecentlyPlayed([])
    try {
      localStorage.removeItem(RECENTLY_PLAYED_KEY)
    } catch {
      toastRef.current('无法清除最近游玩记录', 'error')
    }
  }, [])

  return { recentlyPlayed, markPlayed, clearRecentlyPlayed }
}
