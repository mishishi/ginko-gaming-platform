'use client'

import { useGameStats } from '@/hooks/useGameStats'
import StatsSummary from '@/components/StatsSummary'

export default function StatsSection() {
  const { stats } = useGameStats()

  return (
    <section className="max-w-5xl mx-auto px-4 py-16 space-y-16" aria-labelledby="stats-heading">
      <h2 id="stats-heading" className="sr-only">游戏数据</h2>

      {/* Stats Summary */}
      <StatsSummary stats={stats} />
    </section>
  )
}
