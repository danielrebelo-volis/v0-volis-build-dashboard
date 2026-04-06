"use client"

import { useState } from "react"
import Link from "next/link"
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"
import { useChartColors } from '@/hooks/use-chart-colors'
import {
  Route,
  Train,
  Waves,
  Anchor,
  Plane,
  Building2,
  HardHat,
  Pickaxe,
  Flame,
  Zap,
  Wrench,
  type LucideIcon,
} from "lucide-react"

interface Project {
  id: string
  name: string
  delay: number
  industrialCost: number
  analyticalIndustrialCost: number
  budget: string
  budgetValue: number
  trend: "up" | "down" | "stable"
  category: "Road Infrastructure" | "Railway Infrastructure" | "Hydraulic Infrastructure" | "Port Infrastructure" | "Airport Infrastructure" | "Urban Infrastructure" | "Civil Construction" | "Mining" | "Oil&Gas" | "Power (Energy)" | "Other Works"
  region: "Europa" | "Africa" | "Asia" | "LatAm"
  status: "ongoing" | "finished"
  week: "week-1" | "week-2" | "week-3" | "week-4"
  coordinates: [number, number] // [lng, lat]
  weekData: {
    "week-1": { delay: number; industrialCost: number }
    "week-2": { delay: number; industrialCost: number }
    "week-3": { delay: number; industrialCost: number }
    "week-4": { delay: number; industrialCost: number }
  }
}

