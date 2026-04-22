'use client'

import { useGameStats } from '@/hooks/useGameStats'
import AchievementWall from '@/components/AchievementWall'
import StatsSummary from '@/components/StatsSummary'
import CheckInCalendar from '@/components/CheckInCalendar'
import type { AchievementId } from '@/components/AchievementBadge'

export default function StatsSection() {
  const { stats, unlockedIds } = useGameStats()

  return (
    <section className="max-w-5xl mx-auto px-4 py-16 space-y-16" aria-labelledby="stats-heading">
      <h2 id="stats-heading" className="sr-only">游戏数据与成就</h2>

      {/* Check-in and Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatsSummary stats={stats} />
        <CheckInCalendar />
      </div>

      <AchievementWall unlockedIds={unlockedIds as AchievementId[]} />
    </section>
  )
}
