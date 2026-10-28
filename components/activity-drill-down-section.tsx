'use client'

import { useMemo, useState } from 'react'
import {
  ACTIVITIES,
  DEFAULT_ACTIVITY_ID,
  PROJECT_END,
  PROJECT_START,
  buildChartSeries,
  clampRange,
  computePeriod,
  getActivityModel,
  getTodayIso,
} from '@/lib/activity-drill-down-data'
import { ActivityCombobox } from '@/components/activity-drill-down/activity-combobox'
import { KpiCards } from '@/components/activity-drill-down/kpi-cards'
import { CostSCurve, ProgressSCurve } from '@/components/activity-drill-down/curves'
import { ResourceTables } from '@/components/activity-drill-down/resource-tables'

const filterLabel = 'text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60'
const dateInput =
  'h-9 rounded-md border border-border/50 bg-secondary px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30'

export function ActivityDrillDownSection() {
  const [today] = useState(getTodayIso)
  const [selectedActivity, setSelectedActivity] = useState(DEFAULT_ACTIVITY_ID)
  const [dateFrom, setDateFrom] = useState(PROJECT_START)
  const [dateTo, setDateTo] = useState(today)

  const model = useMemo(() => getActivityModel(selectedActivity, today), [selectedActivity, today])
  const { from, to } = clampRange(dateFrom, dateTo)
  const summary = useMemo(() => computePeriod(model, from, to), [model, from, to])
  const chartData = useMemo(() => buildChartSeries(model, from, to), [model, from, to])

  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-foreground mb-4">Activity Drill-Down</h2>

      {/* ── Filters ──────────────────────────────────────────────────────── */}
      <div className="glass-card rounded-lg p-4 mb-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1.5 w-full sm:w-[380px]">
            <label htmlFor="activity-combobox" className={filterLabel}>
              Activity
            </label>
            <ActivityCombobox
              id="activity-combobox"
              options={ACTIVITIES}
              value={selectedActivity}
              onChange={setSelectedActivity}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="drilldown-from" className={filterLabel}>
              From
            </label>
            <input
              id="drilldown-from"
              type="date"
              value={dateFrom}
              min={PROJECT_START}
              max={dateTo}
              onChange={(e) => e.target.value && setDateFrom(e.target.value)}
              className={dateInput}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="drilldown-to" className={filterLabel}>
              To
            </label>
            <input
              id="drilldown-to"
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

      {/* ── KPI cards ────────────────────────────────────────────────────── */}
      <div className="mb-4">
        <KpiCards summary={summary} unit={model.unit} />
      </div>

      {/* ── Curves ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
        <ProgressSCurve data={chartData} unit={model.unit} activityLabel={model.label} />
        <CostSCurve data={chartData} activityLabel={model.label} />
      </div>

      {/* ── Resource tables ──────────────────────────────────────────────── */}
      <ResourceTables summary={summary} />
    </section>
  )
}
