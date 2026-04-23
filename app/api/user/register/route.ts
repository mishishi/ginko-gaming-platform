import { NextRequest, NextResponse } from 'next/server'
import { createUser, getUserByAnonymousId, getUserByNickname, setPasswordHash } from '@/lib/db'
import bcrypt from 'bcryptjs'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { anonymousId, nickname, password } = body

    if (!anonymousId) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: anonymousId' },
        { status: 400 }
      )
    }

    // Check if user already exists by anonymousId
    const existingUser = getUserByAnonymousId(anonymousId)
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User already registered', user: existingUser },
        { status: 409 }
      )
    }

    // Check if nickname is taken (if provided)
    if (nickname) {
      const nicknameUser = getUserByNickname(nickname)
      if (nicknameUser) {
        return NextResponse.json(
          { success: false, error: 'Nickname already taken' },
          { status: 409 }
        )
      }
    }

    // Create new user
    const user = createUser(anonymousId, nickname)

    // Set password if provided
    if (password) {
      const passwordHash = await bcrypt.hash(password, 10)
      setPasswordHash(user.id!, passwordHash)
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
    console.error('User registration error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to register user' },
      { status: 500 }
    )
  }
}
