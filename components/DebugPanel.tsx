'use client'
import { useGameStats } from '@/hooks/useGameStats'
import { useToast } from '@/contexts/ToastContext'

export default function DebugPanel() {
  const { stats, recordPlay, hasStorageError } = useGameStats()
  const { showToast } = useToast()

  if (process.env.NODE_ENV !== 'development') return null

  const handleRecordPlay = (gameSlug: string, score: number) => {
    const { newlyUnlocked } = recordPlay(gameSlug, score)
    for (const achievement of newlyUnlocked) {
      showToast(`🏆 ${achievement.name}: ${achievement.description}`, 'achievement', 4000)
    }
  }

  return (
    <div className="fixed bottom-4 left-4 bg-[var(--bg-secondary)] border border-[var(--border-default)] p-4 rounded-lg shadow-xl z-50">
      <p className="text-[var(--accent-copper)] text-xs mb-2 font-medium">调试面板</p>
      <div className="text-[var(--text-muted)] text-xs mb-3 space-y-1">
        <p>已解锁: {stats.achievements.length}/5</p>
        <p>总场次: {Object.values(stats.playCount).reduce((a, b) => a + b, 0)}</p>
        {hasStorageError && (
          <p className="text-amber-400">⚠ 成就可能未保存</p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <button
          onClick={() => handleRecordPlay('idol', 50)}
          className="px-3 py-1.5 text-xs bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] rounded transition-colors"
        >
          偶像 +50分
        </button>
        <button
          onClick={() => handleRecordPlay('idol', 150)}
          className="px-3 py-1.5 text-xs bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] rounded transition-colors"
        >
          偶像 +150分
        </button>
        <button
          onClick={() => handleRecordPlay('quiz', 100)}
          className="px-3 py-1.5 text-xs bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] rounded transition-colors"
        >
          竞技 +100分
        </button>
        <button
          onClick={() => handleRecordPlay('fate', 100)}
          className="px-3 py-1.5 text-xs bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] rounded transition-colors"
        >
          命运 +100分
        </button>
      </div>
    </div>
  )
}
