'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useToast } from '@/contexts/ToastContext'

const CHECKIN_KEY = 'yinqiu-checkin'

// Check-in milestone config
export interface CheckInMilestone {
  days: number
  exp: number
  label: string
}

export const CHECKIN_MILESTONES: CheckInMilestone[] = [
  { days: 1,  exp: 5,   label: '首次签到' },
  { days: 3,  exp: 10,  label: '连续3天' },
  { days: 7,  exp: 20,  label: '连续7天' },
  { days: 14, exp: 15,  label: '连续14天' },
  { days: 21, exp: 25,  label: '连续21天' },
  { days: 30, exp: 50,  label: '连续30天' },
  { days: 60, exp: 50,  label: '连续60天' },
  { days: 90, exp: 100, label: '连续90天' },
]

// Check-in history entry
export interface CheckInEntry {
  date: string       // ISO date string "2026-04-22"
  isMakeUp: boolean  // Whether this was a make-up check-in
}

export interface CheckInData {
  lastCheckIn: string | null  // ISO date string "2026-04-22"
  streak: number              // Consecutive check-in days
  totalDays: number           // Total check-in days
  rewardsClaimed: Record<string, boolean>  // milestone days string → claimed
  streakFreeze: number        // Number of streak freezes available
  missedDays: number          // Track consecutive missed days for grace period
  checkInHistory: CheckInEntry[]  // Array of all check-in entries
}