const projects: Project[] = [
  { id: "PRJ-001", name: "Metro Tower",             delay: -35, industrialCost: 103, analyticalIndustrialCost: 95, budget: "€24.5M",  budgetValue: 24.5,  trend: "up",     category: "Civil Construction",       region: "Europa", status: "ongoing",  week: "week-1", coordinates: [2.3,   48.9],  weekData: { "week-1": { delay: -35, industrialCost: 103 }, "week-2": { delay: -30, industrialCost: 101 }, "week-3": { delay: -25, industrialCost:  99 }, "week-4": { delay: -20, industrialCost:  97 } } },
  { id: "PRJ-011", name: "Urban Renewal Center",     delay:  -5, industrialCost: 100, analyticalIndustrialCost: 92, budget: "€67.3M",  budgetValue: 67.3,  trend: "up",     category: "Road Infrastructure",      region: "Europa", status: "ongoing",  week: "week-2", coordinates: [-3.7,  40.4],  weekData: { "week-1": { delay: -15, industrialCost: 101 }, "week-2": { delay: -20, industrialCost: 100 }, "week-3": { delay: -25, industrialCost:  99 }, "week-4": { delay: -30, industrialCost:  98 } } },
  { id: "PRJ-015", name: "Airport Runway",           delay: -22, industrialCost: 105, analyticalIndustrialCost: 97, budget: "€234.5M", budgetValue: 234.5, trend: "up",     category: "Airport Infrastructure",   region: "Africa", status: "ongoing",  week: "week-1", coordinates: [3.4,   6.5],   weekData: { "week-1": { delay: -25, industrialCost: 105 }, "week-2": { delay: -28, industrialCost: 104 }, "week-3": { delay: -30, industrialCost: 103 }, "week-4": { delay: -35, industrialCost: 102 } } },
  { id: "PRJ-020", name: "Solar Farm",               delay: -40, industrialCost:  98, analyticalIndustrialCost: 90, budget: "€145.2M", budgetValue: 145.2, trend: "up",     category: "Power (Energy)",           region: "Africa", status: "ongoing",  week: "week-4", coordinates: [28.2, -26.2],  weekData: { "week-1": { delay: -35, industrialCost:  99 }, "week-2": { delay: -38, industrialCost:  98 }, "week-3": { delay: -40, industrialCost:  97 }, "week-4": { delay: -42, industrialCost:  96 } } },
  { id: "PRJ-003", name: "Skyline Plaza",            delay:  32, industrialCost: 102, analyticalIndustrialCost: 94, budget: "€156M",   budgetValue: 156,   trend: "stable", category: "Civil Construction",       region: "Asia",   status: "ongoing",  week: "week-1", coordinates: [121.5, 31.2],  weekData: { "week-1": { delay: 28,  industrialCost: 102 }, "week-2": { delay: 31,  industrialCost: 103 }, "week-3": { delay: 35,  industrialCost: 104 }, "week-4": { delay: 38,  industrialCost: 105 } } },
  { id: "PRJ-012", name: "Rail Network Expansion",   delay:  18, industrialCost:  99, analyticalIndustrialCost: 91, budget: "€280M",   budgetValue: 280,   trend: "down",   category: "Railway Infrastructure",   region: "Europa", status: "ongoing",  week: "week-1", coordinates: [13.4,  52.5],  weekData: { "week-1": { delay: 15,  industrialCost:  99 }, "week-2": { delay: 18,  industrialCost: 100 }, "week-3": { delay: 22,  industrialCost: 101 }, "week-4": { delay: 25,  industrialCost: 102 } } },
  { id: "PRJ-013", name: "Dam Construction",         delay:  25, industrialCost: 104, analyticalIndustrialCost: 96, budget: "€520M",   budgetValue: 520,   trend: "stable", category: "Hydraulic Infrastructure", region: "LatAm",  status: "ongoing",  week: "week-2", coordinates: [-46.6,-23.5],  weekData: { "week-1": { delay: 20,  industrialCost: 103 }, "week-2": { delay: 25,  industrialCost: 104 }, "week-3": { delay: 28,  industrialCost: 104 }, "week-4": { delay: 32,  industrialCost: 105 } } },
  { id: "PRJ-019", name: "Oil Platform Construction",delay:  40, industrialCost:  97, analyticalIndustrialCost: 89, budget: "€687.2M", budgetValue: 687.2, trend: "stable", category: "Oil&Gas",                  region: "Africa", status: "ongoing",  week: "week-1", coordinates: [7.5,   4.5],   weekData: { "week-1": { delay: 32,  industrialCost:  97 }, "week-2": { delay: 35,  industrialCost:  98 }, "week-3": { delay: 38,  industrialCost:  99 }, "week-4": { delay: 40,  industrialCost: 100 } } },
  { id: "PRJ-004", name: "Industrial Park",          delay: -30, industrialCost:  86, analyticalIndustrialCost: 80, budget: "€42.8M",  budgetValue: 42.8,  trend: "up",     category: "Mining",                  region: "LatAm",  status: "ongoing",  week: "week-3", coordinates: [-68.1,-16.5],  weekData: { "week-1": { delay: -25, industrialCost:  87 }, "week-2": { delay: -28, industrialCost:  86 }, "week-3": { delay: -30, industrialCost:  86 }, "week-4": { delay: -35, industrialCost:  85 } } },
  { id: "PRJ-006", name: "Tech Campus",              delay: -38, industrialCost:  95, analyticalIndustrialCost: 87, budget: "€210M",   budgetValue: 210,   trend: "stable", category: "Urban Infrastructure",     region: "Asia",   status: "ongoing",  week: "week-4", coordinates: [103.8, 1.3],   weekData: { "week-1": { delay: -35, industrialCost:  96 }, "week-2": { delay: -38, industrialCost:  95 }, "week-3": { delay: -40, industrialCost:  94 }, "week-4": { delay: -42, industrialCost:  93 } } },
  { id: "PRJ-009", name: "Data Center",              delay: -15, industrialCost:  91, analyticalIndustrialCost: 84, budget: "€78.5M",  budgetValue: 78.5,  trend: "down",   category: "Port Infrastructure",      region: "Europa", status: "finished", week: "week-4", coordinates: [-9.1,  38.7],  weekData: { "week-1": { delay: -12, industrialCost:  93 }, "week-2": { delay: -14, industrialCost:  92 }, "week-3": { delay: -16, industrialCost:  91 }, "week-4": { delay: -18, industrialCost:  90 } } },
  { id: "PRJ-007", name: "Highway 12 Ext",           delay: -25, industrialCost:  84, analyticalIndustrialCost: 78, budget: "€340M",   budgetValue: 340,   trend: "down",   category: "Road Infrastructure",      region: "Europa", status: "ongoing",  week: "week-1", coordinates: [-8.6,  41.1],  weekData: { "week-1": { delay: -20, industrialCost:  85 }, "week-2": { delay: -23, industrialCost:  84 }, "week-3": { delay: -26, industrialCost:  84 }, "week-4": { delay: -28, industrialCost:  83 } } },
  { id: "PRJ-002", name: "Harbor Bridge",            delay:  20, industrialCost:  89, analyticalIndustrialCost: 82, budget: "€89.2M",  budgetValue: 89.2,  trend: "down",   category: "Port Infrastructure",      region: "Europa", status: "ongoing",  week: "week-2", coordinates: [4.9,   52.4],  weekData: { "week-1": { delay: 18,  industrialCost:  88 }, "week-2": { delay: 20,  industrialCost:  89 }, "week-3": { delay: 22,  industrialCost:  90 }, "week-4": { delay: 25,  industrialCost:  91 } } },
  { id: "PRJ-005", name: "Riverside Homes",          delay:  28, industrialCost:  94, analyticalIndustrialCost: 86, budget: "€18.3M",  budgetValue: 18.3,  trend: "down",   category: "Urban Infrastructure",     region: "LatAm",  status: "finished", week: "week-2", coordinates: [-58.4,-34.6],  weekData: { "week-1": { delay: 25,  industrialCost:  92 }, "week-2": { delay: 28,  industrialCost:  94 }, "week-3": { delay: 30,  industrialCost:  95 }, "week-4": { delay: 32,  industrialCost:  96 } } },
  { id: "PRJ-008", name: "Green Valley",             delay:  38, industrialCost:  88, analyticalIndustrialCost: 81, budget: "€32.1M",  budgetValue: 32.1,  trend: "up",     category: "Hydraulic Infrastructure", region: "Asia",   status: "ongoing",  week: "week-3", coordinates: [77.2,  28.6],  weekData: { "week-1": { delay: 35,  industrialCost:  89 }, "week-2": { delay: 37,  industrialCost:  88 }, "week-3": { delay: 38,  industrialCost:  88 }, "week-4": { delay: 40,  industrialCost:  87 } } },
  { id: "PRJ-016", name: "Terminal Building",        delay:  12, industrialCost:  93, analyticalIndustrialCost: 85, budget: "€189.2M", budgetValue: 189.2, trend: "stable", category: "Airport Infrastructure",   region: "Asia",   status: "ongoing",  week: "week-2", coordinates: [139.7, 35.7],  weekData: { "week-1": { delay: 10,  industrialCost:  91 }, "week-2": { delay: 12,  industrialCost:  93 }, "week-3": { delay: 14,  industrialCost:  94 }, "week-4": { delay: 16,  industrialCost:  95 } } },
  { id: "PRJ-021", name: "Bridge Rehabilitation",    delay:   8, industrialCost:  90, analyticalIndustrialCost: 83, budget: "€67.8M",  budgetValue: 67.8,  trend: "stable", category: "Other Works",              region: "LatAm",  status: "finished", week: "week-1", coordinates: [-70.7,-33.5],  weekData: { "week-1": { delay: 5,   industrialCost:  88 }, "week-2": { delay: 8,   industrialCost:  90 }, "week-3": { delay: 10,  industrialCost:  91 }, "week-4": { delay: 12,  industrialCost:  92 } } },
]

