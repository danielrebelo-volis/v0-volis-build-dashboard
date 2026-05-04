'use client'

import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts'
import { X, Euro, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useChartColors } from '@/hooks/use-chart-colors'

interface ActivityDrillDownProps {
  isOpen: boolean
  onClose: () => void
}

interface ActivitySCurveData {
  week: number
  planned: number
  actual: number
}

const generateActivityData = (activityNumber: number): ActivitySCurveData[] => {
  const variance = activityNumber * 2
  return [
    { week: 1, planned: 1, actual: 0.5 + variance * 0.05 },
    { week: 2, planned: 3, actual: 2.5 + variance * 0.08 },
    { week: 3, planned: 6, actual: 6.5 + variance * 0.1 },
    { week: 4, planned: 10, actual: 10.5 + variance * 0.08 },
    { week: 5, planned: 15, actual: 14.2 + variance * 0.05 },
    { week: 6, planned: 22, actual: 23.8 + variance * 0.03 },
    { week: 7, planned: 30, actual: 32.1 + variance * 0.02 },
    { week: 8, planned: 40, actual: 41.5 + variance * 0.01 },
    { week: 9, planned: 55, actual: 53.2 - variance * 0.02 },
    { week: 10, planned: 70, actual: 68.5 - variance * 0.03 },
    { week: 11, planned: 85, actual: 87.3 - variance * 0.02 },
    { week: 12, planned: 100, actual: 100 },
  ]
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: number
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 rounded-lg border border-border/50">
        <p className="text-xs text-muted-foreground">Week {label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
            {entry.name}: {entry.value}%
          </p>
        ))}
      </div>
    )
  }
  return null
}

function ActivitySCurve({ activityNumber }: { activityNumber: number }) {
  const data = generateActivityData(activityNumber)
  const colors = useChartColors()

  return (
    <div className="glass-card rounded-lg p-4 border border-border/50">
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-foreground">Activity {activityNumber} Progress</h4>
        <p className="text-xs text-muted-foreground mt-1">Planned vs. Actual completion</p>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 24 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
          <XAxis
            dataKey="week"
            stroke={colors.axisLight}
            tick={{ fontSize: 11 }}
            tickFormatter={(v) => `W${v}`}
          >
            <Label value="Weeks" offset={-8} position="insideBottom" style={{ fontSize: 11, fill: colors.axisLight }} />
          </XAxis>
          <YAxis
            stroke={colors.axisLight}
            tick={{ fontSize: 11 }}
            tickFormatter={(v) => `${v}%`}
            domain={[0, 100]}
          >
            <Label value="% Completion" angle={-90} position="insideLeft" offset={-10} style={{ fontSize: 11, fill: colors.axisLight }} />
          </YAxis>
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="planned" 
            stroke={colors.plannedLineDashed} 
            strokeDasharray="5 5"
            strokeWidth={1.5}
            dot={false}
            name="Planned Progress"
            isAnimationActive={false}
          />
          <Line 
            type="monotone" 
            dataKey="actual" 
            stroke={colors.isDark ? "rgba(0,200,255,1)" : "#6C5CE7"} 
            strokeWidth={2}
            dot={false}
            name="Actual Progress"
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function ActivityDrillDown({ isOpen, onClose }: ActivityDrillDownProps) {
  const [selectedActivity, setSelectedActivity] = useState<number | null>(1)
  const activities = Array.from({ length: 5 }, (_, i) => i + 1)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-secondary rounded-lg border border-border/50 w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-card">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50 sticky top-0 bg-secondary/95">
          <h2 className="text-xl font-bold text-foreground">Activity Drill-Down</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-8">
            {/* Activity List */}
            <div className="lg:col-span-1">
              <h3 className="text-sm font-semibold text-foreground mb-3">Activities</h3>
              <div className="space-y-2">
                {activities.map((activity) => (
                  <button
                    key={activity}
                    onClick={() => setSelectedActivity(activity)}
                    className={`w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedActivity === activity
                        ? 'bg-cyan text-background'
                        : 'bg-secondary/50 text-foreground hover:bg-secondary/70'
                    }`}
                  >
                    Activity {activity}
                  </button>
                ))}
              </div>
            </div>

            {/* S-Curve Chart */}
            <div className="lg:col-span-4">
              {selectedActivity && (
                <ActivitySCurve activityNumber={selectedActivity} />
              )}
            </div>
          </div>

          {/* Activity Details */}
          {selectedActivity && (
            <div className="glass-card rounded-lg p-4 border border-border/50">
              <h3 className="text-sm font-semibold text-foreground mb-4">Activity {selectedActivity} — Cost Overview</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Budgeted Cost */}
                <div className="glass-card rounded-lg p-3 border border-border/40">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Euro className="w-3.5 h-3.5 text-muted-foreground" />
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Budgeted Cost</p>
                  </div>
                  <p className="text-xl font-bold text-foreground">€{(1.2 + selectedActivity * 0.4).toFixed(1)}M</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">BAC</p>
                </div>

                {/* Actual Cost */}
                <div className="glass-card rounded-lg p-3 border border-border/40">
                  <div className="flex items-center gap-1.5 mb-2">
                    <TrendingUp className="w-3.5 h-3.5 text-warning" />
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Actual Cost</p>
                  </div>
                  <p className="text-xl font-bold text-warning">€{(1.1 + selectedActivity * 0.46).toFixed(1)}M</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">to date</p>
                </div>

                {/* Cost Variance */}
                <div className="glass-card rounded-lg p-3 border border-border/40">
                  <div className="flex items-center gap-1.5 mb-2">
                    <TrendingDown className="w-3.5 h-3.5 text-destructive" />
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Cost Variance</p>
                  </div>
                  <p className="text-xl font-bold text-destructive">-€{(selectedActivity * 0.06).toFixed(2)}M</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">over budget</p>
                </div>

                {/* Projected IC */}
                <div className="glass-card rounded-lg p-3 border border-border/40">
                  <div className="flex items-center gap-1.5 mb-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-warning" />
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Projected IC</p>
                  </div>
                  <p className="text-xl font-bold text-warning">{88 + selectedActivity * 2}%</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Commercial: <span className="font-medium">{80 + selectedActivity}%</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
