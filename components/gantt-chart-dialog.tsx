'use client'

import { useState, useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

interface GanttActivity {
  name: string
  status: 'Ongoing' | 'Not Started' | 'Finished'
  actual_completeness: number
  forecast_deadline: string
  float_weeks: number
  // start offset in weeks from project start (week 1 = Jan 1 2024)
  startWeek: number
  durationWeeks: number
}

const PROJECT_START = new Date('2024-01-01')
const TODAY = new Date('2024-03-25') // simulated "today" consistent with W9 in the data
const TOTAL_WEEKS = 30

const GANTT_ACTIVITIES: GanttActivity[] = [
  { name: 'Site Preparation',       status: 'Ongoing',     actual_completeness: 85, forecast_deadline: '15/03/2024', float_weeks: 2, startWeek: 0,  durationWeeks: 4  },
  { name: 'Foundation Work',        status: 'Ongoing',     actual_completeness: 60, forecast_deadline: '20/04/2024', float_weeks: 2, startWeek: 2,  durationWeeks: 8  },
  { name: 'Structure Assembly',     status: 'Ongoing',     actual_completeness: 60, forecast_deadline: '10/05/2024', float_weeks: 1, startWeek: 6,  durationWeeks: 10 },
  { name: 'Roofing Works',          status: 'Ongoing',     actual_completeness: 79, forecast_deadline: '18/05/2024', float_weeks: 2, startWeek: 8,  durationWeeks: 6  },
  { name: 'Electrical Installation',status: 'Ongoing',     actual_completeness: 54, forecast_deadline: '25/05/2024', float_weeks: 0, startWeek: 10, durationWeeks: 10 },
  { name: 'Plumbing Systems',       status: 'Ongoing',     actual_completeness: 65, forecast_deadline: '22/05/2024', float_weeks: 0, startWeek: 10, durationWeeks: 8  },
  { name: 'HVAC Installation',      status: 'Ongoing',     actual_completeness: 51, forecast_deadline: '30/05/2024', float_weeks: 0, startWeek: 12, durationWeeks: 10 },
  { name: 'Exterior Cladding',      status: 'Ongoing',     actual_completeness: 53, forecast_deadline: '28/05/2024', float_weeks: 1, startWeek: 12, durationWeeks: 8  },
  { name: 'Interior Partitions',    status: 'Ongoing',     actual_completeness: 54, forecast_deadline: '26/05/2024', float_weeks: 1, startWeek: 13, durationWeeks: 8  },
  { name: 'Mechanical Systems',     status: 'Not Started', actual_completeness: 0,  forecast_deadline: '15/06/2024', float_weeks: 1, startWeek: 16, durationWeeks: 8  },
  { name: 'Finishing Works',        status: 'Not Started', actual_completeness: 10, forecast_deadline: '20/06/2024', float_weeks: 1, startWeek: 18, durationWeeks: 8  },
  { name: 'Flooring Installation',  status: 'Not Started', actual_completeness: 20, forecast_deadline: '10/07/2024', float_weeks: 3, startWeek: 20, durationWeeks: 6  },
  { name: 'Painting & Decoration',  status: 'Not Started', actual_completeness: 5,  forecast_deadline: '15/07/2024', float_weeks: 3, startWeek: 22, durationWeeks: 6  },
]

function getWeekFromDate(date: Date): number {
  const diff = date.getTime() - PROJECT_START.getTime()
  return Math.floor(diff / (7 * 24 * 60 * 60 * 1000))
}

function getWeekLabel(weekOffset: number): string {
  const d = new Date(PROJECT_START)
  d.setDate(d.getDate() + weekOffset * 7)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
}

const STATUS_COLORS = {
  Finished:    { bar: '#16a34a', text: 'text-[#16a34a]', bg: 'bg-[#16a34a]/15' },
  Ongoing:     { bar: '#00c8ff', text: 'text-cyan',      bg: 'bg-cyan/15'       },
  'Not Started':{ bar: '#6b7280', text: 'text-muted-foreground', bg: 'bg-muted/20' },
}

interface GanttChartDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectName: string
}

