"use client"

import { useState } from "react"
import Link from "next/link"

interface Project {
  id: string
  name: string
  spi: number
  cpi: number
  budget: string
  trend: "up" | "down" | "stable"
  category: "commercial" | "residential" | "infrastructure" | "industrial"
  region: "north" | "south" | "east" | "west"
  week: "week-1" | "week-2" | "week-3" | "week-4"
  weekData: {
    "week-1": { spi: number; cpi: number }
    "week-2": { spi: number; cpi: number }
    "week-3": { spi: number; cpi: number }
    "week-4": { spi: number; cpi: number }
  }
}

const projects: Project[] = [
  { id: "PRJ-001", name: "Metro Tower", spi: 0.85, cpi: 1.12, budget: "$24.5M", trend: "up", category: "commercial", region: "north", week: "week-1", weekData: { "week-1": { spi: 0.85, cpi: 1.12 }, "week-2": { spi: 0.88, cpi: 1.08 }, "week-3": { spi: 0.92, cpi: 1.04 }, "week-4": { spi: 0.95, cpi: 1.00 } } },
  { id: "PRJ-002", name: "Harbor Bridge", spi: 1.15, cpi: 0.92, budget: "$89.2M", trend: "down", category: "infrastructure", region: "south", week: "week-2", weekData: { "week-1": { spi: 1.22, cpi: 0.88 }, "week-2": { spi: 1.15, cpi: 0.92 }, "week-3": { spi: 1.08, cpi: 0.98 }, "week-4": { spi: 0.98, cpi: 1.05 } } },
  { id: "PRJ-003", name: "Skyline Plaza", spi: 0.95, cpi: 0.88, budget: "$156M", trend: "stable", category: "commercial", region: "east", week: "week-1", weekData: { "week-1": { spi: 0.95, cpi: 0.88 }, "week-2": { spi: 0.94, cpi: 0.89 }, "week-3": { spi: 0.95, cpi: 0.87 }, "week-4": { spi: 0.96, cpi: 0.86 } } },
  { id: "PRJ-004", name: "Industrial Park", spi: 1.08, cpi: 1.05, budget: "$42.8M", trend: "up", category: "industrial", region: "west", week: "week-3", weekData: { "week-1": { spi: 0.98, cpi: 1.18 }, "week-2": { spi: 1.02, cpi: 1.12 }, "week-3": { spi: 1.08, cpi: 1.05 }, "week-4": { spi: 1.15, cpi: 0.98 } } },
  { id: "PRJ-005", name: "Riverside Homes", spi: 0.78, cpi: 1.25, budget: "$18.3M", trend: "down", category: "residential", region: "north", week: "week-2", weekData: { "week-1": { spi: 0.75, cpi: 1.20 }, "week-2": { spi: 0.78, cpi: 1.25 }, "week-3": { spi: 0.82, cpi: 1.18 }, "week-4": { spi: 0.88, cpi: 1.10 } } },
  { id: "PRJ-006", name: "Tech Campus", spi: 0.92, cpi: 0.95, budget: "$210M", trend: "stable", category: "commercial", region: "south", week: "week-4", weekData: { "week-1": { spi: 0.90, cpi: 0.98 }, "week-2": { spi: 0.91, cpi: 0.96 }, "week-3": { spi: 0.92, cpi: 0.95 }, "week-4": { spi: 0.92, cpi: 0.95 } } },
  { id: "PRJ-007", name: "Highway 12 Ext", spi: 1.22, cpi: 1.18, budget: "$340M", trend: "down", category: "infrastructure", region: "east", week: "week-1", weekData: { "week-1": { spi: 1.22, cpi: 1.18 }, "week-2": { spi: 1.18, cpi: 1.22 }, "week-3": { spi: 1.12, cpi: 1.28 }, "week-4": { spi: 1.05, cpi: 1.35 } } },
  { id: "PRJ-008", name: "Green Valley", spi: 0.88, cpi: 0.82, budget: "$32.1M", trend: "up", category: "residential", region: "west", week: "week-3", weekData: { "week-1": { spi: 0.80, cpi: 0.92 }, "week-2": { spi: 0.84, cpi: 0.88 }, "week-3": { spi: 0.88, cpi: 0.82 }, "week-4": { spi: 0.92, cpi: 0.78 } } },
  { id: "PRJ-009", name: "Data Center", spi: 1.02, cpi: 0.98, budget: "$78.5M", trend: "stable", category: "industrial", region: "north", week: "week-4", weekData: { "week-1": { spi: 1.00, cpi: 1.02 }, "week-2": { spi: 1.01, cpi: 1.00 }, "week-3": { spi: 1.02, cpi: 0.99 }, "week-4": { spi: 1.02, cpi: 0.98 } } },
  { id: "PRJ-010", name: "Civic Center", spi: 0.72, cpi: 0.75, budget: "$125M", trend: "up", category: "commercial", region: "south", week: "week-2", weekData: { "week-1": { spi: 0.65, cpi: 0.88 }, "week-2": { spi: 0.72, cpi: 0.75 }, "week-3": { spi: 0.80, cpi: 0.68 }, "week-4": { spi: 0.88, cpi: 0.62 } } },
]

