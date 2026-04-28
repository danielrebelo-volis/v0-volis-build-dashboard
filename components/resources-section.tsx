'use client'

import { useState } from 'react'
import { Users, Wrench, Clock, TrendingDown } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useChartColors } from '@/hooks/use-chart-colors'

// ─── Types ─────────────────────────────────────────────────────────────────────

type ActivityResourceRow = {
  name: string
  status: 'Not Started' | 'On Time' | 'Delayed'
  workforce: { expected: number; actual: number }
  materials: { expected: number; actual: number }
  equipment: { expected: number; actual: number }
}

type Equipment = {
  id: string
  name: string
  type: string
  operationalHours: number
  downtimeHours: number
  downtimeCause: string
}

// ─── Demo Data ─────────────────────────────────────────────────────────────────

const ACTIVITY_RESOURCES: ActivityResourceRow[] = [
  { name: 'Site Preparation', status: 'On Time', workforce: { expected: 12, actual: 11 }, materials: { expected: 80, actual: 75 }, equipment: { expected: 4, actual: 4 } },
  { name: 'Foundation Work', status: 'Delayed', workforce: { expected: 18, actual: 14 }, materials: { expected: 120, actual: 98 }, equipment: { expected: 6, actual: 5 } },
  { name: 'Structure Assembly', status: 'Delayed', workforce: { expected: 22, actual: 18 }, materials: { expected: 200, actual: 185 }, equipment: { expected: 8, actual: 7 } },
  { name: 'Mechanical Systems', status: 'Not Started', workforce: { expected: 8, actual: 0 }, materials: { expected: 50, actual: 0 }, equipment: { expected: 3, actual: 0 } },
  { name: 'Finishing Works', status: 'Not Started', workforce: { expected: 10, actual: 0 }, materials: { expected: 40, actual: 0 }, equipment: { expected: 2, actual: 0 } },
  { name: 'Electrical Installation', status: 'On Time', workforce: { expected: 14, actual: 14 }, materials: { expected: 90, actual: 88 }, equipment: { expected: 3, actual: 3 } },
  { name: 'Plumbing Systems', status: 'On Time', workforce: { expected: 10, actual: 10 }, materials: { expected: 60, actual: 57 }, equipment: { expected: 2, actual: 2 } },
  { name: 'HVAC Installation', status: 'Delayed', workforce: { expected: 16, actual: 11 }, materials: { expected: 110, actual: 90 }, equipment: { expected: 5, actual: 4 } },
  { name: 'Exterior Cladding', status: 'On Time', workforce: { expected: 8, actual: 8 }, materials: { expected: 70, actual: 68 }, equipment: { expected: 2, actual: 2 } },
  { name: 'Interior Partitions', status: 'On Time', workforce: { expected: 9, actual: 9 }, materials: { expected: 55, actual: 53 }, equipment: { expected: 2, actual: 2 } },
  { name: 'Roofing Works', status: 'On Time', workforce: { expected: 12, actual: 12 }, materials: { expected: 95, actual: 92 }, equipment: { expected: 4, actual: 4 } },
  { name: 'Flooring Installation', status: 'Delayed', workforce: { expected: 7, actual: 4 }, materials: { expected: 45, actual: 30 }, equipment: { expected: 1, actual: 1 } },
  { name: 'Painting & Decoration', status: 'Not Started', workforce: { expected: 6, actual: 0 }, materials: { expected: 30, actual: 0 }, equipment: { expected: 1, actual: 0 } },
]

const EQUIPMENT_LIST: Equipment[] = [
  { id: 'EQ-001', name: 'Tower Crane #1', type: 'Crane', operationalHours: 148, downtimeHours: 20, downtimeCause: 'Mechanical failure' },
  { id: 'EQ-002', name: 'Tower Crane #2', type: 'Crane', operationalHours: 155, downtimeHours: 13, downtimeCause: 'Scheduled maintenance' },
  { id: 'EQ-003', name: 'Excavator A', type: 'Excavator', operationalHours: 130, downtimeHours: 38, downtimeCause: 'Hydraulic repair' },
  { id: 'EQ-004', name: 'Excavator B', type: 'Excavator', operationalHours: 142, downtimeHours: 26, downtimeCause: 'Operator unavailable' },
  { id: 'EQ-005', name: 'Concrete Pump', type: 'Pump', operationalHours: 112, downtimeHours: 56, downtimeCause: 'Pipe blockage' },
  { id: 'EQ-006', name: 'Forklift #1', type: 'Forklift', operationalHours: 160, downtimeHours: 8, downtimeCause: 'Battery replacement' },
  { id: 'EQ-007', name: 'Forklift #2', type: 'Forklift', operationalHours: 152, downtimeHours: 16, downtimeCause: 'Tyre change' },
  { id: 'EQ-008', name: 'Compactor', type: 'Compactor', operationalHours: 118, downtimeHours: 50, downtimeCause: 'Engine overhaul' },
  { id: 'EQ-009', name: 'Welding Unit #1', type: 'Welding', operationalHours: 168, downtimeHours: 0, downtimeCause: '—' },
  { id: 'EQ-010', name: 'Mobile Generator', type: 'Generator', operationalHours: 145, downtimeHours: 23, downtimeCause: 'Fuel system issue' },
]

