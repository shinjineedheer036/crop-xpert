"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

interface GaugeChartProps {
  value: number
}

export function GaugeChart({ value }: GaugeChartProps) {
  const data = [
    { name: "Used", value: value },
    { name: "Remaining", value: 100 - value },
  ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          startAngle={180}
          endAngle={0}
          innerRadius={40}
          outerRadius={60}
          dataKey="value"
          isAnimationActive={true}
        >
          <Cell fill="#6B8B3A" />
          <Cell fill="#E0E0E0" />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}
