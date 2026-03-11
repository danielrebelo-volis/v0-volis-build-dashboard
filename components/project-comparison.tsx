'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useChartColors } from '@/hooks/use-chart-colors'
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
  delay: number
  industrialCost: number
  completion: number
}

// Data from project-list.tsx and overview page
const projects: ComparisonProject[] = [
  {
    id: 'PRJ-001',
    name: 'Metro Tower',
    location: 'Lisbon, Portugal',
    spi: 1.15,
    cpi: 0.88,
    ev: '€24.1M',
    weeklyRatio: '€1.1M/week',
    weeklyChange: '+6.8%',
    ppc: 92,
    estimatedFinalCost: 42.5,
    plannedBudget: 50,
    estimatedDeadline: 'February 28, 2025',
    initialDeadline: 'March 10, 2025',
    delay: -35,
    industrialCost: 95,
    completion: 68,
  },
  {
    id: 'PRJ-002',
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
    delay: 20,
    industrialCost: 73,
    completion: 42,
  },
  {
    id: 'PRJ-003',
    name: 'Skyline Plaza',
    location: 'London',
    spi: 0.85,
    cpi: 0.92,
    ev: '€28.7M',
    weeklyRatio: '€880k/week',
    weeklyChange: '-3.5%',
    ppc: 78,
    estimatedFinalCost: 52.0,
    plannedBudget: 47.5,
    estimatedDeadline: 'April 15, 2025',
    initialDeadline: 'March 25, 2025',
    delay: 32,
    industrialCost: 94,
    completion: 85,
  },
  {
    id: 'PRJ-004',
    name: 'Industrial Park',
    location: 'São Paulo, Brazil',
    spi: 1.08,
    cpi: 0.95,
    ev: '€18.5M',
    weeklyRatio: '€750k/week',
    weeklyChange: '+5.1%',
    ppc: 88,
    estimatedFinalCost: 38.2,
    plannedBudget: 40,
    estimatedDeadline: 'March 5, 2025',
    initialDeadline: 'March 20, 2025',
    delay: -30,
    industrialCost: 70,
    completion: 31,
  },
  {
    id: 'PRJ-005',
    name: 'Riverside Homes',
    location: 'Toronto, Canada',
    spi: 0.92,
    cpi: 1.05,
    ev: '€15.2M',
    weeklyRatio: '€620k/week',
    weeklyChange: '-2.3%',
    ppc: 71,
    estimatedFinalCost: 48.5,
    plannedBudget: 45,
    estimatedDeadline: 'April 22, 2025',
    initialDeadline: 'April 5, 2025',
    delay: 28,
    industrialCost: 78,
    completion: 56,
  },
]

type WeekPoint = { week: string; planned: number; estimated: number; actualSolid: number | null; actualDashed: number | null }
type CostPoint  = { week: string; planned: number; estimated: number; actualSolid: number | null; actualDashed: number | null }