const WEEKLY_EQUIPMENT_UTILISATION = [
  { week: 'W1', operational: 890, downtime: 110 },
  { week: 'W2', operational: 920, downtime: 80 },
  { week: 'W3', operational: 875, downtime: 125 },
  { week: 'W4', operational: 905, downtime: 95 },
  { week: 'W5', operational: 860, downtime: 140 },
  { week: 'W6', operational: 910, downtime: 90 },
  { week: 'W7', operational: 880, downtime: 120 },
  { week: 'W8', operational: 930, downtime: 70 },
  { week: 'W9', operational: 900, downtime: 100 },
]

// ─── Main Component ─────────────────────────────────────────────────────────────

export function ResourcesSection() {
  const chartColors = useChartColors()
  const [equipmentFilter, setEquipmentFilter] = useState<string>('all')
  const [selectedActivity, setSelectedActivity] = useState<string>(ACTIVITY_RESOURCES[0].name)

  // Summary stats
  const allocatedWorkforce = ACTIVITY_RESOURCES.filter(a => a.status !== 'Not Started').reduce((s, a) => s + a.workforce.actual, 0)
  const allocatedEquipment = EQUIPMENT_LIST.length

  const totalOperational = EQUIPMENT_LIST.reduce((s, e) => s + e.operationalHours, 0)
  const totalDowntime = EQUIPMENT_LIST.reduce((s, e) => s + e.downtimeHours, 0)
  const totalHours = totalOperational + totalDowntime
  const utilisationPct = Math.round((totalOperational / totalHours) * 100)

  const equipmentTypes = ['all', ...Array.from(new Set(EQUIPMENT_LIST.map(e => e.type)))]
  const filteredEquipment = equipmentFilter === 'all' ? EQUIPMENT_LIST : EQUIPMENT_LIST.filter(e => e.type === equipmentFilter)

  const pieData = [
    { name: 'Operational', value: totalOperational },
    { name: 'Downtime', value: totalDowntime },
  ]
  const PIE_COLORS = ['#16a34a', '#ef4444']

  return (
    <div className="space-y-8">

      {/* ── Allocated Resources ─────────────────────────────────────────────── */}
      <div className="glass-card rounded-lg p-5 border border-border/50">
        <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">Required Resources this week (via WWP)</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-4 bg-secondary/40 rounded-lg p-4">
            <div className="p-2.5 rounded-lg bg-accent/20">
              <Users className="w-5 h-5 text-accent" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">25</div>
              <div className="text-xs text-muted-foreground mt-0.5">Members of Workforce</div>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-secondary/40 rounded-lg p-4">
            <div className="p-2.5 rounded-lg bg-accent/20">
              <Wrench className="w-5 h-5 text-accent" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">15</div>
              <div className="text-xs text-muted-foreground mt-0.5">Equipments</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Activity Resource Usage ──────────────────────────────────────────── */}
      <div className="glass-card rounded-lg p-5 border border-border/50">
        {/* Header */}
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">Activity Resource Usage</h3>

        {/* Activity selector */}
        <div className="flex flex-wrap gap-2 mb-5">
          {ACTIVITY_RESOURCES.map((a) => {
            const isSelected = selectedActivity === a.name
            const isComplete = a.status !== 'Not Started' && a.workforce.actual >= a.workforce.expected
            const isNotStarted = a.status === 'Not Started'
            const dotColor = isComplete
              ? 'bg-[#16a34a]'
              : isNotStarted
                ? 'bg-muted-foreground/40'
                : 'bg-yellow-400'
            return (
              <button
                key={a.name}
                onClick={() => setSelectedActivity(a.name)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${isSelected
                  ? 'bg-accent text-accent-foreground border-accent'
                  : 'bg-secondary/50 text-muted-foreground border-border/50 hover:bg-secondary hover:text-foreground'
                  }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColor}`} />
                {a.name}
              </button>
            )
          })}
        </div>

        {/* Resource table for selected activity */}
        {(() => {
          const activity = ACTIVITY_RESOURCES.find((a) => a.name === selectedActivity)!
          const rows = [
            { label: 'Workforce', unit: 'pax', used: activity.workforce.actual, planned: activity.workforce.expected },
            { label: 'Equipment', unit: 'units', used: activity.equipment.actual, planned: activity.equipment.expected },
            { label: 'Materials', unit: 't', used: activity.materials.actual, planned: activity.materials.expected },
          ]
          return (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left text-xs text-muted-foreground font-semibold py-2 pr-4">Resource</th>
                  <th className="text-right text-xs text-muted-foreground font-semibold py-2 px-4">Progress</th>
                  <th className="text-right text-xs text-muted-foreground font-semibold py-2 px-4">Used</th>
                  <th className="text-right text-xs text-muted-foreground font-semibold py-2 pl-4">Total Planned</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const pct = row.planned > 0 && activity.status !== 'Not Started'
                    ? Math.round((row.used / row.planned) * 100)
                    : 0
                  return (
                    <tr key={row.label} className="border-b border-border/20 last:border-0">
                      <td className="py-3 pr-4 text-xs font-medium text-foreground">
                        {row.label}
                        <span className="ml-1 text-[10px] text-muted-foreground font-normal">({row.unit})</span>
                      </td>
                      <td className="py-3 px-4 text-right text-sm font-semibold text-foreground">
                        {activity.status === 'Not Started' ? '—' : `${pct}%`}
                      </td>
                      <td className="py-3 px-4 text-right text-sm font-semibold text-foreground">
                        {activity.status === 'Not Started' ? '—' : row.used}
                      </td>
                      <td className="py-3 pl-4 text-right text-sm font-semibold text-foreground">
                        {row.planned}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )
        })()}
      </div>

      {/* ── Equipment Analysis ──────────────────────────────────────────────── */}
      <div className="glass-card rounded-lg p-5 border border-border/50">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Equipment Analysis</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground uppercase tracking-wide">Type:</span>
            <select
              value={equipmentFilter}
              onChange={(e) => setEquipmentFilter(e.target.value)}
              className="appearance-none pl-2.5 pr-7 py-1 text-xs font-medium rounded-md border border-border/50 bg-secondary text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-accent"
            >
              {equipmentTypes.map(t => (
                <option key={t} value={t}>{t === 'all' ? 'All Types' : t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-secondary/40 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-[#16a34a]">{totalOperational.toLocaleString()}h</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">Total Operational</div>
          </div>
          <div className="bg-secondary/40 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-destructive">{totalDowntime.toLocaleString()}h</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">Total Downtime</div>
          </div>
          <div className="bg-secondary/40 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-foreground">{utilisationPct}%</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">Fleet Utilisation</div>
          </div>
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Weekly utilisation stacked bar */}
          <div>
            <p className="text-xs text-muted-foreground font-medium mb-3">Weekly Fleet Hours</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={WEEKLY_EQUIPMENT_UTILISATION} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
                <XAxis dataKey="week" stroke={chartColors.axis} tick={{ fontSize: 10 }} />
                <YAxis stroke={chartColors.axis} tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}h`} width={44} />
                <Tooltip
                  contentStyle={{ backgroundColor: chartColors.tooltipBg, border: chartColors.tooltipBorder, fontSize: 11 }}
                  formatter={(v: number) => [`${v}h`]}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Bar dataKey="operational" name="Operational" stackId="a" fill="#16a34a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="downtime" name="Downtime" stackId="a" fill="#ef4444" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart overall split */}
          <div className="flex flex-col items-center justify-center">
            <p className="text-xs text-muted-foreground font-medium mb-1 self-start">Overall Split</p>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={88} paddingAngle={3} dataKey="value">
                  {pieData.map((_, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: chartColors.tooltipBg, border: chartColors.tooltipBorder, fontSize: 11 }}
                  formatter={(v: number) => [`${v}h`]}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Per-equipment table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left text-xs text-muted-foreground font-semibold py-2 pr-3">ID</th>
                <th className="text-left text-xs text-muted-foreground font-semibold py-2 pr-3">Equipment</th>
                <th className="text-left text-xs text-muted-foreground font-semibold py-2 px-3">Type</th>
                <th className="text-right text-xs text-muted-foreground font-semibold py-2 px-3">Operational (h)</th>
                <th className="text-right text-xs text-muted-foreground font-semibold py-2 px-3">Downtime (h)</th>
                <th className="text-left text-xs text-muted-foreground font-semibold py-2 px-3">Downtime Cause</th>
                <th className="text-right text-xs text-muted-foreground font-semibold py-2 pl-3">Utilisation</th>
              </tr>
            </thead>
            <tbody>
              {filteredEquipment.map((eq) => {
                const total = eq.operationalHours + eq.downtimeHours
                const util = total > 0 ? Math.round((eq.operationalHours / total) * 100) : 0
                const isLow = util < 80
                return (
                  <tr key={eq.id} className="border-b border-border/20 hover:bg-secondary/20">
                    <td className="py-2.5 pr-3 text-xs font-mono text-muted-foreground">{eq.id}</td>
                    <td className="py-2.5 pr-3 text-xs font-medium text-foreground">{eq.name}</td>
                    <td className="py-2.5 px-3 text-xs text-muted-foreground">{eq.type}</td>
                    <td className="py-2.5 px-3 text-xs font-mono text-right text-[#16a34a]">{eq.operationalHours}</td>
                    <td className="py-2.5 px-3 text-xs font-mono text-right text-destructive">{eq.downtimeHours || '—'}</td>
                    <td className="py-2.5 px-3 text-xs text-muted-foreground">{eq.downtimeCause}</td>
                    <td className="py-2.5 pl-3 text-right">
                      <span className={`text-xs font-semibold ${isLow ? 'text-destructive' : 'text-[#16a34a]'}`}>{util}%</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
