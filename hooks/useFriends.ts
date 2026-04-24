'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUserContext } from '@/contexts/UserContext'

const FRIENDS_KEY = 'yinqiu-friends'

export interface Friend {
  anonymousId: string
  nickname: string | null
  addedAt: string
}

interface FriendsData {
  friends: Friend[]
}

function getDateString(date: Date): string {
  return date.toISOString()
}

// Extract the 4-digit code from anonymousId like "旅人#2847"
export function extractFriendCode(anonymousId: string): string {
  const match = anonymousId.match(/#(\d{4})$/)
  return match ? match[1] : ''
}

// Check if a code matches an anonymousId
export function matchesFriendCode(anonymousId: string, code: string): boolean {
  return extractFriendCode(anonymousId) === code
}

export function useFriends() {
  const { userData } = useUserContext()
  const [friends, setFriends] = useState<Friend[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load friends from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FRIENDS_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as FriendsData
        setFriends(parsed.friends)
      }
    } catch (e) {
      console.warn('Failed to load friends from localStorage:', e)
    }
    setIsLoaded(true)
  }, [])

  // Save friends to localStorage
  const saveFriends = useCallback((newFriends: Friend[]) => {
    try {
      localStorage.setItem(FRIENDS_KEY, JSON.stringify({ friends: newFriends }))
    } catch (e) {
      console.warn('Failed to save friends to localStorage:', e)
    }
  }, [])

  // Add a friend by their anonymousId
  const addFriend = useCallback((friendAnonymousId: string, friendNickname: string | null = null): boolean => {
    // Don't add yourself
    if (friendAnonymousId === userData.anonymousId) {
      return false
    }

    // Check if already a friend
    if (friends.some(f => f.anonymousId === friendAnonymousId)) {
      return false
    }

    const newFriend: Friend = {
      anonymousId: friendAnonymousId,
      nickname: friendNickname,
      addedAt: getDateString(new Date()),
    }

    const newFriends = [...friends, newFriend]
    setFriends(newFriends)
    saveFriends(newFriends)
    return true
  }, [friends, userData.anonymousId, saveFriends])

  // Remove a friend
  const removeFriend = useCallback((friendAnonymousId: string) => {
    const newFriends = friends.filter(f => f.anonymousId !== friendAnonymousId)
    setFriends(newFriends)
    saveFriends(newFriends)
  }, [friends, saveFriends])

  // Check if a player is a friend
  const isFriend = useCallback((playerName: string): boolean => {
    // Check if playerName matches any friend's anonymousId or nickname
    return friends.some(f =>
      f.anonymousId === playerName ||
      f.nickname === playerName
    )
  }, [friends])

  // Search for a friend by code (4-digit)
  const searchByCode = useCallback((code: string): string | null => {
    // The code should be 4 digits
    const cleanCode = code.replace(/\D/g, '').slice(0, 4)
    if (cleanCode.length !== 4) {
      return null
    }

    // For now, we can't really search other players without a backend
    // This would need to query the server for players with matching anonymousId
    // For local-only implementation, we return null unless the code matches current user
    // In a real implementation, this would call an API

    // For demo purposes, if the code matches the current user's code, return it
    const myCode = extractFriendCode(userData.anonymousId)
    if (myCode === cleanCode) {
      return userData.anonymousId
    }

    return null
  }, [userData.anonymousId])

  // Get friend by player name (for leaderboard filtering)
  const getFriendByPlayerName = useCallback((playerName: string): Friend | undefined => {
    return friends.find(f =>
      f.anonymousId === playerName ||
      f.nickname === playerName
    )
  }, [friends])

  // Get all friend anonymousIds (for filtering)
  const getFriendIds = useCallback((): string[] => {
    return friends.map(f => f.anonymousId)
  }, [friends])

  // Get all friend nicknames (for filtering)
  const getFriendNicknames = useCallback((): string[] => {
    return friends.map(f => f.nickname).filter((n): n is string => n !== null)
  }, [friends])

  return {
    friends,
    isLoaded,
    addFriend,
    removeFriend,
    isFriend,
    searchByCode,
    getFriendByPlayerName,
    getFriendIds,
    getFriendNicknames,
    extractFriendCode,
    userCode: extractFriendCode(userData.anonymousId),
  }
}
