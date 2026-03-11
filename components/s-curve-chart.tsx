'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useChartColors } from '@/hooks/use-chart-colors'

const progressData = [
  { week: 1, planned: 5, forecast: 4, actual: 3 },
  { week: 2, planned: 10, forecast: 8, actual: 5 },
  { week: 3, planned: 15, forecast: 11, actual: 8 },
  { week: 4, planned: 20, forecast: 16, actual: 12 },
  { week: 5, planned: 28, forecast: 22, actual: 18 },
  { week: 6, planned: 36, forecast: 30, actual: 25 },
  { week: 7, planned: 45, forecast: 38, actual: 34 },
  { week: 8, planned: 55, forecast: 48, actual: 45 },
  { week: 9, planned: 65, forecast: 55, actual: 50 },
]

export function SProgressCurve() {
  const colors = useChartColors()
  
  // Split data: solid line up to week 8, dashed line for week 8-9
  const solidData = progressData.slice(0, 8)
  const dashedData = progressData.slice(7) // Include week 8 for continuity

  return (
    <div className="glass-card rounded-lg p-4 border border-border/50">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">Progress S-Curve</h3>
        <p className="text-xs text-muted-foreground mt-1">Planned vs. Forecast vs. Actual completion</p>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={progressData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
          <XAxis 
            dataKey="week" 
            stroke={colors.axis}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            stroke={colors.axis}
            tick={{ fontSize: 12 }}
          />
          <Tooltip contentStyle={{ backgroundColor: colors.tooltipBg, border: colors.tooltipBorder }} />
          <Legend 
            wrapperStyle={{ paddingTop: '12px' }}
            iconType="line"
          />
          {/* Solid lines for weeks 1-8 */}
          <Line type="monotone" dataKey="planned" stroke="#999999" name="Planned" strokeWidth={2} dot={false} data={solidData} />
          <Line type="monotone" dataKey="forecast" stroke={colors.isDark ? "#00c8ff" : "#6C5CE7"} name="Forecast" strokeWidth={2} dot={false} data={solidData} />
          <Line type="monotone" dataKey="actual" stroke={colors.isDark ? "#00ff88" : "#00b894"} name="Actual" strokeWidth={2} dot={false} data={solidData} />
          
          {/* Dashed lines for weeks 8-9 (forecast) */}
          <Line type="monotone" dataKey="planned" stroke="#999999" strokeWidth={2} dot={false} strokeDasharray="5 5" data={dashedData} />
          <Line type="monotone" dataKey="forecast" stroke={colors.isDark ? "#00c8ff" : "#6C5CE7"} strokeWidth={2} dot={false} strokeDasharray="5 5" data={dashedData} />
          <Line type="monotone" dataKey="actual" stroke={colors.isDark ? "#00ff88" : "#00b894"} strokeWidth={2} dot={false} strokeDasharray="5 5" data={dashedData} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function SCostCurve() {
  const colors = useChartColors()

  const costData = [
    { week: 1, baseline: 3.2, actual: 3.3 },
    { week: 2, baseline: 6.1, actual: 7.0 },
    { week: 3, baseline: 9.2, actual: 10.3 },
    { week: 4, baseline: 12.4, actual: 14.1 },
    { week: 5, baseline: 15.1, actual: 18.0 },
    { week: 6, baseline: 19.1, actual: 22.5 },
    { week: 7, baseline: 24.6, actual: 27.5 },
    { week: 8, baseline: 28.4, actual: 33.3 },
    { week: 9, baseline: 33.5, actual: 40.0 },
  ]
  
  // Split data: solid line up to week 8, dashed line for week 8-9
  const solidData = costData.slice(0, 8)
  const dashedData = costData.slice(7) // Include week 8 for continuity

  return (
    <div className="glass-card rounded-lg p-4 border border-border/50">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">Economic S-Curve</h3>
        <p className="text-xs text-muted-foreground mt-1">Planned vs. Actual expenditure</p>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={costData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
          <XAxis 
            dataKey="week" 
            stroke={colors.axis}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            stroke={colors.axis}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `€${value.toFixed(1)}M`}
          />
          <Tooltip contentStyle={{ backgroundColor: colors.tooltipBg, border: colors.tooltipBorder }} formatter={(value: number) => `€${value.toFixed(1)}M`} />
          <Legend 
            wrapperStyle={{ paddingTop: '12px' }}
            iconType="line"
          />
          {/* Solid lines for weeks 1-8 */}
          <Line type="monotone" dataKey="baseline" stroke="#999999" name="Planned" strokeWidth={2} dot={false} data={solidData} />
          <Line type="monotone" dataKey="actual" stroke="#ff6b6b" name="Actual" strokeWidth={2} dot={false} data={solidData} />
          
          {/* Dashed lines for weeks 8-9 (forecast) */}
          <Line type="monotone" dataKey="baseline" stroke="#999999" strokeWidth={2} dot={false} strokeDasharray="5 5" data={dashedData} />
          <Line type="monotone" dataKey="actual" stroke="#ff6b6b" strokeWidth={2} dot={false} strokeDasharray="5 5" data={dashedData} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
