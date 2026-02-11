'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface SCurveData {
  week: number
  planned: number
  actual: number
}

const data: SCurveData[] = [
  { week: 1, planned: 2, actual: 1.5 },
  { week: 2, planned: 5, actual: 4.8 },
  { week: 3, planned: 8, actual: 9.2 },
  { week: 4, planned: 12, actual: 13.5 },
  { week: 5, planned: 16, actual: 15.8 },
  { week: 6, planned: 21, actual: 22.3 },
  { week: 7, planned: 28, actual: 31.2 },
  { week: 8, planned: 35, actual: 38.5 },
  { week: 9, planned: 43, actual: 45.2 },
  { week: 10, planned: 52, actual: 51.8 },
  { week: 11, planned: 62, actual: 64.3 },
  { week: 12, planned: 72, actual: 75.6 },
  { week: 13, planned: 81, actual: 79.2 },
  { week: 14, planned: 88, actual: 85.8 },
  { week: 15, planned: 94, actual: 92.5 },
  { week: 16, planned: 98, actual: 97.8 },
  { week: 17, planned: 100, actual: 100 },
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
    { week: 1, budgeted: 150000, actual: 120000 },
    { week: 2, budgeted: 350000, actual: 340000 },
    { week: 3, budgeted: 580000, actual: 620000 },
    { week: 4, budgeted: 850000, actual: 920000 },
    { week: 5, budgeted: 1100000, actual: 1080000 },
    { week: 6, budgeted: 1450000, actual: 1520000 },
    { week: 7, budgeted: 1920000, actual: 2100000 },
    { week: 8, budgeted: 2400000, actual: 2650000 },
    { week: 9, budgeted: 2950000, actual: 3080000 },
    { week: 10, budgeted: 3580000, actual: 3520000 },
    { week: 11, budgeted: 4250000, actual: 4380000 },
    { week: 12, budgeted: 4950000, actual: 5150000 },
    { week: 13, budgeted: 5550000, actual: 5420000 },
    { week: 14, budgeted: 6050000, actual: 5900000 },
    { week: 15, budgeted: 6450000, actual: 6350000 },
    { week: 16, budgeted: 6700000, actual: 6700000 },
    { week: 17, budgeted: 6850000, actual: 6850000 },
  ]

  const formatCurrency = (value: number) => {
    return `€${(value / 1000000).toFixed(1)}M`
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
              {entry.name}: {formatCurrency(entry.value)}
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
        <h3 className="text-sm font-semibold text-foreground">Cost S-Curve</h3>
        <p className="text-xs text-muted-foreground mt-1">Budgeted vs. Actual expenditure</p>
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
            name="Budgeted Cost"
            isAnimationActive={false}
          />
          <Line 
            type="monotone" 
            dataKey="actual" 
            stroke="rgba(0,200,255,1)" 
            strokeWidth={2.5}
            dot={false}
            name="Actual Cost"
            isAnimationActive={false}
            filter="drop-shadow(0 0 6px rgba(0,200,255,0.8))"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
