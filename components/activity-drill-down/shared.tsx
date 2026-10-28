'use client'

import { Info, Minus, TrendingDown, TrendingUp } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export const PROJECTED_COST_TOOLTIP =
  "Projected cost is estimated proportionally to the activity's progress (e.g. 25% progress = 25% of the activity's budgeted cost)."

export const POSITIVE_TEXT = 'text-emerald-600 dark:text-emerald-400'

export function DeltaBadge({
  diff,
  pct,
  formatted,
  higherIsBetter,
}: {
  diff: number
  pct: number | null
  formatted: string
  higherIsBetter: boolean
}) {
  const neutral = Math.abs(diff) < 0.05
  const good = higherIsBetter ? diff > 0 : diff < 0
  const Icon = neutral ? Minus : diff > 0 ? TrendingUp : TrendingDown

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold font-mono',
        neutral && 'bg-muted text-muted-foreground',
        !neutral && good && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        !neutral && !good && 'bg-destructive/10 text-destructive',
      )}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      {formatted}
      {pct !== null && !neutral && <span className="opacity-80">({diff > 0 ? '+' : ''}{pct.toFixed(1)}%)</span>}
    </span>
  )
}

export function InfoTip({ text, label = 'More information' }: { text: string; label?: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={label}
          className="inline-flex text-muted-foreground/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-full"
        >
          <Info className="h-3 w-3" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-64 text-left">{text}</TooltipContent>
    </Tooltip>
  )
}

export function SegmentedToggle<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: T
  onChange: (v: T) => void
  options: Array<{ value: T; label: string }>
  ariaLabel: string
}) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => v && onChange(v as T)}
      aria-label={ariaLabel}
      className="rounded-md border border-border/50 bg-secondary p-0.5"
    >
      {options.map((o) => (
        <ToggleGroupItem
          key={o.value}
          value={o.value}
          className="h-7 flex-none rounded-[5px] first:rounded-[5px] last:rounded-[5px] px-2.5 text-xs font-medium text-muted-foreground hover:bg-transparent hover:text-foreground data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm"
        >
          {o.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
