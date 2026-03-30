"use client"

import React from "react"
import { TrendingUp, TrendingDown, Building2, DollarSign, GitBranch, Target, BarChart2, Activity, Clock } from "lucide-react"

interface KpiRowProps {
  label: string
  value: string
  subLabel?: string
  subValue?: string
  trend?: "up" | "down"
  change?: string
  icon: React.ReactNode
  accent?: string
}

function KpiRow({ label, value, subLabel, subValue, trend, change, icon, accent = "#00d4ff" }: KpiRowProps) {
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-border/30 last:border-0 group">
      <div className="flex items-center gap-2 min-w-0">
        <div className="shrink-0 text-muted-foreground/60">{icon}</div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground truncate">{label}</p>
          {subLabel && (
            <p className="text-xs text-muted-foreground/50 truncate mt-0.5">{subLabel}</p>
          )}
        </div>
      </div>
      <div className="text-right shrink-0 ml-3">
        <div className="flex items-center gap-1 justify-end">
          <span className="text-sm font-semibold text-foreground font-mono">{value}</span>
          {change && trend && (
            <span className={`text-xs flex items-center gap-0.5 ${trend === "up" ? "text-success" : "text-destructive"}`}>
              {trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {change}
            </span>
          )}
        </div>
        {subValue && (
          <p className="text-xs text-muted-foreground/50 mt-0.5">{subValue}</p>
        )}
      </div>
    </div>
  )
}

export function MetricsSidebar() {
  return (
    <div className="flex flex-col gap-3 h-fit">
      {/* Portfolio Overview */}
      <div className="glass-card rounded-lg p-4">
        <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Portfolio Overview</h3>
        <div className="divide-y divide-border/0">
          <KpiRow
            label="Active Projects"
            value="24"
            icon={<Building2 className="w-3.5 h-3.5" />}
            accent="#00d4ff"
          />
          <KpiRow
            label="Portfolio Value"
            value="€1.24B"
            icon={<DollarSign className="w-3.5 h-3.5" />}
            accent="#00ff88"
          />
          <KpiRow
            label="Projects in Pipeline"
            value="11"
            icon={<GitBranch className="w-3.5 h-3.5" />}
            accent="#ffaa00"
          />
          <KpiRow
            label="Projected Final Value"
            value="€1.41B"
            subLabel="Goal"
            subValue="€1.50B"
            trend="up"
            icon={<Target className="w-3.5 h-3.5" />}
            accent="#00d4ff"
          />
        </div>
      </div>

      {/* Performance Overview */}
      <div className="glass-card rounded-lg p-4">
        <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Performance Overview</h3>
        <div className="divide-y divide-border/0">
          <KpiRow
            label="Avg Adjusted IC"
            value="68%"
            icon={<BarChart2 className="w-3.5 h-3.5" />}
            accent="#ffaa00"
          />
          <KpiRow
            label="Avg Analytical IC"
            value="63%"
            icon={<Activity className="w-3.5 h-3.5" />}
            accent="#00d4ff"
          />
          <KpiRow
            label="Avg Project Delay"
            value="21 days"
            icon={<Clock className="w-3.5 h-3.5" />}
            accent="#00ff88"
          />
        </div>
      </div>
    </div>
  )
}
