'use client'

import { useMemo, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface TreeColumn<T> {
  key: string
  label: string
  align?: 'left' | 'right'
  render: (node: T) => React.ReactNode
  sortValue: (node: T) => number | string | null
}

interface TreeTableProps<T> {
  title: string
  count: number
  icon: LucideIcon
  nodes: T[]
  getId: (node: T) => string
  getLabel: (node: T) => string
  getChildren: (node: T) => T[]
  columns: TreeColumn<T>[]
  defaultCompare: (a: T, b: T) => number
  initialExpanded: (node: T, depth: number) => boolean
  emptyMessage?: string
}

const th = 'sticky top-0 z-10 bg-card px-3 py-2 text-[11px] font-medium text-muted-foreground border-b border-border/40'
const td = 'px-3 py-2 text-xs border-b border-border/20'

type SortState = { key: string; dir: 'asc' | 'desc' } | null

const DESCRIPTION_KEY = '__description'

function compareValues(a: number | string | null, b: number | string | null) {
  if (a === null && b === null) return 0
  if (a === null) return -1
  if (b === null) return 1
  if (typeof a === 'string' && typeof b === 'string') return a.localeCompare(b)
  return Number(a) - Number(b)
}

export function TreeTable<T>({
  title,
  count,
  icon: Icon,
  nodes,
  getId,
  getLabel,
  getChildren,
  columns,
  defaultCompare,
  initialExpanded,
  emptyMessage = 'No data for the selected filters.',
}: TreeTableProps<T>) {
  const [sort, setSort] = useState<SortState>(null)
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const ids = new Set<string>()
    const walk = (list: T[], depth: number) =>
      list.forEach((n) => {
        if (getChildren(n).length > 0 && initialExpanded(n, depth)) ids.add(getId(n))
        walk(getChildren(n), depth + 1)
      })
    walk(nodes, 0)
    return ids
  })

  const groupIds = useMemo(() => {
    const ids: string[] = []
    const walk = (list: T[]) =>
      list.forEach((n) => {
        if (getChildren(n).length > 0) ids.push(getId(n))
        walk(getChildren(n))
      })
    walk(nodes)
    return ids
  }, [nodes, getChildren, getId])

  const allExpanded = groupIds.length > 0 && groupIds.every((id) => expanded.has(id))

  const comparator = useMemo(() => {
    if (!sort) return defaultCompare
    const sortValue = sort.key === DESCRIPTION_KEY ? getLabel : columns.find((c) => c.key === sort.key)?.sortValue
    if (!sortValue) return defaultCompare
    const sign = sort.dir === 'asc' ? 1 : -1
    return (a: T, b: T) => sign * compareValues(sortValue(a), sortValue(b)) || defaultCompare(a, b)
  }, [sort, columns, defaultCompare, getLabel])

  const rows = useMemo(() => {
    const out: Array<{ node: T; depth: number }> = []
    const walk = (list: T[], depth: number) =>
      [...list].sort(comparator).forEach((n) => {
        out.push({ node: n, depth })
        if (getChildren(n).length > 0 && expanded.has(getId(n))) walk(getChildren(n), depth + 1)
      })
    walk(nodes, 0)
    return out
  }, [nodes, comparator, expanded, getChildren, getId])

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const handleSort = (key: string, numeric: boolean) =>
    setSort((prev) => (prev?.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: numeric ? 'desc' : 'asc' }))

  const headingId = `tree-table-${title.toLowerCase().replace(/\s+/g, '-')}`
  const allColumns: Array<{ key: string; label: string; align: 'left' | 'right'; numeric: boolean }> = [
    { key: DESCRIPTION_KEY, label: 'Description', align: 'left', numeric: false },
    ...columns.map((c) => ({ key: c.key, label: c.label, align: c.align ?? 'right', numeric: (c.align ?? 'right') === 'right' })),
  ]

  return (
    <section className="glass-card rounded-lg" aria-labelledby={headingId}>
      <div className="flex items-center justify-between gap-2 border-b border-border/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <h3 id={headingId} className="text-sm font-semibold text-foreground">
            {title} <span className="font-normal text-muted-foreground">({count})</span>
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
          onClick={() => setExpanded(allExpanded ? new Set() : new Set(groupIds))}
          disabled={groupIds.length === 0}
        >
          {allExpanded ? 'Collapse all' : 'Expand all'}
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] border-separate border-spacing-0">
          <thead>
            <tr>
              {allColumns.map((c) => {
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
            {rows.length === 0 && (
              <tr>
                <td colSpan={allColumns.length} className="px-3 py-10 text-center text-xs text-muted-foreground">
                  {emptyMessage}
                </td>
              </tr>
            )}
            {rows.map(({ node, depth }) => {
              const id = getId(node)
              const isGroup = getChildren(node).length > 0
              const isOpen = expanded.has(id)
              const indent = { paddingLeft: `${12 + depth * 18}px` }
              return (
                <tr
                  key={id}
                  className={cn(isGroup ? 'cursor-pointer bg-muted/60 font-semibold hover:bg-muted' : 'hover:bg-muted/40')}
                  onClick={isGroup ? () => toggle(id) : undefined}
                >
                  <td className={cn(td, 'text-foreground')} style={indent}>
                    {isGroup ? (
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={(e) => {
                          e.stopPropagation()
                          toggle(id)
                        }}
                        className="inline-flex items-center gap-1.5 text-left rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        <ChevronRight
                          className={cn('h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform', isOpen && 'rotate-90')}
                          aria-hidden="true"
                        />
                        {getLabel(node)}
                      </button>
                    ) : (
                      <span className="block pl-5">{getLabel(node)}</span>
                    )}
                  </td>
                  {columns.map((c) => (
                    <td key={c.key} className={cn(td, (c.align ?? 'right') === 'right' ? 'text-right' : 'text-left')}>
                      {c.render(node)}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
