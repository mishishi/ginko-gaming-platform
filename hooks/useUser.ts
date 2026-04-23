'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

const USER_KEY = 'yinqiu-user'
const MIGRATED_KEY = 'yinqiu-migrated'
const SYNCED_AT_KEY = 'yinqiu-synced-at'
const OFFLINE_QUEUE_KEY = 'yinqiu-offline-queue'

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
  loginHistory?: Array<{
    timestamp: string
    userAgent: string
    ip: string
  }>
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
  const [levelUpTo, setLevelUpTo] = useState<number | null>(null)
  const [newTitle, setNewTitle] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  const [offlineQueue, setOfflineQueue] = useState<Array<{ id: string; type: string; payload: unknown; timestamp: string; retries: number }>>([])
  const storageErrorRef = useRef(false)
  const syncToCloudRef = useRef<typeof syncToCloud | null>(null)

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

  // Network status listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    setIsOnline(navigator.onLine)

    // Load offline queue from localStorage
    try {
      const queue = localStorage.getItem(OFFLINE_QUEUE_KEY)
      if (queue) {
        setOfflineQueue(JSON.parse(queue))
      }
    } catch (e) {
      console.warn('Failed to load offline queue:', e)
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Save offline queue to localStorage
  const saveOfflineQueue = useCallback((queue: typeof offlineQueue) => {
    try {
      localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue))
    } catch (e) {
      console.warn('Failed to save offline queue:', e)
    }
  }, [])

  // Enqueue operation for offline processing
  const enqueueOperation = useCallback((type: string, payload: unknown) => {
    const operation = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      type,
      payload,
      timestamp: new Date().toISOString(),
      retries: 0,
    }
    setOfflineQueue(prev => {
      const newQueue = [...prev, operation]
      saveOfflineQueue(newQueue)
      return newQueue
    })
    return operation.id
  }, [saveOfflineQueue])

  // Process offline queue
  const processQueue = useCallback(async () => {
    if (!userData.cloudId || offlineQueue.length === 0) return

    const failedIds: string[] = []

    for (const operation of offlineQueue) {
      try {
        // Process based on operation type
        if (operation.type === 'sync' && syncToCloudRef.current) {
          const result = await syncToCloudRef.current(
            (operation.payload as { stats: Parameters<typeof syncToCloud>[0] }).stats,
            (operation.payload as { checkin: Parameters<typeof syncToCloud>[1] }).checkin
          )
          if (!result.success && operation.retries >= 3) {
            failedIds.push(operation.id)
          }
        }
        // Remove successful operations from queue
        setOfflineQueue(prev => {
          const newQueue = prev.filter(op => op.id !== operation.id)
          saveOfflineQueue(newQueue)
          return newQueue
        })
      } catch (e) {
        console.warn('Failed to process offline operation:', operation.id, e)
        // Increment retry count
        if (operation.retries < 3) {
          setOfflineQueue(prev => {
            const newQueue = prev.map(op =>
              op.id === operation.id ? { ...op, retries: op.retries + 1 } : op
            )
            saveOfflineQueue(newQueue)
            return newQueue
          })
        } else {
          failedIds.push(operation.id)
        }
      }
    }

    // Remove failed operations after max retries
    if (failedIds.length > 0) {
      setOfflineQueue(prev => {
        const newQueue = prev.filter(op => !failedIds.includes(op.id))
        saveOfflineQueue(newQueue)
        return newQueue
      })
    }
  }, [userData.cloudId, offlineQueue, saveOfflineQueue])

  // Process queue when coming back online
  useEffect(() => {
    if (isOnline && offlineQueue.length > 0) {
      processQueue()
    }
  }, [isOnline, processQueue, offlineQueue.length])

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

  // Update nickname on cloud
  const updateNicknameCloud = useCallback(async (nickname: string): Promise<{ success: boolean; error?: string }> => {
    if (!userData.cloudId) {
      return { success: false, error: 'Not registered' }
    }

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userData.cloudId, nickname }),
      })

      const result = await response.json()

      if (result.success) {
        const cloudU = result.user as CloudUser
        setCloudUser(cloudU)
        // Update local nickname too
        const newData = { ...userData, nickname }
        saveToLocalStorage(newData)
        setUserData(newData)
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (e) {
      console.error('Update nickname error:', e)
      return { success: false, error: 'Network error' }
    }
  }, [userData, saveToLocalStorage])

  // Pull cloud data to local (for new device login)
  const pullFromCloud = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    if (!userData.cloudId) {
      return { success: false, error: 'Not registered' }
    }

    try {
      const response = await fetch(`/api/user/data?userId=${userData.cloudId}`)
      const result = await response.json()

      if (result.success && result.user) {
        const cloudU = result.user as CloudUser
        setCloudUser(cloudU)
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (e) {
      console.error('Pull from cloud error:', e)
      return { success: false, error: 'Network error' }
    }
  }, [userData.cloudId])

  // Export user data as JSON download
  const exportData = useCallback(async () => {
    if (!userData.cloudId) {
      return { success: false, error: 'Not registered' }
    }

    try {
      const response = await fetch(`/api/user/export?userId=${userData.cloudId}`)
      if (!response.ok) {
        throw new Error('Export failed')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `yinqiu-data-${userData.anonymousId}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      return { success: true }
    } catch (e) {
      console.error('Export data error:', e)
      return { success: false, error: 'Export failed' }
    }
  }, [userData.cloudId, userData.anonymousId])

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
  const login = useCallback(async (nickname: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, anonymousId: userData.anonymousId, password }),
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

        // Pull cloud data (new device login scenario)
        await pullFromCloud()

        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (e) {
      console.error('Login error:', e)
      return { success: false, error: 'Network error' }
    }
  }, [userData, saveToLocalStorage, pullFromCloud])

  // Register (create cloud account)
  const register = useCallback(async (nickname?: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ anonymousId: userData.anonymousId, nickname, password }),
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

        // Pull cloud data (new device login scenario)
        await pullFromCloud()

        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (e) {
      console.error('Register error:', e)
      return { success: false, error: 'Network error' }
    }
  }, [userData, saveToLocalStorage, pullFromCloud])

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
    streakFreeze: number
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
        localStorage.setItem(SYNCED_AT_KEY, getDateString(new Date()))

        if (result.user) {
          const prevLevel = cloudUser?.level ?? 1
          const prevTitle = cloudUser?.title ?? ''

          setCloudUser(result.user)

          // Detect level-up
          if (result.user.level > prevLevel) {
            setLevelUpTo(result.user.level)
          }

          // Detect title change
          if (result.newTitle && result.newTitle !== prevTitle) {
            setNewTitle(result.newTitle)
          }
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
  }, [userData, cloudUser?.level, cloudUser?.title])

  // Keep syncToCloudRef updated
  useEffect(() => {
    syncToCloudRef.current = syncToCloud
  }, [syncToCloud])

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

  // Delete account (soft delete)
  const deleteAccount = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    if (!userData.cloudId) {
      return { success: false, error: 'Not registered' }
    }

    try {
      const response = await fetch(`/api/user/account?userId=${userData.cloudId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        // Clear all cloud state and local data
        setCloudUser(null)
        setIsLoggedIn(false)

        // Clear cloud-related localStorage keys
        try {
          localStorage.removeItem(SYNCED_AT_KEY)
          localStorage.removeItem(MIGRATED_KEY)
          localStorage.removeItem(OFFLINE_QUEUE_KEY)
        } catch (e) {
          console.warn('Failed to clear localStorage keys:', e)
        }

        // Clear in-memory offline queue
        setOfflineQueue([])

        const newData = {
          ...userData,
          cloudId: undefined,
          isRegistered: false,
        }
        saveToLocalStorage(newData)
        setUserData(newData)
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (e) {
      console.error('Delete account error:', e)
      return { success: false, error: 'Network error' }
    }
  }, [userData, saveToLocalStorage])

  // Clear level-up and title unlock animation states
  const clearAnimations = useCallback(() => {
    setLevelUpTo(null)
    setNewTitle(null)
  }, [])

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
    isOnline,
    levelUpTo,
    newTitle,
    clearAnimations,
    updateNickname,
    updateNicknameCloud,
    recordGamePlayed,
    login,
    register,
    logout,
    deleteAccount,
    migrateData,
    syncToCloud,
    pullFromCloud,
    exportData,
    offlineQueue,
    enqueueOperation,
    processQueue,
  }
}
