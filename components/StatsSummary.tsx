'use client'

import { GameStats } from '@/hooks/useGameStats'

interface StatsSummaryProps {
  stats: GameStats
}

const GAME_NAMES: Record<string, string> = {
  idol: '偶像大师',
  quiz: '知识问答',
  fate: '命运之轮',
}

const GAME_ICONS: Record<string, string> = {
  idol: '🎤',
  quiz: '❓',
  fate: '🎡',
}

function formatTimestamp(isoString: string): string {
  try {
    const date = new Date(isoString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return '刚刚'
    if (diffMins < 60) return `${diffMins} 分钟前`
    if (diffHours < 24) return `${diffHours} 小时前`
    if (diffDays < 7) return `${diffDays} 天前`
    return date.toLocaleDateString('zh-CN')
  } catch {
    return '未知'
  }
}

export default function StatsSummary({ stats }: StatsSummaryProps) {
  const totalPlays = Object.values(stats.playCount).reduce((sum, count) => sum + count, 0)

  const gameSlugs = ['idol', 'quiz', 'fate']

  return (
    <div
      className="rounded-lg p-4 space-y-4"
      style={{
        backgroundColor: 'rgba(74, 92, 79, 0.2)',
        border: '1px solid rgba(184, 148, 95, 0.3)',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2" style={{ color: 'var(--accent-copper)' }}>
        <span className="text-lg">📊</span>
        <h3 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          游戏统计
        </h3>
      </div>

      {/* Total Plays */}
      <div className="flex items-center gap-3">
        <span className="text-base">🎮</span>
        <div className="flex-1">
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            总游戏次数
          </div>
          <div className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            {totalPlays}
          </div>
        </div>
      </div>

      {/* Per-Game Stats */}
      <div className="space-y-3 pt-2" style={{ borderTop: '1px solid rgba(184, 148, 95, 0.2)' }}>
        <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
          各游戏详情
        </div>
        {gameSlugs.map((slug) => {
          const playCount = stats.playCount[slug] || 0
          const highScore = stats.highScore[slug] || 0
          const lastPlayed = stats.lastPlayedAt[slug]

          return (
            <div
              key={slug}
              className="flex items-center gap-3 p-2 rounded"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.15)' }}
            >
              <span className="text-base">{GAME_ICONS[slug]}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                  {GAME_NAMES[slug]}
                </div>
                <div className="flex gap-4 mt-1">
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    次数: <span style={{ color: 'var(--accent-copper)' }}>{playCount}</span>
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    最高分: <span style={{ color: 'var(--accent-glow)' }}>{highScore}</span>
                  </div>
                </div>
              </div>
              {lastPlayed && (
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {formatTimestamp(lastPlayed)}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Last Played Summary */}
      {totalPlays > 0 && (
        <div className="pt-2" style={{ borderTop: '1px solid rgba(184, 148, 95, 0.2)' }}>
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <span>⏱️</span>
            <span>
              最后游戏:{' '}
              {Object.values(stats.lastPlayedAt)
                .sort()
                .reverse()[0]
                ? formatTimestamp(
                    Object.values(stats.lastPlayedAt).sort().reverse()[0]
                  )
                : '暂无记录'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
