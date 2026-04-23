import { NextRequest, NextResponse } from 'next/server'
import {
  getUserByAnonymousId,
  saveUserData,
  recordDailyActive,
  addExp,
  calculateLevel,
  calculateTitle,
  getUserData,
} from '@/lib/db'

export const runtime = 'nodejs'

interface SyncBody {
  anonymousId: string
  nickname?: string
  stats?: {
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
  checkin?: {
    consecutiveDays: number
    lastCheckIn: string
    totalCheckIns: number
    lastSyncedDate?: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: SyncBody = await request.json()
    const { anonymousId, nickname, stats, checkin } = body

    if (!anonymousId) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: anonymousId' },
        { status: 400 }
      )
    }

    // Find existing user
    const user = getUserByAnonymousId(anonymousId)
    if (!user || !user.id) {
      return NextResponse.json(
        { success: false, error: 'User not found. Please register first.' },
        { status: 404 }
      )
    }

    const userId = user.id

    // Calculate exp based on new stats
    let expGained = 0
    if (stats) {
      // Game plays: 10 exp each
      const totalPlays = Object.values(stats.playCount || {}).reduce((a, b) => a + b, 0)
      expGained += totalPlays * 10

      // Achievements: rarity-based exp
      const rarityExp: Record<string, number> = {
        common: 5,
        rare: 15,
        epic: 30,
        legendary: 50,
      }
      for (const achievementId of stats.achievements || []) {
        expGained += rarityExp.common || 5
      }
    }

    // Checkin: 5 exp per day (only for NEW check-ins, not cumulative)
    if (checkin?.lastCheckIn) {
      // Load stored check-in data to find last synced date
      const storedCheckinData = getUserData(userId, 'checkin')
      let lastSyncedDate = ''
      if (storedCheckinData) {
        try {
          const parsed = JSON.parse(storedCheckinData)
          lastSyncedDate = parsed.lastSyncedDate || ''
        } catch (e) {
          // ignore parse errors
        }
      }

      // Only award exp if this is a NEW check-in date (not yet synced)
      if (checkin.lastCheckIn !== lastSyncedDate) {
        expGained += 5
        // Store the new synced date
        checkin.lastSyncedDate = checkin.lastCheckIn
      }
    }

    // Add exp if any gained
    if (expGained > 0) {
      addExp(userId, expGained)
    }

    // Save user data (overwrite existing)
    if (stats) {
      saveUserData(userId, 'stats', JSON.stringify(stats))
    }

    if (checkin) {
      saveUserData(userId, 'checkin', JSON.stringify(checkin))
    }

    // Record daily active entries from sessions
    if (stats?.gameSessions) {
      const dateSet = new Set<string>()
      for (const session of stats.gameSessions) {
        dateSet.add(session.date)
      }
      for (const date of Array.from(dateSet)) {
        const daySessions = stats.gameSessions.filter(s => s.date === date)
        const totalPlayTime = daySessions.reduce((sum, s) => sum + s.duration, 0)
        recordDailyActive(userId, date, daySessions.length, totalPlayTime, false)
      }
    }

    // Get updated user
    const updatedUser = getUserByAnonymousId(anonymousId)
    if (updatedUser) {
      const prevLevel = user.level
      const prevTitle = user.title
      const newLevel = calculateLevel(updatedUser.exp)
      const legendaryCount = (stats?.achievements || []).filter((id: string) =>
        id.includes('legendary') || id.includes('marathoner') || id.includes('perfect_score')
      ).length
      const newTitle = calculateTitle(newLevel, checkin?.consecutiveDays || 0, legendaryCount)

      // Check if title changed (return as newTitle only if changed)
      const titleChanged = newTitle !== prevTitle

      return NextResponse.json({
        success: true,
        user: {
          id: updatedUser.id,
          anonymousId: updatedUser.anonymous_id,
          nickname: updatedUser.nickname,
          title: newTitle,
          level: newLevel,
          exp: updatedUser.exp,
          createdAt: updatedUser.created_at,
          lastActiveAt: updatedUser.last_active_at,
        },
        expGained,
        newTitle: titleChanged ? newTitle : undefined,
      })
    }

    return NextResponse.json({
      success: true,
      user: null,
    })
  } catch (error) {
    console.error('User sync error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to sync user data' },
      { status: 500 }
    )
  }
}