const categoryColors: Record<Project["category"], string> = {
  commercial: "#00d4ff",
  residential: "#00ff88",
  infrastructure: "#ffaa00",
  industrial: "#ff6b6b",
}

interface EVMMatrixProps {
  filterType?: 'typology' | 'region' | 'week' | null
  filterValue?: string | null
}

export function EVMMatrix({ filterType, filterValue }: EVMMatrixProps) {
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Project["category"] | "all">("all")

  const filteredByCategory = selectedCategory === "all" 
    ? projects 
    : projects.filter(p => p.category === selectedCategory)

  // For week filtering, keep all projects but update their positions based on week data
  // For typology/region filtering, filter out projects that don't match
  const getProjectData = (project: Project) => {
    if (filterType === 'week' && filterValue && filterValue in project.weekData) {
      const weekKey = filterValue as keyof typeof project.weekData
      return {
        ...project,
        spi: project.weekData[weekKey].spi,
        cpi: project.weekData[weekKey].cpi,
      }
    }
    return project
  }

  const filteredProjects = filterType && filterValue
    ? filteredByCategory.filter(p => {
        if (filterType === 'typology') return p.category === filterValue
        if (filterType === 'region') return p.region === filterValue
        if (filterType === 'week') return true // Always show all projects for week filtering
        return true
      }).map(getProjectData)
    : filteredByCategory

  const mapToPosition = (spi: number, cpi: number) => {
    const x = ((spi - 0.5) / 1) * 100
    const y = ((cpi - 0.5) / 1) * 100
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) }
  }

  const getBudgetSize = (budget: string) => {
    // Parse budget string (e.g., "$24.5M") to numeric value
    const value = parseFloat(budget.replace(/[$M]/g, ''))
    // Map to discrete sizes: base 10px, up to 16px based on budget
    const minBudget = 18.3
    const maxBudget = 340
    const normalized = (value - minBudget) / (maxBudget - minBudget)
    const baseSize = 10
    const maxSize = 16
    return baseSize + normalized * (maxSize - baseSize)
  }

  return (
    <div className="relative w-full h-full">
      {/* Quadrant Labels */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top-Left: Ahead & Over Budget */}
        <div className="absolute top-4 left-4 text-xs text-muted-foreground/50">
          <span className="text-warning">Ahead</span> & <span className="text-destructive">Over Budget</span>
        </div>
        {/* Top-Right: Delayed & Over Budget */}
        <div className="absolute top-4 right-4 text-xs text-muted-foreground/50 text-right">
          <span className="text-destructive">Delayed</span> & <span className="text-destructive">Over Budget</span>
        </div>
        {/* Bottom-Left: Ahead & Under Budget */}
        <div className="absolute bottom-4 left-4 text-xs text-muted-foreground/50">
          <span className="text-success">Ahead</span> & <span className="text-success">Under Budget</span>
        </div>
        {/* Bottom-Right: Delayed & Under Budget */}
        <div className="absolute bottom-4 right-4 text-xs text-muted-foreground/50 text-right">
          <span className="text-destructive">Delayed</span> & <span className="text-success">Under Budget</span>
        </div>
      </div>

      {/* Grid Lines */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Background grid */}
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.2"/>
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />
        
        {/* Center crosshair - SPI = 1.0 and CPI = 1.0 */}
        <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(255,255,255,0.1)" strokeWidth="0.3" strokeDasharray="2,2"/>
        <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="0.3" strokeDasharray="2,2"/>

        {/* Quadrant shading */}
        <rect x="0" y="0" width="50" height="50" fill="rgba(255,170,0,0.02)" />
        <rect x="50" y="0" width="50" height="50" fill="rgba(255,100,100,0.03)" />
        <rect x="0" y="50" width="50" height="50" fill="rgba(0,255,136,0.02)" />
        <rect x="50" y="50" width="50" height="50" fill="rgba(0,212,255,0.02)" />
      </svg>

      {/* Axis Labels */}
      <div className="absolute left-1/2 -translate-x-1/2 top-2 text-[10px] font-medium text-muted-foreground tracking-widest uppercase">
        Cost Performance Index (CPI)
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 -left-2 text-[10px] font-medium text-muted-foreground tracking-widest uppercase origin-center -rotate-90">
        Schedule Performance Index (SPI)
      </div>

      {/* Data Points */}
      {filteredProjects.map((project) => {
        const pos = mapToPosition(project.spi, project.cpi)
        const isHovered = hoveredProject?.id === project.id
        const color = categoryColors[project.category]
        const baseSize = getBudgetSize(project.budget)
        
        return (
          <Link
            key={project.id}
            href={`/project/${project.id}`}
            className="absolute cursor-pointer transition-all duration-300"
            style={{
              left: `${pos.x}%`,
              top: `${100 - pos.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            onMouseEnter={() => setHoveredProject(project)}
            onMouseLeave={() => setHoveredProject(null)}
          >
            {/* Glow effect */}
            <div
              className="absolute inset-0 rounded-full transition-all duration-300"
              style={{
                width: isHovered ? baseSize + 20 : baseSize + 12,
                height: isHovered ? baseSize + 20 : baseSize + 12,
                marginLeft: isHovered ? -(baseSize + 20) / 2 : -(baseSize + 12) / 2,
                marginTop: isHovered ? -(baseSize + 20) / 2 : -(baseSize + 12) / 2,
                background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
                filter: isHovered ? `blur(8px)` : "blur(4px)",
              }}
            />
            
            {/* Node */}
            <div
              className="relative rounded-full border transition-all duration-300"
              style={{
                width: isHovered ? baseSize + 8 : baseSize,
                height: isHovered ? baseSize + 8 : baseSize,
                backgroundColor: color,
                borderColor: color,
                boxShadow: `0 0 ${isHovered ? 20 : 10}px ${color}80`,
              }}
            />

            {/* Trend indicator */}
            {project.trend !== "stable" && (
              <div 
                className="absolute -top-3 left-1/2 -translate-x-1/2 text-[8px]"
                style={{ color }}
              >
                {project.trend === "up" ? "↑" : "↓"}
              </div>
            )}

            {/* Tooltip */}
            {isHovered && (
              <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 glass-card rounded-lg p-3 pointer-events-none">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                  <span className="font-medium text-sm text-foreground">{project.name}</span>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>SPI</span>
                    <span className="text-foreground font-mono">{project.spi.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CPI</span>
                    <span className="text-foreground font-mono">{project.cpi.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Budget</span>
                    <span className="text-foreground font-mono">{project.budget}</span>
                  </div>
                </div>
              </div>
            )}
          </Link>
        )
      })}

      {/* Category Legend */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
        {(["all", "commercial", "residential", "infrastructure", "industrial"] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`flex items-center gap-1.5 text-xs transition-all ${
              selectedCategory === cat ? "text-foreground" : "text-muted-foreground hover:text-foreground/80"
            }`}
          >
            {cat !== "all" && (
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: categoryColors[cat] }}
              />
            )}
            <span className="capitalize">{cat}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