const categoryIcons: Record<Project["category"], LucideIcon> = {
  "Road Infrastructure":      Route,
  "Railway Infrastructure":   Train,
  "Hydraulic Infrastructure": Waves,
  "Port Infrastructure":      Anchor,
  "Airport Infrastructure":   Plane,
  "Urban Infrastructure":     Building2,
  "Civil Construction":       HardHat,
  "Mining":                   Pickaxe,
  "Oil&Gas":                  Flame,
  "Power (Energy)":           Zap,
  "Other Works":              Wrench,
}

const categoryColors: Record<Project["category"], string> = {
  "Road Infrastructure": "#166534",
  "Railway Infrastructure": "#fbbf24",
  "Hydraulic Infrastructure": "#d4d4d8",
  "Port Infrastructure": "#dc2626",
  "Airport Infrastructure": "#9333ea",
  "Urban Infrastructure": "#06b6d4",
  "Civil Construction": "#00ff88",
  "Mining": "#f59e0b",
  "Oil&Gas": "#8b5cf6",
  "Power (Energy)": "#ec4899",
  "Other Works": "#64748b"
}

const Y_MIN = 80
const Y_MAX = 120
const Y_REF = 100

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

interface EVMMatrixProps {
  view?: "matrix" | "map"
  selectedStatuses?: Set<string>
  selectedWeek?: number | null
  selectedRegion?: string | null
  selectedCategory?: Project["category"] | "all"
}

