'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useCheckIn, type CheckInData, type CheckInResult } from '@/hooks/useCheckIn'

interface CheckInContextValue {
  checkInData: CheckInData
  checkIn: () => CheckInResult
  isCheckedInToday: () => boolean
  canMakeUpCheckIn: () => boolean
  hasStreakFreeze: () => boolean
  makeUpCheckIn: () => { success: boolean; message: string }
}

const CheckInContext = createContext<CheckInContextValue | null>(null)

export function CheckInProvider({ children }: { children: ReactNode }) {
  const { checkInData, checkIn, isCheckedInToday, canMakeUpCheckIn, hasStreakFreeze, makeUpCheckIn } = useCheckIn()

  return (
    <CheckInContext.Provider value={{ checkInData, checkIn, isCheckedInToday, canMakeUpCheckIn, hasStreakFreeze, makeUpCheckIn }}>
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
