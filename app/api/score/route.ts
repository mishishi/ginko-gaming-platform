import { NextRequest, NextResponse } from 'next/server'
import { submitScore } from '@/lib/db'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { gameSlug, playerName, score } = body

    if (!gameSlug || typeof score !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: gameSlug and score' },
        { status: 400 }
      )
    }

    const player = playerName?.trim() || '匿名玩家'
    const result = await submitScore(gameSlug, player, score)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Score submission error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit score' },
      { status: 500 }
    )
  }
}
