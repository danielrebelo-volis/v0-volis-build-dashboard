'use client'

import { useMemo, useState } from 'react'
import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useChartColors } from '@/hooks/use-chart-colors'
import { type ChartPoint, RESOURCE_CATEGORIES, type ResourceCategory } from '@/lib/activity-drill-down-data'
import { SegmentedToggle } from './shared'

type ProgressView = 'physical' | 'economic'
type CostFilter = 'all' | ResourceCategory

const CATEGORY_META: Record<ResourceCategory, { label: string; color: string }> = {
  labor: { label: 'Manpower', color: '#64748b' },
  equipment: { label: 'Equipment', color: '#a78bfa' },
  materials: { label: 'Material', color: '#38bdf8' },
}

function ChartCard({
  title,
  subtitle,
  toggle,
  children,
}: {
  title: string
  subtitle: string
  toggle: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="glass-card min-w-0 rounded-lg p-4">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
        </div>
        {toggle}
      </div>
      {children}
    </div>
  )
}

export function ProgressSCurve({ data, unit, activityLabel }: { data: ChartPoint[]; unit: string; activityLabel: string }) {
  const colors = useChartColors()
  const [view, setView] = useState<ProgressView>('physical')
  const isEconomic = view === 'economic'
  const format = (v: number) => (isEconomic ? `€${v}k` : `${v} ${unit}`)

  return (
    <ChartCard
      title="Progress S-Curve"
      subtitle={`${activityLabel} — cumulative ${isEconomic ? 'value (k€)' : `progress (${unit})`}`}
      toggle={
        <SegmentedToggle
          ariaLabel="Progress view"
          value={view}
          onChange={setView}
          options={[
            { value: 'physical', label: 'Physical view' },
            { value: 'economic', label: 'Economic view' },
          ]}
        />
      }
    >
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 5, right: 16, left: 20, bottom: 24 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
          <XAxis dataKey="label" stroke={colors.axis} tick={{ fontSize: 11 }} minTickGap={16}>
            <Label value="Date" offset={-8} position="insideBottom" style={{ fontSize: 11, fill: colors.axis }} />
          </XAxis>
          <YAxis stroke={colors.axis} tick={{ fontSize: 11 }} tickFormatter={format} width={70}>
            <Label
              value={isEconomic ? 'Value (k€)' : unit}
              angle={-90}
              position="insideLeft"
              offset={-10}
              style={{ fontSize: 11, fill: colors.axis }}
            />
          </YAxis>
          <ChartTooltip
            contentStyle={{ backgroundColor: colors.tooltipBg, border: colors.tooltipBorder, fontSize: 12 }}
            formatter={(value: number, name: string) => [format(value), name]}
          />
          <Legend wrapperStyle={{ paddingTop: 8, fontSize: 11 }} iconType="line" />
          <Line
            type="monotone"
            dataKey={isEconomic ? 'plannedValue' : 'planned'}
            name="Planned"
            stroke="#9CA3AF"
            strokeWidth={2}
            strokeDasharray="6 3"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey={isEconomic ? 'baselineValue' : 'baseline'}
            name="Current Baseline"
            stroke={colors.isDark ? '#60a5fa' : '#3B82F6'}
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey={isEconomic ? 'actualValue' : 'actual'}
            name="Actual"
            stroke={colors.isDark ? '#34d399' : '#10B981'}
            strokeWidth={2}
            dot={data.length <= 31 ? { r: 2 } : false}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

export function CostSCurve({ data, activityLabel }: { data: ChartPoint[]; activityLabel: string }) {
  const colors = useChartColors()
  const [filter, setFilter] = useState<CostFilter>('all')

  const chartData = useMemo(() => {
    const categories = filter === 'all' ? RESOURCE_CATEGORIES : [filter]
    const round = (v: number) => Math.round(v * 10) / 10
    return data.map((p) => ({
      label: p.label,
      planned: round(categories.reduce((s, c) => s + p.cost[c].planned, 0)),
      baseline: round(categories.reduce((s, c) => s + p.cost[c].baseline, 0)),
      actual: p.actual === null ? null : round(categories.reduce((s, c) => s + (p.cost[c].actual ?? 0), 0)),
    }))
  }, [data, filter])

  const filterLabel = filter === 'all' ? 'all resources' : CATEGORY_META[filter].label.toLowerCase()

  return (
    <ChartCard
      title="Cost S-Curve"
      subtitle={`${activityLabel} — cumulative cost, ${filterLabel} (k€)`}
      toggle={
        <SegmentedToggle
          ariaLabel="Cost resource type"
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: 'All' },
            { value: 'labor', label: 'Manpower' },
            { value: 'equipment', label: 'Equipment' },
            { value: 'materials', label: 'Material' },
          ]}
        />
      }
    >
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={chartData} margin={{ top: 5, right: 16, left: 20, bottom: 24 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
          <XAxis dataKey="label" stroke={colors.axis} tick={{ fontSize: 11 }} minTickGap={16}>
            <Label value="Date" offset={-8} position="insideBottom" style={{ fontSize: 11, fill: colors.axis }} />
          </XAxis>
          <YAxis stroke={colors.axis} tick={{ fontSize: 11 }} tickFormatter={(v) => `€${v}k`} width={70}>
            <Label value="Cumulative (k€)" angle={-90} position="insideLeft" offset={-10} style={{ fontSize: 11, fill: colors.axis }} />
          </YAxis>
          <ChartTooltip
            contentStyle={{ backgroundColor: colors.tooltipBg, border: colors.tooltipBorder, fontSize: 12 }}
            formatter={(value: number, name: string) => [`€${value}k`, name]}
          />
          <Legend wrapperStyle={{ paddingTop: 8, fontSize: 11 }} iconType="line" />
          <Line type="monotone" dataKey="planned" name="Planned" stroke="#9CA3AF" strokeWidth={2} strokeDasharray="6 3" dot={false} />
          <Line
            type="monotone"
            dataKey="baseline"
            name="Current Baseline"
            stroke={colors.isDark ? '#c084fc' : '#8B5CF6'}
            strokeWidth={2}
            dot={false}
          />
          <Line type="monotone" dataKey="actual" name="Actual" stroke="#F87171" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
