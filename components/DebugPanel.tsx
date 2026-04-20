'use client'
import { useGameStats } from '@/hooks/useGameStats'

export default function DebugPanel() {
  const { stats, recordPlay } = useGameStats()

  return (
    <div className="fixed bottom-4 right-4 bg-[var(--bg-secondary)] border border-[var(--border-default)] p-4 rounded-lg shadow-xl z-50">
      <p className="text-[var(--accent-copper)] text-xs mb-2 font-medium">调试面板</p>
      <div className="text-[var(--text-muted)] text-xs mb-3 space-y-1">
        <p>已解锁: {stats.achievements.length}/5</p>
        <p>总场次: {Object.values(stats.playCount).reduce((a, b) => a + b, 0)}</p>
      </div>
      <div className="flex flex-col gap-2">
        <button
          onClick={() => recordPlay('idol', 50)}
          className="px-3 py-1.5 text-xs bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] rounded transition-colors"
        >
          偶像 +50分
        </button>
        <button
          onClick={() => recordPlay('idol', 150)}
          className="px-3 py-1.5 text-xs bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] rounded transition-colors"
        >
          偶像 +150分
        </button>
        <button
          onClick={() => recordPlay('quiz', 100)}
          className="px-3 py-1.5 text-xs bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] rounded transition-colors"
        >
          竞技 +100分
        </button>
        <button
          onClick={() => recordPlay('fate', 100)}
          className="px-3 py-1.5 text-xs bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] rounded transition-colors"
        >
          命运 +100分
        </button>
      </div>
    </div>
  )
}
