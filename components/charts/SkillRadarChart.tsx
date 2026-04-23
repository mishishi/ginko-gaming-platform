'use client'

import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { GameStats } from '@/hooks/useGameStats'

function getWeekStart(date: Date): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d.toISOString().split('T')[0]
}

interface SkillRadarChartProps {
  stats: GameStats
}

export default function SkillRadarChart({ stats }: SkillRadarChartProps) {
  const gameSlugs = ['idol', 'quiz', 'fate']
  const totalPlays = Object.values(stats.playCount || {}).reduce((a, b) => a + b, 0)

  // Calculate max values for normalization
  const maxHighScore = Math.max(...gameSlugs.map(s => stats.highScore?.[s] || 0), 1)
  const totalPlayTime = Object.values(stats.totalPlayTime || {}).reduce((a, b) => a + b, 0)
  const maxPlayTime = Math.max(totalPlayTime, 1)

  // Calculate win rate
  let totalWins = 0
  let totalSessions = 0
  for (const slug of gameSlugs) {
    const sessions = stats.gameSessions?.filter(s => s.gameSlug === slug && s.won !== undefined) || []
    totalWins += stats.wins?.[slug] || 0
    totalSessions += sessions.length
  }
  const winRate = totalSessions > 0 ? Math.round((totalWins / totalSessions) * 100) : 0

  // Calculate consecutive days
  const uniqueDates = Array.from(new Set((stats.gameSessions || []).map(s => s.date))).sort()
  let consecutiveDays = 0
  if (uniqueDates.length > 0) {
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    if (uniqueDates[uniqueDates.length - 1] === yesterday || uniqueDates[uniqueDates.length - 1] === today) {
      consecutiveDays = uniqueDates.length
    }
  }

  const data = [
    { subject: '游玩次数', value: totalPlays, max: Math.max(totalPlays, 10) },
    { subject: '最高分', value: maxHighScore, max: maxHighScore },
    { subject: '胜率(%)', value: winRate, max: 100 },
    { subject: '累计时长', value: Math.round(totalPlayTime / 60), max: Math.max(Math.round(totalPlayTime / 60), 30) },
    { subject: '连续天数', value: consecutiveDays, max: Math.max(consecutiveDays, 7) },
  ]

  return (
    <div className="w-full">
      <div className="text-xs text-center mb-2" style={{ color: 'var(--text-muted)' }}>
        综合能力分析
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <RadarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
          <PolarGrid stroke="var(--border-subtle)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
          />
          <Radar
            name="能力值"
            dataKey="value"
            stroke="var(--accent-copper)"
            fill="var(--accent-copper)"
            fillOpacity={0.2}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              fontSize: 12,
              color: 'var(--text-primary)',
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
