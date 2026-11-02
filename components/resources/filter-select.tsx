'use client'

import { AlertTriangle } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export const filterLabel = 'text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60'

export function FilterSelect<T extends string>({
  id,
  label,
  value,
  onChange,
  options,
  allLabel,
}: {
  id: string
  label: string
  value: T | 'all'
  onChange: (v: T | 'all') => void
  options: readonly T[]
  allLabel: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={filterLabel}>
        {label}
      </label>
      <Select value={value} onValueChange={(v) => onChange(v as T | 'all')}>
        <SelectTrigger id={id} className="h-9 w-52 bg-secondary border-border/50 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{allLabel}</SelectItem>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export function MissingPriceValue({ message }: { message: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={message}
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 rounded-sm font-mono text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <AlertTriangle className="h-3 w-3 text-amber-600 dark:text-amber-400" aria-hidden="true" />—
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-64 text-left">{message}</TooltipContent>
    </Tooltip>
  )
}

export function PartialPriceValue({ value, message }: { value: string; message: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={`${value}. ${message}`}
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 rounded-sm font-mono text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <AlertTriangle className="h-3 w-3 text-amber-600 dark:text-amber-400" aria-hidden="true" />
          {value}
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-64 text-left">{message}</TooltipContent>
    </Tooltip>
  )
}
