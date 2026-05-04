"use client"

import { ExternalLink } from "lucide-react"

import Link from "next/link"

interface Project {
  name: string
  id: string
  location: string
  client: string                    // client initials e.g. "EECA"
  contractDeadline: string          // formatted date e.g. "Dec 2025"
  projectedDeadline: string         // formatted date e.g. "Feb 2026"
  plannedProgress: number           // %
  actualProgress: number            // %
  contractValue: number             // M€
  accumulatedProduction: number     // M€
  totalBudget: number               // M€
  projectedAccumulatedCosts: number // M€ — projected accumulated costs to date
  accumulatedCosts: number          // M€ — accumulated costs to date
  projectedTotalCosts: number       // M€ — projected total costs at completion
  targetIC: number                  // %
  adjustedIC: number                // %
  projectedFinalIC: number          // %
}


const COLUMNS = [
  { label: "Project", span: "col-span-2", align: "left" },
  { label: "Contract Deadline", span: "col-span-1", align: "right" },
  { label: "Projected Deadline", span: "col-span-1", align: "right" },
  { label: "Planned Progress", span: "col-span-1", align: "right" },
  { label: "Actual Progress", span: "col-span-1", align: "right" },
  { label: "Contract Value", span: "col-span-1", align: "right" },
  { label: "Accumulated Production", span: "col-span-1", align: "right" },
  { label: "Total Budget", span: "col-span-1", align: "right" },
  { label: "Projected Accumulated Costs to Date", span: "col-span-1", align: "right" },
  { label: "Accumulated Costs to Date", span: "col-span-1", align: "right" },
  { label: "Projected Total Costs", span: "col-span-1", align: "right" },
  { label: "Target IC", span: "col-span-1", align: "right" },
  { label: "Adjusted IC", span: "col-span-1", align: "right" },
  { label: "Projected Final IC", span: "col-span-1", align: "right" },
]

function ProjectRow({ name, id, location, client, contractDeadline, projectedDeadline, plannedProgress, actualProgress, contractValue, accumulatedProduction, totalBudget, projectedAccumulatedCosts, accumulatedCosts, projectedTotalCosts, targetIC, adjustedIC, projectedFinalIC }: Project) {
  return (
    <Link href={`/project/${id}`}>
      <div className="group grid grid-cols-15 items-center gap-3 py-2.5 px-3 hover:bg-secondary/30 transition-colors rounded-lg cursor-pointer">

        {/* Project name + location subtitle */}
        <div className="col-span-2 flex items-center gap-2 min-w-0">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-foreground truncate">{name}</span>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </div>
            <span className="text-xs text-muted-foreground truncate block">
              {location}
              <span className="text-muted-foreground/50 mx-1">|</span>
              <span className="font-medium text-muted-foreground/70">{client}</span>
            </span>
          </div>
        </div>

        {/* Contract Deadline */}
        <div className="col-span-1 text-right">
          <span className="text-xs font-mono text-muted-foreground">{contractDeadline}</span>
        </div>

        {/* Projected Deadline */}
        <div className="col-span-1 text-right">
          <span className="text-xs font-mono text-foreground">{projectedDeadline}</span>
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

        {/* Projected Accumulated Costs to Date */}
        <div className="col-span-1 text-right">
          <span className="text-xs font-mono text-foreground">{projectedAccumulatedCosts.toFixed(1)} M€</span>
        </div>

        {/* Accumulated Costs to Date */}
        <div className="col-span-1 text-right">
          <span className="text-xs font-mono text-foreground">{accumulatedCosts.toFixed(1)} M€</span>
        </div>

        {/* Projected Total Costs */}
        <div className="col-span-1 text-right">
          <span className="text-xs font-mono text-foreground">{projectedTotalCosts.toFixed(1)} M€</span>
        </div>

        {/* Target IC */}
        <div className="col-span-1 text-right">
          <span className="text-xs font-mono text-muted-foreground">{targetIC}%</span>
        </div>

        {/* Adjusted IC */}
        <div className="col-span-1 text-right">
          <span className="text-xs font-mono text-foreground">{adjustedIC}%</span>
        </div>

        {/* Projected Final IC */}
        <div className="col-span-1 text-right">
          <span className="text-xs font-mono text-foreground">{projectedFinalIC}%</span>
        </div>

      </div>
    </Link>
  )
}

