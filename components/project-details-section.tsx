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
    </div>
  )
}
