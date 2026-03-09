"use client"

import { MoreHorizontal, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ProjectRowProps {
  name: string
  id: string
  delay: number // % delay (-50 to +50)
  industrialCost: number // % of contract value (0-100)
  completion: number
}

const statusConfig = {
  "on-track": { label: "On Track", color: "#00ff88" },
  "delayed": { label: "Delayed", color: "#ff6b6b" },
}

function ProjectRow({ name, id, delay, industrialCost, completion }: ProjectRowProps) {
  // Determine status based on delay: delay > 0 = "on track", delay < 0 = "delayed"
  const status: "on-track" | "delayed" = delay > 0 ? "on-track" : "delayed"
  const config = statusConfig[status]

  return (
    <Link href={`/project/${id}`}>
      <div className="group grid grid-cols-12 items-center gap-4 py-3 px-4 hover:bg-secondary/30 transition-colors rounded-lg cursor-pointer">
        {/* Project Name Section - 3 columns */}
        <div className="col-span-3 flex items-center gap-4 min-w-0">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: config.color }}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground truncate">{name}</span>
              <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </div>
            <span className="text-xs text-muted-foreground">{id}</span>
          </div>
        </div>

        {/* Delay - 2 columns */}
        <div className="col-span-2 text-right">
          <span className="text-xs text-muted-foreground block">Delay</span>
          <span className={`text-sm font-mono ${delay <= 0 ? 'text-success' : 'text-destructive'}`}>
            {delay > 0 ? '+' : ''}{delay.toFixed(0)}%
          </span>
        </div>

        {/* Industrial Cost - 2 columns */}
        <div className="col-span-2 text-right">
          <span className="text-xs text-muted-foreground block">Industrial Cost</span>
          <span className={`text-sm font-mono ${industrialCost <= 85 ? 'text-success' : 'text-warning'}`}>
            {industrialCost.toFixed(0)}%
          </span>
        </div>

        {/* Progress - 3 columns */}
        <div className="col-span-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">Progress</span>
            <span className="text-xs font-mono text-foreground">{completion}%</span>
          </div>
          <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${completion}%`,
                backgroundColor: config.color
              }}
            />
          </div>
        </div>

        {/* Status & More - 2 columns */}
        <div className="col-span-2 flex items-center justify-between gap-2">
          <div
            className="px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider whitespace-nowrap"
            style={{
              backgroundColor: `${config.color}15`,
              color: config.color
            }}
          >
            {config.label}
          </div>

          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </Link>
  )
}

export function ProjectList() {
  // Aligned with EVM matrix data - same delay and Industrial Cost values
  const allProjects: ProjectRowProps[] = [
    { name: "Metro Tower", id: "PRJ-001", delay: -35, industrialCost: 95, completion: 68 },
    { name: "Harbor Bridge", id: "PRJ-002", delay: 20, industrialCost: 73, completion: 42 },
    { name: "Skyline Plaza", id: "PRJ-003", delay: 32, industrialCost: 94, completion: 85 },
    { name: "Industrial Park", id: "PRJ-004", delay: -30, industrialCost: 70, completion: 31 },
    { name: "Riverside Homes", id: "PRJ-005", delay: 28, industrialCost: 78, completion: 56 },
    { name: "Tech Campus", id: "PRJ-006", delay: -38, industrialCost: 79, completion: 45 },
    { name: "Highway 12 Ext", id: "PRJ-007", delay: -25, industrialCost: 68, completion: 72 },
    { name: "Green Valley", id: "PRJ-008", delay: 38, industrialCost: 72, completion: 51 },
    { name: "Data Center", id: "PRJ-009", delay: -15, industrialCost: 75, completion: 39 },
  ]

  // Filter: Industrial Cost must always be < 100%
  const projects = allProjects.filter(project => project.industrialCost < 100)

  return (
    <div className="glass-card rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-foreground">Recent Projects</h2>
        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
          View All
        </Button>
      </div>

      <div className="space-y-1">
        {projects.map((project) => (
          <ProjectRow key={project.id} {...project} />
        ))}
      </div>
    </div>
  )
}
