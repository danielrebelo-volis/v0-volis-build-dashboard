"use client"

import React from "react"
import { Building2, DollarSign, GitBranch, Target, BarChart2, Activity, Clock } from "lucide-react"

interface KpiBlockProps {
  label: string
  value: string
  sub?: string
  subValue?: string
  icon: React.ReactNode
  accent?: boolean
  fill?: number // 0–100 for the mini progress bar
}

function KpiBlock({ label, value, sub, subValue, icon, accent, fill }: KpiBlockProps) {
  return (
    <div className="flex flex-col gap-1 py-3 border-b border-border/20 last:border-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className={accent ? "text-accent" : "text-muted-foreground/50"}>{icon}</span>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium leading-tight">{label}</span>
        </div>
        {sub && subValue && (
          <span className="text-[10px] text-muted-foreground/40 font-mono">{subValue}</span>
        )}
      </div>
      <div className="flex items-end justify-between gap-2">
        <span className={`text-xl font-bold font-mono leading-none tracking-tight ${accent ? "text-accent" : "text-foreground"}`}>
          {value}
        </span>
        {sub && (
          <span className="text-[10px] text-muted-foreground/50 leading-tight mb-0.5">{sub}</span>
        )}
      </div>
      {fill !== undefined && (
        <div className="h-0.5 bg-border/30 rounded-full mt-1 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${accent ? "bg-accent" : "bg-foreground/20"}`}
            style={{ width: `${fill}%` }}
          />
        </div>
      )}
    </div>
  )
}

export function MetricsSidebar() {
  return (
    <div className="flex flex-col gap-3 h-full">

      {/* Portfolio Overview */}
      <div className="glass-card rounded-xl px-4 pt-3 pb-1 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-4 rounded-full bg-accent shrink-0" />
          <h3 className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em]">Portfolio Overview</h3>
        </div>
        <div className="flex-1 flex flex-col justify-around">
          <KpiBlock
            label="Active Projects"
            value="24"
            icon={<Building2 className="w-3 h-3" />}
            fill={65}
          />
          <KpiBlock
            label="Portfolio Value"
            value="€1.24B"
            icon={<DollarSign className="w-3 h-3" />}
            accent
            fill={83}
          />
          <KpiBlock
            label="Projects in Pipeline"
            value="11"
            icon={<GitBranch className="w-3 h-3" />}
            fill={40}
          />
          <KpiBlock
            label="Projected Final"
            value="€1.41B"
            sub="Goal"
            subValue="€1.50B"
            icon={<Target className="w-3 h-3" />}
            fill={94}
          />
        </div>
      </div>

      {/* Performance Overview */}
      <div className="glass-card rounded-xl px-4 pt-3 pb-1 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-4 rounded-full bg-accent shrink-0" />
          <h3 className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em]">Performance Overview</h3>
        </div>
        <div className="flex-1 flex flex-col justify-around">
          <KpiBlock
            label="Avg Adjusted IC"
            value="68%"
            icon={<BarChart2 className="w-3 h-3" />}
            fill={68}
          />
          <KpiBlock
            label="Avg Analytical IC"
            value="63%"
            icon={<Activity className="w-3 h-3" />}
            accent
            fill={63}
          />
          <KpiBlock
            label="Avg Project Delay"
            value="21 days"
            icon={<Clock className="w-3 h-3" />}
          />
        </div>
      </div>

    </div>
  )
}
