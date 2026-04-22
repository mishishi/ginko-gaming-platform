'use client'

import { Game } from '@/lib/games'

interface GameFrameErrorProps {
  game: Game
  onRetry: () => void
}

export default function GameFrameError({ game, onRetry }: GameFrameErrorProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-primary)] z-20" role="alert" aria-live="assertive">
      <div className="flex flex-col items-center gap-6 p-8 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
        <div className="text-4xl">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-[var(--text-primary)] text-lg font-medium">
            游戏加载失败
          </span>
          <span className="text-[var(--text-secondary)] text-sm">
            请检查网络连接后重试
          </span>
        </div>
        <button
          onClick={onRetry}
          className="px-6 py-2.5 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90 active:scale-95"
          style={{ backgroundColor: game.color }}
        >
          重试
        </button>
      </div>
    </div>
  )
}
