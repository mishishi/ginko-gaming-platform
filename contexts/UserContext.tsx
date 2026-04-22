'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useUser, type UserData } from '@/hooks/useUser'

interface UserContextValue {
  userData: UserData
  isLoaded: boolean
  displayName: string
  updateNickname: (nickname: string | null) => void
  recordGamePlayed: (gameSlug: string, playTimeMinutes: number) => void
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
