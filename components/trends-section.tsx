"use client"

import { TrendingUp, TrendingDown } from "lucide-react"

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
  const colorClass = isUp ? "text-emerald-400" : "text-destructive"
  const barColor = isUp ? "bg-emerald-400/70" : "bg-destructive/70"
  const bgHighlight = isUp ? "bg-emerald-400/5" : "bg-destructive/5"
  const borderColor = isUp ? "border-emerald-400/20" : "border-destructive/20"
  const Icon = isUp ? TrendingUp : TrendingDown
  const label = isUp ? "Uptrend" : "Downtrend"
  const maxDelta = Math.max(...projects.map((p) => p.delta))

  return (
    <div className="flex-1 min-w-0">
      {/* Column header */}
      <div className={`flex items-center gap-1 mb-2 px-2 py-1 rounded-md border ${bgHighlight} ${borderColor}`}>
        <Icon className={`w-3 h-3 ${colorClass} shrink-0`} />
        <span className={`text-[9px] font-bold uppercase tracking-widest ${colorClass}`}>{label}</span>
      </div>
      {/* Rows */}
      <div className="space-y-1.5">
        {projects.map((project) => {
          const barWidth = (project.delta / maxDelta) * 100
          return (
            <div key={project.id} className="group">
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
}

function Segment({ label, uptrends, downtrends }: SegmentProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-border/25" />
        <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-muted-foreground/60 px-1">{label}</span>
        <div className="h-px flex-1 bg-border/25" />
      </div>
      <div className="flex gap-2">
        <TrendColumn projects={uptrends} direction="up" />
        <div className="w-px bg-border/20 shrink-0 mx-0.5" />
        <TrendColumn projects={downtrends} direction="down" />
      </div>
    </div>
  )
}

export function TrendsSection() {
  return (
    <div className="glass-card rounded-xl px-4 pt-3 pb-4 flex flex-col h-full overflow-y-auto">

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
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

      <div className="flex flex-col justify-evenly flex-1">
        <Segment
          label="Schedule"
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
