import { NextRequest, NextResponse } from 'next/server'
import { getUserByNickname, getUserByAnonymousId, addLoginHistory } from '@/lib/db'
import bcrypt from 'bcryptjs'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nickname, anonymousId, password } = body

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

    // Check if user is deleted
    if (user.deleted_at) {
      return NextResponse.json(
        { success: false, error: 'Account has been deleted' },
        { status: 403 }
      )
    }

    // Verify password if set
    if (user.password_hash) {
      if (!password) {
        return NextResponse.json(
          { success: false, error: 'Password required' },
          { status: 401 }
        )
      }
      const passwordValid = await bcrypt.compare(password, user.password_hash)
      if (!passwordValid) {
        return NextResponse.json(
          { success: false, error: 'Invalid password' },
          { status: 401 }
        )
      }
    }

    // Record login history
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    addLoginHistory(user.id!, {
      timestamp: new Date().toISOString(),
      userAgent,
      ip,
    })

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
