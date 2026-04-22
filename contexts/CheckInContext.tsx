'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useCheckIn, type CheckInData, type CheckInResult } from '@/hooks/useCheckIn'

interface CheckInContextValue {
  checkInData: CheckInData
  checkIn: () => CheckInResult
  isCheckedInToday: () => boolean
  canMakeUpCheckIn: () => boolean
  hasStreakFreeze: () => boolean
}

const CheckInContext = createContext<CheckInContextValue | null>(null)

export function CheckInProvider({ children }: { children: ReactNode }) {
  const { checkInData, checkIn, isCheckedInToday, canMakeUpCheckIn, hasStreakFreeze } = useCheckIn()

  return (
    <CheckInContext.Provider value={{ checkInData, checkIn, isCheckedInToday, canMakeUpCheckIn, hasStreakFreeze }}>
      {children}
    </CheckInContext.Provider>
  )
}

export function useCheckInContext() {
  const context = useContext(CheckInContext)
  if (!context) {
    throw new Error('useCheckInContext must be used within CheckInProvider')
  }
  return context
}
