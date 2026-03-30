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
  const colorClass = isUp ? "text-success" : "text-destructive"
  const Icon = isUp ? TrendingUp : TrendingDown
  const label = isUp ? "Uptrend" : "Downtrend"

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1 mb-2">
        <Icon className={`w-3 h-3 ${colorClass}`} />
        <span className={`text-[10px] font-semibold uppercase tracking-wide ${colorClass}`}>{label}</span>
      </div>
      <div className="space-y-1.5">
        {projects.map((project) => (
          <div key={project.id} className="flex items-center justify-between gap-1">
            <div className="min-w-0">
              <p className="text-xs text-foreground truncate leading-tight">{project.name}</p>
              <div className="h-0.5 bg-secondary/40 rounded-full mt-0.5 overflow-hidden">
                <div
                  className={`h-full ${isUp ? "bg-success" : "bg-destructive"} rounded-full`}
                  style={{ width: `${Math.min(project.delta * 4, 100)}%` }}
                />
              </div>
            </div>
            <span className={`text-xs font-mono font-semibold shrink-0 ${colorClass}`}>
              {isUp ? "+" : "-"}{project.delta}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function TrendsSection() {
  const scheduleUptrends: TrendProject[] = [
    { id: "s1", name: "Harbor Bridge", delta: 11.3 },
    { id: "s2", name: "Tech Campus", delta: 8.2 },
    { id: "s3", name: "Metro Tower", delta: 6.8 },
    { id: "s4", name: "Westside Rail", delta: 4.5 },
  ]

  const scheduleDowntrends: TrendProject[] = [
    { id: "s5", name: "Riverside Homes", delta: 12.5 },
    { id: "s6", name: "Industrial Park", delta: 7.8 },
    { id: "s7", name: "Skyline Plaza", delta: 5.2 },
    { id: "s8", name: "Coastal Road", delta: 2.1 },
  ]

  const costUptrends: TrendProject[] = [
    { id: "c1", name: "Harbor Bridge", delta: 11.3 },
    { id: "c2", name: "Tech Campus", delta: 9.7 },
    { id: "c3", name: "Metro Tower", delta: 7.4 },
    { id: "c4", name: "Westside Rail", delta: 5.1 },
  ]

  const costDowntrends: TrendProject[] = [
    { id: "c5", name: "Riverside Homes", delta: 15.3 },
    { id: "c6", name: "Industrial Park", delta: 11.2 },
    { id: "c7", name: "Skyline Plaza", delta: 8.6 },
    { id: "c8", name: "Coastal Road", delta: 6.4 },
  ]

  return (
    <div className="glass-card rounded-lg px-4 py-3 flex flex-col h-full overflow-y-auto">
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-foreground leading-tight">Uptrends / Downtrends</h2>
        <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">Actual production vs. last approved baselines</p>
      </div>

      <div className="flex flex-col justify-between flex-1 gap-4">
        {/* Schedule Segment */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px flex-1 bg-border/30" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Schedule</span>
            <div className="h-px flex-1 bg-border/30" />
          </div>
          <div className="flex gap-3">
            <TrendColumn projects={scheduleUptrends} direction="up" />
            <div className="w-px bg-border/20 shrink-0" />
            <TrendColumn projects={scheduleDowntrends} direction="down" />
          </div>
        </div>

        {/* Costs Segment */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px flex-1 bg-border/30" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Costs</span>
            <div className="h-px flex-1 bg-border/30" />
          </div>
          <div className="flex gap-3">
            <TrendColumn projects={costUptrends} direction="up" />
            <div className="w-px bg-border/20 shrink-0" />
            <TrendColumn projects={costDowntrends} direction="down" />
          </div>
        </div>
      </div>
    </div>
  )
}
