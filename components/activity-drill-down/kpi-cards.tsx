'use client'

import type { LucideIcon } from 'lucide-react'
import { Euro, HardHat, Package, Ruler, Truck, Wallet } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import {
  type CategorySummary,
  type PeriodSummary,
  type ProgressFigures,
  formatEur,
  formatQty,
  signed,
} from '@/lib/activity-drill-down-data'
import { DeltaBadge, InfoTip, PROJECTED_COST_TOOLTIP } from './shared'

const pctOf = (actual: number, projected: number) => (projected > 0 ? (actual / projected) * 100 : null)

function CardHeader({ icon: Icon, title, badge }: { icon: LucideIcon; title: string; badge?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <div className="flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      </div>
      {badge}
    </div>
  )
}

function Figure({ label, value, info }: { label: string; value: string; info?: boolean }) {
  return (
    <div className="min-w-0">
      <p className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
        {info && <InfoTip text={PROJECTED_COST_TOOLTIP} label="How projected cost is calculated" />}
      </p>
      <p className="truncate text-xl font-bold font-mono text-foreground">{value}</p>
    </div>
  )
}

function ProgressCard({
  icon,
  title,
  figures,
  format,
  higherIsBetter,
}: {
  icon: LucideIcon
  title: string
  figures: ProgressFigures
  format: (v: number) => string
  higherIsBetter: boolean
}) {
  const diff = figures.actual - figures.projected
  const pct = pctOf(figures.actual, figures.projected)
  const variancePct = figures.projected > 0 ? (diff / figures.projected) * 100 : null

  return (
    <div className="glass-card flex flex-col gap-3 rounded-lg p-4">
      <CardHeader
        icon={icon}
        title={title}
        badge={<DeltaBadge diff={diff} pct={variancePct} formatted={signed(diff, format(diff))} higherIsBetter={higherIsBetter} />}
      />
      <div className="grid grid-cols-2 gap-3">
        <Figure label="Actual" value={format(figures.actual)} />
        <Figure label="Projected" value={format(figures.projected)} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Progress value={Math.min(pct ?? 0, 100)} className="h-1.5" aria-label={`${title}: actual vs projected`} />
        <p className="text-xs text-muted-foreground">
          {pct === null ? 'Nothing projected in this period' : `${pct.toFixed(1)}% of projected`}
        </p>
      </div>
      <p className="border-t border-border/40 pt-2 text-[11px] text-muted-foreground">
        Cumulative to date: {format(figures.cumActual)} actual / {format(figures.cumProjected)} projected
      </p>
    </div>
  )
}

function ResourceCard({
  icon,
  title,
  usage,
  usageLabel,
  summary,
}: {
  icon: LucideIcon
  title: string
  usage: string
  usageLabel: string
  summary: CategorySummary
}) {
  const diff = summary.actual - summary.projected
  const variancePct = summary.projected > 0 ? (diff / summary.projected) * 100 : null

  return (
    <div className="glass-card flex flex-col gap-3 rounded-lg p-4">
      <CardHeader
        icon={icon}
        title={title}
        badge={<DeltaBadge diff={diff} pct={variancePct} formatted={signed(diff, formatEur(diff))} higherIsBetter={false} />}
      />
      <div>
        <p className="text-2xl font-bold font-mono text-foreground">{usage}</p>
        <p className="text-xs text-muted-foreground">{usageLabel}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 border-t border-border/40 pt-3">
        <Figure label="Projected cost" value={formatEur(summary.projected)} info />
        <Figure label="Actual cost" value={formatEur(summary.actual)} />
      </div>
    </div>
  )
}

export function KpiCards({ summary, unit }: { summary: PeriodSummary; unit: string }) {
  const { labor, equipment, materials } = summary.categories

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <ProgressCard
          icon={Ruler}
          title="Physical Progress"
          figures={summary.physical}
          format={(v) => `${formatQty(v)} ${unit}`}
          higherIsBetter
        />
        <ProgressCard icon={Euro} title="Economic Progress" figures={summary.economic} format={formatEur} higherIsBetter />
        <ProgressCard icon={Wallet} title="Cost" figures={summary.cost} format={formatEur} higherIsBetter={false} />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <ResourceCard
          icon={HardHat}
          title="Labor"
          usage={`${formatQty(labor.quantity)} h`}
          usageLabel="Total man-hours used"
          summary={labor}
        />
        <ResourceCard
          icon={Truck}
          title="Equipment"
          usage={`${formatQty(equipment.quantity)} h`}
          usageLabel="Total equipment-hours used"
          summary={equipment}
        />
        <ResourceCard
          icon={Package}
          title="Materials"
          usage={`${materials.itemsUsed}`}
          usageLabel={materials.itemsUsed === 1 ? 'Material item used' : 'Material items used'}
          summary={materials}
        />
      </div>
    </div>
  )
}
