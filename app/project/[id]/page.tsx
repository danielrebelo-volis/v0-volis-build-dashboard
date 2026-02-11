'use client'

import { useState } from 'react'
import { DashboardHeader } from '@/components/dashboard-header'
import { ProjectDetailsSection } from '@/components/project-details-section'
import { ProjectKpiSection } from '@/components/project-kpi-section'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ProjectPage({ params }: { params: { id: string } }) {
  const projectData = {
    name: 'Downtown Tower Complex',
    status: 'In Progress',
    statusMessage: 'Critical path maintained. All major milestones on track. Minor resource constraints identified in electrical systems phase.',
    riskLevel: 'low' as const,
    projectBudget: 6850000,
    projectSpent: 6700000,
    teamSize: 45,
    taskCompletion: 98,
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="p-6 max-w-7xl mx-auto">
        {/* Header with Navigation */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-semibold text-foreground">{projectData.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">Project ID: {params.id}</p>
          </div>
          <Link href={`/project/${params.id}/overview`}>
            <Button className="gap-2 bg-foreground text-background hover:bg-foreground/90">
              View Full Details
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Project Details Section */}
        <div className="mb-8">
          <ProjectDetailsSection
            projectBudget={projectData.projectBudget}
            projectSpent={projectData.projectSpent}
            teamSize={projectData.teamSize}
            taskCompletion={projectData.taskCompletion}
            riskLevel={projectData.riskLevel}
            statusMessage={projectData.statusMessage}
          />
        </div>

        {/* KPI Section */}
        <div className="mb-8">
          <ProjectKpiSection />
        </div>

        {/* Call to Action */}
        <div className="glass-card rounded-lg p-6 border border-border/50 text-center">
          <h2 className="text-lg font-semibold text-foreground mb-2">Ready to dive deeper?</h2>
          <p className="text-sm text-muted-foreground mb-4">
            View the complete project overview with detailed analytics, charts, and activity tracking.
          </p>
          <Link href={`/project/${params.id}/overview`}>
            <Button className="gap-2 bg-foreground text-background hover:bg-foreground/90">
              Open Full Project Overview
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