// Per-project s-curve data — each project has distinct curves
// actualSolid = confirmed data (W1–W8), actualDashed = forecast segment (W8–W9)
const sCurveDataByProject: Record<string, { progress: WeekPoint[]; cost: CostPoint[] }> = {
  'PRJ-001': {
    progress: [
      { week: 'W1', planned: 6,  estimated: 5,  actualSolid: 4,    actualDashed: null },
      { week: 'W2', planned: 14, estimated: 12, actualSolid: 9,    actualDashed: null },
      { week: 'W3', planned: 25, estimated: 22, actualSolid: 15,   actualDashed: null },
      { week: 'W4', planned: 38, estimated: 34, actualSolid: 24,   actualDashed: null },
      { week: 'W5', planned: 52, estimated: 47, actualSolid: 35,   actualDashed: null },
      { week: 'W6', planned: 66, estimated: 60, actualSolid: 46,   actualDashed: null },
      { week: 'W7', planned: 78, estimated: 71, actualSolid: 57,   actualDashed: null },
      { week: 'W8', planned: 87, estimated: 80, actualSolid: 68,   actualDashed: 68  },
      { week: 'W9', planned: 94, estimated: 88, actualSolid: null, actualDashed: 76  },
    ],
    cost: [
      { week: 'W1', planned: 2.5,  estimated: 2.2,  actualSolid: 1.9,  actualDashed: null },
      { week: 'W2', planned: 5.0,  estimated: 4.5,  actualSolid: 4.0,  actualDashed: null },
      { week: 'W3', planned: 8.5,  estimated: 7.8,  actualSolid: 6.8,  actualDashed: null },
      { week: 'W4', planned: 13.0, estimated: 12.0, actualSolid: 10.5, actualDashed: null },
      { week: 'W5', planned: 18.5, estimated: 17.0, actualSolid: 15.0, actualDashed: null },
      { week: 'W6', planned: 24.5, estimated: 22.5, actualSolid: 20.0, actualDashed: null },
      { week: 'W7', planned: 30.0, estimated: 27.5, actualSolid: 25.0, actualDashed: null },
      { week: 'W8', planned: 35.5, estimated: 32.0, actualSolid: 29.5, actualDashed: 29.5 },
      { week: 'W9', planned: 40.0, estimated: 36.5, actualSolid: null, actualDashed: 34.0 },
    ],
  },
  'PRJ-002': {
    progress: [
      { week: 'W1', planned: 4,  estimated: 4,  actualSolid: 3,    actualDashed: null },
      { week: 'W2', planned: 10, estimated: 9,  actualSolid: 6,    actualDashed: null },
      { week: 'W3', planned: 18, estimated: 16, actualSolid: 10,   actualDashed: null },
      { week: 'W4', planned: 28, estimated: 25, actualSolid: 16,   actualDashed: null },
      { week: 'W5', planned: 40, estimated: 36, actualSolid: 23,   actualDashed: null },
      { week: 'W6', planned: 53, estimated: 47, actualSolid: 30,   actualDashed: null },
      { week: 'W7', planned: 65, estimated: 57, actualSolid: 37,   actualDashed: null },
      { week: 'W8', planned: 76, estimated: 66, actualSolid: 43,   actualDashed: 43  },
      { week: 'W9', planned: 85, estimated: 74, actualSolid: null, actualDashed: 50  },
    ],
    cost: [
      { week: 'W1', planned: 3.5,  estimated: 3.2,  actualSolid: 3.8,  actualDashed: null },
      { week: 'W2', planned: 7.5,  estimated: 7.0,  actualSolid: 8.5,  actualDashed: null },
      { week: 'W3', planned: 13.0, estimated: 12.0, actualSolid: 15.0, actualDashed: null },
      { week: 'W4', planned: 20.0, estimated: 18.5, actualSolid: 23.0, actualDashed: null },
      { week: 'W5', planned: 28.5, estimated: 26.5, actualSolid: 33.0, actualDashed: null },
      { week: 'W6', planned: 38.0, estimated: 35.5, actualSolid: 44.0, actualDashed: null },
      { week: 'W7', planned: 47.5, estimated: 44.0, actualSolid: 55.0, actualDashed: null },
      { week: 'W8', planned: 55.5, estimated: 51.5, actualSolid: 64.0, actualDashed: 64.0 },
      { week: 'W9', planned: 62.0, estimated: 57.5, actualSolid: null, actualDashed: 72.0 },
    ],
  },
  'PRJ-003': {
    progress: [
      { week: 'W1', planned: 7,  estimated: 6,  actualSolid: 5,    actualDashed: null },
      { week: 'W2', planned: 16, estimated: 14, actualSolid: 12,   actualDashed: null },
      { week: 'W3', planned: 28, estimated: 25, actualSolid: 20,   actualDashed: null },
      { week: 'W4', planned: 42, estimated: 37, actualSolid: 32,   actualDashed: null },
      { week: 'W5', planned: 57, estimated: 51, actualSolid: 45,   actualDashed: null },
      { week: 'W6', planned: 70, estimated: 63, actualSolid: 57,   actualDashed: null },
      { week: 'W7', planned: 81, estimated: 73, actualSolid: 68,   actualDashed: null },
      { week: 'W8', planned: 89, estimated: 81, actualSolid: 77,   actualDashed: 77  },
      { week: 'W9', planned: 95, estimated: 88, actualSolid: null, actualDashed: 84  },
    ],
    cost: [
      { week: 'W1', planned: 2.0,  estimated: 1.9,  actualSolid: 2.1,  actualDashed: null },
      { week: 'W2', planned: 4.5,  estimated: 4.3,  actualSolid: 4.8,  actualDashed: null },
      { week: 'W3', planned: 8.0,  estimated: 7.5,  actualSolid: 8.5,  actualDashed: null },
      { week: 'W4', planned: 12.5, estimated: 11.5, actualSolid: 13.0, actualDashed: null },
      { week: 'W5', planned: 18.0, estimated: 16.5, actualSolid: 18.5, actualDashed: null },
      { week: 'W6', planned: 24.0, estimated: 22.0, actualSolid: 25.0, actualDashed: null },
      { week: 'W7', planned: 30.5, estimated: 28.0, actualSolid: 31.5, actualDashed: null },
      { week: 'W8', planned: 36.5, estimated: 33.5, actualSolid: 38.0, actualDashed: 38.0 },
      { week: 'W9', planned: 42.0, estimated: 38.5, actualSolid: null, actualDashed: 44.0 },
    ],
  },
  'PRJ-004': {
    progress: [
      { week: 'W1', planned: 5,  estimated: 5,  actualSolid: 6,    actualDashed: null },
      { week: 'W2', planned: 12, estimated: 11, actualSolid: 14,   actualDashed: null },
      { week: 'W3', planned: 22, estimated: 21, actualSolid: 26,   actualDashed: null },
      { week: 'W4', planned: 34, estimated: 33, actualSolid: 38,   actualDashed: null },
      { week: 'W5', planned: 48, estimated: 46, actualSolid: 52,   actualDashed: null },
      { week: 'W6', planned: 62, estimated: 60, actualSolid: 64,   actualDashed: null },
      { week: 'W7', planned: 74, estimated: 72, actualSolid: 75,   actualDashed: null },
      { week: 'W8', planned: 84, estimated: 82, actualSolid: 84,   actualDashed: 84  },
      { week: 'W9', planned: 92, estimated: 90, actualSolid: null, actualDashed: 91  },
    ],
    cost: [
      { week: 'W1', planned: 1.8,  estimated: 1.7,  actualSolid: 1.7,  actualDashed: null },
      { week: 'W2', planned: 4.0,  estimated: 3.8,  actualSolid: 3.8,  actualDashed: null },
      { week: 'W3', planned: 7.0,  estimated: 6.6,  actualSolid: 6.5,  actualDashed: null },
      { week: 'W4', planned: 11.0, estimated: 10.4, actualSolid: 10.2, actualDashed: null },
      { week: 'W5', planned: 16.0, estimated: 15.2, actualSolid: 14.8, actualDashed: null },
      { week: 'W6', planned: 21.5, estimated: 20.4, actualSolid: 19.8, actualDashed: null },
      { week: 'W7', planned: 27.0, estimated: 25.6, actualSolid: 24.8, actualDashed: null },
      { week: 'W8', planned: 32.0, estimated: 30.4, actualSolid: 29.5, actualDashed: 29.5 },
      { week: 'W9', planned: 36.5, estimated: 34.7, actualSolid: null, actualDashed: 33.5 },
    ],
  },
  'PRJ-005': {
    progress: [
      { week: 'W1', planned: 4,  estimated: 3,  actualSolid: 3,    actualDashed: null },
      { week: 'W2', planned: 9,  estimated: 8,  actualSolid: 7,    actualDashed: null },
      { week: 'W3', planned: 17, estimated: 15, actualSolid: 12,   actualDashed: null },
      { week: 'W4', planned: 27, estimated: 23, actualSolid: 19,   actualDashed: null },
      { week: 'W5', planned: 39, estimated: 34, actualSolid: 28,   actualDashed: null },
      { week: 'W6', planned: 52, estimated: 45, actualSolid: 37,   actualDashed: null },
      { week: 'W7', planned: 64, estimated: 56, actualSolid: 47,   actualDashed: null },
      { week: 'W8', planned: 74, estimated: 65, actualSolid: 55,   actualDashed: 55  },
      { week: 'W9', planned: 83, estimated: 73, actualSolid: null, actualDashed: 62  },
    ],
    cost: [
      { week: 'W1', planned: 2.8,  estimated: 2.5,  actualSolid: 2.6,  actualDashed: null },
      { week: 'W2', planned: 6.0,  estimated: 5.5,  actualSolid: 5.8,  actualDashed: null },
      { week: 'W3', planned: 10.5, estimated: 9.5,  actualSolid: 10.0, actualDashed: null },
      { week: 'W4', planned: 16.0, estimated: 14.5, actualSolid: 15.5, actualDashed: null },
      { week: 'W5', planned: 22.5, estimated: 20.5, actualSolid: 22.0, actualDashed: null },
      { week: 'W6', planned: 30.0, estimated: 27.5, actualSolid: 29.5, actualDashed: null },
      { week: 'W7', planned: 37.5, estimated: 34.5, actualSolid: 37.0, actualDashed: null },
      { week: 'W8', planned: 44.0, estimated: 40.5, actualSolid: 44.0, actualDashed: 44.0 },
      { week: 'W9', planned: 49.5, estimated: 46.0, actualSolid: null, actualDashed: 50.0 },
    ],
  },
}



