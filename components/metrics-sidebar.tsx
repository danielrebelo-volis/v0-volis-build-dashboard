"use client"

import React from "react"

import { TrendingUp, TrendingDown, Clock, DollarSign, Building2, AlertTriangle } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string
  change?: string
  trend?: "up" | "down"
  icon: React.ReactNode
  accent?: string
}

function MetricCard({ title, value, change, trend, icon, accent = "#00d4ff" }: MetricCardProps) {
  return (
    <div className="glass-card rounded-lg p-4 relative overflow-hidden group">
      {/* Subtle glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${accent}08 0%, transparent 70%)`
        }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">{title}</span>
          <div className="text-muted-foreground/60">{icon}</div>
        </div>

        <div className="flex items-end gap-2">
          <span className="text-2xl font-semibold text-foreground tracking-tight">{value}</span>
          {change && (
            <span className={`text-xs flex items-center gap-0.5 mb-1 ${trend === "up" ? "text-success" : "text-destructive"
              }`}>
              {trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {change}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export function MetricsSidebar() {
  return (
    <div className="space-y-3">
      <MetricCard
        title="Active Projects"
        value="24"
        change="+3"
        trend="up"
        icon={<Building2 className="w-4 h-4" />}
        accent="#00d4ff"
      />

      <MetricCard
        title="Total Budget"
        value="$1.24B"
        change="+12.4%"
        trend="up"
        icon={<DollarSign className="w-4 h-4" />}
        accent="#00ff88"
      />

      <MetricCard
        title="On Schedule"
        value="67%"
        change="-2.1%"
        trend="down"
        icon={<Clock className="w-4 h-4" />}
        accent="#ffaa00"
      />

      <MetricCard
        title="At Risk"
        value="4"
        change="+1"
        trend="down"
        icon={<AlertTriangle className="w-4 h-4" />}
        accent="#ff6b6b"
      />

      {/* Quick Stats */}
      <div className="glass-card rounded-lg p-4 mt-4">
        <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Performance Overview</h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Avg. CI</span>
            <span className="text-sm font-mono text-foreground">63%</span>
          </div>
          <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-cyan rounded-full" style={{ width: "63%" }} />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Avg. CPI</span>
            <span className="text-sm font-mono text-foreground">0.98</span>
          </div>
          <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-success rounded-full" style={{ width: "98%" }} />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Resource Util.</span>
            <span className="text-sm font-mono text-foreground">87%</span>
          </div>
          <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-warning rounded-full" style={{ width: "87%" }} />
          </div>
        </div>
      </div>
    </div>
  )
}
