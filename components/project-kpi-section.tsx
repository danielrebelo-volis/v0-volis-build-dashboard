'use client'

import { TrendingUp, TrendingDown, Calendar, MapPin, TrendingDown as CostIcon } from 'lucide-react'

interface ProjectKPISectionProps {
  projectName?: string
  location?: string
  spi?: number
  cpi?: number
  forecastedEndDate?: string
  deadlineDate?: string
  industrialCost?: number
}

export function ProjectKPISection({
  projectName = 'Porto Coastal Infrastructure',
  location = 'Porto, Portugal',
  spi = 1.08,
  cpi = 0.95,
  forecastedEndDate = 'March 15, 2026',
  deadlineDate = 'March 1, 2026'
}: ProjectKPISectionProps) {
  const isSPIHealthy = spi >= 1.0
  const isCPIHealthy = cpi >= 1.0

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

      {/* Project Metadata */}
      <div className="glass-card rounded-lg p-4 border border-border/50">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Project Info</p>
            <p className="text-sm font-semibold text-foreground mt-0.5">{projectName}</p>
          </div>
          <MapPin className="w-4 h-4 text-cyan" />
        </div>
        <div className="flex items-center gap-1 text-sm">
          <p className="text-2xl font-bold text-foreground">{location}</p>
        </div>
      </div>

      {/* Forecasted End Date */}
      <div className="glass-card rounded-lg p-4 border border-border/50">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Forecast</p>
            <p className="text-sm font-semibold text-foreground mt-0.5">Completion Date</p>
          </div>
          <Calendar className="w-4 h-4 text-cyan" />
        </div>
        <div className="text-2xl font-bold text-foreground">{forecastedEndDate}</div>
      </div>

      {/* Deadline Date */}
      <div className="glass-card rounded-lg p-4 border border-border/50">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Contract</p>
            <p className="text-sm font-semibold text-foreground mt-0.5">Deadline Date</p>
          </div>
          <Calendar className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="text-2xl font-bold text-foreground">{deadlineDate}</div>
      </div>
    </div>
  )
}
