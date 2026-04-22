'use client'

import { useGameStats } from '@/hooks/useGameStats'
import AchievementWall from '@/components/AchievementWall'
import StatsSummary from '@/components/StatsSummary'
import CheckInButton from '@/components/CheckInButton'
import type { AchievementId } from '@/components/AchievementBadge'

export default function StatsSection() {
  const { stats, unlockedIds } = useGameStats()

  return (
    <section className="max-w-5xl mx-auto px-4 py-16 space-y-16" aria-labelledby="stats-heading">
      <h2 id="stats-heading" className="sr-only">游戏数据与成就</h2>

      {/* Check-in and Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsSummary stats={stats} />
        {/* Check-in Card */}
        <div
          className="rounded-lg p-4 flex flex-col items-center justify-center"
          style={{
            backgroundColor: 'rgba(74, 92, 79, 0.2)',
            border: '1px solid rgba(184, 148, 95, 0.3)',
          }}
          role="region"
          aria-label="每日签到"
        >
          <div className="flex items-center gap-2 mb-4 self-start" style={{ color: 'var(--accent-copper)' }}>
            <span className="text-lg" aria-hidden="true">📅</span>
            <h3 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              每日签到
            </h3>
          </div>
          <CheckInButton />
        </div>
      </div>

      <AchievementWall unlockedIds={unlockedIds as AchievementId[]} />
    </section>
  )
}
