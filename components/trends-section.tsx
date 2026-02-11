"use client"

import { TrendingUp, TrendingDown } from "lucide-react"

interface TrendProject {
  id: string
  name: string
  costTrend: number
  scheduleTrend: number
}

export function TrendsSection() {
  // Mock data for projects with uptrends
  const uptrends: TrendProject[] = [
    { id: "1", name: "Harbor Bridge", costTrend: 12.5, scheduleTrend: 8.3 },
    { id: "2", name: "Tech Campus", costTrend: 9.7, scheduleTrend: 11.2 },
    { id: "3", name: "Metro Tower", costTrend: 7.4, scheduleTrend: 6.8 },
  ]

  // Mock data for projects with downtrends
  const downtrends: TrendProject[] = [
    { id: "4", name: "Riverside Homes", costTrend: -15.3, scheduleTrend: -9.5 },
    { id: "5", name: "Industrial Park", costTrend: -11.2, scheduleTrend: -7.8 },
    { id: "6", name: "Skyline Plaza", costTrend: -8.6, scheduleTrend: -5.2 },
  ]

  return (
    <div className="glass-card rounded-lg p-4 h-full flex flex-col">
      <h2 className="text-sm font-medium text-foreground mb-6">Uptrends / Downtrends</h2>

      <div className="flex-1 overflow-y-auto space-y-6">
        {/* Uptrends Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-success" />
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide">Best Uptrends</h3>
          </div>
          <div className="space-y-2">
            {uptrends.map((project) => (
              <div key={project.id} className="group cursor-pointer">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-foreground truncate hover:text-accent transition-colors">{project.name}</p>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs text-muted-foreground">Cost</span>
                      <span className="text-xs font-semibold text-success">+{project.costTrend}%</span>
                    </div>
                    <div className="h-1.5 bg-secondary/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-success transition-all duration-300"
                        style={{ width: `${Math.min(project.costTrend * 3, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs text-muted-foreground">Schedule</span>
                      <span className="text-xs font-semibold text-success">+{project.scheduleTrend}%</span>
                    </div>
                    <div className="h-1.5 bg-secondary/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-success transition-all duration-300"
                        style={{ width: `${Math.min(project.scheduleTrend * 3, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Downtrends Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="w-4 h-4 text-destructive" />
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide">Biggest Downtrends</h3>
          </div>
          <div className="space-y-2">
            {downtrends.map((project) => (
              <div key={project.id} className="group cursor-pointer">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-foreground truncate hover:text-accent transition-colors">{project.name}</p>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs text-muted-foreground">Cost</span>
                      <span className="text-xs font-semibold text-destructive">{project.costTrend}%</span>
                    </div>
                    <div className="h-1.5 bg-secondary/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-destructive transition-all duration-300"
                        style={{ width: `${Math.min(Math.abs(project.costTrend) * 3, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs text-muted-foreground">Schedule</span>
                      <span className="text-xs font-semibold text-destructive">{project.scheduleTrend}%</span>
                    </div>
                    <div className="h-1.5 bg-secondary/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-destructive transition-all duration-300"
                        style={{ width: `${Math.min(Math.abs(project.scheduleTrend) * 3, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
