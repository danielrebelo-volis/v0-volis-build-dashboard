"use client"

import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Project {
  name: string
  id: string
  location: string
  deadline: string          // formatted date
  contractValue: number     // M€
  currentCosts: number      // M€
  plannedProgress: number   // %
  actualProgress: number    // %
  plannedIC: number         // %
  adjustedIC: number        // %
  analyticalIC: number      // % — always < adjustedIC
}

// Colour scale: green ≤ 90%, amber 91–100%, red > 100%
function icColor(value: number): string {
  if (value <= 90) return "#16a34a"   // green-600
  if (value <= 100) return "#d97706"  // amber-600
  return "#dc2626"                    // red-600
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
  { label: "Project", span: "col-span-2" },
  { label: "Location", span: "col-span-1" },
  { label: "Deadline", span: "col-span-1" },
  { label: "Contract Value", span: "col-span-1" },
  { label: "Current Costs", span: "col-span-1" },
  { label: "Planned Prog.", span: "col-span-1" },
  { label: "Actual Prog.", span: "col-span-1" },
  { label: "Planned IC", span: "col-span-1" },
  { label: "Adjusted IC", span: "col-span-1" },
  { label: "Analytical IC", span: "col-span-1" },
  { label: "", span: "col-span-1" },
]

function ProjectRow({ name, id, location, deadline, contractValue, currentCosts, plannedProgress, actualProgress, plannedIC, adjustedIC, analyticalIC }: Project) {
  return (
    <Link href={`/project/${id}`}>
      <div className="group grid grid-cols-12 items-center gap-3 py-2.5 px-3 hover:bg-secondary/30 transition-colors rounded-lg cursor-pointer">

        {/* Project name */}
        <div className="col-span-2 flex items-center gap-2 min-w-0">
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

        {/* Deadline */}
        <div className="col-span-1 text-right">
          <span className="text-[11px] font-mono text-muted-foreground">{deadline}</span>
        </div>

        {/* Contract Value */}
        <div className="col-span-1 text-right">
          <span className="text-[11px] font-mono text-foreground font-medium">{contractValue.toFixed(1)} M€</span>
        </div>

        {/* Current Costs */}
        <div className="col-span-1 text-right">
          <Badge value={`${currentCosts.toFixed(1)} M€`} color={currentCosts > contractValue ? "#dc2626" : currentCosts > contractValue * 0.9 ? "#d97706" : "#16a34a"} />
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
    { name: "Metro Tower",     id: "PRJ-001", location: "Lisboa, PT",    deadline: "Dec 2025", contractValue: 48.2,  currentCosts: 32.4,  plannedProgress: 75,  actualProgress: 68,  plannedIC: 82,  adjustedIC: 90,  analyticalIC: 84 },
    { name: "Harbor Bridge",   id: "PRJ-002", location: "Porto, PT",     deadline: "Mar 2026", contractValue: 112.5, currentCosts: 58.1,  plannedProgress: 50,  actualProgress: 42,  plannedIC: 80,  adjustedIC: 97,  analyticalIC: 91 },
    { name: "Skyline Plaza",   id: "PRJ-003", location: "Madrid, ES",    deadline: "Jun 2025", contractValue: 73.8,  currentCosts: 62.7,  plannedProgress: 80,  actualProgress: 85,  plannedIC: 83,  adjustedIC: 94,  analyticalIC: 88 },
    { name: "Industrial Park", id: "PRJ-004", location: "Setúbal, PT",   deadline: "Sep 2026", contractValue: 31.4,  currentCosts: 10.9,  plannedProgress: 35,  actualProgress: 31,  plannedIC: 81,  adjustedIC: 85,  analyticalIC: 82 },
    { name: "Riverside Homes", id: "PRJ-005", location: "Maputo, MZ",    deadline: "Feb 2026", contractValue: 56.0,  currentCosts: 33.6,  plannedProgress: 60,  actualProgress: 56,  plannedIC: 80,  adjustedIC: 88,  analyticalIC: 83 },
    { name: "Tech Campus",     id: "PRJ-006", location: "Luanda, AO",    deadline: "Nov 2025", contractValue: 89.3,  currentCosts: 49.1,  plannedProgress: 55,  actualProgress: 45,  plannedIC: 83,  adjustedIC: 102, analyticalIC: 96 },
    { name: "Highway 12 Ext",  id: "PRJ-007", location: "Braga, PT",     deadline: "Aug 2025", contractValue: 22.7,  currentCosts: 16.3,  plannedProgress: 70,  actualProgress: 72,  plannedIC: 80,  adjustedIC: 83,  analyticalIC: 80 },
    { name: "Green Valley",    id: "PRJ-008", location: "Nairobi, KE",   deadline: "May 2026", contractValue: 44.1,  currentCosts: 23.0,  plannedProgress: 55,  actualProgress: 51,  plannedIC: 80,  adjustedIC: 87,  analyticalIC: 82 },
    { name: "Data Center",     id: "PRJ-009", location: "Singapore, SG", deadline: "Jan 2027", contractValue: 167.4, currentCosts: 76.8,  plannedProgress: 45,  actualProgress: 39,  plannedIC: 81,  adjustedIC: 105, analyticalIC: 98 },
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
      <div className="grid grid-cols-12 gap-3 px-3 pb-2 border-b border-border/30">
        {COLUMNS.map(({ label, span }, i) => (
          <div key={`${label}-${i}`} className={`${span} text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 ${label === "Project" || label === "Location" || label === "" ? "" : "text-right"}`}>
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
