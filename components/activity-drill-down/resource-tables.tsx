'use client'

import type { LucideIcon } from 'lucide-react'
import { HardHat, Package, Truck } from 'lucide-react'
import {
  type CategorySummary,
  type PeriodSummary,
  type ResourceCategory,
  type ResourceRow,
  formatEur,
  formatQty,
  signed,
} from '@/lib/activity-drill-down-data'
import { cn } from '@/lib/utils'
import { InfoTip, POSITIVE_TEXT, PROJECTED_COST_TOOLTIP } from './shared'

const SCROLL_THRESHOLD = 10

const TABLE_META: Record<ResourceCategory, { title: string; icon: LucideIcon }> = {
  labor: { title: 'Labor', icon: HardHat },
  equipment: { title: 'Equipment', icon: Truck },
  materials: { title: 'Materials', icon: Package },
}

function Variance({ projected, actual }: { projected: number; actual: number }) {
  const diff = actual - projected
  const pct = projected > 0 ? (diff / projected) * 100 : null
  const neutral = Math.abs(diff) < 0.5
  return (
    <span className={cn('whitespace-nowrap', neutral ? 'text-muted-foreground' : diff > 0 ? 'text-destructive' : POSITIVE_TEXT)}>
      {signed(diff, formatEur(diff))}
      {pct !== null && <span className="ml-1 opacity-80">({diff > 0 ? '+' : ''}{pct.toFixed(1)}%)</span>}
    </span>
  )
}

const th = 'sticky top-0 z-10 bg-card px-3 py-2 text-[11px] font-medium text-muted-foreground border-b border-border/40'
const td = 'px-3 py-2 text-xs'

function ResourceTable({
  category,
  rows,
  totals,
}: {
  category: ResourceCategory
  rows: ResourceRow[]
  totals: CategorySummary
}) {
  const { title, icon: Icon } = TABLE_META[category]
  const scrolls = rows.length > SCROLL_THRESHOLD
  const sharedUnit = rows.length > 0 && rows.every((r) => r.resource.unit === rows[0].resource.unit) ? rows[0].resource.unit : null
  const headingId = `resource-table-${category}`

  return (
    <section className="glass-card rounded-lg" aria-labelledby={headingId}>
      <div className="flex items-center justify-between gap-2 border-b border-border/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <h3 id={headingId} className="text-sm font-semibold text-foreground">
            {title} <span className="font-normal text-muted-foreground">({rows.length})</span>
          </h3>
        </div>
        {scrolls && <p className="text-[11px] text-muted-foreground">Scroll to see all rows</p>}
      </div>

      <div className={cn('overflow-x-auto', scrolls && 'max-h-[440px] overflow-y-auto')}>
        <table className="w-full min-w-[720px] border-separate border-spacing-0">
          <thead>
            <tr>
              <th scope="col" className={cn(th, 'text-left')}>Resource</th>
              <th scope="col" className={cn(th, 'text-right')}>Quantity used</th>
              <th scope="col" className={cn(th, 'text-left')}>Unit</th>
              <th scope="col" className={cn(th, 'text-right')}>
                <span className="inline-flex items-center justify-end gap-1">
                  Projected cost (€)
                  <InfoTip text={PROJECTED_COST_TOOLTIP} label="How projected cost is calculated" />
                </span>
              </th>
              <th scope="col" className={cn(th, 'text-right')}>Actual cost (€)</th>
              <th scope="col" className={cn(th, 'text-right')}>Variance (€ / %)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.resource.id} className="hover:bg-muted/40">
                <td className={cn(td, 'border-b border-border/20 text-foreground')}>{r.resource.name}</td>
                <td className={cn(td, 'border-b border-border/20 text-right font-mono text-foreground')}>{formatQty(r.quantity)}</td>
                <td className={cn(td, 'border-b border-border/20 text-muted-foreground')}>{r.resource.unit}</td>
                <td className={cn(td, 'border-b border-border/20 text-right font-mono text-muted-foreground')}>{formatEur(r.projected)}</td>
                <td className={cn(td, 'border-b border-border/20 text-right font-mono text-foreground')}>{formatEur(r.actual)}</td>
                <td className={cn(td, 'border-b border-border/20 text-right font-mono')}>
                  <Variance projected={r.projected} actual={r.actual} />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-semibold">
              <th scope="row" className={cn(td, 'sticky bottom-0 bg-card border-t border-border/60 text-left text-foreground')}>
                Total
              </th>
              <td className={cn(td, 'sticky bottom-0 bg-card border-t border-border/60 text-right font-mono text-foreground')}>
                {sharedUnit ? formatQty(totals.quantity) : `${totals.itemsUsed} items`}
              </td>
              <td className={cn(td, 'sticky bottom-0 bg-card border-t border-border/60 text-muted-foreground')}>
                {sharedUnit ?? '—'}
              </td>
              <td className={cn(td, 'sticky bottom-0 bg-card border-t border-border/60 text-right font-mono text-foreground')}>
                {formatEur(totals.projected)}
              </td>
              <td className={cn(td, 'sticky bottom-0 bg-card border-t border-border/60 text-right font-mono text-foreground')}>
                {formatEur(totals.actual)}
              </td>
              <td className={cn(td, 'sticky bottom-0 bg-card border-t border-border/60 text-right font-mono')}>
                <Variance projected={totals.projected} actual={totals.actual} />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  )
}

export function ResourceTables({ summary }: { summary: PeriodSummary }) {
  return (
    <div className="flex flex-col gap-4">
      {(['labor', 'equipment', 'materials'] as const).map((c) => (
        <ResourceTable key={c} category={c} rows={summary.rows[c]} totals={summary.categories[c]} />
      ))}
    </div>
  )
}
