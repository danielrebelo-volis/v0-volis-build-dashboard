'use client'

import { useMemo, useState } from 'react'
import { Clock, Gauge, Hourglass, HardHat, Package } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useChartColors } from '@/hooks/use-chart-colors'
import { PROJECT_END, PROJECT_START, clampRange, dateToIndex, formatPct, formatQty, getTodayIso } from '@/lib/activity-drill-down-data'
import { buildWeeklyEquipmentHours, computeEquipmentSummary } from '@/lib/equipment-resources-data'
import { SegmentedToggle } from '@/components/activity-drill-down/shared'
import { StatCard } from '@/components/activity-drill-down/kpi-cards'
import { EquipmentTable } from '@/components/resources/equipment-table'

type ResourceType = 'equipment' | 'workforce' | 'materials'

const RESOURCE_TYPE_OPTIONS: Array<{ value: ResourceType; label: string }> = [
  { value: 'equipment', label: 'Equipment' },
  { value: 'workforce', label: 'Workforce' },
  { value: 'materials', label: 'Materials' },
]

const PRODUCTIVE_AVAILABILITY_INFO =
  'Share of the time equipment was allocated to activities in which it was actually working. Simplified version: breakdown and parked time are not tracked yet.'

const filterLabel = 'text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60'
const dateInput =
  'h-9 rounded-md border border-border/50 bg-secondary px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30'

// ─── Equipment view ────────────────────────────────────────────────────────────

function EquipmentView({ from, to }: { from: number; to: number }) {
  const chartColors = useChartColors()
  const summary = useMemo(() => computeEquipmentSummary(from, to), [from, to])
  const weekly = useMemo(() => buildWeeklyEquipmentHours(from, to), [from, to])
  const allocated = summary.hoursWorked + summary.hoursIdle

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          icon={Gauge}
          title="Productive Availability"
          info={PRODUCTIVE_AVAILABILITY_INFO}
          value={summary.productiveAvailability === null ? '—' : formatPct(summary.productiveAvailability)}
          caption="Hours worked / (hours worked + hours idle)"
          progress={summary.productiveAvailability}
          footer={`${formatQty(allocated)} h allocated to activities`}
        />
        <StatCard
          icon={Clock}
          title="Hours Worked"
          value={`${formatQty(summary.hoursWorked)} h`}
          caption="Allocated to an activity and actively working"
          footer={`${summary.activeCount} of ${summary.itemCount} equipment items logged hours`}
        />
        <StatCard
          icon={Hourglass}
          title="Hours Idle"
          value={`${formatQty(summary.hoursIdle)} h`}
          caption="Allocated to an activity but not working"
          footer={`${allocated > 0 ? formatPct((summary.hoursIdle / allocated) * 100) : '—'} of allocated hours`}
        />
      </div>

      <EquipmentTable groups={summary.groups} />

      <div className="glass-card rounded-lg p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Weekly Equipment Hours</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={weekly} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
            <XAxis dataKey="week" stroke={chartColors.axis} tick={{ fontSize: 10 }} />
            <YAxis stroke={chartColors.axis} tick={{ fontSize: 10 }} tickFormatter={(v) => `${formatQty(v)}h`} width={52} />
            <Tooltip
              contentStyle={{ backgroundColor: chartColors.tooltipBg, border: chartColors.tooltipBorder, fontSize: 11 }}
              formatter={(v: number) => [`${formatQty(v)} h`]}
              labelFormatter={(l) => `Week of ${l}`}
            />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
            <Bar dataKey="worked" name="Hours Worked" stackId="a" fill="#16a34a" />
            <Bar dataKey="idle" name="Hours Idle" stackId="a" fill="#a0a0a0" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// ─── Placeholder for upcoming resource types ───────────────────────────────────

function ComingSoon({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="glass-card flex flex-col items-center justify-center gap-2 rounded-lg px-6 py-16 text-center">
      <div className="rounded-full bg-secondary p-3">
        <Icon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
      </div>
      <h3 className="text-sm font-semibold text-foreground">Coming soon</h3>
      <p className="max-w-sm text-xs text-muted-foreground">
        {label} KPIs and the {label.toLowerCase()} breakdown table will be available in a future release.
      </p>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export function ResourcesSection() {
  const [today] = useState(getTodayIso)
  const [resourceType, setResourceType] = useState<ResourceType>('equipment')
  const [dateFrom, setDateFrom] = useState(PROJECT_START)
  const [dateTo, setDateTo] = useState(today)
  const { from, to } = clampRange(dateFrom, dateTo)

  return (
    <section className="mb-8">
      <div className="glass-card rounded-lg p-4 mb-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <span className={filterLabel}>Resource type</span>
            <SegmentedToggle value={resourceType} onChange={setResourceType} options={RESOURCE_TYPE_OPTIONS} ariaLabel="Resource type" />
          </div>

          <div className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="resources-from" className={filterLabel}>From</label>
              <input
                id="resources-from"
                type="date"
                value={dateFrom}
                min={PROJECT_START}
                max={dateTo}
                onChange={(e) => e.target.value && setDateFrom(e.target.value)}
                className={dateInput}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="resources-to" className={filterLabel}>To</label>
              <input
                id="resources-to"
                type="date"
                value={dateTo}
                min={dateFrom}
                max={PROJECT_END}
                onChange={(e) => e.target.value && setDateTo(e.target.value)}
                className={dateInput}
              />
            </div>
          </div>
        </div>
      </div>

      {resourceType === 'equipment' && <EquipmentView from={from} to={Math.max(from, Math.min(to, dateToIndex(today)))} />}
      {resourceType === 'workforce' && <ComingSoon icon={HardHat} label="Workforce" />}
      {resourceType === 'materials' && <ComingSoon icon={Package} label="Materials" />}
    </section>
  )
}
