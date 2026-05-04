'use client'

import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from 'recharts'
import { useChartColors } from '@/hooks/use-chart-colors'

// ─── Mock Data ──────────────────────────────────────────────────────────────

const ACTIVITIES = [
  { id: 'A001', label: 'A001 – Concrete Foundations', unit: 'm³' },
  { id: 'A002', label: 'A002 – Steel Structure Assembly', unit: 'ton' },
  { id: 'A003', label: 'A003 – Facade Cladding', unit: 'm²' },
  { id: 'A004', label: 'A004 – Electrical Rough-In', unit: 'ml' },
  { id: 'A005', label: 'A005 – Plumbing Installation', unit: 'ml' },
]

type ActivityId = 'A001' | 'A002' | 'A003' | 'A004' | 'A005'

interface DailyRecord {
  day: string
  plannedProgress: number    // cumulative planned (original baseline) in unit
  baselineProgress: number   // cumulative current baseline in unit
  actualProgress: number     // cumulative actual in unit
  plannedCost: number        // cumulative planned cost k€
  baselineCost: number       // cumulative current baseline cost k€
  actualCost: number         // cumulative actual cost k€
}

interface ResourceRecord {
  category: 'Labour' | 'Equipment' | 'Materials'
  role: string
  expected: number
  actual: number
  unit: string
}

interface ActivityData {
  unit: string
  totalExpected: number
  totalActual: number
  curve: DailyRecord[]
  resources: ResourceRecord[]
}

