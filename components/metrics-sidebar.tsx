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
}

function KpiRow({ label, value, subLabel, subValue, trend, change, icon }: KpiRowProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/20 last:border-0">
      <div className="flex items-center gap-2 min-w-0">
        <div className="shrink-0 text-muted-foreground/50">{icon}</div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground leading-tight truncate">{label}</p>
          {subLabel && (
            <p className="text-[10px] text-muted-foreground/40 leading-tight truncate">{subLabel}</p>
          )}
        </div>
      </div>
      <div className="text-right shrink-0 ml-2">
        <div className="flex items-center gap-1 justify-end">
          <span className="text-sm font-semibold text-foreground font-mono leading-tight">{value}</span>
          {change && trend && (
            <span className={`text-[10px] flex items-center gap-0.5 ${trend === "up" ? "text-success" : "text-destructive"}`}>
              {trend === "up" ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
              {change}
            </span>
          )}
        </div>
        {subValue && (
          <p className="text-[10px] text-muted-foreground/40 leading-tight">{subValue}</p>
        )}
      </div>
    </div>
  )
}

export function MetricsSidebar() {
  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Portfolio Overview */}
      <div className="glass-card rounded-lg px-4 py-3 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">Portfolio Overview</h3>
          <KpiRow
            label="Active Projects"
            value="24"
            icon={<Building2 className="w-3.5 h-3.5" />}
          />
          <KpiRow
            label="Portfolio Value"
            value="€1.24B"
            icon={<DollarSign className="w-3.5 h-3.5" />}
          />
          <KpiRow
            label="Projects in Pipeline"
            value="11"
            icon={<GitBranch className="w-3.5 h-3.5" />}
          />
          <KpiRow
            label="Projected Final Value"
            value="€1.41B"
            subLabel="Goal"
            subValue="€1.50B"
            trend="up"
            icon={<Target className="w-3.5 h-3.5" />}
          />
        </div>
      </div>

      {/* Performance Overview */}
      <div className="glass-card rounded-lg px-4 py-3 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">Performance Overview</h3>
          <KpiRow
            label="Avg Adjusted IC"
            value="68%"
            icon={<BarChart2 className="w-3.5 h-3.5" />}
          />
          <KpiRow
            label="Avg Analytical IC"
            value="63%"
            icon={<Activity className="w-3.5 h-3.5" />}
          />
          <KpiRow
            label="Avg Project Delay"
            value="21 days"
            icon={<Clock className="w-3.5 h-3.5" />}
          />
        </div>
      </div>
    </div>
  )
}
