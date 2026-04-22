'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useToast } from '@/contexts/ToastContext'

const CHECKIN_KEY = 'yinqiu-checkin'

export interface CheckInData {
  lastCheckIn: string | null  // ISO date string "2026-04-22"
  streak: number              // Consecutive check-in days
  totalDays: number           // Total check-in days
  rewardsClaimed: string[]    // Array of reward dates claimed
}

export interface CheckInResult {
  success: boolean
  alreadyCheckedIn: boolean
  newStreak: number
  reward?: {
    type: 'achievement' | 'streak_bonus'
    id: string
    name: string
    description: string
  }
}

// Check-in achievements config
export const CHECKIN_ACHIEVEMENTS = {
  first_checkin: {
    id: 'first_checkin' as const,
    name: '初来乍到',
    description: '完成首次签到',
    icon: '👋',
    rarity: 'common' as const,
  },
  checkin_3: {
    id: 'checkin_3' as const,
    name: '常客',
    description: '连续签到3天',
    icon: '☕',
    rarity: 'rare' as const,
  },
  checkin_7: {
    id: 'checkin_7' as const,
    name: '铁杆玩家',
    description: '连续签到7天',
    icon: '🔥',
    rarity: 'epic' as const,
  },
  checkin_7_legendary: {
    id: 'checkin_7_legendary' as const,
    name: '七连签',
    description: '完成7天连续签到',
    icon: '💎',
    rarity: 'legendary' as const,
  },
  checkin_30: {
    id: 'checkin_30' as const,
    name: '坚守一个月',
    description: '连续签到30天',
    icon: '🏅',
    rarity: 'legendary' as const,
  },
}

export type CheckInAchievementId = keyof typeof CHECKIN_ACHIEVEMENTS

function getDateString(date: Date): string {
  return date.toISOString().split('T')[0]
}

function isYesterday(dateStr: string, todayStr: string): boolean {
  const date = new Date(dateStr)
  const today = new Date(todayStr)
  const diffTime = today.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  return diffDays === 1
}

function getRewardForStreak(streak: number): { type: 'achievement' | 'streak_bonus'; id: string; name: string; description: string; icon: string } | undefined {
  if (streak === 1) {
    return { type: 'achievement', ...CHECKIN_ACHIEVEMENTS.first_checkin }
  }
  if (streak === 3) {
    return { type: 'achievement', ...CHECKIN_ACHIEVEMENTS.checkin_3 }
  }
  if (streak === 7) {
    return { type: 'achievement', id: 'checkin_7', name: '铁杆玩家', description: '连续签到7天', icon: '🔥' }
  }
  if (streak === 30) {
    return { type: 'achievement', ...CHECKIN_ACHIEVEMENTS.checkin_30 }
  }
  return undefined
}

export function useCheckIn() {
  const [checkInData, setCheckInData] = useState<CheckInData>({
    lastCheckIn: null,
    streak: 0,
    totalDays: 0,
    rewardsClaimed: [],
  })
  const { showToast } = useToast()
  const toastRef = useRef(showToast)
  const checkInDataRef = useRef(checkInData)

  useEffect(() => {
    checkInDataRef.current = checkInData
  }, [checkInData])

  useEffect(() => {
    toastRef.current = showToast
  }, [showToast])

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CHECKIN_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as CheckInData
        // Check if streak should be reset (missed a day)
        const todayStr = getDateString(new Date())
        if (parsed.lastCheckIn && parsed.streak > 0) {
          if (!isYesterday(parsed.lastCheckIn, todayStr) && parsed.lastCheckIn !== todayStr) {
            // Streak is broken - reset it
            parsed.streak = 0
            localStorage.setItem(CHECKIN_KEY, JSON.stringify(parsed))
          }
        }
        setCheckInData(parsed)
      }
    } catch (e) {
      console.warn('Failed to load check-in data from localStorage:', e)
    }
  }, [])

  const checkIn = useCallback((): CheckInResult => {
    const todayStr = getDateString(new Date())
    const current = checkInDataRef.current

    // Already checked in today
    if (current.lastCheckIn === todayStr) {
      return {
        success: false,
        alreadyCheckedIn: true,
        newStreak: current.streak,
      }
    }

    let newStreak: number
    if (current.lastCheckIn && isYesterday(current.lastCheckIn, todayStr)) {
      // Continue streak
      newStreak = current.streak + 1
    } else {
      // Start new streak
      newStreak = 1
    }

    const newTotalDays = current.totalDays + 1

    const newData: CheckInData = {
      lastCheckIn: todayStr,
      streak: newStreak,
      totalDays: newTotalDays,
      rewardsClaimed: current.rewardsClaimed,
    }

    // Check for reward
    const reward = getRewardForStreak(newStreak)

    // Persist
    try {
      localStorage.setItem(CHECKIN_KEY, JSON.stringify(newData))
    } catch (e) {
      console.warn('Failed to save check-in data to localStorage:', e)
      toastRef.current('签到失败，请重试', 'error')
      return { success: false, alreadyCheckedIn: false, newStreak }
    }

    setCheckInData(newData)

    return {
      success: true,
      alreadyCheckedIn: false,
      newStreak,
      reward,
    }
  }, [])

  const isCheckedInToday = useCallback((): boolean => {
    const todayStr = getDateString(new Date())
    return checkInData.lastCheckIn === todayStr
  }, [checkInData.lastCheckIn])

  return {
    checkInData,
    checkIn,
    isCheckedInToday,
  }
}
