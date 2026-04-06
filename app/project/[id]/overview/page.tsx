'use client'

import { useState, useRef, useEffect } from 'react'
import { DashboardHeader } from '@/components/dashboard-header'
import { ArrowLeft, Download, TrendingUp, ChevronDown, GanttChartSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GanttChartDialog } from '@/components/gantt-chart-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from 'next/link'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { useChartColors } from '@/hooks/use-chart-colors'

// ─── Baseline Filter ──────────────────────────────────────────────────────────
const BASELINE_OPTIONS = [
  { value: 'last', label: 'Last Imported Baseline' },
  { value: 'sep25', label: 'Baseline X September 2025' },
  { value: 'may25', label: 'Baseline X May 2025' },
]

function BaselineFilter({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-muted-foreground uppercase tracking-wide whitespace-nowrap">Current Baseline:</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none pl-2.5 pr-7 py-1 text-xs font-medium rounded-md border border-border/50 bg-secondary text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-cyan"
        >
          {BASELINE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
      </div>
    </div>
  )
}

// ─── Economic Table Row with hover popover ────────────────────────────────────
type EconRow = {
  activity: string
  status: string
  completeness: number
  currentCost: number
  commercialIC: number
  projectedIC: number
  currentIC: number
  weeklyCosts: { week: string; labour: number; materials: number; subcontracted: number }[]
}

// Shared demo weekly cost data (same for all rows — prototype)
const DEMO_WEEKLY_COSTS = [
  { week: 'W6', labour: 0.18, materials: 0.14, subcontracted: 0.07 },
  { week: 'W7', labour: 0.20, materials: 0.13, subcontracted: 0.06 },
  { week: 'W8', labour: 0.17, materials: 0.15, subcontracted: 0.08 },
  { week: 'W9', labour: 0.19, materials: 0.12, subcontracted: 0.07 },
]

const COST_NATURE_COLORS = [
  { key: 'labour', label: 'Labour', color: '#a0a0a0' },
  { key: 'materials', label: 'Materials', color: '#00c8ff' },
  { key: 'subcontracted', label: 'Subcontracted', color: '#ff6b6b' },
]

function EconomicTableRow({
  row,
  economicValue,
  chartColors,
}: {
  row: EconRow
  economicValue: number
  chartColors: ReturnType<typeof useChartColors>
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLTableCellElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Max value across all weeks for Y scale
  const maxVal = Math.max(...DEMO_WEEKLY_COSTS.flatMap(w => [w.labour, w.materials, w.subcontracted]))
  const chartH = 100
  const chartW = 264
  const barGroupW = chartW / DEMO_WEEKLY_COSTS.length
  const barW = 10
  const barGap = 2
  const paddingLeft = 36
  const paddingBottom = 20
  const innerH = chartH - paddingBottom
  const innerW = chartW - paddingLeft

  const isNotStarted = row.status === 'Not Started'
  const displayCompleteness = isNotStarted ? 0 : row.completeness
  const displayCost = isNotStarted ? 0 : row.currentCost

  return (
    <tr className="border-b border-border/30 hover:bg-secondary/20">
      <td className="py-3 text-foreground font-medium">{row.activity}</td>
      <td className="py-3 text-right text-foreground">€{economicValue.toFixed(1)}M</td>
      <td className="py-3 text-right">
        <span className={`text-xs px-2 py-0.5 rounded-full ${row.status === 'Finished' ? 'bg-[#16a34a]/15 text-[#16a34a]' :
          row.status === 'Ongoing' ? 'bg-accent/20 text-accent' :
            'bg-muted/30 text-muted-foreground'
          }`}>{row.status}</span>
      </td>
      <td className="py-3 text-right text-foreground">{displayCompleteness}%</td>
      <td className="py-3 text-right text-foreground">€{displayCost.toFixed(2)}M</td>
      <td className="py-3 text-right text-foreground">{row.commercialIC}%</td>
      <td className="py-3 text-right text-foreground">{row.projectedIC}%</td>
      <td className="py-3 text-right text-foreground">{row.currentIC}%</td>

      {/* Three-dot — click to toggle */}
      <td ref={ref} className="py-3 text-right relative">
        <button
          onClick={() => setOpen(v => !v)}
          className={`p-1 rounded transition-colors ${open ? 'bg-secondary/60 text-foreground' : 'hover:bg-secondary/40 text-muted-foreground'}`}
          aria-label="Weekly cost breakdown"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <circle cx="4" cy="10" r="1.5" /><circle cx="10" cy="10" r="1.5" /><circle cx="16" cy="10" r="1.5" />
          </svg>
        </button>

        {open && (
          <div className="absolute right-0 bottom-full mb-2 z-50 bg-background border border-border/50 rounded-lg shadow-xl p-4"
            style={{ width: chartW + paddingLeft + 8 }}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
              Weekly Costs by Nature — Last 4 Weeks
            </p>

            {/* SVG bar chart — fixed size, no ResizeObserver issues */}
            <svg width={chartW} height={chartH} className="overflow-visible">
              {/* Y grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map(t => {
                const y = innerH - t * innerH
                return (
                  <g key={t}>
                    <line x1={paddingLeft} y1={y} x2={chartW} y2={y}
                      stroke={chartColors.grid} strokeWidth={0.5} strokeDasharray="3 3" />
                    <text x={paddingLeft - 4} y={y + 3} textAnchor="end"
                      fontSize={8} fill={chartColors.axis}>
                      {(t * maxVal).toFixed(2)}
                    </text>
                  </g>
                )
              })}

              {/* Bars */}
              {DEMO_WEEKLY_COSTS.map((week, wi) => {
                const groupX = paddingLeft + wi * (innerW / DEMO_WEEKLY_COSTS.length) + (innerW / DEMO_WEEKLY_COSTS.length - (barW + barGap) * 3) / 2
                return (
                  <g key={week.week}>
                    {COST_NATURE_COLORS.map((nat, ni) => {
                      const val = week[nat.key as keyof typeof week] as number
                      const bh = (val / maxVal) * innerH
                      const bx = groupX + ni * (barW + barGap)
                      const by = innerH - bh
                      return (
                        <rect key={nat.key} x={bx} y={by} width={barW} height={bh}
                          fill={nat.color} rx={2} opacity={0.9} />
                      )
                    })}
                    {/* X label */}
                    <text x={groupX + ((barW + barGap) * 3) / 2 - barGap} y={innerH + 14}
                      textAnchor="middle" fontSize={9} fill={chartColors.axis}>
                      {week.week}
                    </text>
                  </g>
                )
              })}
            </svg>

            {/* Legend */}
            <div className="flex items-center gap-3 mt-2">
              {COST_NATURE_COLORS.map(l => (
                <div key={l.key} className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: l.color }} />
                  <span className="text-[10px] text-muted-foreground">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </td>
    </tr>
  )
}

export default function ProjectOverview({ params }: { params: { id: string } }) {
  const chartColors = useChartColors()
  const [ganttOpen, setGanttOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedActivity, setSelectedActivity] = useState('all')
  const [selectedWorkfront, setSelectedWorkfront] = useState('all')
  const [selectedOwner, setSelectedOwner] = useState('all')
  const [selectedCostMonth, setSelectedCostMonth] = useState('last-month')
  const [selectedCostType, setSelectedCostType] = useState('all')
  const [sortBy, setSortBy] = useState<'value' | 'plannedProgress' | 'actualProgress' | 'accumulatedProduction' | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [economicSortBy, setEconomicSortBy] = useState<'baselineCost' | 'actualCost' | 'totalBaseline' | 'totalEstimated' | null>(null)
  const [economicSortDirection, setEconomicSortDirection] = useState<'asc' | 'desc'>('desc')
  const [progressBaseline, setProgressBaseline] = useState('last')
  const [economicBaseline, setEconomicBaseline] = useState('last')

  // Data Quality Tab State
  const [dailyReportViewBy, setDailyReportViewBy] = useState('7days')
  const [dailyReportDateRange, setDailyReportDateRange] = useState({ start: '', end: '' })
  const [shiftViewBy, setShiftViewBy] = useState('7days')
  const [activityViewBy, setActivityViewBy] = useState('7days')
  const [shiftDateRange, setShiftDateRange] = useState({ start: '', end: '' })
  const [activityDateRange, setActivityDateRange] = useState({ start: '', end: '' })

  const project = {
    name: 'Metro Tower Development',
    city: 'Lisbon',
    country: 'Portugal',
    typology: 'Civil Construction',
    client: 'Investor Group ABC',
    contractValue: '€24.5M',
    manager: 'John Silva',
  }

  const progressData = [
    { week: '1', planned: 5, estimated: 4, actual: 3, actualSolid: 3, actualDashed: null },
    { week: '2', planned: 10, estimated: 8, actual: 5, actualSolid: 5, actualDashed: null },
    { week: '3', planned: 15, estimated: 14, actual: 8, actualSolid: 8, actualDashed: null },
    { week: '4', planned: 20, estimated: 18, actual: 12, actualSolid: 12, actualDashed: null },
    { week: '5', planned: 28, estimated: 26, actual: 18, actualSolid: 18, actualDashed: null },
    { week: '6', planned: 36, estimated: 34, actual: 25, actualSolid: 25, actualDashed: null },
    { week: '7', planned: 45, estimated: 42, actual: 34, actualSolid: 34, actualDashed: null },
    { week: '8', planned: 55, estimated: 51, actual: 45, actualSolid: 45, actualDashed: 45 },
    { week: '9', planned: 65, estimated: 60, actual: 50, actualSolid: null, actualDashed: 50 },
  ]

  const costData = [
    { week: '1', baseline: 3.2, currentBaseline: 3.0, actualSolid: 3.3, actualDashed: null },
    { week: '2', baseline: 6.1, currentBaseline: 5.8, actualSolid: 7.0, actualDashed: null },
    { week: '3', baseline: 9.2, currentBaseline: 8.8, actualSolid: 10.3, actualDashed: null },
    { week: '4', baseline: 12.4, currentBaseline: 12.0, actualSolid: 14.1, actualDashed: null },
    { week: '5', baseline: 15.1, currentBaseline: 14.8, actualSolid: 18.0, actualDashed: null },
    { week: '6', baseline: 19.1, currentBaseline: 18.5, actualSolid: 22.5, actualDashed: null },
    { week: '7', baseline: 24.6, currentBaseline: 23.8, actualSolid: 27.5, actualDashed: null },
    { week: '8', baseline: 28.4, currentBaseline: 27.5, actualSolid: 33.3, actualDashed: 33.3 },
    { week: '9', baseline: 33.5, currentBaseline: 32.0, actualSolid: null, actualDashed: 40.0 },
  ]

  const getFilteredProgressData = () => {
    if (selectedActivity === 'all' && selectedWorkfront === 'all' && selectedOwner === 'all') {
      return progressData
    }
    return progressData.map(d => {
      const factor = Math.random() * 0.3 + 0.7
      return {
        ...d,
        actual: d.actual != null ? Math.max(d.actual * 0.8, d.actual * factor) : null,
        actualSolid: d.actualSolid != null ? Math.max(d.actualSolid * 0.8, d.actualSolid * factor) : null,
        actualDashed: d.actualDashed != null ? Math.max(d.actualDashed * 0.8, d.actualDashed * factor) : null,
        estimated: d.estimated * 0.9,
      }
    })
  }

  const costTypeMultipliers: Record<string, number> = {
    all: 1.0,
    labour: 0.38,
    materials: 0.25,
    equipment: 0.16,
    indirect: 0.11,
    subcontracted: 0.10,
  }

  const getFilteredCostData = () => {
    const ctScale = costTypeMultipliers[selectedCostType] ?? 1
    const actScale = selectedActivity !== 'all' ? 0.88 : 1
    const wfScale = selectedWorkfront !== 'all' ? 0.93 : 1
    const scale = ctScale * actScale * wfScale
    if (scale === 1) return costData
    return costData.map(d => ({
      ...d,
      baseline: parseFloat((d.baseline * scale).toFixed(2)),
      currentBaseline: parseFloat((d.currentBaseline * scale).toFixed(2)),
      actualSolid: d.actualSolid != null ? parseFloat((d.actualSolid * scale).toFixed(2)) : null,
      actualDashed: d.actualDashed != null ? parseFloat((d.actualDashed * scale).toFixed(2)) : null,
    }))
  }

  // float_weeks sourced from schedule table (same formula: 2 - Math.floor(idx/2))
  const activities = [
    { name: 'Site Preparation', value: 2.1, metric: 'm³', total_planned_qty: 1000, planned_qty: 900, executed_qty: 850, expected_completeness: (900 / 1000).toFixed(2), actual_completeness: 85, earnedValue: 1.785, status: 'Ongoing', forecast_deadline: '15/03/2024', float_weeks: 2 },
    { name: 'Foundation Work', value: 5.2, metric: 'm³', total_planned_qty: 2000, planned_qty: 1400, executed_qty: 1200, expected_completeness: (1400 / 2000).toFixed(2), actual_completeness: 60, earnedValue: 3.12, status: 'Ongoing', forecast_deadline: '20/04/2024', float_weeks: 2 },
    { name: 'Structure Assembly', value: 8.5, metric: 'units', total_planned_qty: 150, planned_qty: 110, executed_qty: 90, expected_completeness: (110 / 150).toFixed(2), actual_completeness: 60, earnedValue: 5.10, status: 'Ongoing', forecast_deadline: '10/05/2024', float_weeks: 1 },
    { name: 'Mechanical Systems', value: 4.3, metric: 'systems', total_planned_qty: 45, planned_qty: 10, executed_qty: 0, expected_completeness: (10 / 45).toFixed(2), actual_completeness: 0, earnedValue: 0, status: 'Not Started', forecast_deadline: '15/06/2024', float_weeks: 1 },
    { name: 'Finishing Works', value: 4.4, metric: 'areas', total_planned_qty: 50, planned_qty: 10, executed_qty: 5, expected_completeness: (10 / 50).toFixed(2), actual_completeness: 10, earnedValue: 0.44, status: 'Not Started', forecast_deadline: '20/06/2024', float_weeks: 1 },
    { name: 'Electrical Installation', value: 3.8, metric: 'circuits', total_planned_qty: 120, planned_qty: 80, executed_qty: 65, expected_completeness: (80 / 120).toFixed(2), actual_completeness: 54, earnedValue: 2.052, status: 'Ongoing', forecast_deadline: '25/05/2024', float_weeks: 0 },
    { name: 'Plumbing Systems', value: 2.9, metric: 'connections', total_planned_qty: 85, planned_qty: 60, executed_qty: 55, expected_completeness: (60 / 85).toFixed(2), actual_completeness: 65, earnedValue: 1.885, status: 'Ongoing', forecast_deadline: '22/05/2024', float_weeks: 0 },
    { name: 'HVAC Installation', value: 6.7, metric: 'units', total_planned_qty: 35, planned_qty: 25, executed_qty: 18, expected_completeness: (25 / 35).toFixed(2), actual_completeness: 51, earnedValue: 3.417, status: 'Ongoing', forecast_deadline: '30/05/2024', float_weeks: 0 },
    { name: 'Exterior Cladding', value: 3.2, metric: 'm²', total_planned_qty: 800, planned_qty: 500, executed_qty: 420, expected_completeness: (500 / 800).toFixed(2), actual_completeness: 53, earnedValue: 1.696, status: 'Ongoing', forecast_deadline: '28/05/2024', float_weeks: 1 },
    { name: 'Interior Partitions', value: 2.6, metric: 'm²', total_planned_qty: 650, planned_qty: 400, executed_qty: 350, expected_completeness: (400 / 650).toFixed(2), actual_completeness: 54, earnedValue: 1.404, status: 'Ongoing', forecast_deadline: '26/05/2024', float_weeks: 1 },
    { name: 'Roofing Works', value: 4.1, metric: 'm²', total_planned_qty: 1200, planned_qty: 1000, executed_qty: 950, expected_completeness: (1000 / 1200).toFixed(2), actual_completeness: 79, earnedValue: 3.239, status: 'Ongoing', forecast_deadline: '18/05/2024', float_weeks: 2 },
    { name: 'Flooring Installation', value: 1.9, metric: 'm²', total_planned_qty: 900, planned_qty: 300, executed_qty: 180, expected_completeness: (300 / 900).toFixed(2), actual_completeness: 20, earnedValue: 0.38, status: 'Not Started', forecast_deadline: '10/07/2024', float_weeks: 3 },
    { name: 'Painting & Decoration', value: 1.5, metric: 'm²', total_planned_qty: 1100, planned_qty: 200, executed_qty: 50, expected_completeness: (200 / 1100).toFixed(2), actual_completeness: 5, earnedValue: 0.075, status: 'Not Started', forecast_deadline: '15/07/2024', float_weeks: 3 },
  ]

  const weeklyNatureCosts: Record<string, { week: string; labour: number; materials: number; subcontracted: number }[]> = {
    'Site Preparation': [{ week: 'W6', labour: 0.08, materials: 0.05, subcontracted: 0.02 }, { week: 'W7', labour: 0.07, materials: 0.06, subcontracted: 0.03 }, { week: 'W8', labour: 0.09, materials: 0.04, subcontracted: 0.02 }, { week: 'W9', labour: 0.06, materials: 0.05, subcontracted: 0.01 }],
    'Foundation Work': [{ week: 'W6', labour: 0.18, materials: 0.14, subcontracted: 0.07 }, { week: 'W7', labour: 0.20, materials: 0.13, subcontracted: 0.06 }, { week: 'W8', labour: 0.17, materials: 0.15, subcontracted: 0.08 }, { week: 'W9', labour: 0.19, materials: 0.12, subcontracted: 0.07 }],
    'Structure Assembly': [{ week: 'W6', labour: 0.25, materials: 0.19, subcontracted: 0.10 }, { week: 'W7', labour: 0.22, materials: 0.21, subcontracted: 0.11 }, { week: 'W8', labour: 0.26, materials: 0.18, subcontracted: 0.09 }, { week: 'W9', labour: 0.24, materials: 0.20, subcontracted: 0.10 }],
    'Mechanical Systems': [{ week: 'W6', labour: 0.10, materials: 0.08, subcontracted: 0.12 }, { week: 'W7', labour: 0.11, materials: 0.09, subcontracted: 0.13 }, { week: 'W8', labour: 0.09, materials: 0.10, subcontracted: 0.11 }, { week: 'W9', labour: 0.12, materials: 0.07, subcontracted: 0.14 }],
    'Finishing Works': [{ week: 'W6', labour: 0.07, materials: 0.06, subcontracted: 0.04 }, { week: 'W7', labour: 0.08, materials: 0.05, subcontracted: 0.03 }, { week: 'W8', labour: 0.06, materials: 0.07, subcontracted: 0.05 }, { week: 'W9', labour: 0.09, materials: 0.04, subcontracted: 0.03 }],
    'Electrical Installation': [{ week: 'W6', labour: 0.14, materials: 0.09, subcontracted: 0.08 }, { week: 'W7', labour: 0.13, materials: 0.10, subcontracted: 0.09 }, { week: 'W8', labour: 0.15, materials: 0.08, subcontracted: 0.07 }, { week: 'W9', labour: 0.12, materials: 0.11, subcontracted: 0.08 }],
    'Plumbing Systems': [{ week: 'W6', labour: 0.11, materials: 0.07, subcontracted: 0.05 }, { week: 'W7', labour: 0.10, materials: 0.08, subcontracted: 0.06 }, { week: 'W8', labour: 0.12, materials: 0.06, subcontracted: 0.04 }, { week: 'W9', labour: 0.09, materials: 0.09, subcontracted: 0.05 }],
    'HVAC Installation': [{ week: 'W6', labour: 0.20, materials: 0.16, subcontracted: 0.14 }, { week: 'W7', labour: 0.22, materials: 0.15, subcontracted: 0.13 }, { week: 'W8', labour: 0.19, materials: 0.17, subcontracted: 0.15 }, { week: 'W9', labour: 0.21, materials: 0.14, subcontracted: 0.12 }],
    'Exterior Cladding': [{ week: 'W6', labour: 0.09, materials: 0.12, subcontracted: 0.06 }, { week: 'W7', labour: 0.10, materials: 0.11, subcontracted: 0.07 }, { week: 'W8', labour: 0.08, materials: 0.13, subcontracted: 0.05 }, { week: 'W9', labour: 0.11, materials: 0.10, subcontracted: 0.06 }],
    'Interior Partitions': [{ week: 'W6', labour: 0.08, materials: 0.06, subcontracted: 0.04 }, { week: 'W7', labour: 0.07, materials: 0.07, subcontracted: 0.05 }, { week: 'W8', labour: 0.09, materials: 0.05, subcontracted: 0.03 }, { week: 'W9', labour: 0.08, materials: 0.08, subcontracted: 0.04 }],
    'Roofing Works': [{ week: 'W6', labour: 0.13, materials: 0.10, subcontracted: 0.07 }, { week: 'W7', labour: 0.14, materials: 0.09, subcontracted: 0.08 }, { week: 'W8', labour: 0.12, materials: 0.11, subcontracted: 0.06 }, { week: 'W9', labour: 0.15, materials: 0.08, subcontracted: 0.07 }],
    'Flooring Installation': [{ week: 'W6', labour: 0.06, materials: 0.09, subcontracted: 0.03 }, { week: 'W7', labour: 0.07, materials: 0.08, subcontracted: 0.04 }, { week: 'W8', labour: 0.05, materials: 0.10, subcontracted: 0.02 }, { week: 'W9', labour: 0.08, materials: 0.07, subcontracted: 0.03 }],
    'Painting & Decoration': [{ week: 'W6', labour: 0.04, materials: 0.03, subcontracted: 0.02 }, { week: 'W7', labour: 0.05, materials: 0.02, subcontracted: 0.01 }, { week: 'W8', labour: 0.03, materials: 0.04, subcontracted: 0.02 }, { week: 'W9', labour: 0.06, materials: 0.02, subcontracted: 0.01 }],
  }

  const economicTable = activities.map(activity => {
    const commercialIC = 80 + Math.random() * 5
    const projectedIC = commercialIC + 5 + Math.random() * 8
    const currentIC = commercialIC + 3 + Math.random() * 6
    return {
      activity: activity.name,
      status: activity.status,
      completeness: activity.actual_completeness,
      currentCost: activity.value * (activity.actual_completeness / 100) * 1.08,
      commercialIC: parseFloat(commercialIC.toFixed(1)),
      projectedIC: parseFloat(projectedIC.toFixed(1)),
      currentIC: parseFloat(currentIC.toFixed(1)),
      weeklyCosts: weeklyNatureCosts[activity.name] ?? [],
    }
  })

  const costBreakdownData = [
    { category: 'Labour (MDO)', planned: 12.5, estimated: 12.8, actual: 13.2 },
    { category: 'Materials', planned: 8.3, estimated: 8.6, actual: 9.1 },
    { category: 'Equipment', planned: 5.2, estimated: 5.4, actual: 5.8 },
    { category: 'Indirect Costs', planned: 6.1, estimated: 6.3, actual: 6.7 },
    { category: 'Subcontracted', planned: 7.4, estimated: 7.7, actual: 8.2 },
  ]

  const getFilteredCostBreakdownData = () => {
    if (selectedActivity === 'all' && selectedWorkfront === 'all') {
      return costBreakdownData
    }
    return costBreakdownData.map(d => ({
      ...d,
      actual: d.actual * 0.95,
      planned: d.planned * 0.92,
      estimated: d.estimated * 0.93,
    }))
  }

  const handleSort = (column: 'value' | 'plannedProgress' | 'actualProgress' | 'accumulatedProduction') => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortDirection('desc')
    }
  }

  const getSortedActivities = () => {
    if (!sortBy) return activities

    const sorted = [...activities].sort((a, b) => {
      let aValue: number = 0
      let bValue: number = 0

      switch (sortBy) {
        case 'value':
          aValue = a.value
          bValue = b.value
          break
        case 'plannedProgress':
          aValue = parseFloat(a.expected_completeness)
          bValue = parseFloat(b.expected_completeness)
          break
        case 'actualProgress':
          aValue = a.actual_completeness
          bValue = b.actual_completeness
          break
        case 'accumulatedProduction':
          aValue = a.earnedValue
          bValue = b.earnedValue
          break

      }

      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
    })

    return sorted
  }

  const handleEconomicSort = (column: 'baselineCost' | 'actualCost' | 'totalBaseline' | 'totalEstimated') => {
    if (economicSortBy === column) {
      setEconomicSortDirection(economicSortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setEconomicSortBy(column)
      setEconomicSortDirection('desc')
    }
  }

  const getSortedEconomicTable = () => {
    if (!economicSortBy) return economicTable

    const sorted = [...economicTable].sort((a, b) => {
      let aValue: number = 0
      let bValue: number = 0

      switch (economicSortBy) {
        case 'baselineCost':
          aValue = a.baseline
          bValue = b.baseline
          break
        case 'actualCost':
          aValue = a.actual
          bValue = b.actual
          break
        case 'totalBaseline':
          aValue = a.baseline / (a.completeness / 100)
          bValue = b.baseline / (b.completeness / 100)
          break
        case 'totalEstimated':
          aValue = (a.actual / (a.completeness / 100)) * 1.05
          bValue = (b.actual / (b.completeness / 100)) * 1.05
          break
      }

      return economicSortDirection === 'asc' ? aValue - bValue : bValue - aValue
    })

    return sorted
  }

  // Data Quality Tab Data
  const dataQualityKPIs = [
    { label: 'Daily Report Files Uploaded', value: '235' },
    { label: 'Total Recorded Tasks', value: '6' },
    { label: 'Total Working Hours', value: '78.1k' },
    { label: 'Unique Reporting Days', value: '75' },
    { label: 'Unique Employees Logged', value: '225' },
    { label: 'Unique Equipment Used', value: '23' },
  ]

  const dataErrorsCompact = [
    { filename: 'Daily_Report_2024_02_01.csv', activity: 'Site Preparation', qty: 3 },
    { filename: 'Daily_Report_2024_02_02.csv', activity: 'Foundation Work', qty: 1 },
    { filename: 'Daily_Report_2024_02_03.csv', activity: 'Structure Assembly', qty: 5 },
  ]

  const dataErrorsDetailed = [
    { report: 'Daily_Report_2024_02_01.csv', dateUpdate: '2024-02-01', activity: 'Site Prep', issue: 'Employee with multiple records', qty: 2 },
    { report: 'Daily_Report_2024_02_01.csv', dateUpdate: '2024-02-01', activity: 'Site Prep', issue: 'Missing equipment ID', qty: 1 },
    { report: 'Daily_Report_2024_02_02.csv', dateUpdate: '2024-02-02', activity: 'Foundation', issue: 'Invalid working hours', qty: 1 },
    { report: 'Daily_Report_2024_02_03.csv', dateUpdate: '2024-02-03', activity: 'Structure', issue: 'Duplicate entries', qty: 3 },
    { report: 'Daily_Report_2024_02_03.csv', dateUpdate: '2024-02-03', activity: 'Structure', issue: 'Timestamp mismatch', qty: 2 },
  ]

  // Daily report files data with actual and expected uploads
  const dailyReportFilesData7Days = [
    { date: 'Jan 25', actual: 8, expected: 10 },
    { date: 'Jan 26', actual: 12, expected: 15 },
    { date: 'Jan 27', actual: 10, expected: 12 },
    { date: 'Jan 28', actual: 15, expected: 18 },
    { date: 'Jan 29', actual: 14, expected: 20 },
    { date: 'Jan 30', actual: 18, expected: 20 },
    { date: 'Jan 31', actual: 16, expected: 18 },
  ]

  const dailyReportFilesData30Days = [
    { date: 'Jan 04', actual: 6, expected: 10 }, { date: 'Jan 05', actual: 9, expected: 12 }, { date: 'Jan 06', actual: 7, expected: 10 },
    { date: 'Jan 07', actual: 11, expected: 15 }, { date: 'Jan 08', actual: 13, expected: 16 }, { date: 'Jan 09', actual: 10, expected: 12 },
    { date: 'Jan 10', actual: 14, expected: 18 }, { date: 'Jan 11', actual: 12, expected: 14 }, { date: 'Jan 12', actual: 15, expected: 18 },
    { date: 'Jan 13', actual: 16, expected: 20 }, { date: 'Jan 14', actual: 14, expected: 16 }, { date: 'Jan 15', actual: 18, expected: 22 },
    { date: 'Jan 16', actual: 17, expected: 20 }, { date: 'Jan 17', actual: 19, expected: 22 }, { date: 'Jan 18', actual: 16, expected: 18 },
    { date: 'Jan 19', actual: 20, expected: 24 }, { date: 'Jan 20', actual: 18, expected: 20 }, { date: 'Jan 21', actual: 21, expected: 25 },
    { date: 'Jan 22', actual: 22, expected: 26 }, { date: 'Jan 23', actual: 19, expected: 22 }, { date: 'Jan 24', actual: 23, expected: 27 },
    { date: 'Jan 25', actual: 8, expected: 10 }, { date: 'Jan 26', actual: 12, expected: 15 }, { date: 'Jan 27', actual: 10, expected: 12 },
    { date: 'Jan 28', actual: 15, expected: 18 }, { date: 'Jan 29', actual: 14, expected: 20 }, { date: 'Jan 30', actual: 18, expected: 20 },
    { date: 'Jan 31', actual: 16, expected: 18 },
  ]

  const dailyReportFilesData6Months = [
    { date: 'Sep', actual: 280, expected: 320 }, { date: 'Oct', actual: 310, expected: 350 }, { date: 'Nov', actual: 290, expected: 330 },
    { date: 'Dec', actual: 320, expected: 360 }, { date: 'Jan', actual: 340, expected: 380 }, { date: 'Feb', actual: 300, expected: 340 },
  ]

  // Reports by shift data - only 3 shifts (Morning, Afternoon, Night)
  const reportsByShiftData7Days = [
    { date: 'Jan 25', 'Morning': 3, 'Afternoon': 2, 'Night': 1 },
    { date: 'Jan 26', 'Morning': 4, 'Afternoon': 3, 'Night': 2 },
    { date: 'Jan 27', 'Morning': 3, 'Afternoon': 3, 'Night': 2 },
    { date: 'Jan 28', 'Morning': 5, 'Afternoon': 4, 'Night': 2 },
    { date: 'Jan 29', 'Morning': 4, 'Afternoon': 4, 'Night': 3 },
    { date: 'Jan 30', 'Morning': 5, 'Afternoon': 5, 'Night': 3 },
    { date: 'Jan 31', 'Morning': 4, 'Afternoon': 5, 'Night': 3 },
  ]

  const reportsByShiftData30Days = [
    { date: 'Jan 04', 'Morning': 2, 'Afternoon': 2, 'Night': 1 }, { date: 'Jan 05', 'Morning': 3, 'Afternoon': 2, 'Night': 1 },
    { date: 'Jan 06', 'Morning': 2, 'Afternoon': 3, 'Night': 2 }, { date: 'Jan 07', 'Morning': 4, 'Afternoon': 3, 'Night': 2 },
    { date: 'Jan 08', 'Morning': 3, 'Afternoon': 4, 'Night': 2 }, { date: 'Jan 09', 'Morning': 3, 'Afternoon': 3, 'Night': 2 },
    { date: 'Jan 10', 'Morning': 5, 'Afternoon': 4, 'Night': 2 }, { date: 'Jan 11', 'Morning': 4, 'Afternoon': 3, 'Night': 3 },
    { date: 'Jan 12', 'Morning': 5, 'Afternoon': 4, 'Night': 2 }, { date: 'Jan 13', 'Morning': 5, 'Afternoon': 5, 'Night': 3 },
    { date: 'Jan 14', 'Morning': 4, 'Afternoon': 4, 'Night': 2 }, { date: 'Jan 15', 'Morning': 6, 'Afternoon': 5, 'Night': 3 },
    { date: 'Jan 16', 'Morning': 5, 'Afternoon': 5, 'Night': 3 }, { date: 'Jan 17', 'Morning': 6, 'Afternoon': 6, 'Night': 3 },
    { date: 'Jan 18', 'Morning': 5, 'Afternoon': 4, 'Night': 2 }, { date: 'Jan 19', 'Morning': 7, 'Afternoon': 6, 'Night': 3 },
    { date: 'Jan 20', 'Morning': 6, 'Afternoon': 5, 'Night': 3 }, { date: 'Jan 21', 'Morning': 7, 'Afternoon': 7, 'Night': 3 },
    { date: 'Jan 22', 'Morning': 7, 'Afternoon': 6, 'Night': 4 }, { date: 'Jan 23', 'Morning': 6, 'Afternoon': 6, 'Night': 3 },
    { date: 'Jan 24', 'Morning': 7, 'Afternoon': 7, 'Night': 4 }, { date: 'Jan 25', 'Morning': 3, 'Afternoon': 2, 'Night': 1 },
    { date: 'Jan 26', 'Morning': 4, 'Afternoon': 3, 'Night': 2 }, { date: 'Jan 27', 'Morning': 3, 'Afternoon': 3, 'Night': 2 },
    { date: 'Jan 28', 'Morning': 5, 'Afternoon': 4, 'Night': 2 }, { date: 'Jan 29', 'Morning': 4, 'Afternoon': 4, 'Night': 3 },
    { date: 'Jan 30', 'Morning': 5, 'Afternoon': 5, 'Night': 3 }, { date: 'Jan 31', 'Morning': 4, 'Afternoon': 5, 'Night': 3 },
  ]

  const reportsByActivityData = [
    { date: 'Jan 25', 'Sleepers-Production': 3, 'Ballast': 2, 'Flashbutt-Welding': 2, 'Inspection': 1, total: 8 },
    { date: 'Jan 26', 'Sleepers-Production': 5, 'Ballast': 3, 'Flashbutt-Welding': 3, 'Inspection': 1, total: 12 },
    { date: 'Jan 27', 'Sleepers-Production': 4, 'Ballast': 3, 'Flashbutt-Welding': 2, 'Inspection': 1, total: 10 },
    { date: 'Jan 28', 'Sleepers-Production': 6, 'Ballast': 4, 'Flashbutt-Welding': 4, 'Inspection': 1, total: 15 },
    { date: 'Jan 29', 'Sleepers-Production': 5, 'Ballast': 4, 'Flashbutt-Welding': 4, 'Inspection': 1, total: 14 },
    { date: 'Jan 30', 'Sleepers-Production': 8, 'Ballast': 5, 'Flashbutt-Welding': 4, 'Inspection': 1, total: 18 },
    { date: 'Jan 31', 'Sleepers-Production': 7, 'Ballast': 4, 'Flashbutt-Welding': 4, 'Inspection': 1, total: 16 },
    { date: 'Feb 01', 'Sleepers-Production': 9, 'Ballast': 6, 'Flashbutt-Welding': 4, 'Inspection': 1, total: 20 },
    { date: 'Feb 02', 'Sleepers-Production': 10, 'Ballast': 7, 'Flashbutt-Welding': 4, 'Inspection': 1, total: 22 },
  ]

  // Filter logic for daily report files
  const getFilteredDailyReportData = () => {
    if (dailyReportViewBy === '7days') {
      return dailyReportFilesData7Days
    } else if (dailyReportViewBy === '30days') {
      return dailyReportFilesData30Days
    } else if (dailyReportViewBy === '6months') {
      return dailyReportFilesData6Months
    }
    return dailyReportFilesData7Days
  }

  // Filter logic for shift graph
  const getFilteredShiftData = () => {
    let data

    if (shiftViewBy === '7days') {
      data = reportsByShiftData7Days
    } else if (shiftViewBy === '30days') {
      data = reportsByShiftData30Days
    } else if (shiftViewBy === '6months') {
      // For 6 months, aggregate by month
      data = [
        { date: 'Sep', 'Morning': 65, 'Afternoon': 55, 'Night': 28 },
        { date: 'Oct', 'Morning': 72, 'Afternoon': 62, 'Night': 31 },
        { date: 'Nov', 'Morning': 68, 'Afternoon': 58, 'Night': 29 },
        { date: 'Dec', 'Morning': 75, 'Afternoon': 65, 'Night': 32 },
        { date: 'Jan', 'Morning': 80, 'Afternoon': 70, 'Night': 35 },
        { date: 'Feb', 'Morning': 70, 'Afternoon': 63, 'Night': 30 },
      ]
    }

    if (shiftDateRange.start && shiftDateRange.end) {
      data = data.filter(d => {
        const dateStr = d.date.replace(' ', '-')
        return dateStr >= shiftDateRange.start && dateStr <= shiftDateRange.end
      })
    }

    return data || reportsByShiftData7Days
  }

  // Filter logic for activity graph
  const getFilteredActivityData = () => {
    let data

    if (activityViewBy === '7days') {
      data = reportsByActivityData.slice(-7)
    } else if (activityViewBy === '30days') {
      // For 30 days, use extended data
      data = dailyReportFilesData30Days.map(d => ({
        date: d.date,
        'Sleepers-Production': Math.ceil(d.actual * 0.45),
        'Ballast': Math.ceil(d.actual * 0.32),
        'Flashbutt-Welding': Math.ceil(d.actual * 0.18),
        'Inspection': Math.ceil(d.actual * 0.05),
        total: d.actual,
      }))
    } else if (activityViewBy === '6months') {
      // For 6 months, show by month
      data = [
        { date: 'Sep', 'Sleepers-Production': 126, 'Ballast': 90, 'Flashbutt-Welding': 50, 'Inspection': 14, total: 280 },
        { date: 'Oct', 'Sleepers-Production': 140, 'Ballast': 99, 'Flashbutt-Welding': 56, 'Inspection': 15, total: 310 },
        { date: 'Nov', 'Sleepers-Production': 131, 'Ballast': 93, 'Flashbutt-Welding': 52, 'Inspection': 14, total: 290 },
        { date: 'Dec', 'Sleepers-Production': 144, 'Ballast': 102, 'Flashbutt-Welding': 58, 'Inspection': 16, total: 320 },
        { date: 'Jan', 'Sleepers-Production': 153, 'Ballast': 109, 'Flashbutt-Welding': 61, 'Inspection': 17, total: 340 },
        { date: 'Feb', 'Sleepers-Production': 135, 'Ballast': 96, 'Flashbutt-Welding': 54, 'Inspection': 15, total: 300 },
      ]
    }

    if (activityDateRange.start && activityDateRange.end) {
      data = data.filter(d => {
        const dateStr = d.date.replace(' ', '-')
        return dateStr >= activityDateRange.start && dateStr <= activityDateRange.end
      })
    }

    return data || reportsByActivityData.slice(-7)
  }

  const dailyReportFilesData = [
    { date: 'Jan 25', actual: 8, expected: 10 },
    { date: 'Jan 26', actual: 12, expected: 15 },
    { date: 'Jan 27', actual: 10, expected: 12 },
    { date: 'Jan 28', actual: 15, expected: 18 },
    { date: 'Jan 29', actual: 14, expected: 20 },
    { date: 'Jan 30', actual: 18, expected: 20 },
    { date: 'Jan 31', actual: 16, expected: 18 },
  ]

  return (
    <div className="min-h-screen bg-background grid-background">
      <DashboardHeader />

      <main className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <Link href={`/project/PRJ-001`}>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-foreground mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Project
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Project Overview - {project.name}</h1>
            <p className="text-sm text-muted-foreground mt-2">{project.city}, {project.country} | {project.typology}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="gap-2 bg-foreground text-background hover:bg-foreground/90"
              onClick={() => setGanttOpen(true)}
            >
              <GanttChartSquare className="w-4 h-4" />
              Gantt Chart
            </Button>
            <Button
              disabled
              className="gap-2 bg-foreground text-background hover:bg-foreground/90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Download Report
            </Button>
          </div>
        </div>

        <GanttChartDialog
          open={ganttOpen}
          onOpenChange={setGanttOpen}
          projectName={project.name}
        />

        {/* Tab Navigation */}
        <div className="flex gap-8 border-b border-border/50 mb-8">
          {['overview', 'progress', 'economic', 'data-quality'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-2 font-semibold text-sm transition-all ${activeTab === tab
                ? 'text-foreground border-b-2 border-foreground'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <>
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-8">
              <Select value={selectedActivity} onValueChange={setSelectedActivity}>
                <SelectTrigger className="w-48 bg-secondary border-border/50">
                  <SelectValue placeholder="Activities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Activities</SelectItem>
                  <SelectItem value="a1">Site Preparation</SelectItem>
                  <SelectItem value="a2">Foundation Work</SelectItem>
                  <SelectItem value="a3">Structure Assembly</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedWorkfront} onValueChange={setSelectedWorkfront}>
                <SelectTrigger className="w-48 bg-secondary border-border/50">
                  <SelectValue placeholder="Workfronts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Workfronts</SelectItem>
                  <SelectItem value="section1">Section 1</SelectItem>
                  <SelectItem value="section2">Section 2</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedOwner} onValueChange={setSelectedOwner}>
                <SelectTrigger className="w-48 bg-secondary border-border/50">
                  <SelectValue placeholder="Activity Owner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Owners</SelectItem>
                  <SelectItem value="mota">Mota-Engil</SelectItem>
                  <SelectItem value="sub1">Subcontractor 1</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Production S-Curve */}
            <div className="glass-card rounded-lg p-4 mb-6 border border-border/50">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                <h3 className="text-sm font-semibold text-foreground">Production S-Curve</h3>
                <BaselineFilter value={progressBaseline} onChange={setProgressBaseline} />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getFilteredProgressData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                  <XAxis dataKey="week" stroke={chartColors.axis} />
                  <YAxis stroke={chartColors.axis} />
                  <Tooltip contentStyle={{ backgroundColor: chartColors.tooltipBg, border: chartColors.tooltipBorder }} />
                  <Legend />
                  <Line type="monotone" dataKey="planned" stroke="#999999" name="Commercial" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="estimated" stroke="#00c8ff" name="Current Baseline" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="actualSolid" stroke="#00ff88" name="Actual" strokeWidth={2} dot={false} connectNulls={false} />
                  <Line type="monotone" dataKey="actualDashed" stroke="#00ff88" strokeWidth={2} dot={false} strokeDasharray="6 4" legendType="none" connectNulls={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Row 1: Timeline Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="glass-card rounded-lg p-4 border border-border/50">
                <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">Start Date</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Planned</span>
                    <span className="font-mono text-lg font-bold text-foreground">01/01/2024</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Actual</span>
                    <span className="font-mono text-lg font-bold text-foreground">01/02/2024</span>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-lg p-4 border border-border/50">
                <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">End Date</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Planned</span>
                    <span className="font-mono text-lg font-bold text-foreground">03/01/2026</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Estimated</span>
                    <span className="font-mono text-lg font-bold text-foreground">01/15/2026</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Cumulative Progress */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="glass-card rounded-lg p-4 border border-border/50">
                <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">Planned Progress</p>
                <p className="font-mono text-5xl font-bold text-foreground">50%</p>
              </div>

              <div className="glass-card rounded-lg p-4 border border-border/50">
                <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">Actual Cumulative Progress</p>
                <p className="font-mono text-5xl font-bold text-foreground">68%</p>
              </div>
            </div>

            {/* Row 3: Velocity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="glass-card rounded-lg p-4 border border-border/50">
                <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">Avg. Weekly Progress (Last 4 weeks)</p>
                <div className="space-y-3">
                  <p className="font-mono text-3xl font-bold text-foreground">2.4%</p>
                  <p className="text-xs text-muted-foreground">Trend: +0.9% vs prior week</p>
                </div>
              </div>

              <div className="glass-card rounded-lg p-4 border border-border/50">
                <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">Required Weekly Progress</p>
                <div className="space-y-3">
                  <p className="font-mono text-3xl font-bold text-foreground">2.0%</p>
                  <p className="text-xs text-muted-foreground">Target to meet deadline</p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-lg p-4 border border-border/50 gap-4 mb-6">
              <h3 className="text-sm font-semibold text-foreground mb-4">Activity Table</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left text-xs text-muted-foreground font-semibold py-2 min-w-[140px]">Activity</th>
                      <th className="text-right text-xs text-muted-foreground font-semibold py-2 cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('value')}>
                        Econ. Value (€M) {sortBy === 'value' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="text-left text-xs text-muted-foreground font-semibold py-2">Status</th>
                      <th className="text-left text-xs text-muted-foreground font-semibold py-2">Metric</th>
                      <th className="text-right text-xs text-muted-foreground font-semibold py-2">Total Planned</th>
                      <th className="text-right text-xs text-muted-foreground font-semibold py-2">Total Actual</th>
                      <th className="text-right text-xs text-muted-foreground font-semibold py-2 cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('plannedProgress')}>
                        Planned % {sortBy === 'plannedProgress' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="text-right text-xs text-muted-foreground font-semibold py-2 cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('actualProgress')}>
                        Actual % {sortBy === 'actualProgress' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="text-right text-xs text-muted-foreground font-semibold py-2 cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('accumulatedProduction')}>
                        Accum. Prod. (€M) {sortBy === 'accumulatedProduction' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="text-right text-xs text-muted-foreground font-semibold py-2">Float (w)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getSortedActivities().map((activity, idx) => {
                      const isNotStarted = activity.status === 'Not Started'
                      const plannedPct = Math.round(parseFloat(activity.expected_completeness) * 100)
                      const displayActual = isNotStarted ? 0 : activity.executed_qty
                      const displayActualPct = isNotStarted ? 0 : activity.actual_completeness
                      const displayEarnedValue = isNotStarted ? 0 : activity.earnedValue
                      return (
                        <tr key={idx} className="border-b border-border/30 hover:bg-secondary/20">
                          <td className="py-3 text-foreground font-medium">{activity.name}</td>
                          <td className="py-3 text-right text-foreground">€{activity.value.toFixed(1)}M</td>
                          <td className="py-3 text-right">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${activity.status === 'Finished' ? 'bg-[#16a34a]/15 text-[#16a34a]' :
                              activity.status === 'Ongoing' ? 'bg-accent/20 text-accent' :
                                'bg-muted/30 text-muted-foreground'
                              }`}>
                              {activity.status}
                            </span>
                          </td>
                          <td className="py-3 text-right text-muted-foreground text-xs">{activity.metric}</td>
                          <td className="py-3 text-right text-foreground">{activity.total_planned_qty.toLocaleString()}</td>
                          <td className="py-3 text-right text-foreground">{displayActual.toLocaleString()}</td>
                          <td className="py-3 text-right text-muted-foreground">{plannedPct}%</td>
                          <td className="py-3 text-right text-foreground">{displayActualPct}%</td>
                          <td className="py-3 text-right text-foreground">€{displayEarnedValue.toFixed(2)}M</td>
                          <td className="py-3 text-right text-foreground">{activity.float_weeks}w</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Project Info */}
            <h2 className="text-lg font-semibold text-foreground mb-4 mt-8">Project Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="glass-card rounded-lg p-4 border border-border/50">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Client</p>
                <p className="text-lg font-semibold text-foreground">{project.client}</p>
              </div>
              <div className="glass-card rounded-lg p-4 border border-border/50">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Project Manager</p>
                <p className="text-lg font-semibold text-foreground">{project.manager}</p>
              </div>
            </div>

            <h2 className="text-lg font-semibold text-foreground mb-4 mt-8">Contract Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="glass-card rounded-lg p-4 border border-border/50">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Contract Value</p>
                <p className="text-lg font-semibold text-foreground">€24.5M</p>
              </div>
              <div className="glass-card rounded-lg p-4 border border-border/50">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Construction Cost</p>
                <p className="text-lg font-semibold text-foreground">€22.05M</p>
              </div>
              <div className="glass-card rounded-lg p-4 border border-border/50">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Contract Deadline</p>
                <p className="text-lg font-semibold text-foreground">March 1, 2026</p>
              </div>
            </div>

            {/* Production Progress Control Section */}
            <h2 className="text-lg font-semibold text-foreground mb-4 mt-8">Production Progress Control</h2>

            {/* Production Control KPIs - 6 cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
              <div className="glass-card rounded-lg p-3 border border-border/50">
                <p className="text-xs text-muted-foreground mb-2">Planned Accum. Progress</p>
                <p className="text-2xl font-bold text-foreground">50%</p>
              </div>
              <div className="glass-card rounded-lg p-3 border border-border/50">
                <p className="text-xs text-muted-foreground mb-2">Avg. Weekly Advance</p>
                <p className="text-2xl font-bold text-foreground">2.4%</p>
              </div>
              <div className="glass-card rounded-lg p-3 border border-border/50">
                <p className="text-xs text-muted-foreground mb-2">Current Advance</p>
                <p className="text-2xl font-bold text-foreground">+5 weeks</p>
              </div>
              <div className="glass-card rounded-lg p-3 border border-border/50">
                <p className="text-xs text-muted-foreground mb-2">Actual Accum. Progress</p>
                <p className="text-2xl font-bold text-foreground">68%</p>
              </div>
              <div className="glass-card rounded-lg p-3 border border-border/50">
                <p className="text-xs text-muted-foreground mb-2">Required Weekly Advance</p>
                <p className="text-2xl font-bold text-foreground">2.0%</p>
              </div>
              <div className="glass-card rounded-lg p-3 border border-border/50">
                <p className="text-xs text-muted-foreground mb-2">Forecast Deadline</p>
                <p className="text-2xl font-bold text-foreground">January 15, 2026</p>
              </div>
            </div>

            {/* Production S-Curve */}
            <div className="glass-card rounded-lg p-4 mb-6 border border-border/50">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                <h3 className="text-sm font-semibold text-foreground">Production S-Curve</h3>
                <BaselineFilter value={progressBaseline} onChange={setProgressBaseline} />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                  <XAxis dataKey="week" stroke={chartColors.axis} />
                  <YAxis stroke={chartColors.axis} />
                  <Tooltip contentStyle={{ backgroundColor: chartColors.tooltipBg, border: chartColors.tooltipBorder }} />
                  <Legend />
                  <Line type="monotone" dataKey="planned" stroke="#999999" name="Commercial" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="estimated" stroke="#00c8ff" name="Current Baseline" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="actualSolid" stroke="#00ff88" name="Actual" strokeWidth={2} dot={false} connectNulls={false} />
                  <Line type="monotone" dataKey="actualDashed" stroke="#00ff88" strokeWidth={2} dot={false} strokeDasharray="6 4" legendType="none" connectNulls={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Activity Table */}
            <div className="glass-card rounded-lg p-4 border border-border/50 mb-8">
              <h3 className="text-sm font-semibold text-foreground mb-4 text-left">Activity Table</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left text-xs text-muted-foreground font-semibold py-2 min-w-[140px]">Activity</th>
                      <th className="text-right text-xs text-muted-foreground font-semibold py-2 cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('value')}>
                        Econ. Value (€M) {sortBy === 'value' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="text-right text-xs text-muted-foreground font-semibold py-2">Status</th>
                      <th className="text-right text-xs text-muted-foreground font-semibold py-2">Metric</th>
                      <th className="text-right text-xs text-muted-foreground font-semibold py-2">Total Planned</th>
                      <th className="text-right text-xs text-muted-foreground font-semibold py-2">Total Actual</th>
                      <th className="text-right text-xs text-muted-foreground font-semibold py-2 cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('plannedProgress')}>
                        Planned % {sortBy === 'plannedProgress' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="text-right text-xs text-muted-foreground font-semibold py-2 cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('actualProgress')}>
                        Actual % {sortBy === 'actualProgress' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="text-right text-xs text-muted-foreground font-semibold py-2 cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('accumulatedProduction')}>
                        Accum. Prod. (€M) {sortBy === 'accumulatedProduction' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="text-right text-xs text-muted-foreground font-semibold py-2">Float (w)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getSortedActivities().map((activity, idx) => {
                      const isNotStarted = activity.status === 'Not Started'
                      const plannedPct = Math.round(parseFloat(activity.expected_completeness) * 100)
                      const displayActual = isNotStarted ? 0 : activity.executed_qty
                      const displayActualPct = isNotStarted ? 0 : activity.actual_completeness
                      const displayEarnedValue = isNotStarted ? 0 : activity.earnedValue
                      return (
                        <tr key={idx} className="border-b border-border/30 hover:bg-secondary/20">
                          <td className="py-3 text-foreground font-medium">{activity.name}</td>
                          <td className="py-3 text-right text-foreground">€{activity.value.toFixed(1)}M</td>
                          <td className="py-3 text-right">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${activity.status === 'Finished' ? 'bg-[#16a34a]/15 text-[#16a34a]' :
                              activity.status === 'Ongoing' ? 'bg-accent/20 text-accent' :
                                'bg-muted/30 text-muted-foreground'
                              }`}>
                              {activity.status}
                            </span>
                          </td>
                          <td className="py-3 text-right text-muted-foreground text-xs">{activity.metric}</td>
                          <td className="py-3 text-right text-foreground">{activity.total_planned_qty.toLocaleString()}</td>
                          <td className="py-3 text-right text-foreground">{displayActual.toLocaleString()}</td>
                          <td className="py-3 text-right text-muted-foreground">{plannedPct}%</td>
                          <td className="py-3 text-right text-foreground">{displayActualPct}%</td>
                          <td className="py-3 text-right text-foreground">€{displayEarnedValue.toFixed(2)}M</td>
                          <td className="py-3 text-right text-foreground">{activity.float_weeks}w</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Economic Control Section */}
            <h2 className="text-lg font-semibold text-foreground mb-4 mt-8">Economic Control</h2>

            {/* Weekly Cost KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="glass-card rounded-lg p-5 border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-muted-foreground text-sm font-normal">$</span>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-semibold">Avg Weekly Costs</p>
                </div>
                <p className="text-3xl font-bold text-foreground">€0.38M</p>
                <p className="text-sm text-muted-foreground mt-2">Average cost per week to date</p>
              </div>
              <div className="glass-card rounded-lg p-5 border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-semibold">Required Weekly Costs</p>
                </div>
                <p className="text-3xl font-bold text-foreground">€0.42M</p>
                <p className="text-sm text-muted-foreground mt-2">To achieve projected IC</p>
              </div>
              <div className="glass-card rounded-lg p-5 border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-muted-foreground text-sm font-normal">€</span>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-semibold">Accumulated Production</p>
                </div>
                <p className="text-3xl font-bold text-foreground">€16.66M</p>
                <p className="text-sm text-muted-foreground mt-2">68% of €24.5M contract value</p>
              </div>
            </div>

            {/* Economic Overview bar */}
            <div className="glass-card rounded-lg p-4 border border-border/50 mb-6">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-4">Economic Overview</p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-x-6 gap-y-4 divide-x-0 sm:divide-x divide-border/30">
                <div className="sm:pl-0">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-xs text-muted-foreground">€</span>
                    <span className="text-[11px] text-muted-foreground">Project Budget</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">€24.5M</p>
                </div>
                <div className="sm:pl-6">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <TrendingUp className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground">Commercial IC</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">80.0%</p>
                </div>
                <div className="sm:pl-6">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <TrendingUp className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground">Projected IC</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">92.4%</p>
                </div>
                <div className="sm:pl-6">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <TrendingUp className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground">Current IC</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">90.0%</p>
                </div>
                <div className="sm:pl-6">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <TrendingUp className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground">Analytical IC</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">84.2%</p>
                </div>
              </div>
            </div>

            {/* Cost S-Curve */}
            <div className="glass-card rounded-lg p-4 mb-6 border border-border/50">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                <h3 className="text-sm font-semibold text-foreground">Economic S-Curve</h3>
                <BaselineFilter value={economicBaseline} onChange={setEconomicBaseline} />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={costData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                  <XAxis dataKey="week" stroke={chartColors.axis} />
                  <YAxis stroke={chartColors.axis} tickFormatter={(v) => `€${v.toFixed(1)}M`} />
                  <Tooltip contentStyle={{ backgroundColor: chartColors.tooltipBg, border: chartColors.tooltipBorder }} formatter={(v: number) => `€${v.toFixed(1)}M`} />
                  <Legend />
                  <Line type="monotone" dataKey="baseline" stroke="#999999" name="Commercial" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="currentBaseline" stroke={chartColors.isDark ? "#00c8ff" : "#6C5CE7"} name="Current Baseline" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="actualSolid" stroke="#ff6b6b" name="Actual" strokeWidth={2} dot={false} connectNulls={false} />
                  <Line type="monotone" dataKey="actualDashed" stroke="#ff6b6b" strokeWidth={2} dot={false} strokeDasharray="6 4" legendType="none" connectNulls={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Economic Summary Table */}
            <div className="glass-card rounded-lg p-4 border border-border/50 mb-8">
              <h3 className="text-sm font-semibold text-foreground mb-4 text-left">Economic Summary Table</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left text-xs text-muted-foreground font-semibold py-2 min-w-[140px]">Activity</th>
                      <th className="text-right text-xs text-muted-foreground font-semibold py-2 cursor-pointer hover:text-foreground transition-colors" onClick={() => handleEconomicSort('actualCost')}>
                        Econ. Value (€M) {economicSortBy === 'actualCost' && (economicSortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="text-right text-xs text-muted-foreground font-semibold py-2">Status</th>
                      <th className="text-right text-xs text-muted-foreground font-semibold py-2 cursor-pointer hover:text-foreground transition-colors" onClick={() => handleEconomicSort('baselineCost')}>
                        Current Progress {economicSortBy === 'baselineCost' && (economicSortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="text-right text-xs text-muted-foreground font-semibold py-2">Current Cost (€M)</th>
                      <th className="text-right text-xs text-muted-foreground font-semibold py-2">Commercial IC</th>
                      <th className="text-right text-xs text-muted-foreground font-semibold py-2 cursor-pointer hover:text-foreground transition-colors" onClick={() => handleEconomicSort('totalEstimated')}>
                        Projected IC {economicSortBy === 'totalEstimated' && (economicSortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="text-right text-xs text-muted-foreground font-semibold py-2 cursor-pointer hover:text-foreground transition-colors" onClick={() => handleEconomicSort('totalBaseline')}>
                        Current IC {economicSortBy === 'totalBaseline' && (economicSortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="w-8" />
                    </tr>
                  </thead>
                  <tbody>
                    {getSortedEconomicTable().map((row, idx) => {
                      const activity = activities.find(a => a.name === row.activity)
                      const economicValue = activity?.value ?? 0
                      return (
                        <EconomicTableRow
                          key={idx}
                          row={row}
                          economicValue={economicValue}
                          chartColors={chartColors}
                        />
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </>
        )}

        {/* Data Quality Tab */}
        {activeTab === 'data-quality' && (
          <>
            {/* Top KPI Cards - 6 grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
              {dataQualityKPIs.map((kpi, idx) => (
                <div key={idx} className="glass-card rounded-lg p-4 border border-border/50">
                  <p className="text-xs text-muted-foreground mb-2 truncate">{kpi.label}</p>
                  <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                </div>
              ))}
            </div>

            {/* Data Errors Section - Two Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Compact Data Errors Table - Top Right */}
              <div className="lg:col-span-1">
                <div className="glass-card rounded-lg p-4 border border-border/50">
                  <h3 className="text-sm font-semibold text-foreground mb-4">Data Errors Summary</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border/50">
                          <th className="text-left text-muted-foreground font-semibold py-2">Daily Report</th>
                          <th className="text-left text-muted-foreground font-semibold py-2">Activity</th>
                          <th className="text-right text-muted-foreground font-semibold py-2">Qty</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataErrorsCompact.map((error, idx) => (
                          <tr key={idx} className="border-b border-border/30 hover:bg-secondary/20">
                            <td className="py-2 text-foreground truncate text-xs">{error.filename.substring(0, 15)}...</td>
                            <td className="py-2 text-muted-foreground">{error.activity}</td>
                            <td className="py-2 text-right text-foreground font-semibold text-xs">{error.qty}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Placeholder for spacing - will be replaced with detailed table below */}
              <div className="lg:col-span-2"></div>
            </div>

            {/* Detailed Data Errors Table - Full Width */}
            <div className="glass-card rounded-lg p-4 border border-border/50 mb-8">
              <h3 className="text-sm font-semibold text-foreground mb-4">Detailed Data Issues</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left text-xs text-muted-foreground font-semibold py-2">Daily Report</th>
                      <th className="text-left text-xs text-muted-foreground font-semibold py-2">Date Update</th>
                      <th className="text-left text-xs text-muted-foreground font-semibold py-2">Activity</th>
                      <th className="text-left text-xs text-muted-foreground font-semibold py-2">Issue</th>
                      <th className="text-right text-xs text-muted-foreground font-semibold py-2">Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataErrorsDetailed.map((error, idx) => (
                      <tr key={idx} className="border-b border-border/30 hover:bg-secondary/20">
                        <td className="py-3 text-foreground">{error.report}</td>
                        <td className="py-3 text-muted-foreground">{error.dateUpdate}</td>
                        <td className="py-3 text-foreground">{error.activity}</td>
                        <td className="py-3 text-destructive text-sm">{error.issue}</td>
                        <td className="py-3 text-right text-foreground font-semibold">{error.qty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Data Ingestion Timeline Charts */}
            <h2 className="text-lg font-semibold text-foreground mb-6 mt-8">Data Ingestion Timelines</h2>

            {/* Chart 1: Daily Report Files */}
            <div className="glass-card rounded-lg p-4 border border-border/50 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <h3 className="text-sm font-semibold text-foreground">Daily Report Files Uploaded</h3>
                <div className="flex flex-wrap gap-2">
                  {/* View By Dropdown */}
                  <Select value={dailyReportViewBy} onValueChange={setDailyReportViewBy}>
                    <SelectTrigger className="w-40 bg-secondary text-base border-foreground font-semibold">
                      <SelectValue placeholder="View by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">Last 7 Days</SelectItem>
                      <SelectItem value="30days">Last 30 Days</SelectItem>
                      <SelectItem value="6months">Last 6 Months</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Filter Button */}

                </div>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getFilteredDailyReportData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                  <XAxis dataKey="date" stroke={chartColors.axis} />
                  <YAxis stroke={chartColors.axis} />
                  <Tooltip
                    contentStyle={{ backgroundColor: chartColors.tooltipBg, border: chartColors.tooltipBorder }}
                  />
                  <Legend />
                  <Bar dataKey="actual" fill="#00c8ff" name="Actual" radius={[4, 4, 0, 0]} label={{ position: 'inside', fill: '#fff', fontSize: 11 }} />
                  <Bar dataKey="expected" fill="#ffd700" name="Expected" radius={[4, 4, 0, 0]} label={{ position: 'inside', fill: '#000', fontSize: 11 }} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Chart 2: Daily Report Files by Shift */}
            <div className="glass-card rounded-lg p-4 border border-border/50 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <h3 className="text-sm font-semibold text-foreground">Daily Report Files by Shift</h3>
                <div className="flex flex-wrap gap-2">
                  {/* View By Dropdown */}
                  <Select value={shiftViewBy} onValueChange={setShiftViewBy}>
                    <SelectTrigger className="w-40 bg-secondary text-base font-semibold border-foreground">
                      <SelectValue placeholder="View by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">Last 7 Days</SelectItem>
                      <SelectItem value="30days">Last 30 Days</SelectItem>
                      <SelectItem value="6months">Last 6 Months</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Filter Button */}

                </div>
              </div>

              {/* Total Reports Display */}
              <div className="mb-3 text-right">
                <span className="text-foreground font-semibold">
                  Total Reports: {getFilteredShiftData().reduce((sum, d) => sum + (d['Morning'] || 0) + (d['Afternoon'] || 0) + (d['Night'] || 0), 0)}
                </span>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getFilteredShiftData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                  <XAxis dataKey="date" stroke={chartColors.axis} />
                  <YAxis stroke={chartColors.axis} />
                  <Tooltip contentStyle={{ backgroundColor: chartColors.tooltipBg, border: chartColors.tooltipBorder }} />
                  <Legend />
                  <Bar dataKey="Morning" stackId="a" fill="#00c8ff" label={{ position: 'top', fill: '#fff', fontSize: 10 }} />
                  <Bar dataKey="Afternoon" stackId="a" fill="#ffa500" label={{ position: 'top', fill: '#fff', fontSize: 10 }} />
                  <Bar dataKey="Night" stackId="a" fill="#9333ea" label={{ position: 'top', fill: '#fff', fontSize: 10 }} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Chart 3: Daily Report Files by Activity - 100% Stacked */}
            <div className="glass-card rounded-lg p-4 border border-border/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <h3 className="text-sm font-semibold text-foreground">Daily Report Files by Activity</h3>
                <div className="flex flex-wrap gap-2">
                  {/* View By Dropdown */}
                  <Select value={activityViewBy} onValueChange={setActivityViewBy}>
                    <SelectTrigger className="w-40 bg-secondary text-base font-semibold border-foreground">
                      <SelectValue placeholder="View by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">Last 7 Days</SelectItem>
                      <SelectItem value="30days">Last 30 Days</SelectItem>
                      <SelectItem value="6months">Last 6 Months</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Filter Button */}

                </div>
              </div>

              {/* Total Reports Display */}
              <div className="mb-3 text-right">
                <span className="text-foreground font-semibold">
                  Total Reports: {getFilteredActivityData().reduce((sum, d) => sum + d.total, 0)}
                </span>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getFilteredActivityData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                  <XAxis dataKey="date" stroke={chartColors.axis} />
                  <YAxis stroke={chartColors.axis} stroke={chartColors.axis} />
                  <Tooltip contentStyle={{ backgroundColor: chartColors.tooltipBg, border: chartColors.tooltipBorder }} />
                  <Legend />
                  <Bar dataKey="Sleepers-Production" stackId="a" fill="#00c8ff" />
                  <Bar dataKey="Ballast" stackId="a" fill="#00ff88" />
                  <Bar dataKey="Flashbutt-Welding" stackId="a" fill="#ffa500" />
                  <Bar dataKey="Inspection" stackId="a" fill="#ff6b6b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* Economic Tab */}
        {activeTab === 'economic' && (
          <>
            {/* Weekly Cost KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="glass-card rounded-lg p-5 border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-muted-foreground text-sm font-normal">$</span>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-semibold">Avg Weekly Costs</p>
                </div>
                <p className="text-4xl font-bold text-foreground">€0.38M</p>
                <p className="text-sm text-muted-foreground mt-2">Average cost per week to date</p>
              </div>
              <div className="glass-card rounded-lg p-5 border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-semibold">Required Weekly Costs</p>
                </div>
                <p className="text-4xl font-bold text-foreground">€0.42M</p>
                <p className="text-sm text-muted-foreground mt-2">To achieve projected IC</p>
              </div>
              <div className="glass-card rounded-lg p-5 border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-muted-foreground text-sm font-normal">€</span>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-semibold">Accumulated Production</p>
                </div>
                <p className="text-4xl font-bold text-foreground">€16.66M</p>
                <p className="text-sm text-muted-foreground mt-2">68% of €24.5M contract value</p>
              </div>
            </div>

            {/* Economic Overview bar */}
            <div className="glass-card rounded-lg p-4 border border-border/50 mb-8">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-4">Economic Overview</p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-x-6 gap-y-4 divide-x-0 sm:divide-x divide-border/30">
                <div className="sm:pl-0">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-xs text-muted-foreground">€</span>
                    <span className="text-[11px] text-muted-foreground">Project Budget</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">€24.5M</p>
                </div>
                <div className="sm:pl-6">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <TrendingUp className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground">Commercial IC</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">80.0%</p>
                </div>
                <div className="sm:pl-6">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <TrendingUp className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground">Projected IC</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">92.4%</p>
                </div>
                <div className="sm:pl-6">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <TrendingUp className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground">Current IC</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">90.0%</p>
                </div>
                <div className="sm:pl-6">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <TrendingUp className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground">Analytical IC</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">84.2%</p>
                </div>
              </div>
            </div>

            {/* Economic S-Curve with Filters */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-4 mb-6">
                <Select value={selectedActivity} onValueChange={setSelectedActivity}>
                  <SelectTrigger className="w-48 bg-secondary border-border/50">
                    <SelectValue placeholder="Filter by Activity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Activities</SelectItem>
                    <SelectItem value="a1">A1 - Site Prep</SelectItem>
                    <SelectItem value="a2">A2 - Foundation</SelectItem>
                    <SelectItem value="a3">A3 - Structure</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedWorkfront} onValueChange={setSelectedWorkfront}>
                  <SelectTrigger className="w-48 bg-secondary border-border/50">
                    <SelectValue placeholder="Filter by Workfront" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Workfronts</SelectItem>
                    <SelectItem value="section1">Section 1</SelectItem>
                    <SelectItem value="section2">Section 2</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedCostType} onValueChange={setSelectedCostType}>
                  <SelectTrigger className="w-52 bg-secondary border-border/50">
                    <SelectValue placeholder="Filter by Cost Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cost Types</SelectItem>
                    <SelectItem value="labour">Labour</SelectItem>
                    <SelectItem value="materials">Materials</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                    <SelectItem value="indirect">Indirect Costs</SelectItem>
                    <SelectItem value="subcontracted">Subcontracted</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="glass-card rounded-lg p-4 border border-border/50">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                  <h3 className="text-sm font-semibold text-foreground">Economic S-Curve</h3>
                  <BaselineFilter value={economicBaseline} onChange={setEconomicBaseline} />
                </div>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={getFilteredCostData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                    <XAxis dataKey="week" stroke={chartColors.axis} />
                    <YAxis stroke={chartColors.axis} tickFormatter={(v) => `€${v.toFixed(1)}M`} />
                    <Tooltip contentStyle={{ backgroundColor: chartColors.tooltipBg, border: chartColors.tooltipBorder }} formatter={(v: number) => `€${v.toFixed(1)}M`} />
                    <Legend />
                    <Line type="monotone" dataKey="baseline" stroke="#999999" name="Commercial" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="currentBaseline" stroke={chartColors.isDark ? "#00c8ff" : "#6C5CE7"} name="Current Baseline" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="actualSolid" stroke="#ff6b6b" name="Actual" strokeWidth={2} dot={false} connectNulls={false} />
                    <Line type="monotone" dataKey="actualDashed" stroke="#ff6b6b" strokeWidth={2} dot={false} strokeDasharray="6 4" legendType="none" connectNulls={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Cost Breakdown by Nature */}
            <div className="glass-card rounded-lg p-4 border border-border/50 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <h3 className="text-sm font-semibold text-foreground">Cost Breakdown by Nature</h3>
                <Select value={selectedCostMonth} onValueChange={setSelectedCostMonth}>
                  <SelectTrigger className="w-52 bg-secondary border-border/50">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-month">Last Month (March)</SelectItem>
                    <SelectItem value="february">February</SelectItem>
                    <SelectItem value="january">January</SelectItem>
                    <SelectItem value="december-2025">December 2025</SelectItem>
                    <SelectItem value="november-2025">November 2025</SelectItem>
                    <SelectItem value="october-2025">October 2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getFilteredCostBreakdownData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                  <XAxis dataKey="category" stroke={chartColors.axis} angle={-45} textAnchor="end" height={80} />
                  <YAxis stroke={chartColors.axis} />
                  <Tooltip contentStyle={{ backgroundColor: chartColors.tooltipBg, border: chartColors.tooltipBorder }} formatter={(value) => `€${value.toFixed(1)}M`} />
                  <Legend />
                  <Bar dataKey="planned" fill="#999999" name="Planned" />
                  <Bar dataKey="estimated" fill="#00c8ff" name="Estimated Cost" />
                  <Bar dataKey="actual" fill="#ff6b6b" name="Actual" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-card rounded-lg p-4 border border-border/50 gap-6 mb-8">
              <h3 className="text-sm font-semibold text-foreground mb-4">Economic Summary Table</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left text-xs text-muted-foreground font-semibold py-2 min-w-[140px]">Activity</th>
                      <th className="text-right text-xs text-muted-foreground font-semibold py-2 cursor-pointer hover:text-foreground transition-colors" onClick={() => handleEconomicSort('actualCost')}>
                        Econ. Value (€M) {economicSortBy === 'actualCost' && (economicSortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="text-left text-xs text-muted-foreground font-semibold py-2">Status</th>
                      <th className="text-right text-xs text-muted-foreground font-semibold py-2 cursor-pointer hover:text-foreground transition-colors" onClick={() => handleEconomicSort('baselineCost')}>
                        Current Progress {economicSortBy === 'baselineCost' && (economicSortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="text-right text-xs text-muted-foreground font-semibold py-2">Current Cost (€M)</th>
                      <th className="text-right text-xs text-muted-foreground font-semibold py-2">Commercial IC</th>
                      <th className="text-right text-xs text-muted-foreground font-semibold py-2 cursor-pointer hover:text-foreground transition-colors" onClick={() => handleEconomicSort('totalEstimated')}>
                        Projected IC {economicSortBy === 'totalEstimated' && (economicSortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="text-right text-xs text-muted-foreground font-semibold py-2 cursor-pointer hover:text-foreground transition-colors" onClick={() => handleEconomicSort('totalBaseline')}>
                        Current IC {economicSortBy === 'totalBaseline' && (economicSortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="w-8" />
                    </tr>
                  </thead>
                  <tbody>
                    {getSortedEconomicTable().map((row, idx) => {
                      const activity = activities.find(a => a.name === row.activity)
                      const economicValue = activity?.value ?? 0
                      return (
                        <EconomicTableRow
                          key={idx}
                          row={row}
                          economicValue={economicValue}
                          chartColors={chartColors}
                        />
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </>
        )}
      </main>
    </div>
  )
}
