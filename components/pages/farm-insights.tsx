"use client"

import { Card } from "@/components/ui/card"
import { TrendChart } from "@/components/charts/trend-chart"

export function FarmInsights() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-8 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
        <h1 className="text-3xl font-bold text-foreground mb-2">Farm Insights</h1>
        <p className="text-foreground/60">Historical analysis and AI-powered recommendations</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-8 space-y-6">
        {/* Health Trend */}
        <Card className="p-6 border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Crop Health Trend (7 Days)</h2>
          <div className="h-64">
            <TrendChart />
          </div>
        </Card>

        {/* AI Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 border border-border">
            <h3 className="font-semibold text-foreground mb-3">AI Recommendations</h3>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Increase irrigation by 15% this week</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Optimal harvest window: 5-7 days</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Monitor pest activity levels</span>
              </li>
            </ul>
          </Card>

          <Card className="p-6 border border-border">
            <h3 className="font-semibold text-foreground mb-3">Farm Health Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-foreground/70">Average Temperature:</span>
                <span className="font-semibold text-foreground">24.5°C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/70">Avg Soil Moisture:</span>
                <span className="font-semibold text-foreground">58%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/70">Avg Crop Health:</span>
                <span className="font-semibold text-foreground">82%</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
