import { NextRequest, NextResponse } from 'next/server'
import {
  getUserByAnonymousId,
  createUser,
  saveUserData,
  recordDailyActive,
  addExp,
  calculateLevel,
  calculateTitle,
} from '@/lib/db'

export const runtime = 'nodejs'

interface MigrateBody {
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
  }
  achievements?: string[]
}

export async function POST(request: NextRequest) {
  try {
    const body: MigrateBody = await request.json()
    const { anonymousId, nickname, stats, checkin, achievements } = body

    if (!anonymousId) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: anonymousId' },
        { status: 400 }
      )
    }

    // Find existing user or create new one
    let user = getUserByAnonymousId(anonymousId)
    let isNewUser = false

    if (!user) {
      user = createUser(anonymousId, nickname || undefined)
      isNewUser = true
    }

    if (!user.id) {
      return NextResponse.json(
        { success: false, error: 'Failed to get user ID' },
        { status: 500 }
      )
    }

    const userId = user.id

    // Calculate exp based on stats
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
        // Default to common if unknown
        expGained += rarityExp.common || 5
      }
    }

    // Checkin: 5 exp per day
    if (checkin?.totalCheckIns) {
      expGained += checkin.totalCheckIns * 5
    }

    // Add exp if any gained
    if (expGained > 0) {
      addExp(userId, expGained)
    }

    // Save user data
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

    // Calculate new level and title
    const updatedUser = getUserByAnonymousId(anonymousId)
    if (updatedUser) {
      const newLevel = calculateLevel(updatedUser.exp)
      const legendaryCount = (stats?.achievements || []).filter((id: string) =>
        id.includes('legendary') || id.includes('marathoner') || id.includes('perfect_score')
      ).length
      const newTitle = calculateTitle(newLevel, checkin?.consecutiveDays || 0, legendaryCount)

      return NextResponse.json({
        success: true,
        isNewUser,
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
      })
    }

    return NextResponse.json({
      success: true,
      isNewUser,
      user: null,
    })
  } catch (error) {
    console.error('User migration error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to migrate user data' },
      { status: 500 }
    )
  }
}
