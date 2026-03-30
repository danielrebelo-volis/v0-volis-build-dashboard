"use client"

import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Project {
  name: string
  id: string
  location: string
  plannedProgress: number   // %
  actualProgress: number    // %
  plannedIC: number         // %
  adjustedIC: number        // %
  analyticalIC: number      // % — always < adjustedIC
}

// Colour scale: green < 85%, amber 85–95%, red > 95%
function icColor(value: number): string {
  if (value < 85) return "#16a34a"   // green-600
  if (value <= 95) return "#d97706"  // amber-600
  return "#dc2626"                   // red-600
}

// Progress deviation: actual vs planned
// actual >= planned → green, within 10% below → amber, > 10% below → red
function progressColor(actual: number, planned: number): string {
  const diff = actual - planned
  if (diff >= 0) return "#16a34a"
  if (diff >= -10) return "#d97706"
  return "#dc2626"
}

function Badge({ value, color }: { value: string; color: string }) {
  return (
    <span
      className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold tabular-nums"
      style={{ color, backgroundColor: `${color}18` }}
    >
      {value}
    </span>
  )
}

const COLUMNS = [
  { label: "Project", span: "col-span-3" },
  { label: "Location", span: "col-span-1" },
  { label: "Planned Prog.", span: "col-span-1" },
  { label: "Actual Prog.", span: "col-span-1" },
  { label: "Planned IC", span: "col-span-1" },
  { label: "Adjusted IC", span: "col-span-1" },
  { label: "Analytical IC", span: "col-span-1" },
  { label: "", span: "col-span-1" },
]

function ProjectRow({ name, id, location, plannedProgress, actualProgress, plannedIC, adjustedIC, analyticalIC }: Project) {
  return (
    <Link href={`/project/${id}`}>
      <div className="group grid grid-cols-10 items-center gap-3 py-2.5 px-3 hover:bg-secondary/30 transition-colors rounded-lg cursor-pointer">

        {/* Project name */}
        <div className="col-span-3 flex items-center gap-3 min-w-0">
          <div
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: progressColor(actualProgress, plannedProgress) }}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-foreground truncate">{name}</span>
              <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </div>
            <span className="text-[11px] text-muted-foreground">{id}</span>
          </div>
        </div>

        {/* Location */}
        <div className="col-span-1 min-w-0">
          <span className="text-xs text-muted-foreground truncate block">{location}</span>
        </div>

        {/* Planned Progress */}
        <div className="col-span-1 text-right">
          <span className="text-[11px] font-mono text-muted-foreground">{plannedProgress}%</span>
        </div>

        {/* Actual Progress */}
        <div className="col-span-1 text-right">
          <Badge value={`${actualProgress}%`} color={progressColor(actualProgress, plannedProgress)} />
        </div>

        {/* Planned IC */}
        <div className="col-span-1 text-right">
          <span className="text-[11px] font-mono text-muted-foreground">{plannedIC}%</span>
        </div>

        {/* Adjusted IC */}
        <div className="col-span-1 text-right">
          <Badge value={`${adjustedIC}%`} color={icColor(adjustedIC)} />
        </div>

        {/* Analytical IC */}
        <div className="col-span-1 text-right">
          <Badge value={`${analyticalIC}%`} color={icColor(analyticalIC)} />
        </div>

        {/* Spacer for grid alignment */}
        <div className="col-span-1" />
      </div>
    </Link>
  )
}

export function ProjectList() {
  const projects: Project[] = [
    { name: "Metro Tower",     id: "PRJ-001", location: "Lisboa, PT",    plannedProgress: 75,  actualProgress: 68,  plannedIC: 82,  adjustedIC: 90,  analyticalIC: 84 },
    { name: "Harbor Bridge",   id: "PRJ-002", location: "Porto, PT",     plannedProgress: 50,  actualProgress: 42,  plannedIC: 78,  adjustedIC: 97,  analyticalIC: 91 },
    { name: "Skyline Plaza",   id: "PRJ-003", location: "Madrid, ES",    plannedProgress: 80,  actualProgress: 85,  plannedIC: 88,  adjustedIC: 94,  analyticalIC: 88 },
    { name: "Industrial Park", id: "PRJ-004", location: "Setúbal, PT",   plannedProgress: 35,  actualProgress: 31,  plannedIC: 75,  adjustedIC: 70,  analyticalIC: 65 },
    { name: "Riverside Homes", id: "PRJ-005", location: "Maputo, MZ",    plannedProgress: 60,  actualProgress: 56,  plannedIC: 80,  adjustedIC: 78,  analyticalIC: 72 },
    { name: "Tech Campus",     id: "PRJ-006", location: "Luanda, AO",    plannedProgress: 55,  actualProgress: 45,  plannedIC: 83,  adjustedIC: 99,  analyticalIC: 92 },
    { name: "Highway 12 Ext",  id: "PRJ-007", location: "Braga, PT",     plannedProgress: 70,  actualProgress: 72,  plannedIC: 79,  adjustedIC: 68,  analyticalIC: 62 },
    { name: "Green Valley",    id: "PRJ-008", location: "Nairobi, KE",   plannedProgress: 55,  actualProgress: 51,  plannedIC: 77,  adjustedIC: 72,  analyticalIC: 67 },
    { name: "Data Center",     id: "PRJ-009", location: "Singapore, SG", plannedProgress: 45,  actualProgress: 39,  plannedIC: 81,  adjustedIC: 75,  analyticalIC: 70 },
  ]

  return (
    <div className="glass-card rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-foreground">Recent Projects</h2>
        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
          View All
        </Button>
      </div>

      {/* Header row */}
      <div className="grid grid-cols-10 gap-3 px-3 pb-2 border-b border-border/30">
        {COLUMNS.map(({ label, span }) => (
          <div key={label} className={`${span} text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 ${label === "Project" || label === "Location" || label === "" ? "" : "text-right"}`}>
            {label}
          </div>
        ))}
      </div>

      <div className="space-y-0.5 mt-1">
        {projects.map((project) => (
          <ProjectRow key={project.id} {...project} />
        ))}
      </div>
    </div>
  )
}
