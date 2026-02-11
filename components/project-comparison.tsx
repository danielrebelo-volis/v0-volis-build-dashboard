'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface ComparisonProject {
  id: string
  name: string
  location: string
  spi: number
  cpi: number
  ev: string
  weeklyRatio: string
  weeklyChange: string
  ppc: number
  estimatedFinalCost: number
  plannedBudget: number
  estimatedDeadline: string
  initialDeadline: string
}

const projects: ComparisonProject[] = [
  {
    id: 'PRJ-001',
    name: 'Project Alpha',
    location: 'Portugal',
    spi: 1.05,
    cpi: 0.98,
    ev: '€12.5M',
    weeklyRatio: '€850k/week',
    weeklyChange: '+4.2%',
    ppc: 87,
    estimatedFinalCost: 48.5,
    plannedBudget: 50,
    estimatedDeadline: 'March 15, 2025',
    initialDeadline: 'March 22, 2025',
  },
  {
    id: 'PRJ-002',
    name: 'Project Beta',
    location: 'Brazil',
    spi: 0.92,
    cpi: 1.08,
    ev: '€18.2M',
    weeklyRatio: '€920k/week',
    weeklyChange: '-2.1%',
    ppc: 72,
    estimatedFinalCost: 52.8,
    plannedBudget: 48,
    estimatedDeadline: 'April 5, 2025',
    initialDeadline: 'March 28, 2025',
  },
  {
    id: 'PRJ-003',
    name: 'Metro Tower',
    location: 'Singapore',
    spi: 1.15,
    cpi: 0.85,
    ev: '€24.1M',
    weeklyRatio: '€1.1M/week',
    weeklyChange: '+6.8%',
    ppc: 92,
    estimatedFinalCost: 42.5,
    plannedBudget: 50,
    estimatedDeadline: 'February 28, 2025',
    initialDeadline: 'March 10, 2025',
  },
  {
    id: 'PRJ-004',
    name: 'Harbor Bridge',
    location: 'Dubai',
    spi: 0.88,
    cpi: 1.12,
    ev: '€31.5M',
    weeklyRatio: '€950k/week',
    weeklyChange: '-1.5%',
    ppc: 65,
    estimatedFinalCost: 67.2,
    plannedBudget: 60,
    estimatedDeadline: 'April 18, 2025',
    initialDeadline: 'March 30, 2025',
  },
  {
    id: 'PRJ-005',
    name: 'Skyline Plaza',
    location: 'London',
    spi: 1.02,
    cpi: 0.95,
    ev: '€28.7M',
    weeklyRatio: '€880k/week',
    weeklyChange: '+3.2%',
    ppc: 85,
    estimatedFinalCost: 45.2,
    plannedBudget: 47.5,
    estimatedDeadline: 'March 20, 2025',
    initialDeadline: 'March 25, 2025',
  },
]

const sCurveData = [
  { week: 'W1', plannedProgress: 5, actualProgress: 6, plannedCost: 2, actualCost: 2.1 },
  { week: 'W2', plannedProgress: 12, actualProgress: 13, plannedCost: 4.5, actualCost: 4.4 },
  { week: 'W3', plannedProgress: 22, actualProgress: 23, plannedCost: 8, actualCost: 7.8 },
  { week: 'W4', plannedProgress: 35, actualProgress: 38, plannedCost: 12.5, actualCost: 12.2 },
  { week: 'W5', plannedProgress: 50, actualProgress: 52, plannedCost: 18, actualCost: 17.6 },
  { week: 'W6', plannedProgress: 65, actualProgress: 67, plannedCost: 24, actualCost: 23.8 },
  { week: 'W7', plannedProgress: 78, actualProgress: 79, plannedCost: 30, actualCost: 29.5 },
  { week: 'W8', plannedProgress: 88, actualProgress: 90, plannedCost: 35, actualCost: 34.2 },
]

type IndicatorType = 'weekly-evolution' | 'real-earned-value' | 'cpi' | 'spi' | 'ppc' | 'estimated-cost' | 'estimated-deadline'