export function EVMMatrix({
  view = "matrix",
  selectedStatuses,
  selectedWeek = null,
  selectedRegion = null,
  selectedCategory = "all",
}: EVMMatrixProps) {
  const effectiveStatuses = selectedStatuses ?? new Set(["ongoing"])
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null)
  const [hoverSide, setHoverSide] = useState<"left" | "right">("right")
  const colors = useChartColors()

  const getProjectData = (project: Project) => {
    if (selectedWeek) {
      const weekKey = `week-${selectedWeek}` as keyof typeof project.weekData
      return { ...project, delay: project.weekData[weekKey].delay, industrialCost: project.weekData[weekKey].industrialCost }
    }
    return project
  }

  const filteredProjects = projects
    .filter(p => effectiveStatuses.has(p.status))
    .filter(p => selectedRegion ? p.region === selectedRegion : true)
    .filter(p => selectedCategory === "all" ? true : p.category === selectedCategory)
    .map(getProjectData)

  const matrixProjects = filteredProjects.filter(p => p.industrialCost >= Y_MIN && p.industrialCost <= Y_MAX)

  const mapToPosition = (delay: number, industrialCost: number) => {
    const x = ((delay + 50) / 100) * 100
    const y = ((industrialCost - Y_MIN) / (Y_MAX - Y_MIN)) * 100
    return { x: Math.max(2, Math.min(98, x)), y: Math.max(2, Math.min(98, y)) }
  }

  const getBubbleSize = (budgetValue: number) => {
    const minB = 18.3
    const maxB = 687.2
    const normalized = (budgetValue - minB) / (maxB - minB)
    return (20 + Math.pow(Math.max(0, Math.min(1, normalized)), 0.5) * 22) * 0.9
  }

  const refLineY = ((Y_REF - Y_MIN) / (Y_MAX - Y_MIN)) * 100

  const HoverTooltip = ({ project, side }: { project: Project; side: "left" | "right" }) => {
    const color = categoryColors[project.category]
    const Icon = categoryIcons[project.category]
    return (
      <div
        className="absolute z-50 w-52 glass-card rounded-xl p-3 pointer-events-none shadow-xl border border-white/10"
        style={{
          top: "50%",
          transform: "translateY(-50%)",
          ...(side === "right"
            ? { left: `calc(${getBubbleSize(project.budgetValue) / 2}px + 10px)` }
            : { right: `calc(${getBubbleSize(project.budgetValue) / 2}px + 10px)` }),
        }}
      >
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
          <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center" style={{ backgroundColor: `${color}25`, border: `1px solid ${color}60` }}>
            <Icon size={12} style={{ color }} />
          </div>
          <div>
            <div className="font-semibold text-sm text-foreground leading-tight">{project.name}</div>
            <div className="text-[10px] text-muted-foreground">{project.id} · {project.category}</div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[11px] text-muted-foreground">Adj. Industrial Cost</span>
            <span className={`text-[12px] font-bold font-mono ${project.industrialCost > 100 ? "text-red-400" : "text-emerald-400"}`}>
              {project.industrialCost.toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[11px] text-muted-foreground">Analytical IC</span>
            <span className="text-[12px] font-bold font-mono text-blue-400">
              {project.analyticalIndustrialCost.toFixed(1)}%
            </span>
          </div>
          <div className="h-px bg-white/8 my-1" />
          <div className="flex justify-between items-center">
            <span className="text-[11px] text-muted-foreground">Schedule Delay</span>
            <span className={`text-[12px] font-bold font-mono ${project.delay < 0 ? "text-emerald-400" : "text-red-400"}`}>
              {project.delay > 0 ? "+" : ""}{project.delay.toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[11px] text-muted-foreground">Budget</span>
            <span className="text-[12px] font-semibold font-mono text-foreground">{project.budget}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[11px] text-muted-foreground">Region</span>
            <span className="text-[11px] text-muted-foreground/80">{project.region}</span>
          </div>
        </div>
      </div>
    )
  }

  // ── WORLD MAP VIEW ──────────────────────────────────────────────
  if (view === "map") {
    return (
      <div className="relative w-full h-full flex flex-col" data-matrix="true" style={{ background: "#e8eef4", borderRadius: "inherit" }}>
        <ComposableMap
          projectionConfig={{ scale: 147, center: [10, 10] }}
          style={{ width: "100%", height: "100%" }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#d1d5db"
                  stroke="#9ca3af"
                  strokeWidth={0.3}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", fill: "#b0b7c3" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {filteredProjects.map((project) => {
            const isHovered = hoveredProject?.id === project.id
            const color = categoryColors[project.category]
            const r = Math.max(4, getBubbleSize(project.budgetValue) * 0.35)

            return (
              <Marker key={project.id} coordinates={project.coordinates}>
                {/* Glow */}
                <circle
                  r={r + 6}
                  fill={`${color}25`}
                  style={{ pointerEvents: "none" }}
                />
                {/* Bubble */}
                <circle
                  r={isHovered ? r + 2 : r}
                  fill={color}
                  fillOpacity={0.85}
                  stroke={isHovered ? "white" : color}
                  strokeWidth={isHovered ? 1.5 : 0.5}
                  style={{ cursor: "pointer", filter: `drop-shadow(0 0 ${isHovered ? 8 : 4}px ${color}80)`, transition: "all 0.2s" }}
                  onMouseEnter={(e) => {
                    const rect = (e.target as SVGElement).closest('[data-matrix]')?.getBoundingClientRect()
                    const x = e.clientX - (rect?.left ?? 0)
                    const width = rect?.width ?? 800
                    setHoverSide(x < width / 2 ? "right" : "left")
                    setHoveredProject(project)
                  }}
                  onMouseLeave={() => setHoveredProject(null)}
                />
                {/* Label */}
                {isHovered && (
                  <text
                    y={-(r + 8)}
                    textAnchor="middle"
                    style={{ fontSize: 9, fill: "white", fontWeight: 600, pointerEvents: "none" }}
                  >
                    {project.name}
                  </text>
                )}
              </Marker>
            )
          })}
        </ComposableMap>

        {/* Hover tooltip — rendered as HTML overlay for the map */}
        {hoveredProject && (
          <div className="absolute bottom-4 right-4 z-50 pointer-events-none">
            <div className="w-52 glass-card rounded-xl p-3 shadow-xl border border-white/10">
              {(() => {
                const MapIcon = categoryIcons[hoveredProject.category]
                const mapColor = categoryColors[hoveredProject.category]
                return (
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
                    <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center" style={{ backgroundColor: `${mapColor}25`, border: `1px solid ${mapColor}60` }}>
                      <MapIcon size={12} style={{ color: mapColor }} />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-foreground leading-tight">{hoveredProject.name}</div>
                      <div className="text-[10px] text-muted-foreground">{hoveredProject.id} · {hoveredProject.region}</div>
                    </div>
                  </div>
                )
              })()}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-muted-foreground">Adj. Industrial Cost</span>
                  <span className={`text-[12px] font-bold font-mono ${hoveredProject.industrialCost > 100 ? "text-red-400" : "text-emerald-400"}`}>{hoveredProject.industrialCost.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-muted-foreground">Analytical IC</span>
                  <span className="text-[12px] font-bold font-mono text-blue-400">{hoveredProject.analyticalIndustrialCost.toFixed(1)}%</span>
                </div>
                <div className="h-px bg-white/8" />
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-muted-foreground">Budget</span>
                  <span className="text-[12px] font-semibold font-mono text-foreground">{hoveredProject.budget}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── MATRIX VIEW ─────────────────────────────────────────────────
  return (
    <div className="relative w-full h-full flex items-center justify-center" data-matrix="true">
      <div className="relative w-[calc(100%-80px)] h-[calc(100%-60px)]" suppressHydrationWarning>

        {/* Background */}
        <div className="absolute inset-0 rounded-lg border border-white/10 bg-gradient-to-br from-background/50 to-background/30 backdrop-blur-sm">
          <svg className="absolute inset-0 w-full h-full rounded-lg" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.2" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
            <line x1="0" y1={100 - refLineY} x2="100" y2={100 - refLineY} stroke="#f97316" strokeWidth="0.4" strokeDasharray="2,2" opacity="0.9" />
            <line x1="50" y1="0" x2="50" y2="100" stroke="#888888" strokeWidth="0.4" strokeDasharray="2,5" opacity="0.4" />
            <rect x="0" y="0" width="50" height={100 - refLineY} fill="rgba(34,197,94,0.03)" />
            <rect x="50" y="0" width="50" height={100 - refLineY} fill="rgba(255,152,0,0.03)" />
            <rect x="0" y={100 - refLineY} width="50" height={refLineY} fill="rgba(34,197,94,0.02)" />
            <rect x="50" y={100 - refLineY} width="50" height={refLineY} fill="rgba(255,152,0,0.02)" />
          </svg>
        </div>

        {/* Quadrant Labels */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-4 bg-background/60 backdrop-blur px-2 py-1 rounded border border-white/10">
            <div className="text-[10px] font-medium text-foreground">Adj. Industrial Cost {'>'} 100%</div>
            <div className="text-[10px] font-medium text-foreground">Ahead</div>
          </div>
          <div className="absolute top-10 right-4 bg-background/60 backdrop-blur px-2 py-1 rounded border border-white/10 text-right">
            <div className="text-[10px] font-medium text-foreground">Adj. Industrial Cost {'>'} 100%</div>
            <div className="text-[10px] font-medium text-foreground">Delayed</div>
          </div>
          <div className="absolute bottom-4 left-4 bg-background/60 backdrop-blur px-2 py-1 rounded border border-white/10">
            <div className="text-[10px] font-medium text-foreground">Adj. Industrial Cost {'<'} 100%</div>
            <div className="text-[10px] font-medium text-foreground">Ahead</div>
          </div>
          <div className="absolute bottom-4 right-4 bg-background/60 backdrop-blur px-2 py-1 rounded border border-white/10 text-right">
            <div className="text-[10px] font-medium text-foreground">Adj. Industrial Cost {'<'} 100%</div>
            <div className="text-[10px] font-medium text-foreground">Delayed</div>
          </div>
        </div>

        {/* ON TIME label */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] font-semibold text-success/70 tracking-wider">
          ON TIME
        </div>

        {/* Data Points */}
        {matrixProjects.map((project) => {
          const pos = mapToPosition(project.delay, project.industrialCost)
          const isHovered = hoveredProject?.id === project.id
          const color = categoryColors[project.category]
          const size = getBubbleSize(project.budgetValue)

          return (
            <div
              key={project.id}
              className="absolute cursor-pointer transition-all duration-300"
              style={{
                left: `${pos.x}%`,
                top: `${100 - pos.y}%`,
                transform: "translate(-50%, -50%)",
                zIndex: isHovered ? 50 : 10,
              }}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.closest('[data-matrix]')?.getBoundingClientRect()
                const x = e.clientX - (rect?.left ?? 0)
                const width = rect?.width ?? 800
                setHoverSide(x < width / 2 ? "right" : "left")
                setHoveredProject(project)
              }}
              onMouseLeave={() => setHoveredProject(null)}
            >
              {/* Glow */}
              <div
                className="absolute rounded-full transition-all duration-300 pointer-events-none"
                style={{
                  width: isHovered ? size + 20 : size + 10,
                  height: isHovered ? size + 20 : size + 10,
                  left: isHovered ? -(size + 20) / 2 : -(size + 10) / 2,
                  top: isHovered ? -(size + 20) / 2 : -(size + 10) / 2,
                  background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
                  filter: isHovered ? "blur(8px)" : "blur(4px)",
                }}
              />
              {/* Project name label */}
              <div
                className="absolute pointer-events-none"
                style={{
                  bottom: `calc(100% + 4px)`,
                  left: "50%",
                  transform: "translateX(-50%)",
                  whiteSpace: "nowrap",
                }}
              >
                <span
                  className="text-[8px] font-semibold leading-none px-1 py-0.5 rounded"
                  style={{
                    backgroundColor: "rgba(0,0,0,0.55)",
                    color: "#ffffff",
                    backdropFilter: "blur(2px)",
                  }}
                >
                  {project.name}
                </span>
              </div>

              {/* Bubble */}
              <Link href={`/project/${project.id}`}>
                <div
                  className="relative rounded-full border-2 transition-all duration-300"
                  style={{
                    width: size,
                    height: size,
                    backgroundColor: color,
                    borderColor: isHovered ? "white" : `${color}cc`,
                    boxShadow: `0 0 ${isHovered ? 20 : 8}px ${color}80`,
                  }}
                />
              </Link>

              {/* Hover tooltip */}
              {isHovered && <HoverTooltip project={project} side={hoverSide} />}
            </div>
          )
        })}
      </div>

      {/* Y-Axis labels */}
      <div className="absolute left-5 top-1/2 -translate-y-1/2 flex flex-col justify-between h-[calc(100%-60px)]">
        {[120, 115, 110, 105, 100, 95, 90, 85, 80].map(v => (
          <div key={v} className="flex items-center gap-1">
            <span className={`text-[10px] font-mono ${v === 100 ? "text-orange-400 font-bold" : "text-muted-foreground"}`}>{v}%</span>
          </div>
        ))}
      </div>

      {/* Y-Axis Label */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 origin-center -rotate-90">
        <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">Adjusted Industrial Cost</span>
      </div>

      {/* X-Axis */}
      <div className="absolute bottom-3 left-10 right-10 flex justify-between">
        <span className="text-[10px] text-muted-foreground font-mono">-50%</span>
        <span className="text-[10px] text-muted-foreground font-mono">-25%</span>
        <span className="text-[10px] text-success font-mono font-semibold">0%</span>
        <span className="text-[10px] text-muted-foreground font-mono">+25%</span>
        <span className="text-[10px] text-muted-foreground font-mono">+50%</span>
      </div>

      {/* X-Axis Label */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
        <span className="text-xs font-semibold text-muted-foreground tracking-wider">DELAY</span>
      </div>
    </div>
  )
}
