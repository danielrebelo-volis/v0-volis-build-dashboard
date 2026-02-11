'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface SCurveData {
  week: number
  planned: number
  actual: number
}

const data: SCurveData[] = [
  { week: 1, planned: 5, actual: 3 },
  { week: 2, planned: 10, actual: 5 },
  { week: 3, planned: 15, actual: 8 },
  { week: 4, planned: 20, actual: 12 },
  { week: 5, planned: 28, actual: 18 },
  { week: 6, planned: 36, actual: 25 },
  { week: 7, planned: 45, actual: 34 },
  { week: 8, planned: 55, actual: 45 },
  { week: 9, planned: 65, actual: 50 },
]

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

export function SProgressCurve() {
  return (
    <div className="glass-card rounded-lg p-4 border border-border/50">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">Progress S-Curve</h3>
        <p className="text-xs text-muted-foreground mt-1">Planned vs. Actual completion</p>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="week" 
            stroke="rgba(255,255,255,0.3)"
            tick={{ fontSize: 12 }}
            label={{ value: 'Project Timeline (weeks)', position: 'insideBottomRight', offset: -5 }}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.3)"
            tick={{ fontSize: 12 }}
            label={{ value: 'Completion %', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="planned" 
            stroke="rgba(255,255,255,0.3)" 
            strokeDasharray="5 5"
            strokeWidth={1.5}
            dot={false}
            name="Planned Progress"
            isAnimationActive={false}
          />
          <Line 
            type="monotone" 
            dataKey="actual" 
            stroke="rgba(0,200,255,1)" 
            strokeWidth={2.5}
            dot={false}
            name="Actual Progress"
            isAnimationActive={false}
            filter="drop-shadow(0 0 6px rgba(0,200,255,0.8))"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function SCostCurve() {
  const costData = [
    { week: 1, budgeted: 3.2, actual: 3.3 },
    { week: 2, budgeted: 6.1, actual: 7.0 },
    { week: 3, budgeted: 9.2, actual: 10.3 },
    { week: 4, budgeted: 12.4, actual: 14.1 },
    { week: 5, budgeted: 15.1, actual: 18.0 },
    { week: 6, budgeted: 19.1, actual: 22.5 },
    { week: 7, budgeted: 24.6, actual: 27.5 },
    { week: 8, budgeted: 28.4, actual: 33.3 },
    { week: 9, budgeted: 33.5, actual: 40.0 },
  ]

  const formatCurrency = (value: number) => {
    return `€${value.toFixed(1)}M`
  }

  interface CostTooltipProps {
    active?: boolean
    payload?: Array<{ name: string; value: number; color: string }>
    label?: number
  }

  const CostTooltip = ({ active, payload, label }: CostTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 rounded-lg border border-border/50">
          <p className="text-xs text-muted-foreground">Week {label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
              {entry.name}: €{entry.value.toFixed(1)}M
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="glass-card rounded-lg p-4 border border-border/50">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">Economic S-Curve</h3>
        <p className="text-xs text-muted-foreground mt-1">Baseline vs. Actual expenditure</p>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={costData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="week" 
            stroke="rgba(255,255,255,0.3)"
            tick={{ fontSize: 12 }}
            label={{ value: 'Project Timeline (weeks)', position: 'insideBottomRight', offset: -5 }}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.3)"
            tick={{ fontSize: 12 }}
            tickFormatter={formatCurrency}
            label={{ value: 'Cost (EUR)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CostTooltip />} />
          <Line 
            type="monotone" 
            dataKey="budgeted" 
            stroke="rgba(255,255,255,0.3)" 
            strokeDasharray="5 5"
            strokeWidth={1.5}
            dot={false}
            name="Baseline"
            isAnimationActive={false}
          />
          <Line 
            type="monotone" 
            dataKey="actual" 
            stroke="rgba(0,200,255,1)" 
            strokeWidth={2.5}
            dot={false}
            name="Actual"
            isAnimationActive={false}
            filter="drop-shadow(0 0 6px rgba(0,200,255,0.8))"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
