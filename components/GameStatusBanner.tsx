'use client'

import { useGameStatus } from './GameStatusProvider'
import { Game } from '@/lib/games'

interface GameStatusBannerProps {
  game: Game
}

export default function GameStatusBanner({ game }: GameStatusBannerProps) {
  const { status, isLoading } = useGameStatus()
  const gameStatus = status[game.slug]
  const isReachable = gameStatus?.reachable ?? false
  const latency = gameStatus?.latency

  if (isLoading) {
    return (
      <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(74, 92, 79, 0.3)', color: 'var(--text-secondary)' }}>
        检测中...
      </span>
    )
  }

  if (!game.playable) {
    return (
      <span
        className="text-xs px-2 py-0.5 rounded"
        style={{ backgroundColor: 'rgba(184, 148, 95, 0.4)', color: 'var(--accent-amber)' }}
      >
        维护中
      </span>
    )
  }

  if (isReachable) {
    return (
      <span
        className="text-xs px-2 py-0.5 rounded flex items-center gap-1.5"
        style={{ backgroundColor: 'rgba(74, 92, 79, 0.4)', color: 'var(--accent-green)' }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
        在线
        {latency !== null && <span className="text-[10px] opacity-70">{latency}ms</span>}
      </span>
    )
  }

  return (
    <span
      className="text-xs px-2 py-0.5 rounded"
      style={{ backgroundColor: 'rgba(184, 148, 95, 0.4)', color: 'var(--accent-amber)' }}
    >
      服务器离线
    </span>
  )
}