export function ProjectList() {
  const projects: Project[] = [
    { name: "Metro Tower", id: "PRJ-001", location: "Lisboa, PT", client: "CML", contractDeadline: "Dec 2025", projectedDeadline: "Feb 2026", plannedProgress: 75, actualProgress: 68, contractValue: 48.2, accumulatedProduction: 32.8, totalBudget: 46.5, projectedAccumulatedCosts: 33.9, accumulatedCosts: 32.4, projectedTotalCosts: 47.8, targetIC: 82, adjustedIC: 90, projectedFinalIC: 86 },
    { name: "Harbor Bridge", id: "PRJ-002", location: "Porto, PT", client: "AMP", contractDeadline: "Mar 2026", projectedDeadline: "Jun 2026", plannedProgress: 50, actualProgress: 42, contractValue: 112.5, accumulatedProduction: 47.3, totalBudget: 109.8, projectedAccumulatedCosts: 59.8, accumulatedCosts: 58.1, projectedTotalCosts: 115.2, targetIC: 80, adjustedIC: 97, projectedFinalIC: 93 },
    { name: "Skyline Plaza", id: "PRJ-003", location: "Madrid, ES", client: "AENA", contractDeadline: "Jun 2025", projectedDeadline: "Jun 2025", plannedProgress: 80, actualProgress: 85, contractValue: 73.8, accumulatedProduction: 62.7, totalBudget: 71.2, projectedAccumulatedCosts: 62.7, accumulatedCosts: 62.7, projectedTotalCosts: 72.9, targetIC: 83, adjustedIC: 94, projectedFinalIC: 90 },
    { name: "Industrial Park", id: "PRJ-004", location: "Setúbal, PT", client: "SETIN", contractDeadline: "Sep 2026", projectedDeadline: "Nov 2026", plannedProgress: 35, actualProgress: 31, contractValue: 31.4, accumulatedProduction: 9.7, totalBudget: 30.5, projectedAccumulatedCosts: 11.2, accumulatedCosts: 10.9, projectedTotalCosts: 31.1, targetIC: 81, adjustedIC: 85, projectedFinalIC: 83 },
    { name: "Riverside Homes", id: "PRJ-005", location: "Maputo, MZ", client: "FIPAG", contractDeadline: "Feb 2026", projectedDeadline: "Apr 2026", plannedProgress: 60, actualProgress: 56, contractValue: 56.0, accumulatedProduction: 31.4, totalBudget: 54.0, projectedAccumulatedCosts: 34.4, accumulatedCosts: 33.6, projectedTotalCosts: 55.3, targetIC: 80, adjustedIC: 88, projectedFinalIC: 85 },
    { name: "Tech Campus", id: "PRJ-006", location: "Luanda, AO", client: "MINEA", contractDeadline: "Nov 2025", projectedDeadline: "Mar 2026", plannedProgress: 55, actualProgress: 45, contractValue: 89.3, accumulatedProduction: 40.2, totalBudget: 87.5, projectedAccumulatedCosts: 50.6, accumulatedCosts: 49.1, projectedTotalCosts: 92.4, targetIC: 83, adjustedIC: 102, projectedFinalIC: 99 },
    { name: "Highway 12 Ext", id: "PRJ-007", location: "Braga, PT", client: "EP", contractDeadline: "Aug 2025", projectedDeadline: "Aug 2025", plannedProgress: 70, actualProgress: 72, contractValue: 22.7, accumulatedProduction: 16.3, totalBudget: 22.0, projectedAccumulatedCosts: 16.3, accumulatedCosts: 16.3, projectedTotalCosts: 22.3, targetIC: 80, adjustedIC: 83, projectedFinalIC: 81 },
    { name: "Green Valley", id: "PRJ-008", location: "Nairobi, KE", client: "KETRACO", contractDeadline: "May 2026", projectedDeadline: "Jul 2026", plannedProgress: 55, actualProgress: 51, contractValue: 44.1, accumulatedProduction: 22.5, totalBudget: 42.8, projectedAccumulatedCosts: 23.6, accumulatedCosts: 23.0, projectedTotalCosts: 43.9, targetIC: 80, adjustedIC: 87, projectedFinalIC: 84 },
    { name: "Data Center", id: "PRJ-009", location: "Singapore, SG", client: "GovTech", contractDeadline: "Jan 2027", projectedDeadline: "Apr 2027", plannedProgress: 45, actualProgress: 39, contractValue: 167.4, accumulatedProduction: 65.3, totalBudget: 163.0, projectedAccumulatedCosts: 78.1, accumulatedCosts: 76.8, projectedTotalCosts: 174.1, targetIC: 81, adjustedIC: 105, projectedFinalIC: 101 },
  ]

  return (
    <div className="glass-card rounded-lg p-4">
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-foreground">Recent Projects</h2>
      </div>

      {/* Header row */}
      <div className="grid grid-cols-15 gap-3 px-3 pb-2 border-b border-border/30">
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
