'use client'

import { useState, useEffect, useCallback } from 'react'

const USER_KEY = 'yinqiu-user'

export interface UserData {
  anonymousId: string      // "旅人#2847"
  nickname: string | null  // Custom nickname, null if not set
  createdAt: string        // ISO date string
  lastActiveAt: string     // ISO date string
  gamesPlayed: string[]    // Array of game slugs
  totalPlayTime: number    // Minutes
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

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(USER_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as UserData
        // Update last active
        parsed.lastActiveAt = getDateString(new Date())
        setUserData(parsed)
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
    }
    setIsLoaded(true)
  }, [])

  const updateNickname = useCallback((nickname: string | null) => {
    const newData = { ...userData, nickname }
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(newData))
      setUserData(newData)
    } catch (e) {
      console.warn('Failed to save user data:', e)
    }
  }, [userData])

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

    try {
      localStorage.setItem(USER_KEY, JSON.stringify(newData))
      setUserData(newData)
    } catch (e) {
      console.warn('Failed to save user data:', e)
    }
  }, [userData])

  const displayName = userData.nickname || userData.anonymousId

  return {
    userData,
    isLoaded,
    displayName,
    updateNickname,
    recordGamePlayed,
  }
}
