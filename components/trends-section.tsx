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
  const barClass = isUp ? "bg-success" : "bg-destructive"
  const Icon = isUp ? TrendingUp : TrendingDown
  const label = isUp ? "Uptrend" : "Downtrend"

  return (
    <div className="flex-1 min-w-0">
      <div className={`flex items-center gap-1.5 mb-2`}>
        <Icon className={`w-3.5 h-3.5 ${colorClass}`} />
        <span className={`text-xs font-semibold uppercase tracking-wide ${colorClass}`}>{label}</span>
      </div>
      <div className="space-y-2">
        {projects.map((project) => (
          <div key={project.id} className="group cursor-pointer">
            <div className="flex items-center justify-between mb-0.5">
              <p className="text-xs text-foreground truncate pr-1 hover:text-accent transition-colors">{project.name}</p>
              <span className={`text-xs font-mono font-semibold shrink-0 ${colorClass}`}>
                {isUp ? "+" : "-"}{project.delta}%
              </span>
            </div>
            <div className="h-1 bg-secondary/50 rounded-full overflow-hidden">
              <div
                className={`h-full ${barClass} transition-all duration-300`}
                style={{ width: `${Math.min(project.delta * 4, 100)}%` }}
              />
            </div>
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
    <div className="glass-card rounded-lg p-4 flex flex-col overflow-y-auto" style={{ height: 'calc(100svh - 14rem)' }}>
      <h2 className="text-sm font-medium text-foreground mb-0.5">Uptrends / Downtrends</h2>
      <p className="text-xs text-muted-foreground mb-4">Actual production vs. last approved baselines</p>

      <div className="flex-1 flex flex-col gap-5 overflow-y-auto">
        {/* Schedule Segment */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-border/40" />
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-1">Schedule</span>
            <div className="h-px flex-1 bg-border/40" />
          </div>
          <div className="flex gap-4">
            <TrendColumn projects={scheduleUptrends} direction="up" />
            <div className="w-px bg-border/30 shrink-0" />
            <TrendColumn projects={scheduleDowntrends} direction="down" />
          </div>
        </div>

        {/* Costs Segment */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-border/40" />
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-1">Costs</span>
            <div className="h-px flex-1 bg-border/40" />
          </div>
          <div className="flex gap-4">
            <TrendColumn projects={costUptrends} direction="up" />
            <div className="w-px bg-border/30 shrink-0" />
            <TrendColumn projects={costDowntrends} direction="down" />
          </div>
        </div>
      </div>
    </div>
  )
}
