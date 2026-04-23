'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useUser, type UserData, type CloudUser } from '@/hooks/useUser'

interface UserContextValue {
  userData: UserData
  isLoaded: boolean
  isLoggedIn: boolean
  cloudUser: CloudUser | null
  displayName: string
  isSyncing: boolean
  lastSyncAt: string | null
  hasStorageError: boolean
  updateNickname: (nickname: string | null) => void
  recordGamePlayed: (gameSlug: string, playTimeMinutes: number) => void
  login: (nickname: string) => Promise<{ success: boolean; error?: string }>
  register: (nickname?: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  migrateData: (stats: UserStats, checkin?: UserCheckin) => Promise<{ success: boolean; error?: string; expGained?: number }>
  syncToCloud: (stats: UserStats, checkin?: UserCheckin) => Promise<{ success: boolean; error?: string }>
}

interface UserStats {
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
}

interface UserCheckin {
  consecutiveDays: number
  lastCheckIn: string
  totalCheckIns: number
}

const UserContext = createContext<UserContextValue | null>(null)

export function UserProvider({ children }: { children: ReactNode }) {
  const user = useUser()

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  )
}

export function useUserContext() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUserContext must be used within UserProvider')
  }
  return context
}
