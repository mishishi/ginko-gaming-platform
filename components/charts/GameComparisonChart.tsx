'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { GameStats } from '@/hooks/useGameStats'

const GAME_NAMES: Record<string, string> = {
  idol: '偶像大师',
  quiz: '知识问答',
  fate: '命运之轮',
}

const GAME_COLORS: Record<string, string> = {
  idol: '#b8956e',
  quiz: '#6e8bb8',
  fate: '#8bb86e',
}

interface GameComparisonChartProps {
  stats: GameStats
}

export default function GameComparisonChart({ stats }: GameComparisonChartProps) {
  const gameSlugs = ['idol', 'quiz', 'fate']

  const data = gameSlugs.map(slug => ({
    name: GAME_NAMES[slug] || slug,
    playCount: stats.playCount[slug] || 0,
    playTime: Math.round((stats.totalPlayTime?.[slug] || 0) / 60), // minutes
    color: GAME_COLORS[slug] || '#b8956e',
  }))

  return (
    <div className="w-full">
      <div className="text-xs text-center mb-2" style={{ color: 'var(--text-muted)' }}>
        各游戏游玩次数
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
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
              name === 'playCount' ? `${value} 次` : `${value} 分钟`,
              name === 'playCount' ? '游玩次数' : '游玩时长',
            ]}
          />
          <Bar dataKey="playCount" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
