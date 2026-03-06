"use client"

import { ExternalLink } from "lucide-react"
import Link from "next/link"

interface ProjectProps {
  name: string
  id: string
  status: "on-track" | "at-risk" | "delayed"
  delay: number // Y-axis: delay (-50 to +50)
  industrialCost: number // X-axis: IC (60-100)
  completion: number
}

const statusConfig = {
  "on-track": { label: "On Track", color: "#00ff88" },
  "at-risk": { label: "At Risk", color: "#ffaa00" },
  "delayed": { label: "Delayed", color: "#ff6b6b" },
}

function ProjectDot({ name, id, status, delay, industrialCost, completion }: ProjectProps) {
  const config = statusConfig[status]
  
  // Scale IC from 60-100% to chart width (0-100%)
  const icMin = 60, icMax = 100
  const xPercent = ((industrialCost - icMin) / (icMax - icMin)) * 100
  
  // Scale delay from -50 to +50 to chart height (0-100%)
  const delayMin = -50, delayMax = 50
  const yPercent = ((delay - delayMin) / (delayMax - delayMin)) * 100
  
  // Size based on completion
  const size = 28 + (completion / 100) * 12

  return (
    <Link href={`/project/${id}`}>
      <div
        className="absolute group cursor-pointer transition-all hover:scale-110"
        style={{
          left: `${xPercent}%`,
          top: `${yPercent}%`,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          className="rounded-full flex items-center justify-center transition-all hover:shadow-lg"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: config.color,
            boxShadow: `0 0 12px ${config.color}40`,
          }}
        >
          <div className="text-center">
            <div className="text-[9px] font-bold text-black leading-tight">
              {completion}%
            </div>
          </div>
        </div>
        
        {/* Tooltip on hover */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-background border border-border rounded px-2 py-1 text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
          <div className="font-medium text-foreground">{name}</div>
          <div className="text-muted-foreground">{id}</div>
        </div>
      </div>
    </Link>
  )
}

export function ProjectList() {
  // Projects distributed evenly in 4 quadrants (IC: 60-100, Delay: -50 to +50)
  const projects: ProjectProps[] = [
    // Quadrant 1: Low IC (60-80), Low Delay (-50 to 0)
    { name: "Harbor Bridge", id: "PRJ-002", status: "on-track", delay: -30, industrialCost: 68, completion: 42 },
    { name: "Industrial Park", id: "PRJ-004", status: "on-track", delay: -15, industrialCost: 72, completion: 31 },
    
    // Quadrant 2: High IC (80-100), Low Delay (-50 to 0)
    { name: "Metro Tower", id: "PRJ-001", status: "on-track", delay: -22, industrialCost: 91, completion: 68 },
    { name: "Riverside Homes", id: "PRJ-005", status: "at-risk", delay: -10, industrialCost: 87, completion: 56 },
    
    // Quadrant 3: Low IC (60-80), High Delay (0 to +50)
    { name: "Skyline Plaza", id: "PRJ-003", status: "delayed", delay: 25, industrialCost: 75, completion: 85 },
    { name: "Urban Square", id: "PRJ-006", status: "delayed", delay: 35, industrialCost: 65, completion: 52 },
    
    // Quadrant 4: High IC (80-100), High Delay (0 to +50)
    { name: "Coastal Resort", id: "PRJ-007", status: "delayed", delay: 28, industrialCost: 98, completion: 74 },
    { name: "Tech Center", id: "PRJ-008", status: "at-risk", delay: 15, industrialCost: 92, completion: 61 },
  ]

  return (
    <div className="glass-card rounded-lg p-6">
      <div className="mb-4">
        <h2 className="text-sm font-medium text-foreground mb-1">Projects by Performance (IC vs Delay)</h2>
        <p className="text-xs text-muted-foreground">Bubble size indicates completion percentage</p>
      </div>
      
      {/* Chart Container */}
      <div className="relative w-full" style={{ height: "400px" }}>
        {/* Y-axis label */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 text-[10px] text-muted-foreground font-medium whitespace-nowrap">
          Delay %
        </div>
        
        {/* X-axis label */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-8 text-[10px] text-muted-foreground font-medium whitespace-nowrap">
          Industrial Cost (IC) %
        </div>

        {/* Chart Background */}
        <div className="absolute inset-0 border border-border/30 rounded-lg bg-secondary/5 overflow-hidden">
          {/* Grid lines */}
          <div className="absolute inset-0">
            {/* Vertical line at 80% IC (reference) */}
            <div 
              className="absolute top-0 bottom-0 border-l border-accent/30"
              style={{ left: "50%" }}
            />
            {/* Horizontal center line */}
            <div className="absolute left-0 right-0 border-t border-border/20" style={{ top: "50%" }} />
            
            {/* Vertical lines at 25%, 75% */}
            <div className="absolute top-0 bottom-0 border-l border-border/10" style={{ left: "25%" }} />
            <div className="absolute top-0 bottom-0 border-l border-border/10" style={{ left: "75%" }} />
            
            {/* Horizontal lines at 25%, 75% */}
            <div className="absolute left-0 right-0 border-t border-border/10" style={{ top: "25%" }} />
            <div className="absolute left-0 right-0 border-t border-border/10" style={{ top: "75%" }} />
          </div>

          {/* Quadrant Labels */}
          <div className="absolute top-2 left-2 text-[9px] text-muted-foreground/50 font-medium">Low IC<br/>Low Delay</div>
          <div className="absolute top-2 right-2 text-[9px] text-muted-foreground/50 font-medium text-right">High IC<br/>Low Delay</div>
          <div className="absolute bottom-2 left-2 text-[9px] text-muted-foreground/50 font-medium">Low IC<br/>High Delay</div>
          <div className="absolute bottom-2 right-2 text-[9px] text-muted-foreground/50 font-medium text-right">High IC<br/>High Delay</div>

          {/* Reference line label at 80% IC */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 text-[9px] text-accent font-medium">80% IC</div>

          {/* Projects */}
          {projects.map((project) => (
            <ProjectDot key={project.id} {...project} />
          ))}
        </div>

        {/* Axis Values */}
        <div className="absolute -left-10 top-0 text-[9px] text-muted-foreground text-right w-8">+50%</div>
        <div className="absolute -left-10 top-1/2 -translate-y-1/2 text-[9px] text-muted-foreground text-right w-8">0%</div>
        <div className="absolute -left-10 bottom-0 text-[9px] text-muted-foreground text-right w-8">-50%</div>
        
        <div className="absolute bottom-0 left-0 -translate-x-1/2 -translate-y-6 text-[9px] text-muted-foreground">60%</div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-6 text-[9px] text-muted-foreground font-medium text-accent">80%</div>
        <div className="absolute bottom-0 right-0 translate-x-1/2 -translate-y-6 text-[9px] text-muted-foreground">100%</div>
      </div>

      {/* Legend */}
      <div className="mt-8 flex flex-wrap items-center gap-6 pt-4 border-t border-border/30">
        <div className="flex items-center gap-2">
          <div className="text-[9px] text-muted-foreground font-medium">Status:</div>
          {Object.entries(statusConfig).map(([key, config]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: config.color }}
              />
              <span className="text-[9px] text-muted-foreground">{config.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
