'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'
import { GameStats } from '@/hooks/useGameStats'

function getWeekStart(date: Date): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d.toISOString().split('T')[0]
}

interface WeeklyComparisonChartProps {
  stats: GameStats
}

export default function WeeklyComparisonChart({ stats }: WeeklyComparisonChartProps) {
  const now = new Date()
  const thisWeekStart = getWeekStart(now)
  const lastWeekStart = getWeekStart(new Date(now.getTime() - 7 * 86400000))

  const thisWeekData = stats.weeklyStats?.find(w => w.weekStart === thisWeekStart)
  const lastWeekData = stats.weeklyStats?.find(w => w.weekStart === lastWeekStart)

  const data = [
    {
      name: '本周',
      plays: thisWeekData?.totalPlays || 0,
      duration: Math.round((thisWeekData?.totalDuration || 0) / 60),
    },
    {
      name: '上周',
      plays: lastWeekData?.totalPlays || 0,
      duration: Math.round((lastWeekData?.totalDuration || 0) / 60),
    },
  ]

  const hasData = data.some(d => d.plays > 0 || d.duration > 0)

  if (!hasData) {
    return (
      <div className="flex items-center justify-center h-40 text-sm" style={{ color: 'var(--text-muted)' }}>
        暂无本周数据
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="text-xs text-center mb-2" style={{ color: 'var(--text-muted)' }}>
        本周 vs 上周
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" opacity={0.3} />
          <XAxis
            dataKey="name"
            tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
            axisLine={{ stroke: 'var(--border-subtle)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              fontSize: 12,
              color: 'var(--text-primary)',
            }}
            formatter={(value, name) => [
              name === 'plays' ? `${value} 次` : `${value} 分钟`,
              name === 'plays' ? '游玩次数' : '游玩时长',
            ]}
          />
          <Legend
            formatter={(value: string) => (
              <span style={{ color: 'var(--text-secondary)', fontSize: 11 }}>
                {value === 'plays' ? '次数' : '时长(分)'}
              </span>
            )}
          />
          <Bar dataKey="plays" fill="var(--accent-copper)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="duration" fill="var(--accent-amber)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
