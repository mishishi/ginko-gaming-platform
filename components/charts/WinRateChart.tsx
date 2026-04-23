'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { GameStats } from '@/hooks/useGameStats'

const GAME_NAMES: Record<string, string> = {
  idol: '偶像大师',
  quiz: '知识问答',
  fate: '命运之轮',
}

const COLORS = ['#b8956e', '#6e8bb8', '#8bb86e', '#b86e8b', '#8b6eb8']

interface WinRateChartProps {
  stats: GameStats
}

export default function WinRateChart({ stats }: WinRateChartProps) {
  const gameSlugs = ['idol', 'quiz', 'fate']

  const data = gameSlugs
    .map((slug, index) => {
      const wins = stats.wins?.[slug] || 0
      const sessions = stats.gameSessions?.filter(s => s.gameSlug === slug && s.won !== undefined) || []
      return {
        name: GAME_NAMES[slug] || slug,
        wins,
        total: sessions.length,
        color: COLORS[index % COLORS.length],
      }
    })
    .filter(d => d.total > 0)

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-sm" style={{ color: 'var(--text-muted)' }}>
        暂无胜率数据
      </div>
    )
  }

  const pieData = data.map(d => ({
    name: d.name,
    value: d.wins,
    total: d.total,
  }))

  return (
    <div className="w-full">
      <div className="text-xs text-center mb-2" style={{ color: 'var(--text-muted)' }}>
        各游戏胜率
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={65}
            paddingAngle={3}
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              fontSize: 12,
              color: 'var(--text-primary)',
            }}
            formatter={(value, name, props) => {
              const total = (props.payload as { total?: number }).total || 0
              const rate = total > 0 ? Math.round((Number(value) / total) * 100) : 0
              return [`${value}胜 / ${total}局 (${rate}%)`, name]
            }}
          />
          <Legend
            formatter={(value: string) => (
              <span style={{ color: 'var(--text-secondary)', fontSize: 11 }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
