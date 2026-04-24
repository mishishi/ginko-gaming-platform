'use client'

import { useMemo } from 'react'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts'

interface SkillRadarChartProps {
  playCount: number        // 游玩次数
  highScore: number         // 最高分
  winRate: number           // 胜率
  totalPlayTime: number     // 累计时长（秒）
  consecutiveDays: number   // 连续天数
}

export default function SkillRadarChart({
  playCount,
  highScore,
  winRate,
  totalPlayTime,
  consecutiveDays,
}: SkillRadarChartProps) {
  const data = useMemo(() => {
    // Normalize each value to 0-100 scale for display
    const playCountScore = Math.min(playCount, 100)
    const highScoreScore = Math.min(highScore, 100)
    const winRateScore = Math.min(winRate, 100)
    const playTimeScore = Math.min(totalPlayTime / 3600, 100) // 1小时 = 100分
    const consecutiveScore = Math.min(consecutiveDays * 10, 100) // 10天 = 100分

    return [
      { subject: '游玩次数', score: playCountScore, fullMark: 100 },
      { subject: '最高分', score: highScoreScore, fullMark: 100 },
      { subject: '胜率', score: winRateScore, fullMark: 100 },
      { subject: '游戏时长', score: playTimeScore, fullMark: 100 },
      { subject: '连续活跃', score: consecutiveScore, fullMark: 100 },
    ]
  }, [playCount, highScore, winRate, totalPlayTime, consecutiveDays])

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
          <PolarGrid
            stroke="rgba(184, 149, 110, 0.2)"
            gridType="polygon"
          />
          <PolarAngleAxis
            dataKey="subject"
            tick={{
              fill: 'rgba(184, 149, 110, 0.7)',
              fontSize: 11,
            }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{
              fill: 'rgba(184, 149, 110, 0.5)',
              fontSize: 9,
            }}
            tickCount={5}
          />
          <Radar
            name="能力值"
            dataKey="score"
            stroke="#b8956f"
            fill="#b8956f"
            fillOpacity={0.4}
            strokeWidth={2}
            dot={{
              r: 4,
              fill: '#b8956f',
              strokeWidth: 0,
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
