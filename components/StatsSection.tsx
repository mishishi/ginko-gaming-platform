'use client'

import { useGameStats } from '@/hooks/useGameStats'
import AchievementWall from '@/components/AchievementWall'
import StatsSummary from '@/components/StatsSummary'
import type { AchievementId } from '@/components/AchievementBadge'

export default function StatsSection() {
  const { stats, unlockedIds } = useGameStats()

  return (
    <section className="max-w-5xl mx-auto px-4 py-16 space-y-16">
      <StatsSummary stats={stats} />
      <AchievementWall unlockedIds={unlockedIds as AchievementId[]} />
    </section>
  )
}
