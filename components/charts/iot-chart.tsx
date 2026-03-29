"use client"

import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts"

interface IoTChartProps {
  value: number
  range: [number, number]
  color: string
}

export function IoTChart({ value, range, color }: IoTChartProps) {
  const [min, max] = range
  const data = Array.from({ length: 12 }, (_, i) => ({
    index: i,
    value: min + (max - min) * (0.3 + Math.random() * 0.4 + (i / 12) * 0.3),
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            border: "none",
            borderRadius: "8px",
            color: "#fff",
          }}
        />
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} isAnimationActive={true} />
      </LineChart>
    </ResponsiveContainer>
  )
}
