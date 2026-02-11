import { TrendingUp, Target, DollarSign } from 'lucide-react'

interface OtherIndicatorsProps {
  weeklyProgress: number
  priorWeekProgress: number
  requiredWeeklyProgress: number
  earnedValue: number
}

export function OtherIndicators({
  weeklyProgress,
  priorWeekProgress,
  requiredWeeklyProgress,
  earnedValue,
}: OtherIndicatorsProps) {
  const progressTrend = weeklyProgress - priorWeekProgress
  const progressTrendPercent = ((progressTrend / priorWeekProgress) * 100).toFixed(1)
  const isPositiveTrend = progressTrend >= 0

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-foreground mb-4">Other Indicators</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Weekly Average Progress */}
        <div className="glass-card rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan" />
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Weekly Avg Progress
              </p>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-3xl font-bold text-foreground">{weeklyProgress.toFixed(1)}%</p>
          </div>
          <div className={`flex items-center gap-1.5 text-xs ${isPositiveTrend ? 'text-success' : 'text-destructive'}`}>
            <span className={`flex items-center gap-1 ${isPositiveTrend ? 'text-success' : 'text-destructive'}`}>
              {isPositiveTrend ? '↑' : '↓'} {Math.abs(parseFloat(progressTrendPercent))}%
            </span>
            <span className="text-muted-foreground">vs prior week</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Prior week: {priorWeekProgress.toFixed(1)}%</p>
        </div>

        {/* Weekly Progress Needed for Deadline */}
        <div className="glass-card rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan" />
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Required Weekly Progress
              </p>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-3xl font-bold text-foreground">{requiredWeeklyProgress.toFixed(1)}%</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className={weeklyProgress >= requiredWeeklyProgress ? 'text-success' : 'text-warning'}>
              {weeklyProgress >= requiredWeeklyProgress ? '✓ On track' : '⚠ Behind target'}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">To finish on initial deadline</p>
        </div>

        {/* Earned Value */}
        <div className="glass-card rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-cyan" />
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Earned Value
              </p>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-3xl font-bold text-foreground">€{(earnedValue / 1000000).toFixed(2)}M</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Completed activities value</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Out of €6.85M total budget</p>
        </div>
      </div>
    </div>
  )
}
