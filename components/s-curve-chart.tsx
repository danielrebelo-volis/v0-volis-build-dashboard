'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useChartColors } from '@/hooks/use-chart-colors'

const progressData = [
  { week: 1, planned: 5, forecast: 4, actual: 3, actualSolid: 3, actualDashed: null },
  { week: 2, planned: 10, forecast: 8, actual: 5, actualSolid: 5, actualDashed: null },
  { week: 3, planned: 15, forecast: 11, actual: 8, actualSolid: 8, actualDashed: null },
  { week: 4, planned: 20, forecast: 16, actual: 12, actualSolid: 12, actualDashed: null },
  { week: 5, planned: 28, forecast: 22, actual: 18, actualSolid: 18, actualDashed: null },
  { week: 6, planned: 36, forecast: 30, actual: 25, actualSolid: 25, actualDashed: null },
  { week: 7, planned: 45, forecast: 38, actual: 34, actualSolid: 34, actualDashed: null },
  { week: 8, planned: 55, forecast: 48, actual: 45, actualSolid: 45, actualDashed: 45 },
  { week: 9, planned: 65, forecast: 55, actual: 50, actualSolid: null, actualDashed: 50 },
]

export function SProgressCurve() {
  const colors = useChartColors()

  return (
    <div className="glass-card rounded-lg p-4 border border-border/50">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">Progress S-Curve</h3>
        <p className="text-xs text-muted-foreground mt-1">Commercial vs. Forecast vs. Actual completion</p>
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
            payload={
              [
                { value: 'Commercial', type: 'line', id: 'baseline', color: '#999999' },
                { value: 'Forecast', type: 'line', id: 'actualSolid', color: colors.isDark ? "#00c8ff" : "#6C5CE7" },
                { value: 'Actual', type: 'line', id: 'actualSolid', color: colors.isDark ? "#00ff88" : "#00b894" },
              ]
            }
          />
          <Line
            type="monotone"
            dataKey="planned"
            stroke="#999999"
            name="Commercial"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="forecast"
            stroke={colors.isDark ? "#00c8ff" : "#6C5CE7"}
            name="Forecast"
            strokeWidth={2}
            dot={false}
          />
          {/* Solid portion: weeks 1–8 */}
          <Line
            type="monotone"
            dataKey="actualSolid"
            stroke={colors.isDark ? "#00ff88" : "#00b894"}
            name="Actual"
            strokeWidth={2}
            dot={false}
            connectNulls={false}
          />
          {/* Dashed portion: weeks 8–9 (forecast) */}
          <Line
            type="monotone"
            dataKey="actualDashed"
            stroke={colors.isDark ? "#00ff88" : "#00b894"}
            strokeWidth={2}
            dot={false}
            strokeDasharray="6 4"
            legendType="none"
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function SCostCurve() {
  const colors = useChartColors()

  const costData = [
    { week: 1, baseline: 3.2, actualSolid: 3.3, actualDashed: null },
    { week: 2, baseline: 6.1, actualSolid: 7.0, actualDashed: null },
    { week: 3, baseline: 9.2, actualSolid: 10.3, actualDashed: null },
    { week: 4, baseline: 12.4, actualSolid: 14.1, actualDashed: null },
    { week: 5, baseline: 15.1, actualSolid: 18.0, actualDashed: null },
    { week: 6, baseline: 19.1, actualSolid: 22.5, actualDashed: null },
    { week: 7, baseline: 24.6, actualSolid: 27.5, actualDashed: null },
    { week: 8, baseline: 28.4, actualSolid: 33.3, actualDashed: 33.3 },
    { week: 9, baseline: 33.5, actualSolid: null, actualDashed: 40.0 },
  ]

  return (
    <div className="glass-card rounded-lg p-4 border border-border/50">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">Economic S-Curve</h3>
        <p className="text-xs text-muted-foreground mt-1">Commercial vs. Actual expenditure</p>
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
            payload={
              [
                { value: 'Commercial', type: 'line', id: 'baseline', color: '#999999' },
                { value: 'Actual', type: 'line', id: 'actualSolid', color: '#ff6b6b' },
              ]
            }
          />
          <Line
            type="monotone"
            dataKey="baseline"
            stroke="#999999"
            name="Commercial"
            strokeWidth={2}
            dot={false}
          />
          {/* Solid portion: weeks 1–8 */}
          <Line
            type="monotone"
            dataKey="actualSolid"
            stroke="#ff6b6b"
            name="Actual"
            strokeWidth={2}
            dot={false}
            connectNulls={false}
          />
          {/* Dashed portion: weeks 8–9 (forecast) */}
          <Line
            type="monotone"
            legendType="none"
            dataKey="actualDashed"
            stroke="#ff6b6b"
            strokeWidth={2}
            dot={false}
            strokeDasharray="6 4"
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