export function GanttChartDialog({ open, onOpenChange, projectName }: GanttChartDialogProps) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)

  const todayWeek = useMemo(() => getWeekFromDate(TODAY), [])

  // Build month labels for the header
  const monthLabels = useMemo(() => {
    const labels: { label: string; startCol: number; spanCols: number }[] = []
    let current: string | null = null
    let startCol = 0
    let span = 0
    for (let w = 0; w < TOTAL_WEEKS; w++) {
      const d = new Date(PROJECT_START)
      d.setDate(d.getDate() + w * 7)
      const month = d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })
      if (month !== current) {
        if (current) labels.push({ label: current, startCol, spanCols: span })
        current = month
        startCol = w
        span = 1
      } else {
        span++
      }
    }
    if (current) labels.push({ label: current, startCol, spanCols: span })
    return labels
  }, [])

  const cellWidth = 28 // px per week cell

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[92vw] w-full max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-5 pb-4 border-b border-border/50 flex-shrink-0">
          <DialogTitle className="text-lg font-semibold text-foreground">
            Project Schedule — {projectName}
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-0.5">Live Gantt chart · Baseline vs. Actual progress</p>
        </DialogHeader>

        {/* Legend */}
        <div className="flex items-center gap-5 px-6 py-3 border-b border-border/30 flex-shrink-0 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-8 h-3 rounded-sm bg-cyan/80" />
            <span className="text-[11px] text-muted-foreground">Baseline duration</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-3 rounded-sm bg-cyan" />
            <span className="text-[11px] text-muted-foreground">Actual progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-3 rounded-sm bg-[#6b7280]/40" />
            <span className="text-[11px] text-muted-foreground">Not started</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-0.5 h-4 bg-[#ff6b6b]" />
            <span className="text-[11px] text-muted-foreground">Today</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border-2 border-[#f59e0b]" />
            <span className="text-[11px] text-muted-foreground">Float (slack)</span>
          </div>
        </div>

        <div className="overflow-auto flex-1">
          <div className="min-w-max">
            {/* Header row */}
            <div className="flex sticky top-0 z-20 bg-background border-b border-border/50">
              {/* Activity name column */}
              <div className="w-48 flex-shrink-0 px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground border-r border-border/30">
                Activity
              </div>
              {/* Status column */}
              <div className="w-24 flex-shrink-0 px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground border-r border-border/30 text-center">
                Status
              </div>
              {/* Progress column */}
              <div className="w-14 flex-shrink-0 px-2 py-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground border-r border-border/30 text-center">
                Done
              </div>
              {/* Timeline header — months */}
              <div className="relative flex-1" style={{ minWidth: TOTAL_WEEKS * cellWidth }}>
                {/* Month labels */}
                <div className="flex border-b border-border/20">
                  {monthLabels.map((m) => (
                    <div
                      key={m.label}
                      className="border-r border-border/20 py-1 text-[10px] font-medium text-muted-foreground text-center"
                      style={{ width: m.spanCols * cellWidth }}
                    >
                      {m.label}
                    </div>
                  ))}
                </div>
                {/* Week numbers */}
                <div className="flex">
                  {Array.from({ length: TOTAL_WEEKS }, (_, i) => (
                    <div
                      key={i}
                      className={`border-r border-border/10 text-[9px] text-center py-0.5 flex-shrink-0 ${
                        i === todayWeek ? 'text-[#ff6b6b] font-bold' : 'text-muted-foreground/50'
                      }`}
                      style={{ width: cellWidth }}
                    >
                      W{i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Activity rows */}
            {GANTT_ACTIVITIES.map((activity, idx) => {
              const colors = STATUS_COLORS[activity.status] ?? STATUS_COLORS['Not Started']
              const barLeft = activity.startWeek * cellWidth
              const barWidth = activity.durationWeeks * cellWidth
              const progressWidth = Math.round((activity.actual_completeness / 100) * barWidth)
              const floatLeft = (activity.startWeek + activity.durationWeeks) * cellWidth
              const floatWidth = activity.float_weeks * cellWidth

              return (
                <div
                  key={activity.name}
                  className={`flex items-center border-b border-border/20 transition-colors cursor-default ${
                    hoveredRow === idx ? 'bg-secondary/30' : idx % 2 === 0 ? 'bg-transparent' : 'bg-secondary/10'
                  }`}
                  style={{ height: 40 }}
                  onMouseEnter={() => setHoveredRow(idx)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  {/* Activity name */}
                  <div className="w-48 flex-shrink-0 px-4 text-xs text-foreground font-medium truncate border-r border-border/30">
                    {activity.name}
                  </div>

                  {/* Status badge */}
                  <div className="w-24 flex-shrink-0 px-3 border-r border-border/30 flex justify-center">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${colors.bg} ${colors.text}`}>
                      {activity.status}
                    </span>
                  </div>

                  {/* Completeness */}
                  <div className="w-14 flex-shrink-0 px-2 border-r border-border/30 text-center text-xs font-semibold text-foreground">
                    {activity.actual_completeness}%
                  </div>

                  {/* Timeline bars */}
                  <div
                    className="relative flex-shrink-0"
                    style={{ width: TOTAL_WEEKS * cellWidth, height: 40 }}
                  >
                    {/* Vertical grid lines */}
                    {Array.from({ length: TOTAL_WEEKS }, (_, i) => (
                      <div
                        key={i}
                        className={`absolute top-0 bottom-0 border-r ${
                          i === todayWeek ? 'border-[#ff6b6b]/60' : 'border-border/10'
                        }`}
                        style={{ left: (i + 1) * cellWidth - 1 }}
                      />
                    ))}

                    {/* Today line */}
                    <div
                      className="absolute top-0 bottom-0 w-px bg-[#ff6b6b]/70 z-10"
                      style={{ left: todayWeek * cellWidth + cellWidth / 2 }}
                    />

                    {/* Baseline bar (semi-transparent background) */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 rounded-sm"
                      style={{
                        left: barLeft,
                        width: barWidth,
                        height: 14,
                        backgroundColor: colors.bar,
                        opacity: 0.25,
                      }}
                    />

                    {/* Actual progress bar */}
                    {progressWidth > 0 && (
                      <div
                        className="absolute top-1/2 -translate-y-1/2 rounded-sm"
                        style={{
                          left: barLeft,
                          width: progressWidth,
                          height: 14,
                          backgroundColor: colors.bar,
                          opacity: 0.9,
                        }}
                      />
                    )}

                    {/* Float indicator dots */}
                    {activity.float_weeks > 0 && (
                      <div
                        className="absolute top-1/2 -translate-y-1/2 flex items-center gap-0.5"
                        style={{ left: floatLeft + 3 }}
                      >
                        {Array.from({ length: Math.min(activity.float_weeks, 4) }, (_, i) => (
                          <div
                            key={i}
                            className="rounded-full border border-[#f59e0b]"
                            style={{ width: 6, height: 6, backgroundColor: 'transparent' }}
                          />
                        ))}
                      </div>
                    )}

                    {/* Completion label inside bar (only if wide enough) */}
                    {progressWidth > 32 && (
                      <span
                        className="absolute top-1/2 -translate-y-1/2 text-[9px] font-bold text-background/90 leading-none select-none"
                        style={{ left: barLeft + 4 }}
                      >
                        {activity.actual_completeness}%
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border/30 flex-shrink-0 flex items-center justify-between">
          <p className="text-[11px] text-muted-foreground">
            Project start: 01 Jan 2024 · Data as of W9 · {GANTT_ACTIVITIES.length} activities
          </p>
          <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
            <span>
              <span className="text-foreground font-semibold">
                {GANTT_ACTIVITIES.filter(a => a.status === 'Ongoing').length}
              </span>{' '}Ongoing
            </span>
            <span>
              <span className="text-foreground font-semibold">
                {GANTT_ACTIVITIES.filter(a => a.status === 'Not Started').length}
              </span>{' '}Not Started
            </span>
            <span>
              <span className="text-foreground font-semibold">
                {GANTT_ACTIVITIES.filter(a => a.float_weeks === 0).length}
              </span>{' '}Critical path
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
