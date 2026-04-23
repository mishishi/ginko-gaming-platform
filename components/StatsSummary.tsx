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

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}秒`
  if (seconds < 3600) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return secs > 0 ? `${mins}分${secs}秒` : `${mins}分钟`
  }
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`
}

// Calculate consecutive days from sessions
function calculateConsecutiveDays(sessions: GameStats['gameSessions']): number {
  if (!sessions || sessions.length === 0) return 0

  const uniqueDates = Array.from(new Set(sessions.map(s => s.date))).sort().reverse()
  if (uniqueDates.length === 0) return 0

  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  // Check if the most recent session is today or yesterday
  if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) {
    return 0
  }

  let consecutive = 1
  for (let i = 1; i < uniqueDates.length; i++) {
    const current = new Date(uniqueDates[i - 1])
    const prev = new Date(uniqueDates[i])
    const diffDays = Math.floor((current.getTime() - prev.getTime()) / 86400000)

    if (diffDays === 1) {
      consecutive++
    } else {
      break
    }
  }

  return consecutive
}

// Get week start date
function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

// Calculate weekly comparison
function getWeeklyComparison(weeklyStats: GameStats['weeklyStats']): { thisWeek: { plays: number; duration: number }; lastWeek: { plays: number; duration: number }; trend: 'up' | 'down' | 'same' } {
  const now = new Date()
  const thisWeekStart = getWeekStart(now).toISOString().split('T')[0]
  const lastWeekStart = getWeekStart(new Date(now.getTime() - 7 * 86400000)).toISOString().split('T')[0]

  const thisWeek = weeklyStats.find(w => w.weekStart === thisWeekStart) || { totalPlays: 0, totalDuration: 0 }
  const lastWeek = weeklyStats.find(w => w.weekStart === lastWeekStart) || { totalPlays: 0, totalDuration: 0 }

  let trend: 'up' | 'down' | 'same' = 'same'
  if (thisWeek.totalPlays > lastWeek.totalPlays) trend = 'up'
  else if (thisWeek.totalPlays < lastWeek.totalPlays) trend = 'down'

  return {
    thisWeek: { plays: thisWeek.totalPlays, duration: thisWeek.totalDuration },
    lastWeek: { plays: lastWeek.totalPlays, duration: lastWeek.totalDuration },
    trend,
  }
}

export default function StatsSummary({ stats }: StatsSummaryProps) {
  const totalPlays = Object.values(stats.playCount).reduce((sum, count) => sum + count, 0)
  const totalPlayTime = Object.values(stats.totalPlayTime || {}).reduce((sum, t) => sum + t, 0)
  const gameSlugs = ['idol', 'quiz', 'fate']

  const consecutiveDays = calculateConsecutiveDays(stats.gameSessions || [])
  const weekly = getWeeklyComparison(stats.weeklyStats || [])

  // Calculate win rates per game
  const getWinRate = (slug: string): number => {
    const wins = stats.wins?.[slug] || 0
    const gameSessions = stats.gameSessions?.filter(s => s.gameSlug === slug && s.won !== undefined) || []
    if (gameSessions.length === 0) return 0
    return Math.round((wins / gameSessions.length) * 100)
  }

  const trendIcon = {
    up: '↑',
    down: '↓',
    same: '→',
  }[weekly.trend]

  const trendColor = {
    up: 'var(--accent-green)',
    down: 'var(--accent-red)',
    same: 'var(--text-muted)',
  }[weekly.trend]

  return (
    <div
      className="rounded-lg p-4 space-y-4"
      style={{
        backgroundColor: 'rgba(74, 92, 79, 0.2)',
        border: '1px solid rgba(184, 148, 95, 0.3)',
      }}
      role="region"
      aria-label="游戏统计数据"
    >
      {/* Header */}
      <div className="flex items-center gap-2" style={{ color: 'var(--accent-copper)' }}>
        <span className="text-lg" aria-hidden="true">📊</span>
        <h3 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          游戏统计
        </h3>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-2 gap-3">
        {/* Total Plays */}
        <div className="flex items-center gap-3 p-2 rounded" style={{ backgroundColor: 'rgba(0, 0, 0, 0.15)' }}>
          <span className="text-base" aria-hidden="true">🎮</span>
          <div className="flex-1">
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>总游戏次数</div>
            <div className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{totalPlays}</div>
          </div>
        </div>

        {/* Total Play Time */}
        <div className="flex items-center gap-3 p-2 rounded" style={{ backgroundColor: 'rgba(0, 0, 0, 0.15)' }}>
          <span className="text-base" aria-hidden="true">⏱️</span>
          <div className="flex-1">
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>累计时长</div>
            <div className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{formatDuration(totalPlayTime)}</div>
          </div>
        </div>

        {/* Consecutive Days */}
        <div className="flex items-center gap-3 p-2 rounded" style={{ backgroundColor: 'rgba(0, 0, 0, 0.15)' }}>
          <span className="text-base" aria-hidden="true">🔥</span>
          <div className="flex-1">
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>连续游玩</div>
            <div className="text-lg font-semibold" style={{ color: 'var(--accent-amber)' }}>
              {consecutiveDays > 0 ? `${consecutiveDays} 天` : '-'}
            </div>
          </div>
        </div>

        {/* Weekly Trend */}
        <div className="flex items-center gap-3 p-2 rounded" style={{ backgroundColor: 'rgba(0, 0, 0, 0.15)' }}>
          <span className="text-base" aria-hidden="true">📈</span>
          <div className="flex-1">
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>本周趋势</div>
            <div className="text-lg font-semibold" style={{ color: trendColor }}>
              {weekly.thisWeek.plays > 0 || weekly.lastWeek.plays > 0 ? (
                <span className="flex items-center gap-1">
                  {trendIcon} {weekly.thisWeek.plays}
                </span>
              ) : '-'}
            </div>
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
          const playTime = stats.totalPlayTime?.[slug] || 0
          const winRate = getWinRate(slug)

          return (
            <div
              key={slug}
              className="flex items-center gap-3 p-2 rounded"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.15)' }}
            >
              <span className="text-base" aria-hidden="true">{GAME_ICONS[slug]}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                  {GAME_NAMES[slug]}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    次数: <span style={{ color: 'var(--accent-copper)' }}>{playCount}</span>
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    最高分: <span style={{ color: 'var(--accent-glow)' }}>{highScore}</span>
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    时长: <span style={{ color: 'var(--accent-amber)' }}>{formatDuration(playTime)}</span>
                  </div>
                  {winRate > 0 && (
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      胜率: <span style={{ color: 'var(--accent-green)' }}>{winRate}%</span>
                    </div>
                  )}
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

      {/* Weekly Comparison Detail */}
      {(weekly.thisWeek.plays > 0 || weekly.lastWeek.plays > 0) && (
        <div className="pt-2" style={{ borderTop: '1px solid rgba(184, 148, 95, 0.2)' }}>
          <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
            <div className="flex items-center gap-4">
              <div>
                本周: <span style={{ color: 'var(--accent-copper)' }}>{weekly.thisWeek.plays}次</span>
                <span style={{ color: 'var(--text-muted)' }}> ({formatDuration(weekly.thisWeek.duration)})</span>
              </div>
              <div>
                上周: <span style={{ color: 'var(--text-muted)' }}>{weekly.lastWeek.plays}次</span>
                <span style={{ color: 'var(--text-muted)' }}> ({formatDuration(weekly.lastWeek.duration)})</span>
              </div>
            </div>
            <div style={{ color: trendColor }}>{trendIcon}</div>
          </div>
        </div>
      )}
    </div>
  )
}
