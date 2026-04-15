'use client'

import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { format, addDays } from 'date-fns'
import type { DateRange } from 'react-day-picker'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
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
  plannedProgress: number   // cumulative expected in unit
  actualProgress: number    // cumulative actual in unit
  plannedCost: number       // cumulative expected cost k€
  actualCost: number        // cumulative actual cost k€
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
      { day: 'Day 1', plannedProgress: 10, actualProgress: 8,  plannedCost: 4.2,  actualCost: 4.8 },
      { day: 'Day 2', plannedProgress: 22, actualProgress: 18, plannedCost: 9.1,  actualCost: 10.3 },
      { day: 'Day 3', plannedProgress: 38, actualProgress: 30, plannedCost: 15.6, actualCost: 17.9 },
      { day: 'Day 4', plannedProgress: 58, actualProgress: 48, plannedCost: 23.8, actualCost: 27.4 },
      { day: 'Day 5', plannedProgress: 75, actualProgress: 62, plannedCost: 30.7, actualCost: 35.2 },
      { day: 'Day 6', plannedProgress: 90, actualProgress: 72, plannedCost: 36.9, actualCost: 42.1 },
      { day: 'Day 7', plannedProgress: 100, actualProgress: 80, plannedCost: 41.0, actualCost: 46.6 },
    ],
    resources: [
      { category: 'Labour',    role: 'Carpenter',           expected: 2, actual: 1, unit: 'workers' },
      { category: 'Labour',    role: 'Concrete Specialist', expected: 3, actual: 3, unit: 'workers' },
      { category: 'Equipment', role: 'Concrete Pump',       expected: 1, actual: 1, unit: 'units' },
      { category: 'Equipment', role: 'Vibrator',            expected: 2, actual: 1, unit: 'units' },
      { category: 'Materials', role: 'Concrete C30',        expected: 100, actual: 80, unit: 'm³' },
      { category: 'Materials', role: 'Rebar',               expected: 8500, actual: 8200, unit: 'kg' },
    ],
  },
  A002: {
    unit: 'ton',
    totalExpected: 45,
    totalActual: 38,
    curve: [
      { day: 'Day 1', plannedProgress: 5,  actualProgress: 4,  plannedCost: 8.0,  actualCost: 9.1 },
      { day: 'Day 2', plannedProgress: 12, actualProgress: 10, plannedCost: 19.2, actualCost: 22.0 },
      { day: 'Day 3', plannedProgress: 22, actualProgress: 18, plannedCost: 35.2, actualCost: 40.4 },
      { day: 'Day 4', plannedProgress: 33, actualProgress: 27, plannedCost: 52.8, actualCost: 61.4 },
      { day: 'Day 5', plannedProgress: 40, actualProgress: 33, plannedCost: 64.0, actualCost: 74.5 },
      { day: 'Day 6', plannedProgress: 45, actualProgress: 38, plannedCost: 72.0, actualCost: 84.2 },
    ],
    resources: [
      { category: 'Labour',    role: 'Steel Fixer',      expected: 4, actual: 3, unit: 'workers' },
      { category: 'Labour',    role: 'Crane Operator',   expected: 1, actual: 1, unit: 'workers' },
      { category: 'Equipment', role: 'Tower Crane',      expected: 1, actual: 1, unit: 'units' },
      { category: 'Equipment', role: 'Welding Machine',  expected: 3, actual: 2, unit: 'units' },
      { category: 'Materials', role: 'Steel S355',       expected: 45000, actual: 38000, unit: 'kg' },
      { category: 'Materials', role: 'Bolts M24',        expected: 1200, actual: 980, unit: 'units' },
    ],
  },
  A003: {
    unit: 'm²',
    totalExpected: 320,
    totalActual: 295,
    curve: [
      { day: 'Day 1', plannedProgress: 40,  actualProgress: 38,  plannedCost: 6.4,  actualCost: 6.9 },
      { day: 'Day 2', plannedProgress: 90,  actualProgress: 85,  plannedCost: 14.4, actualCost: 15.6 },
      { day: 'Day 3', plannedProgress: 150, actualProgress: 140, plannedCost: 24.0, actualCost: 26.1 },
      { day: 'Day 4', plannedProgress: 220, actualProgress: 200, plannedCost: 35.2, actualCost: 38.2 },
      { day: 'Day 5', plannedProgress: 280, actualProgress: 255, plannedCost: 44.8, actualCost: 48.7 },
      { day: 'Day 6', plannedProgress: 320, actualProgress: 295, plannedCost: 51.2, actualCost: 55.8 },
    ],
    resources: [
      { category: 'Labour',    role: 'Facade Installer', expected: 6, actual: 6, unit: 'workers' },
      { category: 'Labour',    role: 'Helper',           expected: 3, actual: 2, unit: 'workers' },
      { category: 'Equipment', role: 'Scaffold',         expected: 1, actual: 1, unit: 'sets' },
      { category: 'Equipment', role: 'Lifting Platform', expected: 2, actual: 2, unit: 'units' },
      { category: 'Materials', role: 'Cladding Panels',  expected: 320, actual: 295, unit: 'm²' },
      { category: 'Materials', role: 'Fixings Kit',      expected: 650, actual: 600, unit: 'units' },
    ],
  },
  A004: {
    unit: 'ml',
    totalExpected: 850,
    totalActual: 710,
    curve: [
      { day: 'Day 1', plannedProgress: 100, actualProgress: 80,  plannedCost: 3.2, actualCost: 3.7 },
      { day: 'Day 2', plannedProgress: 240, actualProgress: 190, plannedCost: 7.7, actualCost: 8.9 },
      { day: 'Day 3', plannedProgress: 420, actualProgress: 340, plannedCost: 13.4, actualCost: 15.5 },
      { day: 'Day 4', plannedProgress: 600, actualProgress: 490, plannedCost: 19.2, actualCost: 22.1 },
      { day: 'Day 5', plannedProgress: 750, actualProgress: 620, plannedCost: 24.0, actualCost: 27.6 },
      { day: 'Day 6', plannedProgress: 850, actualProgress: 710, plannedCost: 27.2, actualCost: 31.2 },
    ],
    resources: [
      { category: 'Labour',    role: 'Electrician',      expected: 4, actual: 3, unit: 'workers' },
      { category: 'Labour',    role: 'Apprentice',       expected: 2, actual: 2, unit: 'workers' },
      { category: 'Equipment', role: 'Cable Puller',     expected: 1, actual: 1, unit: 'units' },
      { category: 'Equipment', role: 'Conduit Bender',   expected: 2, actual: 1, unit: 'units' },
      { category: 'Materials', role: 'Cable 3×2.5mm²',   expected: 850, actual: 710, unit: 'ml' },
      { category: 'Materials', role: 'Conduit 25mm',     expected: 850, actual: 710, unit: 'ml' },
    ],
  },
  A005: {
    unit: 'ml',
    totalExpected: 620,
    totalActual: 590,
    curve: [
      { day: 'Day 1', plannedProgress: 80,  actualProgress: 78,  plannedCost: 2.8, actualCost: 3.1 },
      { day: 'Day 2', plannedProgress: 180, actualProgress: 172, plannedCost: 6.3, actualCost: 7.0 },
      { day: 'Day 3', plannedProgress: 310, actualProgress: 295, plannedCost: 10.9, actualCost: 12.1 },
      { day: 'Day 4', plannedProgress: 450, actualProgress: 430, plannedCost: 15.8, actualCost: 17.4 },
      { day: 'Day 5', plannedProgress: 560, actualProgress: 535, plannedCost: 19.6, actualCost: 21.6 },
      { day: 'Day 6', plannedProgress: 620, actualProgress: 590, plannedCost: 21.7, actualCost: 23.9 },
    ],
    resources: [
      { category: 'Labour',    role: 'Plumber',          expected: 3, actual: 3, unit: 'workers' },
      { category: 'Labour',    role: 'Helper',           expected: 2, actual: 2, unit: 'workers' },
      { category: 'Equipment', role: 'Pipe Bender',      expected: 1, actual: 1, unit: 'units' },
      { category: 'Equipment', role: 'Pressure Tester',  expected: 1, actual: 1, unit: 'units' },
      { category: 'Materials', role: 'Copper Pipe 28mm', expected: 620, actual: 590, unit: 'ml' },
      { category: 'Materials', role: 'Fittings',         expected: 310, actual: 295, unit: 'units' },
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
                  <th className="text-left text-[10px] text-muted-foreground font-medium pb-1.5 pr-2">Role</th>
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

function ActivitySCurve({ data, unit }: { data: DailyRecord[]; unit: string }) {
  const colors = useChartColors()

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
        <XAxis dataKey="day" stroke={colors.axis} tick={{ fontSize: 11 }} />
        <YAxis
          yAxisId="progress"
          stroke={colors.axis}
          tick={{ fontSize: 11 }}
          tickFormatter={(v) => `${v} ${unit}`}
          width={64}
        />
        <YAxis
          yAxisId="cost"
          orientation="right"
          stroke={colors.axis}
          tick={{ fontSize: 11 }}
          tickFormatter={(v) => `€${v}k`}
          width={52}
        />
        <Tooltip
          contentStyle={{ backgroundColor: colors.tooltipBg, border: colors.tooltipBorder, fontSize: 12 }}
          formatter={(value: number, name: string) =>
            name.includes('Cost') ? [`€${value}k`, name] : [`${value} ${unit}`, name]
          }
        />
        <Legend wrapperStyle={{ paddingTop: 10, fontSize: 12 }} iconType="line" />
        <Line yAxisId="progress" type="monotone" dataKey="plannedProgress" name="Expected Progress" stroke="#9CA3AF" strokeWidth={2} dot={false} />
        <Line yAxisId="progress" type="monotone" dataKey="actualProgress"  name="Actual Progress"  stroke={colors.isDark ? '#00ff88' : '#00b894'} strokeWidth={2} dot={{ r: 3 }} />
        <Line yAxisId="cost"     type="monotone" dataKey="plannedCost"     name="Expected Cost"    stroke={colors.isDark ? '#00c8ff' : '#6C5CE7'} strokeWidth={2} dot={false} strokeDasharray="5 3" />
        <Line yAxisId="cost"     type="monotone" dataKey="actualCost"      name="Actual Cost"      stroke="#ff6b6b"                               strokeWidth={2} dot={{ r: 3 }} />
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
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 3, 1),
    to: addDays(new Date(2025, 3, 1), 6),
  })
  const [calOpen, setCalOpen] = useState(false)

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

          {/* Date range picker */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              Period
            </label>
            <Popover open={calOpen} onOpenChange={setCalOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 min-w-[220px] justify-start gap-2 text-sm font-normal bg-secondary border-border/50"
                >
                  <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, 'dd MMM yyyy')} – {format(dateRange.to, 'dd MMM yyyy')}
                      </>
                    ) : (
                      format(dateRange.from, 'dd MMM yyyy')
                    )
                  ) : (
                    <span className="text-muted-foreground">Select period</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => {
                    setDateRange(range)
                    if (range?.from && range?.to) setCalOpen(false)
                  }}
                  numberOfMonths={2}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
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
                  <td className="text-xs text-muted-foreground py-1.5 pr-2">Expected</td>
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
                  <td className="text-xs text-muted-foreground py-1.5 pr-2">Delta</td>
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

      {/* ── Row 3: S-Curve + KPI card ─────────────────────────────────────── */}
      <div className="flex gap-4">
        {/* S-Curve — 3/4 width */}
        <div className="glass-card rounded-lg p-4 flex-[3] min-w-0">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-foreground">Activity S-Curve</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {activityMeta.label} — cumulative progress &amp; cost over period
            </p>
          </div>
          <ActivitySCurve data={activity.curve} unit={activityMeta.unit} />
        </div>

        {/* KPI card — 1/4 width */}
        <div className="glass-card rounded-lg p-4 flex-[1] min-w-[180px] flex flex-col justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 mb-2">
            KPIs
          </h3>
          <div className="flex-1">
            <KPICard
              label="Accumulated Progress"
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
              label="Expected Cost"
              expected={`€${lastCost.plannedCost}k`}
              actual={`€${lastCost.actualCost}k`}
            />
            <KPICard
              label="Cost Variance"
              expected="0%"
              actual={`+${(((lastCost.actualCost - lastCost.plannedCost) / lastCost.plannedCost) * 100).toFixed(1)}%`}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
