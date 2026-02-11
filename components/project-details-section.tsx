'use client'

import { AlertCircle, CheckCircle2, Clock, DollarSign, Users, Zap } from 'lucide-react'

interface ProjectDetailsSectionProps {
  projectBudget?: number
  projectSpent?: number
  teamSize?: number
  taskCompletion?: number
  riskLevel?: 'low' | 'medium' | 'high'
  statusMessage?: string
}

export function ProjectDetailsSection({
  projectBudget = 6850000,
  projectSpent = 6700000,
  teamSize = 45,
  taskCompletion = 98,
  riskLevel = 'low',
  statusMessage = 'Critical path maintained. All major milestones on track. Minor resource constraints identified in electrical systems phase.'
}: ProjectDetailsSectionProps) {
  const budgetRemaining = projectBudget - projectSpent
  const percentageSpent = (projectSpent / projectBudget) * 100

  const riskColors = {
    low: { bg: 'bg-green-500/10', text: 'text-green-400', label: 'Low Risk' },
    medium: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: 'Medium Risk' },
    high: { bg: 'bg-red-500/10', text: 'text-red-400', label: 'High Risk' }
  }

  const risk = riskColors[riskLevel]

  return (
    <div className="space-y-4">
      {/* Critical Deviations / Status */}
      <div className="glass-card rounded-lg p-4 border border-border/50">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-cyan flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground mb-2">Project Status</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{statusMessage}</p>
          </div>
          <div className={`${risk.bg} ${risk.text} px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0`}>
            {risk.label}
          </div>
        </div>
      </div>

      {/* Grid of Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Budget Status */}
        <div className="glass-card rounded-lg p-4 border border-border/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-cyan" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Budget Status</span>
            </div>
            <span className={`text-xs font-medium ${percentageSpent > 95 ? 'text-orange-400' : 'text-green-400'}`}>
              {percentageSpent.toFixed(1)}%
            </span>
          </div>
          <div className="space-y-2">
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-cyan" 
                style={{ width: `${percentageSpent}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>€{(projectSpent / 1000000).toFixed(1)}M spent</span>
              <span>€{(budgetRemaining / 1000000).toFixed(1)}M remaining</span>
            </div>
          </div>
        </div>

        {/* Task Completion */}
        <div className="glass-card rounded-lg p-4 border border-border/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Tasks Complete</span>
            </div>
            <span className="text-xs font-medium text-green-400">{taskCompletion}%</span>
          </div>
          <div className="space-y-2">
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-success" 
                style={{ width: `${taskCompletion}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{Math.round(taskCompletion)}% done</span>
              <span>{Math.round(100 - taskCompletion)} remaining</span>
            </div>
          </div>
        </div>

        {/* Team Size */}
        <div className="glass-card rounded-lg p-4 border border-border/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Team Size</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground mb-2">{teamSize} members</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Zap className="w-3 h-3 text-warning" />
            <span>4 open positions</span>
          </div>
        </div>
      </div>
    </div>
  )
}
