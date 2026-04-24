'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'

interface PlaySession {
  date: string  // ISO date string
  duration: number  // in seconds
}

interface PlayHistoryChartProps {
  data: PlaySession[]
}

export default function PlayHistoryChart({ data }: PlayHistoryChartProps) {
  // Group by date and sum durations
  const chartData = data.reduce((acc, session) => {
    const existing = acc.find((d) => d.date === session.date)
    if (existing) {
      existing.duration += session.duration
    } else {
      acc.push({ date: session.date, duration: session.duration })
    }
    return acc
  }, [] as { date: string; duration: number }[])

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
          <defs>
            <linearGradient id="durationGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#b8956f" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#b8956f" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(184, 149, 110, 0.1)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{
              fill: 'rgba(184, 149, 110, 0.7)',
              fontSize: 10,
            }}
            axisLine={{ stroke: 'rgba(184, 149, 110, 0.2)' }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(value) => `${Math.round(value / 60)}m`}
            tick={{
              fill: 'rgba(184, 149, 110, 0.5)',
              fontSize: 10,
            }}
            axisLine={false}
            tickLine={false}
            width={35}
          />
          <Tooltip
            formatter={(value) => [`${Math.round(Number(value) / 60)} 分钟`, '游戏时长']}
            contentStyle={{
              backgroundColor: 'rgba(26, 24, 20, 0.95)',
              border: '1px solid rgba(184, 149, 110, 0.3)',
              borderRadius: 8,
              color: '#b8956f',
            }}
            labelFormatter={(label) => formatDate(String(label))}
          />
          <Area
            type="monotone"
            dataKey="duration"
            stroke="#b8956f"
            strokeWidth={2}
            fill="url(#durationGradient)"
            dot={{
              r: 3,
              fill: '#b8956f',
              strokeWidth: 0,
            }}
            activeDot={{
              r: 5,
              fill: '#b8956f',
              stroke: '#fff',
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
