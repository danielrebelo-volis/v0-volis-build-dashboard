'use client'

import { useState } from 'react'
import { DashboardHeader } from '@/components/dashboard-header'
import { ProjectKPISection } from '@/components/project-kpi-section'
import { ProjectDetailsSection } from '@/components/project-details-section'
import { SProgressCurve, SCostCurve } from '@/components/s-curve-chart'
import { ActivityDrillDown } from '@/components/activity-drill-down'
import { OtherIndicators } from '@/components/other-indicators'
import { ArrowLeft, Zap, TrendingDown, Calendar, Download, Euro } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ProjectDeepDive({ params }: { params: { id: string } }) {
  const [drillDownOpen, setDrillDownOpen] = useState(false)

  // Mock project data - in a real app, this would come from a database
  const projectData = {
    id: 'PRJ-001',
    name: 'Metro Tower Development',
    location: 'Lisbon, Portugal',
    portfolio: '€2.5B',
    spi: 1.35,
    cpi: 0.89,
    forecastedEndDate: 'January 15, 2026',
    budget: 24500000,
    spent: 15000000,
    teamSize: 45,
    taskCompletion: 68,
    riskLevel: 'low' as const,
    statusMessage: 'Project is 35 days ahead of schedule. Industrial cost at 90% vs commercial baseline of 80%. All major milestones on track with strong production velocity.'
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
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">Executive Project Report</p>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                {projectData.name}
              </h1>
            </div>
          </div>

          <Link href={`/project/PRJ-001/overview`}>
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
            deadlineDate="March 1, 2026"
          />
        </div>

        {/* Economic Overview */}
        <div className="mb-6 glass-card rounded-lg p-6">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-5">Economic Overview</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Project Budget */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Euro className="w-3.5 h-3.5 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Project Budget</p>
              </div>
              <p className="text-2xl font-bold text-foreground">€24.5M</p>
            </div>
            {/* Commercial IC */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <TrendingDown className="w-3.5 h-3.5 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Commercial IC</p>
              </div>
              <p className="text-2xl font-bold text-foreground">80.0%</p>
            </div>
            {/* Projected IC */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <TrendingDown className="w-3.5 h-3.5 text-warning" />
                <p className="text-xs text-muted-foreground">Projected IC</p>
              </div>
              <p className="text-2xl font-bold text-warning">92.4%</p>
            </div>
            {/* Current IC */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Euro className="w-3.5 h-3.5 text-warning" />
                <p className="text-xs text-muted-foreground">Current IC</p>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-warning">90.0%</p>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Analytical IC: <span className="font-medium">84.2%</span>
              </p>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="mb-8 glass-card rounded-lg p-6">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-5">Progress Overview</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Planned Completion */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Planned Completion</p>
              </div>
              <p className="text-2xl font-bold text-foreground">72.0%</p>
            </div>
            {/* Current Completion */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Calendar className="w-3.5 h-3.5 text-success" />
                <p className="text-xs text-muted-foreground">Current Completion</p>
              </div>
              <p className="text-2xl font-bold text-success">68.0%</p>
            </div>
            {/* Accumulated Production */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Euro className="w-3.5 h-3.5 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Accumulated Production</p>
              </div>
              <p className="text-2xl font-bold text-foreground">€16.66M</p>
            </div>
            {/* Schedule Variance */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Calendar className="w-3.5 h-3.5 text-success" />
                <p className="text-xs text-muted-foreground">Schedule Variance</p>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-success">+35 days</p>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">ahead of schedule</p>
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
          avgWeeklyProgress={2.4}
          requiredWeeklyProgress={2.0}
          avgWeeklyCosts={0.38}
          requiredWeeklyCosts={0.42}
          dataQuality={87}
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
              <span>Project ID: PRJ-001</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Last updated: 2 minutes ago</span>
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