type IndicatorType = 'weekly-evolution' | 'real-earned-value' | 'cpi' | 'spi' | 'ppc' | 'estimated-cost' | 'estimated-deadline'

function IndicatorCard({ 
  type, 
  project 
}: { 
  type: IndicatorType
  project: ComparisonProject 
}) {
  const colors = useChartColors()
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
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                <XAxis dataKey="week" tick={{ fontSize: 8, fill: colors.tickFillLight }} />
                <YAxis hide />
                <Line type="monotone" dataKey="actualProgress" stroke={colors.isDark ? "#00c8ff" : "#6C5CE7"} strokeWidth={1.5} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )
    case 'real-earned-value':
      return (
        <div className="glass-card rounded-lg p-4">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Accumulated Production</h4>
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
  const colors = useChartColors()

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
      {(() => {
        const curves = sCurveDataByProject[selectedProject.id] ?? sCurveDataByProject['PRJ-001']
        const actualColor = colors.isDark ? "#00ff88" : "#00b894"
        const progressLegend = [
          { value: 'Planned',   type: 'line' as const, color: '#999999'  },
          { value: 'Estimated', type: 'line' as const, color: colors.isDark ? "#00c8ff" : "#6C5CE7" },
          { value: 'Actual',    type: 'line' as const, color: actualColor },
        ]
        const costLegend = [
          { value: 'Planned',   type: 'line' as const, color: '#999999'  },
          { value: 'Estimated', type: 'line' as const, color: colors.isDark ? "#00c8ff" : "#6C5CE7" },
          { value: 'Actual',    type: 'line' as const, color: '#ff6b6b'  },
        ]
        return (
          <>
            <div className="mb-8">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Progress S-Curve</h3>
              <div className="h-40 glass-card rounded-lg p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={curves.progress}>
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                    <XAxis dataKey="week" tick={{ fontSize: 10, fill: colors.tickFill }} />
                    <YAxis tick={{ fontSize: 10, fill: colors.tickFill }} />
                    <Tooltip contentStyle={{ backgroundColor: colors.tooltipBg, border: colors.tooltipBorder }} />
                    <Legend wrapperStyle={{ paddingTop: '8px' }} iconType="line" payload={progressLegend} />
                    <Line type="monotone" dataKey="planned"      stroke="#999999"   strokeWidth={2} dot={false} name="Planned"   />
                    <Line type="monotone" dataKey="estimated"    stroke={colors.isDark ? "#00c8ff" : "#6C5CE7"} strokeWidth={2} dot={false} name="Estimated" />
                    <Line type="monotone" dataKey="actualSolid"  stroke={actualColor} strokeWidth={2} dot={false} name="Actual" connectNulls={false} />
                    <Line type="monotone" dataKey="actualDashed" stroke={actualColor} strokeWidth={2} dot={false} strokeDasharray="6 4" legendType="none" connectNulls={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Cost S-Curve</h3>
              <div className="h-40 glass-card rounded-lg p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={curves.cost}>
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                    <XAxis dataKey="week" tick={{ fontSize: 10, fill: colors.tickFill }} />
                    <YAxis tick={{ fontSize: 10, fill: colors.tickFill }} tickFormatter={(v) => `€${v}M`} />
                    <Tooltip contentStyle={{ backgroundColor: colors.tooltipBg, border: colors.tooltipBorder }} formatter={(v: number) => `€${v.toFixed(1)}M`} />
                    <Legend wrapperStyle={{ paddingTop: '8px' }} iconType="line" payload={costLegend} />
                    <Line type="monotone" dataKey="planned"      stroke="#999999"   strokeWidth={2} dot={false} name="Planned"   />
                    <Line type="monotone" dataKey="estimated"    stroke={colors.isDark ? "#00c8ff" : "#6C5CE7"} strokeWidth={2} dot={false} name="Estimated" />
                    <Line type="monotone" dataKey="actualSolid"  stroke="#ff6b6b"   strokeWidth={2} dot={false} name="Actual" connectNulls={false} />
                    <Line type="monotone" dataKey="actualDashed" stroke="#ff6b6b"   strokeWidth={2} dot={false} strokeDasharray="6 4" legendType="none" connectNulls={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )
      })()}

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
    { value: 'real-earned-value', label: 'Accumulated Production' },
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