function IndicatorCard({ 
  type, 
  project 
}: { 
  type: IndicatorType
  project: ComparisonProject 
}) {
  const calculateDays = (estimatedDate: string, initialDate: string) => {
    const estimated = new Date(estimatedDate)
    const initial = new Date(initialDate)
    const days = Math.round((estimated - initial) / (1000 * 60 * 60 * 24))
    return days
  }

  const costDifference = ((project.estimatedFinalCost - project.plannedBudget) / project.plannedBudget) * 100
  const days = calculateDays(project.estimatedDeadline, project.initialDeadline)

  switch (type) {
    case 'weekly-evolution':
      return (
        <div className="glass-card rounded-lg p-4">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Weekly Evolution</h4>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl font-bold text-foreground">{project.weeklyChange}</span>
            <span className="text-xs text-muted-foreground">this week</span>
          </div>
          <div className="h-20">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={sCurveData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="week" tick={{ fontSize: 8, fill: 'rgba(255,255,255,0.3)' }} />
                <YAxis hide />
                <Line type="monotone" dataKey="actualProgress" stroke="#00c8ff" strokeWidth={1.5} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )
    case 'real-earned-value':
      return (
        <div className="glass-card rounded-lg p-4">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Real Earned Value</h4>
          <div className="text-2xl font-bold text-foreground mb-1">{project.ev}</div>
          <div className="text-xs text-muted-foreground">Weekly Production: {project.weeklyRatio}</div>
        </div>
      )
    case 'cpi':
      return (
        <div className="glass-card rounded-lg p-4">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">CPI</h4>
          <div className="text-2xl font-bold text-foreground">{project.cpi.toFixed(2)}</div>
          <div className="text-xs text-muted-foreground mt-2">
            {project.cpi > 1 ? '✓ Under Budget' : '⚠ Over Budget'}
          </div>
        </div>
      )
    case 'spi':
      return (
        <div className="glass-card rounded-lg p-4">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">SPI</h4>
          <div className="text-2xl font-bold text-foreground">{project.spi.toFixed(2)}</div>
          <div className="text-xs text-muted-foreground mt-2">
            {project.spi > 1 ? '✓ Ahead Schedule' : '⚠ Behind Schedule'}
          </div>
        </div>
      )
    case 'ppc':
      return (
        <div className="glass-card rounded-lg p-4">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">PPC</h4>
          <div className="text-2xl font-bold text-foreground">{project.ppc}%</div>
          <div className="text-xs text-muted-foreground mt-2">Plan Performance Compliance</div>
        </div>
      )
    case 'estimated-cost':
      return (
        <div className="glass-card rounded-lg p-4">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Estimated Final Cost</h4>
          <div className="text-2xl font-bold text-foreground">€{project.estimatedFinalCost.toFixed(1)}M</div>
          <div className={`text-xs mt-2 ${costDifference > 0 ? 'text-red-500' : 'text-green-500'}`}>
            {costDifference > 0 ? '+' : ''}{costDifference.toFixed(1)}% vs planned
          </div>
        </div>
      )
    case 'estimated-deadline':
      return (
        <div className="glass-card rounded-lg p-4">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Estimated Deadline</h4>
          <div className="text-sm font-bold text-foreground">{project.estimatedDeadline}</div>
          <div className={`text-xs mt-2 ${days < 0 ? 'text-green-500' : 'text-red-500'}`}>
            {days < 0 ? '' : '+'}{days} days {days < 0 ? 'ahead' : 'behind'}
          </div>
        </div>
      )
  }
}

function ComparisonSide({
  side,
  selectedProject,
  onProjectChange,
  selectedIndicators,
}: {
  side: 'left' | 'right'
  selectedProject: ComparisonProject
  onProjectChange: (project: ComparisonProject) => void
  selectedIndicators: IndicatorType[]
}) {
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <div className="flex-1">
      {/* Project Dropdown */}
      <div className="relative mb-6">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-full flex items-center justify-between px-4 py-3 border border-foreground rounded-lg hover:bg-secondary/20 transition-colors"
        >
          <div className="text-left">
            <div className="text-sm font-semibold text-foreground">{selectedProject.name}</div>
            <div className="text-xs text-muted-foreground">{selectedProject.location}</div>
          </div>
          <ChevronDown className="w-4 h-4 text-foreground transition-transform" style={{
            transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
          }} />
        </button>

        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 border border-foreground rounded-lg bg-background z-50">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => {
                  onProjectChange(project)
                  setShowDropdown(false)
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-secondary/30 transition-colors border-b border-border/30 last:border-b-0"
              >
                <div className="text-sm font-medium text-foreground">{project.name}</div>
                <div className="text-xs text-muted-foreground">{project.location}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* S-Curves - Progress and Cost */}
      <div className="mb-8">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Progress S-Curve</h3>
        <div className="h-40 glass-card rounded-lg p-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={sCurveData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.5)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.5)' }} />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(20,20,20,0.9)', border: '1px solid rgba(255,255,255,0.2)' }} />
              <Line type="monotone" dataKey="plannedProgress" stroke="rgba(255,255,255,0.4)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="actualProgress" stroke="#00c8ff" strokeWidth={2.5} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cost S-Curve */}
      <div className="mb-8">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Cost S-Curve</h3>
        <div className="h-40 glass-card rounded-lg p-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={sCurveData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.5)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.5)' }} />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(20,20,20,0.9)', border: '1px solid rgba(255,255,255,0.2)' }} />
              <Line type="monotone" dataKey="plannedCost" stroke="rgba(255,255,255,0.4)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="actualCost" stroke="#00c8ff" strokeWidth={2.5} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Selected Indicators */}
      {selectedIndicators.length > 0 && (
        <div className="grid grid-cols-1 gap-3">
          {selectedIndicators.map((indicator) => (
            <IndicatorCard key={indicator} type={indicator} project={selectedProject} />
          ))}
        </div>
      )}
    </div>
  )
}

