"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export function TrendChart() {
  const data = [
    { day: "Mon", health: 75, temp: 22, moisture: 45 },
    { day: "Tue", health: 76, temp: 23, moisture: 48 },
    { day: "Wed", health: 78, temp: 24, moisture: 52 },
    { day: "Thu", health: 81, temp: 25, moisture: 55 },
    { day: "Fri", health: 82, temp: 24, moisture: 58 },
    { day: "Sat", health: 84, temp: 26, moisture: 62 },
    { day: "Sun", health: 85, temp: 27, moisture: 60 },
  ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.1)" />
        <XAxis dataKey="day" stroke="rgba(0, 0, 0, 0.5)" />
        <YAxis stroke="rgba(0, 0, 0, 0.5)" />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            border: "none",
            borderRadius: "8px",
            color: "#fff",
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="health"
          stroke="#6B8B3A"
          strokeWidth={2}
          dot={{ fill: "#6B8B3A", r: 4 }}
          isAnimationActive={true}
          name="Crop Health %"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