const ACTIVITY_DATA: Record<ActivityId, ActivityData> = {
  A001: {
    unit: 'm³',
    totalExpected: 100,
    totalActual: 80,
    curve: [
      { day: 'Day 1', plannedProgress: 10, baselineProgress: 11, actualProgress: 8, plannedCost: 4.2, baselineCost: 4.5, actualCost: 4.8 },
      { day: 'Day 2', plannedProgress: 22, baselineProgress: 24, actualProgress: 18, plannedCost: 9.1, baselineCost: 9.8, actualCost: 10.3 },
      { day: 'Day 3', plannedProgress: 38, baselineProgress: 40, actualProgress: 30, plannedCost: 15.6, baselineCost: 16.8, actualCost: 17.9 },
      { day: 'Day 4', plannedProgress: 58, baselineProgress: 61, actualProgress: 48, plannedCost: 23.8, baselineCost: 25.5, actualCost: 27.4 },
      { day: 'Day 5', plannedProgress: 75, baselineProgress: 78, actualProgress: 62, plannedCost: 30.7, baselineCost: 33.0, actualCost: 35.2 },
      { day: 'Day 6', plannedProgress: 90, baselineProgress: 93, actualProgress: 72, plannedCost: 36.9, baselineCost: 39.5, actualCost: 42.1 },
      { day: 'Day 7', plannedProgress: 100, baselineProgress: 100, actualProgress: 80, plannedCost: 41.0, baselineCost: 44.0, actualCost: 46.6 },
    ],
    resources: [
      { category: 'Labour', role: 'Carpenter', expected: 16, actual: 8, unit: 'h' },
      { category: 'Labour', role: 'Concrete Specialist', expected: 24, actual: 22, unit: 'h' },
      { category: 'Equipment', role: 'Concrete Pump', expected: 1, actual: 1, unit: 'units' },
      { category: 'Equipment', role: 'Hilux', expected: 2, actual: 1, unit: 'units' },
      { category: 'Materials', role: 'Concrete C30', expected: 100, actual: 80, unit: 'm³' },
      { category: 'Materials', role: 'Rebar', expected: 8500, actual: 8200, unit: 'kg' },
    ],
  },
  A002: {
    unit: 'ton',
    totalExpected: 45,
    totalActual: 38,
    curve: [
      { day: 'Day 1', plannedProgress: 5, baselineProgress: 5, actualProgress: 4, plannedCost: 8.0, baselineCost: 8.5, actualCost: 9.1 },
      { day: 'Day 2', plannedProgress: 12, baselineProgress: 13, actualProgress: 10, plannedCost: 19.2, baselineCost: 20.5, actualCost: 22.0 },
      { day: 'Day 3', plannedProgress: 22, baselineProgress: 23, actualProgress: 18, plannedCost: 35.2, baselineCost: 37.5, actualCost: 40.4 },
      { day: 'Day 4', plannedProgress: 33, baselineProgress: 35, actualProgress: 27, plannedCost: 52.8, baselineCost: 56.0, actualCost: 61.4 },
      { day: 'Day 5', plannedProgress: 40, baselineProgress: 42, actualProgress: 33, plannedCost: 64.0, baselineCost: 68.0, actualCost: 74.5 },
      { day: 'Day 6', plannedProgress: 45, baselineProgress: 45, actualProgress: 38, plannedCost: 72.0, baselineCost: 77.0, actualCost: 84.2 },
    ],
    resources: [
      { category: 'Labour', role: 'Steel Fixer', expected: 32, actual: 24, unit: 'h' },
      { category: 'Labour', role: 'Crane Operator', expected: 8, actual: 8, unit: 'h' },
      { category: 'Equipment', role: 'Tower Crane', expected: 1, actual: 1, unit: 'units' },
      { category: 'Equipment', role: 'Welding Machine', expected: 3, actual: 2, unit: 'units' },
      { category: 'Materials', role: 'Steel S355', expected: 45000, actual: 38000, unit: 'kg' },
      { category: 'Materials', role: 'Bolts M24', expected: 1200, actual: 980, unit: 'units' },
    ],
  },
  A003: {
    unit: 'm²',
    totalExpected: 320,
    totalActual: 295,
    curve: [
      { day: 'Day 1', plannedProgress: 40, baselineProgress: 42, actualProgress: 38, plannedCost: 6.4, baselineCost: 6.7, actualCost: 6.9 },
      { day: 'Day 2', plannedProgress: 90, baselineProgress: 94, actualProgress: 85, plannedCost: 14.4, baselineCost: 15.0, actualCost: 15.6 },
      { day: 'Day 3', plannedProgress: 150, baselineProgress: 156, actualProgress: 140, plannedCost: 24.0, baselineCost: 25.0, actualCost: 26.1 },
      { day: 'Day 4', plannedProgress: 220, baselineProgress: 228, actualProgress: 200, plannedCost: 35.2, baselineCost: 36.6, actualCost: 38.2 },
      { day: 'Day 5', plannedProgress: 280, baselineProgress: 290, actualProgress: 255, plannedCost: 44.8, baselineCost: 46.5, actualCost: 48.7 },
      { day: 'Day 6', plannedProgress: 320, baselineProgress: 320, actualProgress: 295, plannedCost: 51.2, baselineCost: 53.2, actualCost: 55.8 },
    ],
    resources: [
      { category: 'Labour', role: 'Facade Installer', expected: 48, actual: 46, unit: 'h' },
      { category: 'Labour', role: 'Helper', expected: 24, actual: 16, unit: 'h' },
      { category: 'Equipment', role: 'Scaffold', expected: 1, actual: 1, unit: 'sets' },
      { category: 'Equipment', role: 'Lifting Platform', expected: 2, actual: 2, unit: 'units' },
      { category: 'Materials', role: 'Cladding Panels', expected: 320, actual: 295, unit: 'm²' },
      { category: 'Materials', role: 'Fixings Kit', expected: 650, actual: 600, unit: 'units' },
    ],
  },
  A004: {
    unit: 'ml',
    totalExpected: 850,
    totalActual: 710,
    curve: [
      { day: 'Day 1', plannedProgress: 100, baselineProgress: 105, actualProgress: 80, plannedCost: 3.2, baselineCost: 3.5, actualCost: 3.7 },
      { day: 'Day 2', plannedProgress: 240, baselineProgress: 250, actualProgress: 190, plannedCost: 7.7, baselineCost: 8.2, actualCost: 8.9 },
      { day: 'Day 3', plannedProgress: 420, baselineProgress: 440, actualProgress: 340, plannedCost: 13.4, baselineCost: 14.3, actualCost: 15.5 },
      { day: 'Day 4', plannedProgress: 600, baselineProgress: 625, actualProgress: 490, plannedCost: 19.2, baselineCost: 20.4, actualCost: 22.1 },
      { day: 'Day 5', plannedProgress: 750, baselineProgress: 780, actualProgress: 620, plannedCost: 24.0, baselineCost: 25.5, actualCost: 27.6 },
      { day: 'Day 6', plannedProgress: 850, baselineProgress: 850, actualProgress: 710, plannedCost: 27.2, baselineCost: 29.0, actualCost: 31.2 },
    ],
    resources: [
      { category: 'Labour', role: 'Electrician', expected: 32, actual: 24, unit: 'h' },
      { category: 'Labour', role: 'Apprentice', expected: 16, actual: 16, unit: 'h' },
      { category: 'Equipment', role: 'Cable Puller', expected: 1, actual: 1, unit: 'units' },
      { category: 'Equipment', role: 'Conduit Bender', expected: 2, actual: 1, unit: 'units' },
      { category: 'Materials', role: 'Cable 3×2.5mm²', expected: 850, actual: 710, unit: 'ml' },
      { category: 'Materials', role: 'Conduit 25mm', expected: 850, actual: 710, unit: 'ml' },
    ],
  },
  A005: {
    unit: 'ml',
    totalExpected: 620,
    totalActual: 590,
    curve: [
      { day: 'Day 1', plannedProgress: 80, baselineProgress: 82, actualProgress: 78, plannedCost: 2.8, baselineCost: 2.9, actualCost: 3.1 },
      { day: 'Day 2', plannedProgress: 180, baselineProgress: 185, actualProgress: 172, plannedCost: 6.3, baselineCost: 6.6, actualCost: 7.0 },
      { day: 'Day 3', plannedProgress: 310, baselineProgress: 318, actualProgress: 295, plannedCost: 10.9, baselineCost: 11.4, actualCost: 12.1 },
      { day: 'Day 4', plannedProgress: 450, baselineProgress: 460, actualProgress: 430, plannedCost: 15.8, baselineCost: 16.5, actualCost: 17.4 },
      { day: 'Day 5', plannedProgress: 560, baselineProgress: 572, actualProgress: 535, plannedCost: 19.6, baselineCost: 20.5, actualCost: 21.6 },
      { day: 'Day 6', plannedProgress: 620, baselineProgress: 620, actualProgress: 590, plannedCost: 21.7, baselineCost: 22.7, actualCost: 23.9 },
    ],
    resources: [
      { category: 'Labour', role: 'Plumber', expected: 24, actual: 22, unit: 'h' },
      { category: 'Labour', role: 'Helper', expected: 16, actual: 14, unit: 'h' },
      { category: 'Equipment', role: 'Pipe Bender', expected: 1, actual: 1, unit: 'units' },
      { category: 'Equipment', role: 'Pressure Tester', expected: 1, actual: 1, unit: 'units' },
      { category: 'Materials', role: 'Copper Pipe 28mm', expected: 620, actual: 590, unit: 'ml' },
      { category: 'Materials', role: 'Fittings', expected: 310, actual: 295, unit: 'units' },
    ],
  },
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Delta({ expected, actual }: { expected: number; actual: number }) {
  const diff = actual - expected
  if (diff === 0) return <Minus className="w-3.5 h-3.5 text-muted-foreground inline" />
  if (diff > 0)
    return (
      <span className="inline-flex items-center gap-0.5 text-success text-xs font-medium">
        <TrendingUp className="w-3.5 h-3.5" />+{diff}
      </span>
    )
  return (
    <span className="inline-flex items-center gap-0.5 text-destructive text-xs font-medium">
      <TrendingDown className="w-3.5 h-3.5" />{diff}
    </span>
  )
}

function ResourceTable({ resources }: { resources: ResourceRecord[] }) {
  const categories: Array<'Labour' | 'Equipment' | 'Materials'> = ['Labour', 'Equipment', 'Materials']

  return (
    <div className="flex gap-4 w-full">
      {categories.map((cat) => {
        const rows = resources.filter((r) => r.category === cat)
        return (
          <div key={cat} className="flex-1 min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2 border-b border-border/40 pb-1">
              {cat}
            </div>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left text-[10px] text-muted-foreground font-medium pb-1.5 pr-2">Resource</th>
                  <th className="text-right text-[10px] text-muted-foreground font-medium pb-1.5 pr-2">Expected</th>
                  <th className="text-right text-[10px] text-muted-foreground font-medium pb-1.5 pr-2">Actual</th>
                  <th className="text-right text-[10px] text-muted-foreground font-medium pb-1.5">Delta</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-t border-border/20">
                    <td className="text-xs text-foreground py-1.5 pr-2 truncate max-w-[100px]">{r.role}</td>
                    <td className="text-xs font-mono text-muted-foreground text-right py-1.5 pr-2 whitespace-nowrap">
                      {r.expected.toLocaleString()} <span className="text-[10px]">{r.unit}</span>
                    </td>
                    <td className="text-xs font-mono text-foreground text-right py-1.5 pr-2 whitespace-nowrap">
                      {r.actual.toLocaleString()} <span className="text-[10px]">{r.unit}</span>
                    </td>
                    <td className="text-right py-1.5">
                      <Delta expected={r.expected} actual={r.actual} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      })}
    </div>
  )
}

function ProgressSCurve({ data, unit }: { data: DailyRecord[]; unit: string }) {
  const colors = useChartColors()
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 5, right: 16, left: 20, bottom: 24 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
        <XAxis dataKey="day" stroke={colors.axis} tick={{ fontSize: 11 }}>
          <Label value="Days" offset={-8} position="insideBottom" style={{ fontSize: 11, fill: colors.axis }} />
        </XAxis>
        <YAxis
          stroke={colors.axis}
          tick={{ fontSize: 11 }}
          tickFormatter={(v) => `${v} ${unit}`}
          width={60}
        >
          <Label value={unit} angle={-90} position="insideLeft" offset={-10} style={{ fontSize: 11, fill: colors.axis }} />
        </YAxis>
        <Tooltip
          contentStyle={{ backgroundColor: colors.tooltipBg, border: colors.tooltipBorder, fontSize: 12 }}
          formatter={(value: number, name: string) => [`${value} ${unit}`, name]}
        />
        <Legend wrapperStyle={{ paddingTop: 8, fontSize: 11 }} iconType="line" />
        <Line type="monotone" dataKey="plannedProgress" name="Planned" stroke="#9CA3AF" strokeWidth={2} strokeDasharray="6 3" dot={false} />
        <Line type="monotone" dataKey="baselineProgress" name="Current Baseline" stroke={colors.isDark ? '#60a5fa' : '#3B82F6'} strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="actualProgress" name="Actual" stroke={colors.isDark ? '#34d399' : '#10B981'} strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

function CostSCurve({ data }: { data: DailyRecord[] }) {
  const colors = useChartColors()
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 5, right: 16, left: 20, bottom: 24 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
        <XAxis dataKey="day" stroke={colors.axis} tick={{ fontSize: 11 }}>
          <Label value="Days" offset={-8} position="insideBottom" style={{ fontSize: 11, fill: colors.axis }} />
        </XAxis>
        <YAxis
          stroke={colors.axis}
          tick={{ fontSize: 11 }}
          tickFormatter={(v) => `€${v}k`}
          width={60}
        >
          <Label value="Cost (k€)" angle={-90} position="insideLeft" offset={-10} style={{ fontSize: 11, fill: colors.axis }} />
        </YAxis>
        <Tooltip
          contentStyle={{ backgroundColor: colors.tooltipBg, border: colors.tooltipBorder, fontSize: 12 }}
          formatter={(value: number, name: string) => [`€${value}k`, name]}
        />
        <Legend wrapperStyle={{ paddingTop: 8, fontSize: 11 }} iconType="line" />
        <Line type="monotone" dataKey="plannedCost" name="Planned" stroke="#9CA3AF" strokeWidth={2} strokeDasharray="6 3" dot={false} />
        <Line type="monotone" dataKey="baselineCost" name="Current Baseline" stroke={colors.isDark ? '#c084fc' : '#8B5CF6'} strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="actualCost" name="Actual" stroke="#F87171" strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

function KPICard({
  label,
  expected,
  actual,
  unit,
}: {
  label: string
  expected: string
  actual: string
  unit?: string
}) {
  return (
    <div className="flex flex-col gap-1.5 py-3 border-b border-border/30 last:border-0">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">{label}</p>
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="text-[10px] text-muted-foreground mb-0.5">Expected</p>
          <p className="text-sm font-bold font-mono text-foreground">{expected}{unit ? ` ${unit}` : ''}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-muted-foreground mb-0.5">Actual</p>
          <p className="text-sm font-bold font-mono text-foreground">{actual}{unit ? ` ${unit}` : ''}</p>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function ActivityDrillDownSection() {
  const [selectedActivity, setSelectedActivity] = useState<ActivityId>('A001')
  const [dateFrom, setDateFrom] = useState('2026-03-01')
  const [dateTo, setDateTo] = useState('2026-03-07')

  const activity = ACTIVITY_DATA[selectedActivity]
  const activityMeta = ACTIVITIES.find((a) => a.id === selectedActivity)!

  const progressPct = Math.round((activity.totalActual / activity.totalExpected) * 100)
  const expectedPct = 100
  const lastCost = activity.curve[activity.curve.length - 1]

  return (
    <section className="mb-8">
      {/* Section title */}
      <h2 className="text-lg font-semibold text-foreground mb-4">Activity Drill-Down</h2>

      {/* ── Row 1: Filters ───────────────────────────────────────────────── */}
      <div className="glass-card rounded-lg p-4 mb-4">
        <div className="flex flex-wrap items-end gap-4">
          {/* Activity dropdown */}
          <div className="flex flex-col gap-1.5 min-w-[240px]">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              Activity
            </label>
            <Select
              value={selectedActivity}
              onValueChange={(v) => setSelectedActivity(v as ActivityId)}
            >
              <SelectTrigger className="h-9 text-sm bg-secondary border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACTIVITIES.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date range — From */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              From
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="h-9 rounded-md border border-border/50 bg-secondary px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30"
            />
          </div>

          {/* Date range — To */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              To
            </label>
            <input
              type="date"
              value={dateTo}
              min={dateFrom}
              onChange={(e) => setDateTo(e.target.value)}
              className="h-9 rounded-md border border-border/50 bg-secondary px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30"
            />
          </div>
        </div>
      </div>

      {/* ── Row 2: Progress + Resources table ────────────────────────────── */}
      <div className="glass-card rounded-lg p-4 mb-4">
        <div className="flex gap-6">
          {/* Progress block */}
          <div className="shrink-0 w-48">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-3 border-b border-border/40 pb-1">
              Progress
            </div>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left text-[10px] text-muted-foreground font-medium pb-1.5" />
                  <th className="text-right text-[10px] text-muted-foreground font-medium pb-1.5">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border/20">
                  <td className="text-xs text-muted-foreground py-1.5 pr-2">Projected</td>
                  <td className="text-xs font-mono text-foreground text-right py-1.5 whitespace-nowrap">
                    {activity.totalExpected} <span className="text-[10px]">{activityMeta.unit}</span>
                  </td>
                </tr>
                <tr className="border-t border-border/20">
                  <td className="text-xs text-muted-foreground py-1.5 pr-2">Actual</td>
                  <td className="text-xs font-mono text-foreground text-right py-1.5 whitespace-nowrap">
                    {activity.totalActual} <span className="text-[10px]">{activityMeta.unit}</span>
                  </td>
                </tr>
                <tr className="border-t border-border/20">
                  <td className="text-xs text-muted-foreground py-1.5 pr-2">Variation</td>
                  <td className="text-right py-1.5">
                    <Delta expected={activity.totalExpected} actual={activity.totalActual} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Divider */}
          <div className="w-px bg-border/40 self-stretch" />

          {/* Resources block */}
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-3 border-b border-border/40 pb-1">
              Resources Used
            </div>
            <ResourceTable resources={activity.resources} />
          </div>
        </div>
      </div>

      {/* ── Row 3: Two stacked S-Curves (3/4) + KPI card (1/4) ───────────── */}
      <div className="flex gap-4 items-stretch">

        {/* Charts column — 3/4 width */}
        <div className="flex-[3] min-w-0 flex flex-col gap-4">
          {/* Progress S-Curve */}
          <div className="glass-card rounded-lg p-4">
            <div className="mb-2">
              <h3 className="text-sm font-semibold text-foreground">Progress S-Curve</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {activityMeta.label} — cumulative progress ({activityMeta.unit})
              </p>
            </div>
            <ProgressSCurve data={activity.curve} unit={activityMeta.unit} />
          </div>

          {/* Cost S-Curve */}
          <div className="glass-card rounded-lg p-4">
            <div className="mb-2">
              <h3 className="text-sm font-semibold text-foreground">Cost S-Curve</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {activityMeta.label} — cumulative cost (k€)
              </p>
            </div>
            <CostSCurve data={activity.curve} />
          </div>
        </div>

        {/* KPI card — 1/4 width, full height */}
        <div className="glass-card rounded-lg p-4 flex-[1] min-w-[180px] flex flex-col">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 mb-4">
            KPIs
          </h3>
          <div className="flex-1 flex flex-col justify-around">
            <KPICard
              label="Accum. Progress"
              expected={`${expectedPct}%`}
              actual={`${progressPct}%`}
            />
            <KPICard
              label="Progress in Units"
              expected={`${activity.totalExpected}`}
              actual={`${activity.totalActual}`}
              unit={activityMeta.unit}
            />
            <KPICard
              label="Planned Cost"
              expected={`€${lastCost.plannedCost}k`}
              actual={`€${lastCost.actualCost}k`}
            />
            <KPICard
              label="Cost Variance"
              expected="0.0%"
              actual={`+${(((lastCost.actualCost - lastCost.plannedCost) / lastCost.plannedCost) * 100).toFixed(1)}%`}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
