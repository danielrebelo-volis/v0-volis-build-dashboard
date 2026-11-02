'use client'

import { Fragment, useMemo, useState } from 'react'
import { ChevronRight, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { formatPct, formatQty } from '@/lib/activity-drill-down-data'
import type { EquipmentGroup, EquipmentRow } from '@/lib/equipment-resources-data'
import { cn } from '@/lib/utils'

type SortKey = 'id' | 'name' | 'typology' | 'productiveAvailability' | 'hoursWorked' | 'hoursIdle'
type SortState = { key: SortKey; dir: 'asc' | 'desc' } | null

const COLUMNS: Array<{ key: SortKey; label: string; align: 'left' | 'right'; numeric: boolean }> = [
  { key: 'id', label: 'ID', align: 'left', numeric: false },
  { key: 'name', label: 'Name', align: 'left', numeric: false },
  { key: 'typology', label: 'Typology', align: 'left', numeric: false },
  { key: 'productiveAvailability', label: 'Productive Availability', align: 'left', numeric: true },
  { key: 'hoursWorked', label: 'Hours Worked (h)', align: 'right', numeric: true },
  { key: 'hoursIdle', label: 'Hours Idle (h)', align: 'right', numeric: true },
]

const th = 'sticky top-0 z-10 bg-card px-3 py-2 text-[11px] font-medium text-muted-foreground border-b border-border/40'
const td = 'px-3 py-2 text-xs border-b border-border/20'

const byText = (a: string, b: string) => a.localeCompare(b)
const byNumber = (a: number | null, b: number | null) => (a ?? -1) - (b ?? -1)

function compareRows(a: EquipmentRow, b: EquipmentRow, sort: SortState) {
  if (!sort) return b.hoursWorked - a.hoursWorked
  const sign = sort.dir === 'asc' ? 1 : -1
  switch (sort.key) {
    case 'id':
    case 'name':
    case 'typology':
      return sign * byText(a[sort.key], b[sort.key])
    default:
      return sign * byNumber(a[sort.key], b[sort.key])
  }
}

function compareGroups(a: EquipmentGroup, b: EquipmentGroup, sort: SortState) {
  if (!sort || sort.key === 'id' || sort.key === 'name' || sort.key === 'typology') {
    const sign = sort?.dir === 'desc' && sort.key !== 'id' ? -1 : 1
    return sign * byText(a.typology, b.typology)
  }
  const sign = sort.dir === 'asc' ? 1 : -1
  return sign * byNumber(a[sort.key], b[sort.key])
}

function AvailabilityCell({ value, label }: { value: number | null; label: string }) {
  if (value === null) return <span className="font-mono text-muted-foreground">—</span>
  return (
    <div className="flex items-center gap-2">
      <Progress value={value} className="h-1.5 w-24 shrink-0" aria-label={`${label} productive availability`} />
      <span className="font-mono text-foreground">{formatPct(value)}</span>
    </div>
  )
}

export function EquipmentTable({ groups }: { groups: EquipmentGroup[] }) {
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set())
  const [sort, setSort] = useState<SortState>(null)

  const sortedGroups = useMemo(
    () =>
      [...groups]
        .sort((a, b) => compareGroups(a, b, sort))
        .map((g) => ({ ...g, items: [...g.items].sort((a, b) => compareRows(a, b, sort)) })),
    [groups, sort],
  )

  const allExpanded = groups.length > 0 && groups.every((g) => expanded.has(g.typology))
  const itemCount = groups.reduce((s, g) => s + g.items.length, 0)

  const toggleGroup = (typology: string) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(typology)) next.delete(typology)
      else next.add(typology)
      return next
    })

  const toggleAll = () => setExpanded(allExpanded ? new Set() : new Set(groups.map((g) => g.typology)))

  const handleSort = (key: SortKey, numeric: boolean) =>
    setSort((prev) => {
      if (prev?.key === key) return { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
      return { key, dir: numeric ? 'desc' : 'asc' }
    })

  return (
    <section className="glass-card rounded-lg" aria-labelledby="equipment-table-heading">
      <div className="flex items-center justify-between gap-2 border-b border-border/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <h3 id="equipment-table-heading" className="text-sm font-semibold text-foreground">
            Equipment <span className="font-normal text-muted-foreground">({itemCount})</span>
          </h3>
        </div>
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground" onClick={toggleAll}>
          {allExpanded ? 'Collapse all' : 'Expand all'}
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-separate border-spacing-0">
          <thead>
            <tr>
              {COLUMNS.map((c) => {
                const active = sort?.key === c.key
                return (
                  <th
                    key={c.key}
                    scope="col"
                    aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}
                    className={cn(th, c.align === 'right' ? 'text-right' : 'text-left')}
                  >
                    <button
                      type="button"
                      onClick={() => handleSort(c.key, c.numeric)}
                      className={cn('inline-flex items-center gap-1 hover:text-foreground transition-colors', active && 'text-foreground')}
                    >
                      {c.label}
                      {active && <span aria-hidden="true">{sort.dir === 'asc' ? '↑' : '↓'}</span>}
                    </button>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {sortedGroups.map((g) => {
              const isOpen = expanded.has(g.typology)
              return (
                <Fragment key={g.typology}>
                  <tr
                    className="cursor-pointer bg-muted/60 font-semibold hover:bg-muted"
                    onClick={() => toggleGroup(g.typology)}
                  >
                    <td className={cn(td, 'font-mono text-muted-foreground')}>—</td>
                    <td className={cn(td, 'text-foreground')}>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleGroup(g.typology)
                        }}
                        className="inline-flex items-center gap-1.5 text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-sm"
                      >
                        <ChevronRight
                          className={cn('h-3.5 w-3.5 text-muted-foreground transition-transform', isOpen && 'rotate-90')}
                          aria-hidden="true"
                        />
                        {g.typology} ({g.items.length})
                      </button>
                    </td>
                    <td className={cn(td, 'text-muted-foreground')}>—</td>
                    <td className={td}>
                      <AvailabilityCell value={g.productiveAvailability} label={g.typology} />
                    </td>
                    <td className={cn(td, 'text-right font-mono text-foreground')}>{formatQty(g.hoursWorked)}</td>
                    <td className={cn(td, 'text-right font-mono text-foreground')}>{formatQty(g.hoursIdle)}</td>
                  </tr>
                  {isOpen &&
                    g.items.map((r) => (
                      <tr key={r.id} className="hover:bg-muted/40">
                        <td className={cn(td, 'font-mono text-muted-foreground')}>{r.id}</td>
                        <td className={cn(td, 'pl-11 text-foreground')}>{r.name}</td>
                        <td className={cn(td, 'text-muted-foreground')}>{r.typology}</td>
                        <td className={td}>
                          <AvailabilityCell value={r.productiveAvailability} label={r.name} />
                        </td>
                        <td className={cn(td, 'text-right font-mono text-foreground')}>{formatQty(r.hoursWorked)}</td>
                        <td className={cn(td, 'text-right font-mono text-foreground')}>{formatQty(r.hoursIdle)}</td>
                      </tr>
                    ))}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
