'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

interface WeekData {
  week: string
  thisWeek: number
  lastWeek: number
}

interface WeeklyComparisonChartProps {
  data: WeekData[]
}

export default function WeeklyComparisonChart({ data }: WeeklyComparisonChartProps) {
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
            dataKey="week"
            tick={{
              fill: 'rgba(184, 149, 110, 0.7)',
              fontSize: 10,
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
          <Legend
            verticalAlign="top"
            height={36}
            formatter={(value) => (
              <span style={{ color: 'rgba(184, 149, 110, 0.7)', fontSize: 11 }}>
                {value === 'thisWeek' ? '本周' : '上周'}
              </span>
            )}
          />
          <Bar
            dataKey="thisWeek"
            fill="#b8956f"
            fillOpacity={0.8}
            radius={[4, 4, 0, 0]}
            name="本周"
          />
          <Bar
            dataKey="lastWeek"
            fill="#4a5c4f"
            fillOpacity={0.6}
            radius={[4, 4, 0, 0]}
            name="上周"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
