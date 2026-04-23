import { NextRequest, NextResponse } from 'next/server'
import { getUserByNickname, getUserByAnonymousId } from '@/lib/db'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nickname, anonymousId } = body

    if (!nickname && !anonymousId) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: nickname or anonymousId' },
        { status: 400 }
      )
    }

    // Try to find user by nickname first
    let user = nickname ? getUserByNickname(nickname) : null

    // If not found by nickname and anonymousId provided, try anonymousId
    if (!user && anonymousId) {
      user = getUserByAnonymousId(anonymousId)
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

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
    })
  } catch (error) {
    console.error('User login error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to login' },
      { status: 500 }
    )
  }
}
