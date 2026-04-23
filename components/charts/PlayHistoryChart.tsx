'use client'

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { GameStats } from '@/hooks/useGameStats'

interface PlayHistoryChartProps {
  stats: GameStats
}

export default function PlayHistoryChart({ stats }: PlayHistoryChartProps) {
  // Build daily play time from sessions
  const dailyMap: Record<string, number> = {}
  for (const session of stats.gameSessions || []) {
    dailyMap[session.date] = (dailyMap[session.date] || 0) + session.duration
  }

  const last14 = Object.entries(dailyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-14)

  const data = last14.map(([date, duration]) => ({
    date: date.slice(5), // MM-DD
    duration: Math.round(duration / 60), // minutes
  }))

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-sm" style={{ color: 'var(--text-muted)' }}>
        暂无游戏记录
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="text-xs text-center mb-2" style={{ color: 'var(--text-muted)' }}>
        近14天游玩时长（分钟）
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" opacity={0.3} />
          <XAxis
            dataKey="date"
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
            formatter={(value) => [`${value} 分钟`, '游玩时长']}
          />
          <Line
            type="monotone"
            dataKey="duration"
            stroke="var(--accent-copper)"
            strokeWidth={2}
            dot={{ fill: 'var(--accent-copper)', r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
