"use client"

import { ExternalLink } from "lucide-react"

import Link from "next/link"

interface Project {
  name: string
  id: string
  location: string
  deadline: string              // formatted date
  plannedProgress: number       // %
  actualProgress: number        // %
  contractValue: number         // M€
  accumulatedProduction: number // M€
  totalBudget: number           // M€ — always > currentCosts
  expectedCosts: number         // M€ — projected total cost at completion
  currentCosts: number          // M€
  targetIC: number              // % (formerly plannedIC)
  adjustedIC: number            // %
  analyticalIC: number          // % — always < adjustedIC
  projectedIC: number           // %
}


// Column order:
// Project | Deadline | Planned Prog. | Actual Prog. | Contract Value | Accum. Prod. | Total Budget | Exp. Costs | Current Costs | Target IC | Adjusted IC | Analytical IC | Projected IC | (action)
const COLUMNS = [
  { label: "Project", span: "col-span-2", align: "left" },
  { label: "Deadline", span: "col-span-1", align: "right" },
  { label: "Planned Progress", span: "col-span-1", align: "right" },
  { label: "Actual Progress", span: "col-span-1", align: "right" },
  { label: "Contract Value", span: "col-span-1", align: "right" },
  { label: "Accumulated Production", span: "col-span-1", align: "right" },
  { label: "Total Budget", span: "col-span-1", align: "right" },
  { label: "Expected Costs", span: "col-span-1", align: "right" },
  { label: "Current Costs", span: "col-span-1", align: "right" },
  { label: "Target IC", span: "col-span-1", align: "right" },
  { label: "Adjusted IC", span: "col-span-1", align: "right" },
  { label: "Analytical IC", span: "col-span-1", align: "right" },
  { label: "Projected IC", span: "col-span-1", align: "right" },
]

function ProjectRow({ name, id, location, deadline, plannedProgress, actualProgress, contractValue, accumulatedProduction, totalBudget, expectedCosts, currentCosts, targetIC, adjustedIC, analyticalIC, projectedIC }: Project) {
  return (
    <Link href={`/project/${id}`}>
      <div className="group grid grid-cols-14 items-center gap-3 py-2.5 px-3 hover:bg-secondary/30 transition-colors rounded-lg cursor-pointer">

        {/* Project name + location subtitle */}
        <div className="col-span-2 flex items-center gap-2 min-w-0">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-foreground truncate">{name}</span>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </div>
            <span className="text-xs text-muted-foreground truncate block">{location}</span>
          </div>
        </div>

        {/* Deadline */}
        <div className="col-span-1 text-right">
          <span className="text-xs font-mono text-muted-foreground">{deadline}</span>
        </div>

        {/* Planned Progress */}
        <div className="col-span-1 text-right">
          <span className="text-xs font-mono text-muted-foreground">{plannedProgress}%</span>
        </div>

        {/* Actual Progress */}
        <div className="col-span-1 text-right">
          <span className="text-xs font-mono text-foreground">{actualProgress}%</span>
        </div>

        {/* Contract Value */}
        <div className="col-span-1 text-right">
          <span className="text-xs font-mono text-foreground font-medium">{contractValue.toFixed(1)} M€</span>
        </div>

        {/* Accumulated Production */}
        <div className="col-span-1 text-right">
          <span className="text-xs font-mono text-foreground">{accumulatedProduction.toFixed(1)} M€</span>
        </div>

        {/* Total Budget */}
        <div className="col-span-1 text-right">
          <span className="text-xs font-mono text-foreground">{totalBudget.toFixed(1)} M€</span>
        </div>

        {/* Expected Costs */}
        <div className="col-span-1 text-right">
          <span className="text-xs font-mono text-foreground">{expectedCosts.toFixed(1)} M€</span>
        </div>

        {/* Current Costs */}
        <div className="col-span-1 text-right">
          <span className="text-xs font-mono text-foreground">{currentCosts.toFixed(1)} M€</span>
        </div>

        {/* Target IC */}
        <div className="col-span-1 text-right">
          <span className="text-xs font-mono text-muted-foreground">{targetIC}%</span>
        </div>

        {/* Adjusted IC */}
        <div className="col-span-1 text-right">
          <span className="text-xs font-mono text-foreground">{adjustedIC}%</span>
        </div>

        {/* Analytical IC */}
        <div className="col-span-1 text-right">
          <span className="text-xs font-mono text-foreground">{analyticalIC}%</span>
        </div>

        {/* Projected IC */}
        <div className="col-span-1 text-right">
          <span className="text-xs font-mono text-foreground">{projectedIC}%</span>
        </div>

      </div>
    </Link>
  )
}