export interface CheckInResult {
  success: boolean
  alreadyCheckedIn: boolean
  newStreak: number
  isMakeUp: boolean
  expGained: number
  reward?: {
    type: 'achievement' | 'streak_bonus'
    id: string
    name: string
    description: string
    icon: string
  }
  milestonesReached: CheckInMilestone[]
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

function isWeekend(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 6
}

function getMilestonesReached(streak: number, rewardsClaimed: Record<string, boolean>): CheckInMilestone[] {
  return CHECKIN_MILESTONES.filter(m => m.days === streak && !rewardsClaimed[String(m.days)])
}

export function useCheckIn() {
  const [checkInData, setCheckInData] = useState<CheckInData>({
    lastCheckIn: null,
    streak: 0,
    totalDays: 0,
    rewardsClaimed: {},
    streakFreeze: 0,
    missedDays: 0,
    checkInHistory: [],
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
        // Ensure new fields exist
        if (parsed.streakFreeze === undefined) parsed.streakFreeze = 0
        if (parsed.missedDays === undefined) parsed.missedDays = 0
        if (parsed.checkInHistory === undefined) parsed.checkInHistory = []
        // Migrate old string[] rewardsClaimed to object
        if (Array.isArray(parsed.rewardsClaimed)) {
          parsed.rewardsClaimed = {}
        }

        // Check if streak should be reset (missed a day)
        const todayStr = getDateString(new Date())
        if (parsed.lastCheckIn && parsed.streak > 0) {
          if (!isYesterday(parsed.lastCheckIn, todayStr) && parsed.lastCheckIn !== todayStr) {
            // User missed a day - apply grace period logic
            if (parsed.missedDays === 0) {
              // First miss - grant grace period (1 day buffer)
              parsed.missedDays = 1
              localStorage.setItem(CHECKIN_KEY, JSON.stringify(parsed))
            } else {
              // Already had grace period used, streak is now broken
              parsed.streak = 0
              parsed.missedDays = 0
              // Use streak freeze if available
              if (parsed.streakFreeze > 0) {
                parsed.streakFreeze -= 1
                parsed.streak = 1 // Restore minimal streak
                parsed.missedDays = 0
                toastRef.current('🔒 使用了补签卡，你的连续签到已恢复！', 'info')
              }
              localStorage.setItem(CHECKIN_KEY, JSON.stringify(parsed))
            }
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
    const today = new Date()

    // Already checked in today
    if (current.lastCheckIn === todayStr) {
      return {
        success: false,
        alreadyCheckedIn: true,
        newStreak: current.streak,
        isMakeUp: false,
        expGained: 0,
        milestonesReached: [],
      }
    }

    let newStreak: number
    let isMakeUp = false

    if (current.lastCheckIn && isYesterday(current.lastCheckIn, todayStr)) {
      // Continue streak normally
      newStreak = current.streak + 1
      current.missedDays = 0
    } else if (current.lastCheckIn && current.missedDays > 0) {
      // Using grace period - streak preserved but not incremented
      newStreak = current.streak
      isMakeUp = true
      current.missedDays = 0
    } else {
      // Start new streak (first time or after streak break)
      newStreak = 1
      current.missedDays = 0
    }

    // Check if we should grant a streak freeze (at 7-day multiples)
    let newStreakFreeze = current.streakFreeze
    if (newStreak > 0 && newStreak % 7 === 0 && !isMakeUp) {
      newStreakFreeze += 1
    }

    const newTotalDays = current.totalDays + 1

    // Weekend double EXP
    const isWeekendDay = isWeekend(today)
    const baseExp = 5
    const expGained = isWeekendDay ? baseExp * 2 : baseExp

    // Append to check-in history
    const newHistoryEntry: CheckInEntry = { date: todayStr, isMakeUp }
    const existingIndex = current.checkInHistory.findIndex(e => e.date === todayStr)
    const newHistory = existingIndex >= 0
      ? current.checkInHistory.map((e, i) => i === existingIndex ? newHistoryEntry : e)
      : [...current.checkInHistory, newHistoryEntry]

    // Check for milestone rewards reached
    const milestonesReached = getMilestonesReached(newStreak, current.rewardsClaimed)

    // Mark milestones as claimed
    const newRewardsClaimed = { ...current.rewardsClaimed }
    for (const m of milestonesReached) {
      newRewardsClaimed[String(m.days)] = true
    }

    const newData: CheckInData = {
      lastCheckIn: todayStr,
      streak: newStreak,
      totalDays: newTotalDays,
      rewardsClaimed: newRewardsClaimed,
      streakFreeze: newStreakFreeze,
      missedDays: 0,
      checkInHistory: newHistory,
    }

    // Check for achievement reward
    const reward = getRewardForStreak(newStreak)

    // Build milestone message
    let milestoneMsg = ''
    if (milestonesReached.length > 0) {
      const parts = milestonesReached.map(m => `${m.label} +${m.exp} EXP`)
      milestoneMsg = ' ' + parts.join(' ')
    }

    // Build toast message
    let toastMsg = ''
    if (isMakeUp) {
      toastMsg = `补签成功！连续${newStreak}天 🔒`
    } else if (isWeekendDay) {
      toastMsg = `🌟 周六/日双倍 EXP！+${expGained} EXP${milestoneMsg}`
    } else {
      toastMsg = `签到成功！连续${newStreak}天 +${expGained} EXP${milestoneMsg}`
    }
    if (reward) {
      toastMsg += ` ${reward.icon} ${reward.name}`
    }

    // Persist
    try {
      localStorage.setItem(CHECKIN_KEY, JSON.stringify(newData))
    } catch (e) {
      console.warn('Failed to save check-in data to localStorage:', e)
      toastRef.current('签到失败，请重试', 'error')
      return { success: false, alreadyCheckedIn: false, newStreak, isMakeUp, expGained: 0, milestonesReached: [] }
    }

    setCheckInData(newData)

    return {
      success: true,
      alreadyCheckedIn: false,
      newStreak,
      isMakeUp,
      expGained,
      reward,
      milestonesReached,
    }
  }, [])

  const isCheckedInToday = useCallback((): boolean => {
    const todayStr = getDateString(new Date())
    return checkInData.lastCheckIn === todayStr
  }, [checkInData.lastCheckIn])

  // Check if user can do a make-up check-in (has grace period available)
  const canMakeUpCheckIn = useCallback((): boolean => {
    if (isCheckedInToday()) return false
    const todayStr = getDateString(new Date())
    if (!checkInData.lastCheckIn) return false
    // Can make up if: had a previous streak, missed yesterday (grace period active)
    return checkInData.streak > 0 && checkInData.missedDays > 0
  }, [checkInData.lastCheckIn, checkInData.streak, checkInData.missedDays, isCheckedInToday])

  // Check if user has streak freeze available
  const hasStreakFreeze = useCallback((): boolean => {
    return checkInData.streakFreeze > 0
  }, [checkInData.streakFreeze])

  // Show check-in reminder when user returns to tab after absence
  useEffect(() => {
    // Only remind users who have used check-in before (streak > 0)
    if (checkInData.totalDays === 0) return

    let hasShownReminder = false

    const handleVisibilityChange = () => {
      if (document.hidden) {
        hasShownReminder = false
        return
      }
      if (hasShownReminder) return
      if (isCheckedInToday()) return

      hasShownReminder = true
      // Delay slightly to not interrupt their focus transition
      setTimeout(() => {
        const message = checkInData.streak > 0
          ? `好久不见！你的连续签到已 ${checkInData.streak} 天了，今日还未签到`
          : '今日还未签到，快来签到吧！'
        showToast(message, 'info', 5000)
      }, 500)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [checkInData.totalDays, checkInData.streak, isCheckedInToday, showToast])

  return {
    checkInData,
    checkIn,
    isCheckedInToday,
    canMakeUpCheckIn,
    hasStreakFreeze,
  }
}
