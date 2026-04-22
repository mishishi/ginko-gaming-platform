import { NextRequest, NextResponse } from 'next/server'
import { getTopScores } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const gameSlug = searchParams.get('game')
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? parseInt(limitParam, 10) : 10

    if (!gameSlug) {
      return NextResponse.json(
        { error: 'Missing required query parameter: game' },
        { status: 400 }
      )
    }

    const rankings = await getTopScores(gameSlug, limit)

    return NextResponse.json({
      rankings: rankings.map((entry, index) => ({
        rank: index + 1,
        playerName: entry.playerName,
        score: entry.score,
        gameSlug: entry.gameSlug,
        updatedAt: entry.updatedAt,
      })),
    })
  } catch (error) {
    console.error('Leaderboard fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
}
