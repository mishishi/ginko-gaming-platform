'use client'

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'

interface WinRateData {
  name: string
  value: number
  color: string
}

interface WinRateChartProps {
  data: WinRateData[]
}

export default function WinRateChart({ data }: WinRateChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke="transparent"
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [
              `${value} 场 (${total > 0 ? Math.round((Number(value) / total) * 100) : 0}%)`,
              '场次',
            ]}
            contentStyle={{
              backgroundColor: 'rgba(26, 24, 20, 0.95)',
              border: '1px solid rgba(184, 149, 110, 0.3)',
              borderRadius: 8,
              color: '#b8956f',
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => (
              <span style={{ color: 'rgba(184, 149, 110, 0.7)', fontSize: 11 }}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
