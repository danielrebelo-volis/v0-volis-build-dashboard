'use client'

import { useState } from 'react'
import { DashboardHeader } from '@/components/dashboard-header'
import { ProjectKPISection } from '@/components/project-kpi-section'
import { ProjectDetailsSection } from '@/components/project-details-section'
import { SProgressCurve, SCostCurve } from '@/components/s-curve-chart'
import { ActivityDrillDown } from '@/components/activity-drill-down'
import { OtherIndicators } from '@/components/other-indicators'
import { ArrowLeft, Zap, TrendingDown, Calendar, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ProjectDeepDive({ params }: { params: { id: string } }) {
  const [drillDownOpen, setDrillDownOpen] = useState(false)

  // Mock project data - in a real app, this would come from a database
  const projectData = {
    id: 'PRJ-007',
    name: 'Metro Tower Development',
    location: 'Lisbon, Portugal',
    portfolio: '€2.5B',
    spi: 1.08,
    cpi: 0.95,
    forecastedEndDate: 'March 15, 2025',
    budget: 6850000,
    spent: 6700000,
    teamSize: 45,
    taskCompletion: 98,
    riskLevel: 'low' as const,
    statusMessage: 'Critical path maintained. All major milestones on track. Minor resource constraints identified in electrical systems phase.'
  }

  return (
    <div className="min-h-screen bg-background grid-background">
      <DashboardHeader />

      <main className="p-6">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Portfolio</span>
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                {projectData.name}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {projectData.location} • Part of {projectData.portfolio} portfolio
              </p>
            </div>
          </div>

          <Link href={`/project/PRJ-007/overview`}>
            <Button
              className="gap-2 bg-cyan text-background hover:bg-cyan/90 self-start sm:self-auto"
            >
              <span className="hidden sm:inline">Go to Project Overview</span>
              <span className="sm:hidden">Overview</span>
            </Button>
          </Link>
        </div>

        {/* KPI Section */}
        <div className="mb-8">
          <ProjectKPISection
            projectName={projectData.name}
            location={projectData.location}
            spi={projectData.spi}
            cpi={projectData.cpi}
            forecastedEndDate={projectData.forecastedEndDate}
          />
        </div>

        {/* Project Info Card */}
        <div className="mb-8 glass-card rounded-lg p-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-6">Budget & Schedule Variance</h3>
          <div className="grid grid-cols-2 lg:grid-cols-2 gap-6">
            {/* Budget Variance */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 text-success" />
                <p className="text-xs text-muted-foreground">Budget Variance</p>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-success">€150,000</p>
                <p className="text-xs text-muted-foreground">under budget</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Budget: €6.85M | Spent: €6.7M</p>
            </div>

            {/* Schedule Variance */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-success" />
                <p className="text-xs text-muted-foreground">Schedule Variance</p>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-success">+12 days</p>
                <p className="text-xs text-muted-foreground">ahead of schedule</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Expected: March 27 | Forecast: March 15</p>
            </div>
          </div>
        </div>

        {/* S-Curves Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Project S-Curves</h2>
            <Button
              onClick={() => setDrillDownOpen(true)}
              className="gap-2 bg-cyan text-background hover:bg-cyan/90"
            >
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Activity Drill-Down</span>
              <span className="sm:hidden">Drill-Down</span>
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SProgressCurve />
            <SCostCurve />
          </div>
        </div>

        {/* Other Indicators Section */}
        <OtherIndicators
          weeklyProgress={8.5}
          priorWeekProgress={7.2}
          requiredWeeklyProgress={7.8}
          earnedValue={5600000}
        />

        {/* Details & Status */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Project Details & Performance</h2>
          <ProjectDetailsSection
            projectBudget={projectData.budget}
            projectSpent={projectData.spent}
            teamSize={projectData.teamSize}
            taskCompletion={projectData.taskCompletion}
            riskLevel={projectData.riskLevel}
            statusMessage={projectData.statusMessage}
          />
        </div>

        {/* Footer Info */}
        <div className="mt-8 pt-6 border-t border-border/50">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
            <div>
              <span>Project ID: {projectData.id}</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Last updated: 2 minutes ago</span>
              <span className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-success" />
                Real-time data
              </span>
            </div>
          </div>
        </div>

        {/* Activity Drill-Down Modal */}
        <ActivityDrillDown
          isOpen={drillDownOpen}
          onClose={() => setDrillDownOpen(false)}
        />
      </main>
    </div>
  )
}
