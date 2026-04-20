import { NextResponse } from 'next/server'
import { games } from '@/lib/games'

interface GameStatus {
  slug: string
  reachable: boolean
  latency: number | null
}

export const dynamic = 'force-dynamic'

export async function GET() {
  const statusPromises = games.map(async (game): Promise<GameStatus> => {
    const start = Date.now()
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2000)

      const response = await fetch(game.devUrl, {
        method: 'HEAD',
        signal: controller.signal,
        cache: 'no-store',
      })

      clearTimeout(timeoutId)
      const latency = Date.now() - start

      return {
        slug: game.slug,
        reachable: response.ok,
        latency,
      }
    } catch {
      return {
        slug: game.slug,
        reachable: false,
        latency: null,
      }
    }
  })

  const statuses = await Promise.all(statusPromises)

  const result: Record<string, { reachable: boolean; latency: number | null }> = {}
  for (const status of statuses) {
    result[status.slug] = {
      reachable: status.reachable,
      latency: status.latency,
    }
  }

  return NextResponse.json(result, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  })
}
