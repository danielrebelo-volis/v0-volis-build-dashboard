'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, MapPin, User, Calendar, Banknote, Activity, Sparkles, Loader2 } from 'lucide-react'
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useChartColors } from '@/hooks/use-chart-colors'

// ─── Data Model ────────────────────────────────────────────────────────────────

interface ComparisonProject {
  id: string
  name: string
  location: string
  typology: string
  pm: string
  deadline: string
  contractValue: number   // M€
  status: 'ongoing' | 'finished'
  // Schedule
  delayDays: number
  spi: number
  accumulatedProduction: number  // M€
  expectedProduction: number     // M€
  // Cost
  ciPlanned: number              // %
  ciAdjusted: number             // %
  ciAnalytical: number           // %
  budgetVariance: number         // M€ (negative = under, positive = over)
  cpi: number
  // Activity
  ppc: number   // 0–100
  tmr: number   // 0–100
  // Legacy fields kept for S-curves
  ev: string
  weeklyRatio: string
  weeklyChange: string
  estimatedFinalCost: number
  plannedBudget: number
  estimatedDeadline: string
  initialDeadline: string
  completion: number
}

const projects: ComparisonProject[] = [
  {
    id: 'PRJ-001', name: 'Metro Tower', location: 'Lisbon, Portugal',
    typology: 'Urban Infrastructure', pm: 'Ana Ferreira', deadline: '2025-03-10', contractValue: 50, status: 'ongoing',
    delayDays: -14, spi: 1.15, accumulatedProduction: 24.1, expectedProduction: 30.1,
    ciPlanned: 82, ciAdjusted: 90, ciAnalytical: 84, budgetVariance: -4.2, cpi: 1.09,
    ppc: 92, tmr: 87,
    ev: '€24.1M', weeklyRatio: '€1.1M/week', weeklyChange: '+6.8%',
    estimatedFinalCost: 45.8, plannedBudget: 50, estimatedDeadline: 'Feb 24, 2025', initialDeadline: 'Mar 10, 2025', completion: 68,
  },
  {
    id: 'PRJ-002', name: 'Harbor Bridge', location: 'Porto, Portugal',
    typology: 'Road Infrastructure', pm: 'Carlos Mendes', deadline: '2025-03-30', contractValue: 60, status: 'ongoing',
    delayDays: 20, spi: 0.88, accumulatedProduction: 31.5, expectedProduction: 39.4,
    ciPlanned: 78, ciAdjusted: 97, ciAnalytical: 91, budgetVariance: 7.2, cpi: 0.89,
    ppc: 65, tmr: 58,
    ev: '€31.5M', weeklyRatio: '€950k/week', weeklyChange: '-1.5%',
    estimatedFinalCost: 67.2, plannedBudget: 60, estimatedDeadline: 'Apr 18, 2025', initialDeadline: 'Mar 30, 2025', completion: 42,
  },
  {
    id: 'PRJ-003', name: 'Skyline Plaza', location: 'Madrid, Spain',
    typology: 'Civil Construction', pm: 'Sofia Ramos', deadline: '2025-03-25', contractValue: 47.5, status: 'ongoing',
    delayDays: 32, spi: 0.85, accumulatedProduction: 28.7, expectedProduction: 35.9,
    ciPlanned: 88, ciAdjusted: 94, ciAnalytical: 88, budgetVariance: 4.5, cpi: 0.92,
    ppc: 78, tmr: 71,
    ev: '€28.7M', weeklyRatio: '€880k/week', weeklyChange: '-3.5%',
    estimatedFinalCost: 52.0, plannedBudget: 47.5, estimatedDeadline: 'Apr 26, 2025', initialDeadline: 'Mar 25, 2025', completion: 85,
  },
  {
    id: 'PRJ-004', name: 'Industrial Park', location: 'Setúbal, Portugal',
    typology: 'Industrial', pm: 'Miguel Costa', deadline: '2025-03-20', contractValue: 40, status: 'ongoing',
    delayDays: -30, spi: 1.08, accumulatedProduction: 18.5, expectedProduction: 23.1,
    ciPlanned: 75, ciAdjusted: 70, ciAnalytical: 65, budgetVariance: -1.8, cpi: 1.05,
    ppc: 88, tmr: 83,
    ev: '€18.5M', weeklyRatio: '€750k/week', weeklyChange: '+5.1%',
    estimatedFinalCost: 38.2, plannedBudget: 40, estimatedDeadline: 'Mar 5, 2025', initialDeadline: 'Mar 20, 2025', completion: 31,
  },
  {
    id: 'PRJ-005', name: 'Riverside Homes', location: 'Maputo, Mozambique',
    typology: 'Hydraulic Infrastructure', pm: 'Laura Nunes', deadline: '2025-04-05', contractValue: 45, status: 'ongoing',
    delayDays: 28, spi: 0.92, accumulatedProduction: 15.2, expectedProduction: 19.0,
    ciPlanned: 80, ciAdjusted: 78, ciAnalytical: 72, budgetVariance: 3.5, cpi: 0.96,
    ppc: 71, tmr: 64,
    ev: '€15.2M', weeklyRatio: '€620k/week', weeklyChange: '-2.3%',
    estimatedFinalCost: 48.5, plannedBudget: 45, estimatedDeadline: 'Apr 22, 2025', initialDeadline: 'Apr 5, 2025', completion: 56,
  },
]

