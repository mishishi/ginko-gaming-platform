import { NextRequest, NextResponse } from 'next/server'
import { getUserById, getUserData } from '@/lib/db'

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

    return NextResponse.json({
      success: true,
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
    })
  } catch (error) {
    console.error('Get user data error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get user data' },
      { status: 500 }
    )
  }
}
