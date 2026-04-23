'use client'

import { useState } from 'react'
import { useLeaderboard, LeaderboardEntry, LeaderboardFilter } from '@/hooks/useLeaderboard'
import { useToast } from '@/contexts/ToastContext'

interface LeaderboardPanelProps {
  gameSlug: string
  currentPlayerName?: string
  title?: string
}

function TrophyIcon({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <span className="text-yellow-400" role="img" aria-label="第一名">
        🥇
      </span>
    )
  }
  if (rank === 2) {
    return (
      <span className="text-gray-300" role="img" aria-label="第二名">
        🥈
      </span>
    )
  }
  if (rank === 3) {
    return (
      <span className="text-amber-600" role="img" aria-label="第三名">
        🥉
      </span>
    )
  }
  return <span className="text-[var(--text-muted)] w-6 text-center">{rank}</span>
}

function LeaderboardRow({ entry, isCurrentPlayer }: { entry: LeaderboardEntry; isCurrentPlayer: boolean }) {
  return (
    <div
      className={`
        flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
        ${isCurrentPlayer
          ? 'bg-[var(--accent-copper)]/20 border border-[var(--accent-copper)]/40'
          : 'hover:bg-[var(--bg-hover)]'
        }
      `}
    >
      <TrophyIcon rank={entry.rank} />
      <div className="flex-1 min-w-0">
        <div className={`text-sm truncate ${isCurrentPlayer ? 'text-[var(--accent-copper)] font-medium' : 'text-[var(--text-primary)]'}`}>
          {entry.playerName}
          {isCurrentPlayer && <span className="ml-2 text-xs text-[var(--text-muted)]">(你)</span>}
        </div>
      </div>
      <div className="text-sm font-medium text-[var(--text-primary)] tabular-nums">
        {entry.score.toLocaleString()}
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-2">
          <div className="w-6 h-6 rounded bg-[var(--bg-hover)] animate-pulse" />
          <div className="flex-1 h-4 rounded bg-[var(--bg-hover)] animate-pulse" />
          <div className="w-16 h-4 rounded bg-[var(--bg-hover)] animate-pulse" />
        </div>
      ))}
    </div>
  )
}

export default function LeaderboardPanel({ gameSlug, currentPlayerName, title = '排行榜' }: LeaderboardPanelProps) {
  const [filter, setFilter] = useState<LeaderboardFilter>('all')
  const { rankings, playerRank, isLoading, error, refresh } = useLeaderboard(gameSlug, 10, filter)
  const { showToast } = useToast()

  const handleRefresh = () => {
    refresh()
    showToast('刷新排行榜', 'info')
  }

  return (
    <div
      className="rounded-lg p-4"
      style={{
        backgroundColor: 'rgba(74, 92, 79, 0.2)',
        border: '1px solid rgba(184, 148, 95, 0.3)',
      }}
      role="region"
      aria-label={`${title}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2" style={{ color: 'var(--accent-copper)' }}>
          <span className="text-lg" aria-hidden="true">🏆</span>
          <h3 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-1">
          {/* Filter tabs */}
          <div className="flex rounded-lg p-0.5" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-xs rounded-md transition-all duration-200 ${
                filter === 'all'
                  ? 'bg-[var(--accent-copper)] text-[var(--bg-primary)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setFilter('week')}
              className={`px-3 py-1 text-xs rounded-md transition-all duration-200 ${
                filter === 'week'
                  ? 'bg-[var(--accent-copper)] text-[var(--bg-primary)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              本周
            </button>
          </div>
          <button
            onClick={handleRefresh}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
            aria-label="刷新排行榜"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={isLoading ? 'animate-spin' : ''}
            >
              <path d="M21 2v6h-6" />
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
              <path d="M3 22v-6h6" />
              <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      {isLoading && <LoadingSkeleton />}

      {error && (
        <div className="text-center py-8">
          <p className="text-sm text-[var(--text-muted)] mb-3">加载失败，请重试</p>
          <button
            onClick={refresh}
            className="px-4 py-2 text-xs rounded border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--accent-copper)] hover:border-[var(--accent-copper)] transition-all duration-200 active:scale-95"
          >
            重试
          </button>
        </div>
      )}

      {!isLoading && !error && rankings.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-2" role="img" aria-hidden="true">📝</div>
          <p className="text-sm text-[var(--text-muted)]">暂无记录</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">成为第一个上榜的玩家吧！</p>
        </div>
      )}

      {!isLoading && !error && rankings.length > 0 && (
        <div className="space-y-1">
          {rankings.map((entry) => (
            <LeaderboardRow
              key={`${entry.playerName}-${entry.score}`}
              entry={entry}
              isCurrentPlayer={currentPlayerName ? entry.playerName === currentPlayerName : false}
            />
          ))}
        </div>
      )}

      {/* Player rank indicator */}
      {playerRank !== null && playerRank > 10 && (
        <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] text-center">
          <span className="text-xs text-[var(--text-muted)]">
            你当前的排名：第 <span className="text-[var(--accent-copper)] font-medium">{playerRank}</span> 名
          </span>
        </div>
      )}
    </div>
  )
}