// ─── S-Curve Data ─────────────────────────────────────────────────────────────

type CurvePoint = { week: string; planned: number; estimated: number; actualSolid: number | null; actualDashed: number | null }

const sCurveDataByProject: Record<string, { progress: CurvePoint[]; cost: CurvePoint[] }> = {
  'PRJ-001': {
    progress: [
      { week: 'W1', planned: 6, estimated: 5, actualSolid: 4, actualDashed: null },
      { week: 'W2', planned: 14, estimated: 12, actualSolid: 9, actualDashed: null },
      { week: 'W3', planned: 25, estimated: 22, actualSolid: 15, actualDashed: null },
      { week: 'W4', planned: 38, estimated: 34, actualSolid: 24, actualDashed: null },
      { week: 'W5', planned: 52, estimated: 47, actualSolid: 35, actualDashed: null },
      { week: 'W6', planned: 66, estimated: 60, actualSolid: 46, actualDashed: null },
      { week: 'W7', planned: 78, estimated: 71, actualSolid: 57, actualDashed: null },
      { week: 'W8', planned: 87, estimated: 80, actualSolid: 68, actualDashed: 68 },
      { week: 'W9', planned: 94, estimated: 88, actualSolid: null, actualDashed: 76 },
    ],
    cost: [
      { week: 'W1', planned: 2.5, estimated: 2.2, actualSolid: 1.9, actualDashed: null },
      { week: 'W2', planned: 5.0, estimated: 4.5, actualSolid: 4.0, actualDashed: null },
      { week: 'W3', planned: 8.5, estimated: 7.8, actualSolid: 6.8, actualDashed: null },
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
      { week: 'W1', planned: 4, estimated: 4, actualSolid: 3, actualDashed: null },
      { week: 'W2', planned: 10, estimated: 9, actualSolid: 6, actualDashed: null },
      { week: 'W3', planned: 18, estimated: 16, actualSolid: 10, actualDashed: null },
      { week: 'W4', planned: 28, estimated: 25, actualSolid: 16, actualDashed: null },
      { week: 'W5', planned: 40, estimated: 36, actualSolid: 23, actualDashed: null },
      { week: 'W6', planned: 53, estimated: 47, actualSolid: 30, actualDashed: null },
      { week: 'W7', planned: 65, estimated: 57, actualSolid: 37, actualDashed: null },
      { week: 'W8', planned: 76, estimated: 66, actualSolid: 43, actualDashed: 43 },
      { week: 'W9', planned: 85, estimated: 74, actualSolid: null, actualDashed: 50 },
    ],
    cost: [
      { week: 'W1', planned: 3.5, estimated: 3.2, actualSolid: 3.8, actualDashed: null },
      { week: 'W2', planned: 7.5, estimated: 7.0, actualSolid: 8.5, actualDashed: null },
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
      { week: 'W1', planned: 7, estimated: 6, actualSolid: 5, actualDashed: null },
      { week: 'W2', planned: 16, estimated: 14, actualSolid: 12, actualDashed: null },
      { week: 'W3', planned: 28, estimated: 25, actualSolid: 20, actualDashed: null },
      { week: 'W4', planned: 42, estimated: 37, actualSolid: 32, actualDashed: null },
      { week: 'W5', planned: 57, estimated: 51, actualSolid: 45, actualDashed: null },
      { week: 'W6', planned: 70, estimated: 63, actualSolid: 57, actualDashed: null },
      { week: 'W7', planned: 81, estimated: 73, actualSolid: 68, actualDashed: null },
      { week: 'W8', planned: 89, estimated: 81, actualSolid: 77, actualDashed: 77 },
      { week: 'W9', planned: 95, estimated: 88, actualSolid: null, actualDashed: 84 },
    ],
    cost: [
      { week: 'W1', planned: 2.0, estimated: 1.9, actualSolid: 2.1, actualDashed: null },
      { week: 'W2', planned: 4.5, estimated: 4.3, actualSolid: 4.8, actualDashed: null },
      { week: 'W3', planned: 8.0, estimated: 7.5, actualSolid: 8.5, actualDashed: null },
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
      { week: 'W1', planned: 5, estimated: 5, actualSolid: 6, actualDashed: null },
      { week: 'W2', planned: 12, estimated: 11, actualSolid: 14, actualDashed: null },
      { week: 'W3', planned: 22, estimated: 21, actualSolid: 26, actualDashed: null },
      { week: 'W4', planned: 34, estimated: 33, actualSolid: 38, actualDashed: null },
      { week: 'W5', planned: 48, estimated: 46, actualSolid: 52, actualDashed: null },
      { week: 'W6', planned: 62, estimated: 60, actualSolid: 64, actualDashed: null },
      { week: 'W7', planned: 74, estimated: 72, actualSolid: 75, actualDashed: null },
      { week: 'W8', planned: 84, estimated: 82, actualSolid: 84, actualDashed: 84 },
      { week: 'W9', planned: 92, estimated: 90, actualSolid: null, actualDashed: 91 },
    ],
    cost: [
      { week: 'W1', planned: 1.8, estimated: 1.7, actualSolid: 1.7, actualDashed: null },
      { week: 'W2', planned: 4.0, estimated: 3.8, actualSolid: 3.8, actualDashed: null },
      { week: 'W3', planned: 7.0, estimated: 6.6, actualSolid: 6.5, actualDashed: null },
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
      { week: 'W1', planned: 4, estimated: 3, actualSolid: 3, actualDashed: null },
      { week: 'W2', planned: 9, estimated: 8, actualSolid: 7, actualDashed: null },
      { week: 'W3', planned: 17, estimated: 15, actualSolid: 12, actualDashed: null },
      { week: 'W4', planned: 27, estimated: 23, actualSolid: 19, actualDashed: null },
      { week: 'W5', planned: 39, estimated: 34, actualSolid: 28, actualDashed: null },
      { week: 'W6', planned: 52, estimated: 45, actualSolid: 37, actualDashed: null },
      { week: 'W7', planned: 64, estimated: 56, actualSolid: 47, actualDashed: null },
      { week: 'W8', planned: 74, estimated: 65, actualSolid: 55, actualDashed: 55 },
      { week: 'W9', planned: 83, estimated: 73, actualSolid: null, actualDashed: 62 },
    ],
    cost: [
      { week: 'W1', planned: 2.8, estimated: 2.5, actualSolid: 2.6, actualDashed: null },
      { week: 'W2', planned: 6.0, estimated: 5.5, actualSolid: 5.8, actualDashed: null },
      { week: 'W3', planned: 10.5, estimated: 9.5, actualSolid: 10.0, actualDashed: null },
      { week: 'W4', planned: 16.0, estimated: 14.5, actualSolid: 15.5, actualDashed: null },
      { week: 'W5', planned: 22.5, estimated: 20.5, actualSolid: 22.0, actualDashed: null },
      { week: 'W6', planned: 30.0, estimated: 27.5, actualSolid: 29.5, actualDashed: null },
      { week: 'W7', planned: 37.5, estimated: 34.5, actualSolid: 37.0, actualDashed: null },
      { week: 'W8', planned: 44.0, estimated: 40.5, actualSolid: 44.0, actualDashed: 44.0 },
      { week: 'W9', planned: 49.5, estimated: 46.0, actualSolid: null, actualDashed: 50.0 },
    ],
  },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function icColor(v: number) {
  if (v < 85) return '#16a34a'
  if (v < 95) return '#d97706'
  return '#dc2626'
}
function spiColor(v: number) { return v >= 1 ? '#16a34a' : v >= 0.9 ? '#d97706' : '#dc2626' }
function cpiColor(v: number) { return v >= 1 ? '#16a34a' : v >= 0.9 ? '#d97706' : '#dc2626' }
function ppcColor(v: number) { return v >= 80 ? '#16a34a' : v >= 65 ? '#d97706' : '#dc2626' }

function StatRow({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/20 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="text-right">
        <span className="text-sm font-semibold" style={color ? { color } : undefined}>{value}</span>
        {sub && <div className="text-[10px] text-muted-foreground">{sub}</div>}
      </div>
    </div>
  )
}

// ─── Project Info Card ────────────────────────────────────────────────────────

function ProjectInfoCard({ project }: { project: ComparisonProject }) {
  const statusColor = project.status === 'ongoing' ? '#16a34a' : '#6b7280'
  return (
    <div className="glass-card rounded-lg p-4 mb-4">
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        <div className="flex items-center gap-2">
          <Activity className="w-3 h-3 text-muted-foreground shrink-0" />
          <span className="text-[11px] text-muted-foreground">Typology</span>
          <span className="text-[11px] font-medium text-foreground ml-auto">{project.typology}</span>
        </div>
        <div className="flex items-center gap-2">
          <User className="w-3 h-3 text-muted-foreground shrink-0" />
          <span className="text-[11px] text-muted-foreground">PM</span>
          <span className="text-[11px] font-medium text-foreground ml-auto">{project.pm}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-3 h-3 text-muted-foreground shrink-0" />
          <span className="text-[11px] text-muted-foreground">Deadline</span>
          <span className="text-[11px] font-medium text-foreground ml-auto">{project.deadline}</span>
        </div>
        <div className="flex items-center gap-2">
          <Banknote className="w-3 h-3 text-muted-foreground shrink-0" />
          <span className="text-[11px] text-muted-foreground">Contract</span>
          <span className="text-[11px] font-medium text-foreground ml-auto">€{project.contractValue}M</span>
        </div>
        <div className="flex items-center gap-2 col-span-2">
          <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
          <span className="text-[11px] text-muted-foreground">Status</span>
          <span className="text-[11px] font-semibold ml-auto capitalize" style={{ color: statusColor }}>{project.status}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Indicator Sections ───────────────────────────────────────────────────────

function ScheduleSection({ project, maxWeek }: { project: ComparisonProject; maxWeek: number }) {
  const prodPct = Math.round((project.accumulatedProduction / project.expectedProduction) * 100)
  return (
    <div className="glass-card rounded-lg p-4 space-y-0">
      <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 mb-1">Schedule</h4>
      <StatRow
        label="Delay"
        value={`${project.delayDays > 0 ? '+' : ''}${project.delayDays} days`}
        color={project.delayDays <= 0 ? '#16a34a' : project.delayDays < 15 ? '#d97706' : '#dc2626'}
      />
      <StatRow
        label="SPI"
        value={project.spi.toFixed(2)}
        sub={project.spi >= 1 ? 'Ahead of schedule' : 'Behind schedule'}
        color={spiColor(project.spi)}
      />
      <StatRow
        label="Accumulated Production"
        value={`€${project.accumulatedProduction.toFixed(1)}M`}
        sub={`${prodPct}% of expected (€${project.expectedProduction.toFixed(1)}M)`}
        color={prodPct >= 90 ? '#16a34a' : prodPct >= 75 ? '#d97706' : '#dc2626'}
      />
    </div>
  )
}

function CostSection({ project }: { project: ComparisonProject }) {
  const varColor = project.budgetVariance <= 0 ? '#16a34a' : project.budgetVariance < 3 ? '#d97706' : '#dc2626'
  return (
    <div className="glass-card rounded-lg p-4 space-y-0">
      <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 mb-1">Cost</h4>
      <StatRow label="CI Planned" value={`${project.ciPlanned}%`} color={icColor(project.ciPlanned)} />
      <StatRow label="CI Adjusted" value={`${project.ciAdjusted}%`} color={icColor(project.ciAdjusted)} />
      <StatRow label="CI Analytical" value={`${project.ciAnalytical}%`} color={icColor(project.ciAnalytical)} />
      <StatRow
        label="Budget Variance"
        value={`${project.budgetVariance > 0 ? '+' : ''}€${project.budgetVariance.toFixed(1)}M`}
        sub={project.budgetVariance <= 0 ? 'Under budget' : 'Over budget'}
        color={varColor}
      />
      <StatRow
        label="CPI"
        value={project.cpi.toFixed(2)}
        sub={project.cpi >= 1 ? 'Under budget' : 'Over budget'}
        color={cpiColor(project.cpi)}
      />
    </div>
  )
}

function ActivitySection({ project }: { project: ComparisonProject }) {
  return (
    <div className="glass-card rounded-lg p-4 space-y-0">
      <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 mb-1">Activity Progress</h4>
      <StatRow
        label="PPC — Plan Percent Complete"
        value={`${project.ppc}%`}
        sub="% of planned tasks completed"
        color={ppcColor(project.ppc)}
      />
      <StatRow
        label="TMR — Tasks Made Ready"
        value={`${project.tmr}%`}
        sub="% of tasks prepared for execution"
        color={ppcColor(project.tmr)}
      />
    </div>
  )
}

// ─── S-Curve Charts ───────────────────────────────────────────────────────────

const ACTIVITIES = [
  { value: 'all', label: 'All Activities' },
  { value: 'a1', label: 'A1 - Site Prep' },
  { value: 'a2', label: 'A2 - Foundation' },
  { value: 'a3', label: 'A3 - Structure' },
]
const WORKFRONTS = [
  { value: 'all', label: 'All Workfronts' },
  { value: 'section1', label: 'Section 1' },
  { value: 'section2', label: 'Section 2' },
]
const OWNERS = [
  { value: 'all', label: 'All Owners' },
  { value: 'owner1', label: 'Mota-Engil' },
  { value: 'owner2', label: 'Subcontractor 1' },
]
const COST_TYPES = [
  { value: 'all', label: 'All Cost Types' },
  { value: 'labour', label: 'Labour' },
  { value: 'materials', label: 'Materials' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'indirect', label: 'Indirect' },
]
const costTypeMultipliers: Record<string, number> = { all: 1, labour: 0.38, materials: 0.25, equipment: 0.16, indirect: 0.11 }

function FilterSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="text-xs h-7 px-2 rounded-md border border-border/50 bg-secondary text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}

function SCurves({ project, maxWeek }: { project: ComparisonProject; maxWeek: number }) {
  const colors = useChartColors()
  const [progressActivity, setProgressActivity] = useState('all')
  const [progressWorkfront, setProgressWorkfront] = useState('all')
  const [progressOwner, setProgressOwner] = useState('all')
  const [costActivity, setCostActivity] = useState('all')
  const [costWorkfront, setCostWorkfront] = useState('all')
  const [costType, setCostType] = useState('all')

  const base = sCurveDataByProject[project.id] ?? sCurveDataByProject['PRJ-001']
  const WEEKS = ['W1','W2','W3','W4','W5','W6','W7','W8','W9']
  const sliceIdx = maxWeek // 1-based, W1=1..W9=9
  const slicedProgress = base.progress.slice(0, sliceIdx)
  const slicedCost = base.cost.slice(0, sliceIdx)

  const actualColor = '#00b894'
  const filtered = (progressActivity !== 'all' || progressWorkfront !== 'all' || progressOwner !== 'all')
    ? slicedProgress.map(d => {
        const f = 0.82 + (progressActivity.charCodeAt(progressActivity.length - 1) % 10) * 0.018
        return { ...d, actualSolid: d.actualSolid != null ? +(d.actualSolid * f).toFixed(1) : null, actualDashed: d.actualDashed != null ? +(d.actualDashed * f).toFixed(1) : null, estimated: +(d.estimated * (f + 0.05)).toFixed(1) }
      })
    : slicedProgress

  const ctMul = costTypeMultipliers[costType] ?? 1
  const costFiltered = (costActivity !== 'all' || costWorkfront !== 'all' || costType !== 'all')
    ? slicedCost.map(d => {
        const scale = ctMul * (costActivity !== 'all' ? 0.88 : 1) * (costWorkfront !== 'all' ? 0.93 : 1)
        return { ...d, planned: +(d.planned * scale).toFixed(2), estimated: +(d.estimated * scale).toFixed(2), actualSolid: d.actualSolid != null ? +(d.actualSolid * scale).toFixed(2) : null, actualDashed: d.actualDashed != null ? +(d.actualDashed * scale).toFixed(2) : null }
      })
    : slicedCost

  const baselineColor = colors.isDark ? '#00c8ff' : '#6C5CE7'
  const legendProgress = [{ value: 'Commercial', type: 'line' as const, color: '#999' }, { value: 'Current Baseline', type: 'line' as const, color: baselineColor }, { value: 'Actual', type: 'line' as const, color: actualColor }]
  const legendCost = [{ value: 'Commercial', type: 'line' as const, color: '#999' }, { value: 'Current Baseline', type: 'line' as const, color: baselineColor }, { value: 'Actual', type: 'line' as const, color: '#ff6b6b' }]

  return (
    <>
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Progress S-Curve</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          <FilterSelect value={progressActivity} onChange={setProgressActivity} options={ACTIVITIES} />
          <FilterSelect value={progressWorkfront} onChange={setProgressWorkfront} options={WORKFRONTS} />
          <FilterSelect value={progressOwner} onChange={setProgressOwner} options={OWNERS} />
        </div>
        <div className="h-44 glass-card rounded-lg p-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={filtered}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: colors.tickFill }} />
              <YAxis tick={{ fontSize: 10, fill: colors.tickFill }} />
              <Tooltip contentStyle={{ backgroundColor: colors.tooltipBg, border: colors.tooltipBorder }} />
              <Legend wrapperStyle={{ paddingTop: 8 }} iconType="line" payload={legendProgress} />
              <Line type="monotone" dataKey="planned" stroke="#999" strokeWidth={2} dot={false} name="Commercial" />
              <Line type="monotone" dataKey="estimated" stroke={baselineColor} strokeWidth={2} dot={false} name="Current Baseline" />
              <Line type="monotone" dataKey="actualSolid" stroke={actualColor} strokeWidth={2} dot={false} name="Actual" connectNulls={false} />
              <Line type="monotone" dataKey="actualDashed" stroke={actualColor} strokeWidth={2} dot={false} strokeDasharray="6 4" legendType="none" connectNulls={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Cost S-Curve</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          <FilterSelect value={costActivity} onChange={setCostActivity} options={ACTIVITIES} />
          <FilterSelect value={costWorkfront} onChange={setCostWorkfront} options={WORKFRONTS} />
          <FilterSelect value={costType} onChange={setCostType} options={COST_TYPES} />
        </div>
        <div className="h-44 glass-card rounded-lg p-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={costFiltered}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: colors.tickFill }} />
              <YAxis tick={{ fontSize: 10, fill: colors.tickFill }} tickFormatter={v => `€${v}M`} />
              <Tooltip contentStyle={{ backgroundColor: colors.tooltipBg, border: colors.tooltipBorder }} formatter={(v: number) => `€${v.toFixed(1)}M`} />
              <Legend wrapperStyle={{ paddingTop: 8 }} iconType="line" payload={legendCost} />
              <Line type="monotone" dataKey="planned" stroke="#999" strokeWidth={2} dot={false} name="Commercial" />
              <Line type="monotone" dataKey="estimated" stroke={baselineColor} strokeWidth={2} dot={false} name="Current Baseline" />
              <Line type="monotone" dataKey="actualSolid" stroke="#ff6b6b" strokeWidth={2} dot={false} name="Actual" connectNulls={false} />
              <Line type="monotone" dataKey="actualDashed" stroke="#ff6b6b" strokeWidth={2} dot={false} strokeDasharray="6 4" legendType="none" connectNulls={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  )
}

// ─── AI Insight Panel ─────────────────────────────────────────────────────────

function AIInsightPanel({ projectA, projectB, activeCategories }: {
  projectA: ComparisonProject
  projectB: ComparisonProject
  activeCategories: string[]
}) {
  const [insight, setInsight] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const fetchInsight = async () => {
    if (open && insight) { setOpen(false); return }
    setOpen(true)
    setLoading(true)
    setInsight('')

    const res = await fetch('/api/compare-projects', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ projectA, projectB, activeCategories }),
    })

    const reader = res.body?.getReader()
    const decoder = new TextDecoder()
    if (!reader) { setLoading(false); return }

    let buffer = ''
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''
      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed.startsWith('data:')) {
          const data = trimmed.slice(5).trim()
          if (data === '[DONE]') continue
          try {
            const parsed = JSON.parse(data)
            if (parsed.type === 'text-delta' && parsed.delta) {
              setInsight(prev => prev + parsed.delta)
            }
          } catch { /* skip */ }
        }
      }
    }
    setLoading(false)
  }

  return (
    <div className="mt-6">
      <button
        onClick={fetchInsight}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border/40 bg-background hover:bg-secondary/30 transition-colors text-sm font-medium text-foreground"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /> : <Sparkles className="w-4 h-4 text-amber-500" />}
        {loading ? 'Generating insight...' : open && insight ? 'Hide AI Insight' : 'AI Insight — Compare Projects'}
      </button>

      {open && (
        <div className="mt-3 glass-card rounded-lg p-4 border border-amber-500/20">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500/80">AI Analysis</span>
            <span className="text-[10px] text-muted-foreground ml-auto">Comparing {projectA.name} vs {projectB.name}</span>
          </div>
          {loading && !insight && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Analysing project data...</span>
            </div>
          )}
          {insight && (
            <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap">{insight}</p>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Comparison Side ──────────────────────────────────────────────────────────

type CategoryKey = 'schedule' | 'cost' | 'activity'

function ComparisonSide({
  selectedProject,
  otherProject,
  onProjectChange,
  activeCategories,
  maxWeek,
}: {
  selectedProject: ComparisonProject
  otherProject: ComparisonProject
  onProjectChange: (p: ComparisonProject) => void
  activeCategories: CategoryKey[]
  maxWeek: number
}) {
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <div className="flex-1 min-w-0">
      {/* Project selector */}
      <div className="relative mb-4">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-full flex items-center justify-between px-4 py-3 border border-foreground/20 rounded-lg hover:bg-secondary/20 transition-colors"
        >
          <div className="text-left">
            <div className="text-sm font-semibold text-foreground">{selectedProject.name}</div>
            <div className="text-xs text-muted-foreground">{selectedProject.location}</div>
          </div>
          <ChevronDown className={`w-4 h-4 text-foreground transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
        </button>
        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 border border-border/40 rounded-lg bg-background z-50 shadow-lg">
            {projects.map(p => (
              <button key={p.id} onClick={() => { onProjectChange(p); setShowDropdown(false) }}
                className="w-full text-left px-4 py-2.5 hover:bg-secondary/30 transition-colors border-b border-border/20 last:border-b-0">
                <div className="text-sm font-medium text-foreground">{p.name}</div>
                <div className="text-xs text-muted-foreground">{p.location}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Project info card */}
      <ProjectInfoCard project={selectedProject} />

      {/* S-curves */}
      <SCurves project={selectedProject} maxWeek={maxWeek} />

      {/* Active category indicator sections */}
      <div className="space-y-4">
        {activeCategories.includes('schedule') && <ScheduleSection project={selectedProject} maxWeek={maxWeek} />}
        {activeCategories.includes('cost') && <CostSection project={selectedProject} />}
        {activeCategories.includes('activity') && <ActivitySection project={selectedProject} />}
      </div>

      {/* AI Insight button */}
      <AIInsightPanel
        projectA={selectedProject}
        projectB={otherProject}
        activeCategories={activeCategories}
      />
    </div>
  )
}

// ─── Multi-select Category Dropdown ──────────────────────────────────────────

const CATEGORIES: { value: CategoryKey; label: string }[] = [
  { value: 'schedule', label: 'Schedule' },
  { value: 'cost', label: 'Cost' },
  { value: 'activity', label: 'Activity Progress' },
]

function CategoryDropdown({ selected, onChange }: { selected: CategoryKey[]; onChange: (v: CategoryKey[]) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const toggle = (val: CategoryKey) => {
    if (selected.includes(val)) {
      if (selected.length === 1) return // keep at least one
      onChange(selected.filter(v => v !== val))
    } else {
      onChange([...selected, val])
    }
  }

  const label = selected.length === 3 ? 'All Indicators' : CATEGORIES.filter(c => selected.includes(c.value)).map(c => c.label).join(', ')

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/40 bg-background text-sm font-medium text-foreground hover:bg-secondary/20 transition-colors"
      >
        <span>{label}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 w-52 border border-border/40 rounded-lg bg-background shadow-lg z-50 p-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => toggle(cat.value)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-secondary/30 transition-colors text-sm text-left"
            >
              <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${selected.includes(cat.value) ? 'bg-foreground border-foreground' : 'border-border/60'}`}>
                {selected.includes(cat.value) && (
                  <svg className="w-2.5 h-2.5 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={selected.includes(cat.value) ? 'text-foreground font-medium' : 'text-muted-foreground'}>{cat.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export function ProjectComparison() {
  const [leftProject, setLeftProject] = useState<ComparisonProject>(projects[0])
  const [rightProject, setRightProject] = useState<ComparisonProject>(projects[1])
  const [activeCategories, setActiveCategories] = useState<CategoryKey[]>(['schedule'])
  const [maxWeek, setMaxWeek] = useState<number>(9)

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="border-b border-border/50 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Project Comparison</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Side-by-side performance analysis</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Indicator multi-select */}
          <CategoryDropdown selected={activeCategories} onChange={setActiveCategories} />

          {/* Week filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Up to</span>
            <div className="flex items-center rounded-md border border-border/40 bg-background p-0.5 text-xs font-medium">
              {[1,2,3,4,5,6,7,8,9].map(w => (
                <button key={w} onClick={() => setMaxWeek(w)}
                  className={`w-7 h-6 rounded flex items-center justify-center transition-all ${maxWeek === w ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`}>
                  W{w}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Two-column comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ComparisonSide
            selectedProject={leftProject}
            otherProject={rightProject}
            onProjectChange={setLeftProject}
            activeCategories={activeCategories}
            maxWeek={maxWeek}
          />
          <ComparisonSide
            selectedProject={rightProject}
            otherProject={leftProject}
            onProjectChange={setRightProject}
            activeCategories={activeCategories}
            maxWeek={maxWeek}
          />
        </div>
      </div>
    </div>
  )
}