export function ProjectComparison() {
  const [leftProject, setLeftProject] = useState<ComparisonProject>(projects[0])
  const [rightProject, setRightProject] = useState<ComparisonProject>(projects[1])
  const [selectedIndicators, setSelectedIndicators] = useState<IndicatorType[]>([])

  const indicatorOptions: { value: IndicatorType; label: string }[] = [
    { value: 'weekly-evolution', label: 'Weekly Evolution' },
    { value: 'real-earned-value', label: 'Real Earned Value' },
    { value: 'cpi', label: 'CPI' },
    { value: 'spi', label: 'SPI' },
    { value: 'ppc', label: 'PPC' },
    { value: 'estimated-cost', label: 'Estimated Final Cost' },
    { value: 'estimated-deadline', label: 'Estimated Deadline' },
  ]

  const toggleIndicator = (indicator: IndicatorType) => {
    setSelectedIndicators((prev) =>
      prev.includes(indicator)
        ? prev.filter((i) => i !== indicator)
        : [...prev, indicator]
    )
  }

  return (
    <div className="min-h-screen bg-background grid-background">
      {/* Header */}
      <div className="border-b border-border/50 px-6 py-4">
        <h1 className="text-xl font-semibold text-foreground">Project Comparison</h1>
        <p className="text-xs text-muted-foreground mt-1">Side-by-side performance analysis</p>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Indicator Selection */}
        <div className="mb-8 flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger className="bg-white text-card" asChild>
              <Button variant="outline" className="gap-2 text-muted-foreground bg-transparent">
                Choose indicator
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-56">
              <DropdownMenuLabel>Select Indicators</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {indicatorOptions.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={selectedIndicators.includes(option.value)}
                  onCheckedChange={() => toggleIndicator(option.value)}
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Comparison Sides */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ComparisonSide
            side="left"
            selectedProject={leftProject}
            onProjectChange={setLeftProject}
            selectedIndicators={selectedIndicators}
          />
          <ComparisonSide
            side="right"
            selectedProject={rightProject}
            onProjectChange={setRightProject}
            selectedIndicators={selectedIndicators}
          />
        </div>
      </div>
    </div>
  )
}
