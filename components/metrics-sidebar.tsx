"use client"

import React from "react"

interface KpiBlockProps {
  label: string
  value: string
  sub?: string
  subValue?: string
  fill?: number // 0–100 for the mini progress bar
  fillColor?: string // custom fill color for the progress bar
}

function KpiBlock({ label, value, sub, subValue, fill, fillColor }: KpiBlockProps) {
  return (
    <div className="flex flex-col gap-1 py-3 border-b border-border/20 last:border-0">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium leading-tight">{label}</span>
        {sub && subValue && (
          <span className="text-[10px] text-muted-foreground/40 font-mono">{subValue}</span>
        )}
      </div>
      <div className="flex items-end justify-between gap-2">
        <span className="text-xl font-bold font-mono leading-none tracking-tight text-foreground">
          {value}
        </span>
        {sub && (
          <span className="text-[10px] text-muted-foreground/50 leading-tight mb-0.5">{sub}</span>
        )}
      </div>
      {fill !== undefined && (
        <div className="h-0.5 bg-border/30 rounded-full mt-1 overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${fill}%`, backgroundColor: fillColor ?? "hsl(var(--foreground) / 0.2)" }}
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
      <div className="glass-card rounded-xl px-4 pt-3 pb-1 flex flex-col">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-4 rounded-full bg-accent shrink-0" />
          <h3 className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em]">Portfolio Overview</h3>
        </div>
        <div className="flex flex-col">
          <KpiBlock
            label="Active Projects"
            value="24"
            fill={65}
          />
          <KpiBlock
            label="Portfolio Value"
            value="€1.24B"
            fill={83}
          />
          <KpiBlock
            label="Projects in Pipeline"
            value="11"
            fill={40}
          />
          <KpiBlock
            label="Annual Production to Date"
            value="€1.41B"
            fill={94}
          />
          <KpiBlock
            label="Annual Production Forecast"
            value="€1.50B"
            sub="Still not achieved"
            fill={86}
          />
        </div>
      </div>

      {/* Performance Overview */}
      <div className="glass-card rounded-xl px-4 pt-3 pb-1 flex flex-col">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-4 rounded-full bg-accent shrink-0" />
          <h3 className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em]">Performance Overview</h3>
        </div>
        <div className="flex flex-col">
          <KpiBlock
            label="Average Projected IC"
            value="78%"
            fill={68}
          />
          <KpiBlock
            label="Average Annual IC"
            value="81%"
            fill={63}
          />
          <KpiBlock
            label="Average Projected IC"
            value="85%"
            fill={63}
          />
          <KpiBlock
            label="Average Project Delay"
            value="21 days"
          />
        </div>
      </div>

    </div>
  )
}
