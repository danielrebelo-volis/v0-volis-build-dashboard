"use client"

import { useState } from "react"
import { TrendingUp, TrendingDown, ChevronDown } from "lucide-react"

interface TrendProject {
  id: string
  name: string
  delta: number
}

interface TrendColumnProps {
  projects: TrendProject[]
  direction: "up" | "down"
}

function TrendColumn({ projects, direction }: TrendColumnProps) {
  const isUp = direction === "up"
  const colorClass = isUp ? "text-emerald-500" : "text-destructive"
  const barColor = isUp ? "bg-emerald-500/70" : "bg-destructive/70"
  const bgHighlight = isUp ? "bg-emerald-500/5" : "bg-destructive/5"
  const borderColor = isUp ? "border-emerald-500/20" : "border-destructive/20"
  const Icon = isUp ? TrendingUp : TrendingDown
  const label = isUp ? "Uptrend" : "Downtrend"
  const maxDelta = Math.max(...projects.map((p) => p.delta))

  return (
    <div className="flex-1 min-w-0 flex flex-col">
      {/* Column header */}
      <div className={`flex items-center gap-1 px-2 py-1 rounded-md border shrink-0 ${bgHighlight} ${borderColor}`}>
        <Icon className={`w-3 h-3 ${colorClass} shrink-0`} />
        <span className={`text-[9px] font-bold uppercase tracking-widest ${colorClass}`}>{label}</span>
      </div>
      {/* Rows */}
      <div className="flex flex-col gap-2 pt-1">
        {projects.map((project) => {
          const barWidth = (project.delta / maxDelta) * 100
          return (
            <div key={project.id}>
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[11px] text-foreground/80 leading-tight truncate font-medium">{project.name}</span>
                <span className={`text-[11px] font-mono font-bold shrink-0 ml-1 ${colorClass}`}>
                  {isUp ? "+" : "-"}{project.delta}%
                </span>
              </div>
              <div className="h-[3px] bg-border/20 rounded-full overflow-hidden">
                <div
                  className={`h-full ${barColor} rounded-full transition-all`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface SegmentProps {
  label: string
  uptrends: TrendProject[]
  downtrends: TrendProject[]
  defaultOpen?: boolean
}

function Segment({ label, uptrends, downtrends, defaultOpen = false }: SegmentProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className={`border border-border/25 rounded-lg overflow-hidden flex flex-col`}>
      {/* Collapsed header — always visible */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-muted/30 transition-colors shrink-0"
      >
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-foreground/70">{label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Expandable content — grows to fill available height when open */}
      {open && (
        <div className="px-3 pb-3 pt-1 flex gap-2 border-t border-border/15">
          <TrendColumn projects={uptrends} direction="up" />
          <div className="w-px bg-border/20 shrink-0 mx-0.5" />
          <TrendColumn projects={downtrends} direction="down" />
        </div>
      )}
    </div>
  )
}

export function TrendsSection() {
  return (
    <div className="glass-card rounded-xl px-4 pt-3 pb-4 flex flex-col">

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 rounded-full bg-accent shrink-0" />
            <h2 className="text-sm font-bold text-foreground leading-tight">Uptrends / Downtrends</h2>
          </div>
          <p className="text-[10px] text-muted-foreground/60 leading-tight mt-0.5 ml-3">
            Actual production vs. last approved baselines
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Segment
          label="Progress"
          uptrends={[
            { id: "s1", name: "Harbor Bridge", delta: 11.3 },
            { id: "s2", name: "Tech Campus", delta: 8.2 },
            { id: "s3", name: "Metro Tower", delta: 6.8 },
            { id: "s4", name: "Westside Rail", delta: 4.5 },
          ]}
          downtrends={[
            { id: "s5", name: "Riverside Homes", delta: 12.5 },
            { id: "s6", name: "Industrial Park", delta: 7.8 },
            { id: "s7", name: "Skyline Plaza", delta: 5.2 },
            { id: "s8", name: "Coastal Road", delta: 2.1 },
          ]}
        />
        <Segment
          label="Costs"
          uptrends={[
            { id: "c1", name: "Harbor Bridge", delta: 11.3 },
            { id: "c2", name: "Tech Campus", delta: 9.7 },
            { id: "c3", name: "Metro Tower", delta: 7.4 },
            { id: "c4", name: "Westside Rail", delta: 5.1 },
          ]}
          downtrends={[
            { id: "c5", name: "Riverside Homes", delta: 15.3 },
            { id: "c6", name: "Industrial Park", delta: 11.2 },
            { id: "c7", name: "Skyline Plaza", delta: 8.6 },
            { id: "c8", name: "Coastal Road", delta: 6.4 },
          ]}
        />
      </div>
    </div>
  )
}