export function ProjectList() {
  const projects: Project[] = [
    { name: "Metro Tower", id: "PRJ-001", location: "Lisboa, PT", deadline: "Dec 2025", plannedProgress: 75, actualProgress: 68, contractValue: 48.2, accumulatedProduction: 32.8, totalBudget: 46.5, expectedCosts: 47.8, currentCosts: 32.4, targetIC: 82, adjustedIC: 90, analyticalIC: 84, projectedIC: 86 },
    { name: "Harbor Bridge", id: "PRJ-002", location: "Porto, PT", deadline: "Mar 2026", plannedProgress: 50, actualProgress: 42, contractValue: 112.5, accumulatedProduction: 47.3, totalBudget: 109.8, expectedCosts: 115.2, currentCosts: 58.1, targetIC: 80, adjustedIC: 97, analyticalIC: 91, projectedIC: 93 },
    { name: "Skyline Plaza", id: "PRJ-003", location: "Madrid, ES", deadline: "Jun 2025", plannedProgress: 80, actualProgress: 85, contractValue: 73.8, accumulatedProduction: 62.7, totalBudget: 71.2, expectedCosts: 72.9, currentCosts: 62.7, targetIC: 83, adjustedIC: 94, analyticalIC: 88, projectedIC: 90 },
    { name: "Industrial Park", id: "PRJ-004", location: "Setúbal, PT", deadline: "Sep 2026", plannedProgress: 35, actualProgress: 31, contractValue: 31.4, accumulatedProduction: 9.7, totalBudget: 30.5, expectedCosts: 31.1, currentCosts: 10.9, targetIC: 81, adjustedIC: 85, analyticalIC: 82, projectedIC: 83 },
    { name: "Riverside Homes", id: "PRJ-005", location: "Maputo, MZ", deadline: "Feb 2026", plannedProgress: 60, actualProgress: 56, contractValue: 56.0, accumulatedProduction: 31.4, totalBudget: 54.0, expectedCosts: 55.3, currentCosts: 33.6, targetIC: 80, adjustedIC: 88, analyticalIC: 83, projectedIC: 85 },
    { name: "Tech Campus", id: "PRJ-006", location: "Luanda, AO", deadline: "Nov 2025", plannedProgress: 55, actualProgress: 45, contractValue: 89.3, accumulatedProduction: 40.2, totalBudget: 87.5, expectedCosts: 92.4, currentCosts: 49.1, targetIC: 83, adjustedIC: 102, analyticalIC: 96, projectedIC: 99 },
    { name: "Highway 12 Ext", id: "PRJ-007", location: "Braga, PT", deadline: "Aug 2025", plannedProgress: 70, actualProgress: 72, contractValue: 22.7, accumulatedProduction: 16.3, totalBudget: 22.0, expectedCosts: 22.3, currentCosts: 16.3, targetIC: 80, adjustedIC: 83, analyticalIC: 80, projectedIC: 81 },
    { name: "Green Valley", id: "PRJ-008", location: "Nairobi, KE", deadline: "May 2026", plannedProgress: 55, actualProgress: 51, contractValue: 44.1, accumulatedProduction: 22.5, totalBudget: 42.8, expectedCosts: 43.9, currentCosts: 23.0, targetIC: 80, adjustedIC: 87, analyticalIC: 82, projectedIC: 84 },
    { name: "Data Center", id: "PRJ-009", location: "Singapore, SG", deadline: "Jan 2027", plannedProgress: 45, actualProgress: 39, contractValue: 167.4, accumulatedProduction: 65.3, totalBudget: 163.0, expectedCosts: 174.1, currentCosts: 76.8, targetIC: 81, adjustedIC: 105, analyticalIC: 98, projectedIC: 101 },
  ]

  return (
    <div className="glass-card rounded-lg p-4">
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-foreground">Recent Projects</h2>
      </div>

      {/* Header row */}
      <div className="grid grid-cols-14 gap-3 px-3 pb-2 border-b border-border/30">
        {COLUMNS.map(({ label, span, align }, i) => (
          <div key={`${label}-${i}`} className={`${span} text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 ${align === "left" ? "" : "text-right"}`}>
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
