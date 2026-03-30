import { TrendingUp, Target, DollarSign, AlertTriangle, BarChart2 } from 'lucide-react'

interface OtherIndicatorsProps {
  avgWeeklyProgress?: number
  requiredWeeklyProgress?: number
  avgWeeklyCosts?: number          // €M per week
  requiredWeeklyCosts?: number     // €M per week to hit projected IC
  dataQuality?: number             // 0–100 % of reports present (100 = no missing)
}

function IndicatorCard({
  icon: Icon,
  label,
  value,
  sub,
  valueColor = 'text-foreground',
}: {
  icon: React.ElementType
  label: string
  value: string
  sub?: string
  valueColor?: string
}) {
  return (
    <div className="glass-card rounded-lg p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider leading-tight">{label}</p>
      </div>
      <p className={`text-2xl font-bold mb-1 ${valueColor}`}>{value}</p>
      {sub && <p className="text-[11px] text-muted-foreground">{sub}</p>}
    </div>
  )
}

export function OtherIndicators({
  avgWeeklyProgress = 2.4,
  requiredWeeklyProgress = 2.0,
  avgWeeklyCosts = 0.38,
  requiredWeeklyCosts = 0.42,
  dataQuality = 87,
}: OtherIndicatorsProps) {
  const progressOnTrack = avgWeeklyProgress >= requiredWeeklyProgress
  const costsOnTrack = avgWeeklyCosts <= requiredWeeklyCosts
  const qualityColor = dataQuality >= 90 ? 'text-success' : dataQuality >= 70 ? 'text-warning' : 'text-destructive'

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-foreground mb-4">Other Indicators</h2>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">

        <IndicatorCard
          icon={TrendingUp}
          label="Avg Weekly Progress"
          value={`${avgWeeklyProgress.toFixed(1)}%`}
          sub="Average per week to date"
          valueColor={progressOnTrack ? 'text-success' : 'text-warning'}
        />

        <IndicatorCard
          icon={Target}
          label="Required Weekly Progress"
          value={`${requiredWeeklyProgress.toFixed(1)}%`}
          sub={progressOnTrack ? 'Current pace sufficient' : 'Increase pace to meet deadline'}
          valueColor={progressOnTrack ? 'text-foreground' : 'text-warning'}
        />

        <IndicatorCard
          icon={DollarSign}
          label="Avg Weekly Costs"
          value={`€${avgWeeklyCosts.toFixed(2)}M`}
          sub="Average cost per week to date"
          valueColor={costsOnTrack ? 'text-success' : 'text-warning'}
        />

        <IndicatorCard
          icon={BarChart2}
          label="Required Weekly Costs"
          value={`€${requiredWeeklyCosts.toFixed(2)}M`}
          sub="To achieve projected IC"
          valueColor="text-foreground"
        />

        <IndicatorCard
          icon={AlertTriangle}
          label="Data Quality"
          value={`${dataQuality}%`}
          sub={`${100 - dataQuality}% of reports missing`}
          valueColor={qualityColor}
        />

      </div>
    </div>
  )
}
