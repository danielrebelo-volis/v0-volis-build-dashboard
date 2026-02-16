"use client"

import { useState } from "react"
import Link from "next/link"

interface Project {
  id: string
  name: string
  delay: number // % delay (-50 to +50, negative = ahead, positive = behind)
  industrialCost: number // % of contract value (60-110)
  budget: string
  trend: "up" | "down" | "stable"
  category: "commercial" | "residential" | "infrastructure" | "industrial"
  region: "north" | "south" | "east" | "west"
  week: "week-1" | "week-2" | "week-3" | "week-4"
  weekData: {
    "week-1": { delay: number; industrialCost: number }
    "week-2": { delay: number; industrialCost: number }
    "week-3": { delay: number; industrialCost: number }
    "week-4": { delay: number; industrialCost: number }
  }
}

const projects: Project[] = [
  { id: "PRJ-001", name: "Metro Tower", delay: 15, industrialCost: 78, budget: "$24.5M", trend: "up", category: "commercial", region: "north", week: "week-1", weekData: { "week-1": { delay: 15, industrialCost: 78 }, "week-2": { delay: 12, industrialCost: 75 }, "week-3": { delay: 8, industrialCost: 72 }, "week-4": { delay: 5, industrialCost: 70 } } },
  { id: "PRJ-002", name: "Harbor Bridge", delay: -8, industrialCost: 68, budget: "$89.2M", trend: "down", category: "infrastructure", region: "south", week: "week-2", weekData: { "week-1": { delay: -12, industrialCost: 65 }, "week-2": { delay: -8, industrialCost: 68 }, "week-3": { delay: -5, industrialCost: 72 }, "week-4": { delay: 2, industrialCost: 76 } } },
  { id: "PRJ-003", name: "Skyline Plaza", delay: 22, industrialCost: 95, budget: "$156M", trend: "stable", category: "commercial", region: "east", week: "week-1", weekData: { "week-1": { delay: 22, industrialCost: 95 }, "week-2": { delay: 23, industrialCost: 96 }, "week-3": { delay: 22, industrialCost: 94 }, "week-4": { delay: 21, industrialCost: 93 } } },
  { id: "PRJ-004", name: "Industrial Park", delay: -15, industrialCost: 70, budget: "$42.8M", trend: "up", category: "industrial", region: "west", week: "week-3", weekData: { "week-1": { delay: 5, industrialCost: 82 }, "week-2": { delay: -5, industrialCost: 76 }, "week-3": { delay: -15, industrialCost: 70 }, "week-4": { delay: -20, industrialCost: 65 } } },
  { id: "PRJ-005", name: "Riverside Homes", delay: 28, industrialCost: 105, budget: "$18.3M", trend: "down", category: "residential", region: "north", week: "week-2", weekData: { "week-1": { delay: 30, industrialCost: 108 }, "week-2": { delay: 28, industrialCost: 105 }, "week-3": { delay: 25, industrialCost: 102 }, "week-4": { delay: 20, industrialCost: 98 } } },
  { id: "PRJ-006", name: "Tech Campus", delay: -5, industrialCost: 73, budget: "$210M", trend: "stable", category: "commercial", region: "south", week: "week-4", weekData: { "week-1": { delay: 5, industrialCost: 78 }, "week-2": { delay: 0, industrialCost: 75 }, "week-3": { delay: -5, industrialCost: 73 }, "week-4": { delay: -5, industrialCost: 73 } } },
  { id: "PRJ-007", name: "Highway 12 Ext", delay: -18, industrialCost: 62, budget: "$340M", trend: "down", category: "infrastructure", region: "east", week: "week-1", weekData: { "week-1": { delay: -18, industrialCost: 62 }, "week-2": { delay: -12, industrialCost: 66 }, "week-3": { delay: -8, industrialCost: 70 }, "week-4": { delay: -2, industrialCost: 74 } } },
  { id: "PRJ-008", name: "Green Valley", delay: 25, industrialCost: 92, budget: "$32.1M", trend: "up", category: "residential", region: "west", week: "week-3", weekData: { "week-1": { delay: 32, industrialCost: 98 }, "week-2": { delay: 28, industrialCost: 95 }, "week-3": { delay: 25, industrialCost: 92 }, "week-4": { delay: 20, industrialCost: 88 } } },
  { id: "PRJ-009", name: "Data Center", delay: -10, industrialCost: 66, budget: "$78.5M", trend: "stable", category: "industrial", region: "north", week: "week-4", weekData: { "week-1": { delay: 2, industrialCost: 74 }, "week-2": { delay: -5, industrialCost: 70 }, "week-3": { delay: -10, industrialCost: 68 }, "week-4": { delay: -10, industrialCost: 66 } } },
  { id: "PRJ-010", name: "Civic Center", delay: 35, industrialCost: 88, budget: "$125M", trend: "up", category: "commercial", region: "south", week: "week-2", weekData: { "week-1": { delay: 40, industrialCost: 102 }, "week-2": { delay: 35, industrialCost: 88 }, "week-3": { delay: 28, industrialCost: 82 }, "week-4": { delay: 20, industrialCost: 76 } } },
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
        delay: project.weekData[weekKey].delay,
        industrialCost: project.weekData[weekKey].industrialCost,
      }
    }
    return project
  }

  const filteredProjects = (filterType && filterValue
    ? filteredByCategory.filter(p => {
      if (filterType === 'typology') return p.category === filterValue
      if (filterType === 'region') return p.region === filterValue
      if (filterType === 'week') return true // Always show all projects for week filtering
      return true
    }).map(getProjectData)
    : filteredByCategory
  ).filter(p => p.industrialCost >= 60 && p.industrialCost <= 110) // Only show projects in 60-110% range

  const mapToPosition = (delay: number, industrialCost: number) => {
    // Map delay (-50 to +50) to x position (0-100)
    // Negative delays (ahead) map to 0-50, positive delays (behind) map to 50-100
    const x = ((delay + 50) / 100) * 100
    // Map industrial cost (60-110%) to y position (0-100)
    const y = ((industrialCost - 60) / 50) * 100
    return { x: Math.max(2, Math.min(98, x)), y: Math.max(2, Math.min(98, y)) }
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
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Main chart container with padding for axes */}
      <div className="relative w-[calc(100%-80px)] h-[calc(100%-80px)]">
        {/* Background and grid */}
        <div className="absolute inset-0 rounded-lg border border-border/20 bg-gradient-to-br from-background/50 to-background/30 backdrop-blur-sm">
          {/* Grid Lines */}
          <svg className="absolute inset-0 w-full h-full rounded-lg" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Background grid */}
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.2" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />

            {/* Reference line at 85% industrial cost (85-60)/(110-60) = 50% of range, inverted = 50 */}
            <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.15)" strokeWidth="0.6" strokeDasharray="5,5" />

            {/* Center line at 0% delay (x = 50) */}
            <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(255,255,255,0.15)" strokeWidth="0.4" strokeDasharray="3,3" />

            {/* Quadrant shading - based on 85% reference line and center line */}
            <rect x="0" y="0" width="50" height="50" fill="rgba(255,100,100,0.03)" />
            <rect x="50" y="0" width="50" height="50" fill="rgba(255,100,100,0.04)" />
            <rect x="0" y="50" width="50" height="50" fill="rgba(0,255,136,0.03)" />
            <rect x="50" y="50" width="50" height="50" fill="rgba(255,170,0,0.02)" />
          </svg>
        </div>

        {/* Quadrant Labels */}
        <div className="absolute inset-0 pointer-events-none px-6 py-6">
          {/* Top-Left: Ahead & High Cost (>85%) */}
          <div className="absolute top-6 left-6 text-[11px] text-muted-foreground/40 font-medium">
            <div className="text-destructive/60">Cost {'>'} 85%</div>
            <div className="text-success/60">Ahead</div>
          </div>
          {/* Top-Right: Delayed & High Cost (>85%) */}
          <div className="absolute top-6 right-6 text-[11px] text-muted-foreground/40 font-medium text-right">
            <div className="text-destructive/60">Cost {'>'} 85%</div>
            <div className="text-destructive/60">Delayed</div>
          </div>
          {/* Bottom-Left: Ahead & Good Cost (<85%) */}
          <div className="absolute bottom-6 left-6 text-[11px] text-muted-foreground/40 font-medium">
            <div className="text-success/60">Cost {'<'} 85%</div>
            <div className="text-success/60">Ahead</div>
          </div>
          {/* Bottom-Right: Delayed & Good Cost (<85%) */}
          <div className="absolute bottom-6 right-6 text-[11px] text-muted-foreground/40 font-medium text-right">
            <div className="text-success/60">Cost {'<'} 85%</div>
            <div className="text-warning/60">Delayed</div>
          </div>
        </div>

        {/* Reference line labels */}
        <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-xs font-semibold text-warning flex items-center gap-1.5">
          <div className="text-foreground/70">85%</div>
        </div>

        {/* Center line label (on-time) */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] font-semibold text-success/70 tracking-wider">
          ON TIME
        </div>

        {/* Data Points */}
        {filteredProjects.map((project) => {
          const pos = mapToPosition(project.delay, project.industrialCost)
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
                      <span>% delay</span>
                      <span className="text-foreground font-mono">{project.delay.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>% Industrial Cost</span>
                      <span className="text-foreground font-mono">{project.industrialCost.toFixed(1)}%</span>
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
      </div>

      {/* Y-Axis (left) - Industrial Cost % */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col justify-between h-[calc(100%-80px)]">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground font-mono">110%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground font-mono">97.5%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-warning font-mono font-semibold"></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground font-mono">72.5%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground font-mono">60%</span>
        </div>
      </div>

      {/* Y-Axis Label */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 origin-center -rotate-90">
        <span className="text-xs font-semibold text-muted-foreground tracking-wider">INDUSTRIAL COST</span>
      </div>

      {/* X-Axis (bottom) - delay % */}
      <div className="absolute bottom-8 left-10 right-10 flex justify-between">
        <span className="text-[10px] text-muted-foreground font-mono">-50%</span>
        <span className="text-[10px] text-muted-foreground font-mono">-25%</span>
        <span className="text-[10px] text-success font-mono font-semibold">0%</span>
        <span className="text-[10px] text-muted-foreground font-mono">+25%</span>
        <span className="text-[10px] text-muted-foreground font-mono">+50%</span>
      </div>

      {/* X-Axis Label and Category Legend */}
      <div className="absolute bottom-0 left-10 right-10 flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground tracking-wider">DELAY</span>

        {/* Category Legend - Compact */}
        <div className="glass-card rounded-md px-2.5 py-1.5 border border-border/30 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-semibold text-muted-foreground tracking-wide uppercase">Typology</span>
            <div className="flex items-center gap-2">
              {(["all", "commercial", "residential", "infrastructure", "industrial"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center gap-1 text-[10px] transition-all ${selectedCategory === cat
                    ? "text-foreground font-medium"
                    : "text-muted-foreground/60 hover:text-foreground/80"
                    }`}
                >
                  {cat !== "all" ? (
                    <>
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor: categoryColors[cat],
                          boxShadow: selectedCategory === cat ? `0 0 6px ${categoryColors[cat]}80` : 'none'
                        }}
                      />
                      <span className="capitalize">{cat}</span>
                    </>
                  ) : (
                    <>
                      <div className="w-1.5 h-1.5 rounded-full border border-muted-foreground/50" />
                      <span className="capitalize">{cat}</span>
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
