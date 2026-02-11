'use client'

import { TrendingUp, TrendingDown, Calendar, MapPin } from 'lucide-react'

interface ProjectKPISectionProps {
  projectName?: string
  location?: string
  spi?: number
  cpi?: number
  forecastedEndDate?: string
}

export function ProjectKPISection({
  projectName = 'Porto Coastal Infrastructure',
  location = 'Porto, Portugal',
  spi = 1.08,
  cpi = 0.95,
  forecastedEndDate = 'March 15, 2025'
}: ProjectKPISectionProps) {
  const isSPIHealthy = spi >= 1.0
  const isCPIHealthy = cpi >= 1.0

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* SPI Card */}
      <div className="glass-card rounded-lg p-4 border border-border/50">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Schedule Performance</p>
            <p className="text-sm font-semibold text-foreground mt-0.5">SPI Index</p>
          </div>
          {isSPIHealthy ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-cyan">{spi.toFixed(2)}</span>
          <span className="text-xs text-muted-foreground">vs baseline</span>
        </div>
        <div className="mt-3 pt-3 border-t border-border/30">
          <p className={`text-xs font-medium ${isSPIHealthy ? 'text-green-400' : 'text-orange-400'}`}>
            {isSPIHealthy ? '8% ahead of schedule' : 'Slightly behind schedule'}
          </p>
        </div>
      </div>

      {/* CPI Card */}
      <div className="glass-card rounded-lg p-4 border border-border/50">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Cost Performance</p>
            <p className="text-sm font-semibold text-foreground mt-0.5">CPI Index</p>
          </div>
          {isCPIHealthy ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-orange-500" />
          )}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-cyan">{cpi.toFixed(2)}</span>
          <span className="text-xs text-muted-foreground">cost ratio</span>
        </div>
        <div className="mt-3 pt-3 border-t border-border/30">
          <p className={`text-xs font-medium ${isCPIHealthy ? 'text-green-400' : 'text-orange-400'}`}>
            {isCPIHealthy ? 'On budget' : '5% over budget'}
          </p>
        </div>
      </div>

      {/* AI Forecasted End Date */}
      <div className="glass-card rounded-lg p-4 border border-border/50">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">AI Forecast</p>
            <p className="text-sm font-semibold text-foreground mt-0.5">Completion Date</p>
          </div>
          <Calendar className="w-4 h-4 text-cyan" />
        </div>
        <div className="text-2xl font-bold text-cyan">{forecastedEndDate}</div>
        <div className="mt-3 pt-3 border-t border-border/30">
          <p className="text-xs text-muted-foreground">Based on historical trends & current velocity</p>
        </div>
      </div>

      {/* Project Metadata */}
      <div className="glass-card rounded-lg p-4 border border-border/50">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Project Info</p>
            <p className="text-sm font-semibold text-foreground mt-0.5">{projectName}</p>
          </div>
          <MapPin className="w-4 h-4 text-cyan" />
        </div>
        <div className="flex items-center gap-1 text-sm text-foreground mb-3">
          <span>{location}</span>
        </div>
        <div className="mt-3 pt-3 border-t border-border/30">
          <p className="text-xs text-muted-foreground">Part of €2.5B portfolio</p>
        </div>
      </div>
    </div>
  )
}
