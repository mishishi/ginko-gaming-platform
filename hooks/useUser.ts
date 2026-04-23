'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

const USER_KEY = 'yinqiu-user'
const MIGRATED_KEY = 'yinqiu-migrated'

export interface UserData {
  anonymousId: string      // "旅人#2847"
  nickname: string | null  // Custom nickname, null if not set
  createdAt: string        // ISO date string
  lastActiveAt: string     // ISO date string
  gamesPlayed: string[]    // Array of game slugs
  totalPlayTime: number    // Minutes
  cloudId?: number         // Cloud user ID after registration
  isRegistered?: boolean   // True if registered in cloud
}

export interface CloudUser {
  id: number
  anonymousId: string
  nickname: string | null
  title: string
  level: number
  exp: number
  createdAt: string
  lastActiveAt: string
}

function generateAnonymousId(): string {
  const num = Math.floor(1000 + Math.random() * 9000)
  return `旅人#${num}`
}

function getDateString(date: Date): string {
  return date.toISOString()
}

export function useUser() {
  const [userData, setUserData] = useState<UserData>({
    anonymousId: '',
    nickname: null,
    createdAt: '',
    lastActiveAt: '',
    gamesPlayed: [],
    totalPlayTime: 0,
  })
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [cloudUser, setCloudUser] = useState<CloudUser | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null)
  const storageErrorRef = useRef(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(USER_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as UserData
        // Update last active
        parsed.lastActiveAt = getDateString(new Date())
        setUserData(parsed)
        setIsLoggedIn(parsed.isRegistered || false)
      } else {
        // Create new user
        const newUser: UserData = {
          anonymousId: generateAnonymousId(),
          nickname: null,
          createdAt: getDateString(new Date()),
          lastActiveAt: getDateString(new Date()),
          gamesPlayed: [],
          totalPlayTime: 0,
        }
        localStorage.setItem(USER_KEY, JSON.stringify(newUser))
        setUserData(newUser)
      }
    } catch (e) {
      console.warn('Failed to load user data from localStorage:', e)
      storageErrorRef.current = true
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage whenever userData changes
  const saveToLocalStorage = useCallback((data: UserData) => {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(data))
      storageErrorRef.current = false
    } catch (e) {
      console.warn('Failed to save user data:', e)
      storageErrorRef.current = true
    }
  }, [])

  const updateNickname = useCallback((nickname: string | null) => {
    const newData = { ...userData, nickname }
    saveToLocalStorage(newData)
    setUserData(newData)
  }, [userData, saveToLocalStorage])

  const recordGamePlayed = useCallback((gameSlug: string, playTimeMinutes: number) => {
    const gamesPlayed = userData.gamesPlayed.includes(gameSlug)
      ? userData.gamesPlayed
      : [...userData.gamesPlayed, gameSlug]

    const newData: UserData = {
      ...userData,
      gamesPlayed,
      totalPlayTime: userData.totalPlayTime + playTimeMinutes,
      lastActiveAt: getDateString(new Date()),
    }

    saveToLocalStorage(newData)
    setUserData(newData)
  }, [userData, saveToLocalStorage])

  // Login with nickname
  const login = useCallback(async (nickname: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, anonymousId: userData.anonymousId }),
      })

      const result = await response.json()

      if (result.success) {
        const cloudU = result.user as CloudUser
        setCloudUser(cloudU)
        setIsLoggedIn(true)

        // Update localStorage with cloud ID
        const newData = {
          ...userData,
          nickname: cloudU.nickname,
          cloudId: cloudU.id,
          isRegistered: true,
        }
        saveToLocalStorage(newData)
        setUserData(newData)

        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (e) {
      console.error('Login error:', e)
      return { success: false, error: 'Network error' }
    }
  }, [userData, saveToLocalStorage])

  // Register (create cloud account)
  const register = useCallback(async (nickname?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ anonymousId: userData.anonymousId, nickname }),
      })

      const result = await response.json()

      if (result.success) {
        const cloudU = result.user as CloudUser
        setCloudUser(cloudU)
        setIsLoggedIn(true)

        // Update localStorage with cloud ID
        const newData = {
          ...userData,
          nickname: cloudU.nickname,
          cloudId: cloudU.id,
          isRegistered: true,
        }
        saveToLocalStorage(newData)
        setUserData(newData)

        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (e) {
      console.error('Register error:', e)
      return { success: false, error: 'Network error' }
    }
  }, [userData, saveToLocalStorage])

  // Migrate local data to cloud
  const migrateData = useCallback(async (stats: {
    playCount: Record<string, number>
    highScore: Record<string, number>
    lastPlayedAt: Record<string, string>
    achievements: string[]
    totalPlayTime: Record<string, number>
    gameSessions: Array<{
      gameSlug: string
      date: string
      duration: number
      score: number
      won?: boolean
    }>
    weeklyStats: Array<{
      weekStart: string
      totalPlays: number
      totalDuration: number
    }>
    wins: Record<string, number>
  }, checkin?: {
    consecutiveDays: number
    lastCheckIn: string
    totalCheckIns: number
  }): Promise<{ success: boolean; error?: string; expGained?: number }> => {
    try {
      // First register if not registered
      if (!userData.isRegistered) {
        const regResult = await register()
        if (!regResult.success) {
          return { success: false, error: regResult.error }
        }
      }

      const response = await fetch('/api/user/migrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          anonymousId: userData.anonymousId,
          nickname: userData.nickname || undefined,
          stats,
          checkin,
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Mark as migrated in localStorage
        localStorage.setItem(MIGRATED_KEY, 'true')

        if (result.user) {
          setCloudUser(result.user)
        }
        if (result.expGained) {
          setLastSyncAt(getDateString(new Date()))
        }
        return { success: true, expGained: result.expGained }
      } else {
        return { success: false, error: result.error }
      }
    } catch (e) {
      console.error('Migrate error:', e)
      return { success: false, error: 'Network error' }
    }
  }, [userData, register])

  // Sync local data to cloud
  const syncToCloud = useCallback(async (stats: {
    playCount: Record<string, number>
    highScore: Record<string, number>
    lastPlayedAt: Record<string, string>
    achievements: string[]
    totalPlayTime: Record<string, number>
    gameSessions: Array<{
      gameSlug: string
      date: string
      duration: number
      score: number
      won?: boolean
    }>
    weeklyStats: Array<{
      weekStart: string
      totalPlays: number
      totalDuration: number
    }>
    wins: Record<string, number>
  }, checkin?: {
    consecutiveDays: number
    lastCheckIn: string
    totalCheckIns: number
  }): Promise<{ success: boolean; error?: string }> => {
    if (!userData.cloudId) {
      return { success: false, error: 'Not registered' }
    }

    setIsSyncing(true)
    try {
      const response = await fetch('/api/user/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          anonymousId: userData.anonymousId,
          nickname: userData.nickname || undefined,
          stats,
          checkin,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setLastSyncAt(getDateString(new Date()))
        if (result.user) {
          setCloudUser(result.user)
        }
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (e) {
      console.error('Sync error:', e)
      return { success: false, error: 'Network error' }
    } finally {
      setIsSyncing(false)
    }
  }, [userData])

  // Logout (clear cloud state only, keep local)
  const logout = useCallback(() => {
    setCloudUser(null)
    setIsLoggedIn(false)
    // Keep localStorage data, just clear cloud ID
    const newData = {
      ...userData,
      cloudId: undefined,
      isRegistered: false,
    }
    saveToLocalStorage(newData)
    setUserData(newData)
  }, [userData, saveToLocalStorage])

  const displayName = userData.nickname || userData.anonymousId

  return {
    userData,
    isLoaded,
    isLoggedIn,
    cloudUser,
    displayName,
    isSyncing,
    lastSyncAt,
    hasStorageError: storageErrorRef.current,
    updateNickname,
    recordGamePlayed,
    login,
    register,
    logout,
    migrateData,
    syncToCloud,
  }
}
