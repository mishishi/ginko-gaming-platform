import { NextRequest, NextResponse } from 'next/server'
import { getUserById, getUserData, getTopScores } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameter: userId' },
        { status: 400 }
      )
    }

    const user = getUserById(parseInt(userId, 10))
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Fetch all user data
    const statsJson = getUserData(user.id!, 'stats')
    const checkinJson = getUserData(user.id!, 'checkin')
    const achievementsJson = getUserData(user.id!, 'achievements')

    // Fetch user's scores from leaderboard
    const scores = getTopScores('', 100) // Get many scores, filter by user below
    const userScores = scores.filter(s => s.playerName === user.nickname || s.playerName === user.anonymous_id)

    const exportData = {
      exportedAt: new Date().toISOString(),
      user: {
        id: user.id,
        anonymousId: user.anonymous_id,
        nickname: user.nickname,
        title: user.title,
        level: user.level,
        exp: user.exp,
        createdAt: user.created_at,
        lastActiveAt: user.last_active_at,
      },
      stats: statsJson ? JSON.parse(statsJson) : null,
      checkin: checkinJson ? JSON.parse(checkinJson) : null,
      achievements: achievementsJson ? JSON.parse(achievementsJson) : null,
      scores: userScores,
    }

    const jsonString = JSON.stringify(exportData, null, 2)
    const encoder = new TextEncoder()
    const bodyBytes = encoder.encode(jsonString)
    const filename = encodeURIComponent(`yinqiu-data-${user.anonymous_id}.json`)
    return new Response(bodyBytes, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Export data error:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to export data' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      }
    )
  }
}
