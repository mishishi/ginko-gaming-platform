'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

interface GameData {
  game: string
  plays: number
  color?: string
}

interface GameComparisonChartProps {
  data: GameData[]
}

const COLORS = ['#b8956f', '#4a5c4f', '#8b7355', '#6b8e6b', '#9b8b7a']

export default function GameComparisonChart({ data }: GameComparisonChartProps) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(184, 149, 110, 0.1)"
            vertical={false}
          />
          <XAxis
            dataKey="game"
            tick={{
              fill: 'rgba(184, 149, 110, 0.7)',
              fontSize: 11,
            }}
            axisLine={{ stroke: 'rgba(184, 149, 110, 0.2)' }}
            tickLine={false}
          />
          <YAxis
            tick={{
              fill: 'rgba(184, 149, 110, 0.5)',
              fontSize: 10,
            }}
            axisLine={false}
            tickLine={false}
            width={30}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(26, 24, 20, 0.95)',
              border: '1px solid rgba(184, 149, 110, 0.3)',
              borderRadius: 8,
              color: '#b8956f',
            }}
            cursor={{ fill: 'rgba(184, 149, 110, 0.1)' }}
          />
          <Bar dataKey="plays" radius={[4, 4, 0, 0]}>
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={data[index]?.color || COLORS[index % COLORS.length]}
                fillOpacity={0.8}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
