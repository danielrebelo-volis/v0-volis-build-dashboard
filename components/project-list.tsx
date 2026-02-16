"use client"

import { MoreHorizontal, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ProjectRowProps {
  name: string
  id: string
  status: "on-track" | "at-risk" | "delayed"
  delay: number // % delay (-50 to +50)
  industrialCost: number // % of contract value (0-100)
  completion: number
}

const statusConfig = {
  "on-track": { label: "On Track", color: "#00ff88" },
  "at-risk": { label: "At Risk", color: "#ffaa00" },
  "delayed": { label: "Delayed", color: "#ff6b6b" },
}

function ProjectRow({ name, id, status, delay, industrialCost, completion }: ProjectRowProps) {
  const config = statusConfig[status]
  
  return (
    <Link href={`/project/${id}`}>
      <div className="group flex items-center justify-between py-3 px-4 hover:bg-secondary/30 transition-colors rounded-lg cursor-pointer">
        <div className="flex items-center gap-4">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: config.color }}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">{name}</span>
              <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-xs text-muted-foreground">{id}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right w-16">
            <span className="text-xs text-muted-foreground block">Delay</span>
            <span className={`text-sm font-mono ${delay <= 0 ? 'text-success' : 'text-destructive'}`}>
              {delay > 0 ? '+' : ''}{delay.toFixed(0)}%
            </span>
          </div>
          
          <div className="text-right w-16">
            <span className="text-xs text-muted-foreground block">CI</span>
            <span className={`text-sm font-mono ${industrialCost <= 85 ? 'text-success' : 'text-warning'}`}>
              {industrialCost.toFixed(0)}%
            </span>
          </div>
          
          <div className="w-24">
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
          
          <div 
            className="px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider"
            style={{ 
              backgroundColor: `${config.color}15`,
              color: config.color
            }}
          >
            {config.label}
          </div>
          
        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
        </Button>
      </div>
    </div>
    </Link>
  )
}

export function ProjectList() {
  const projects: ProjectRowProps[] = [
    { name: "Metro Tower", id: "PRJ-001", status: "on-track", delay: -22, industrialCost: 93, completion: 68 },
    { name: "Harbor Bridge", id: "PRJ-002", status: "on-track", delay: 8, industrialCost: 71, completion: 42 },
    { name: "Skyline Plaza", id: "PRJ-003", status: "delayed", delay: 32, industrialCost: 106, completion: 85 },
    { name: "Industrial Park", id: "PRJ-004", status: "on-track", delay: -5, industrialCost: 67, completion: 31 },
    { name: "Riverside Homes", id: "PRJ-005", status: "at-risk", delay: 18, industrialCost: 98, completion: 56 },
  ]

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
