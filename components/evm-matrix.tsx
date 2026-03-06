'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import type { Project } from '@/lib/types'

const categoryColors: Record<Project['category'], string> = {
  'Infraestruturas Rodoviárias': '#EF4444',
  'Infraestruturas Ferroviárias': '#F97316',
  'Infraestruturas Hidráulicas': '#3B82F6',
  'Infraestruturas Portuárias': '#06B6D4',
  'Infraestruturas Aeroportos': '#8B5CF6',
  'Infraestruturas Urbanas': '#EC4899',
  'Construção Civil': '#F59E0B',
  'Mineração': '#6B7280',
  'Oil&Gas': '#000000',
  'Power (energia)': '#FBBF24',
  'Outras obras': '#A1A5B8'
}

type Matrix = {
  x: number
  y: number
  data: Project[]
}

interface EVMMatrixProps {
  projects: Project[]
}

export function EVMMatrix({ projects }: EVMMatrixProps) {
  const [selectedCategory, setSelectedCategory] = useState<Project['category'] | 'all'>('all')

  const matrix = useMemo(() => {
    const filtered = selectedCategory === 'all' ? projects : projects.filter(p => p.category === selectedCategory)

    const grid: Record<string, Matrix> = {}

    filtered.forEach((project) => {
      const delay = ((project.delayPercentage ?? 0) / 25) * 2
      const cost = ((project.industrialCostPercentage ?? 100) / 25 - 2) * 2

      const x = Math.round(delay)
      const y = Math.round(cost)

      const key = `${x},${y}`

      if (!grid[key]) {
        grid[key] = { x, y, data: [] }
      }

      grid[key].data.push(project)
    })

    return Object.values(grid)
  }, [projects, selectedCategory])

  return (
    <div className="relative w-full flex flex-col items-center justify-start" style={{ minHeight: '600px' }}>
      <div className="relative w-[calc(100%-80px)] flex-1" style={{ minHeight: '480px' }} suppressHydrationWarning>
        {/* Y-Axis (left) - Industrial Cost % */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col justify-between h-[calc(100%-60px)]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground font-mono">110%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground font-mono">97.5%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-warning font-mono font-semibold"></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground font-mono">72.5%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground font-mono">60%</span>
          </div>
        </div>

        {/* Y-Axis Label */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 origin-center -rotate-90">
          <span className="text-xs font-semibold text-muted-foreground tracking-wider">INDUSTRIAL COST</span>
        </div>

        {/* X-Axis (bottom) - delay % */}
        <div className="absolute bottom-14 left-10 right-10 flex justify-between">
          <span className="text-[10px] text-muted-foreground font-mono">-50%</span>
          <span className="text-[10px] text-muted-foreground font-mono">-25%</span>
          <span className="text-[10px] text-success font-mono font-semibold">0%</span>
          <span className="text-[10px] text-muted-foreground font-mono">+25%</span>
          <span className="text-[10px] text-muted-foreground font-mono">+50%</span>
        </div>

        {/* X-Axis Label */}
        <div className="absolute bottom-3 left-10 right-10 flex items-center justify-center">
          <span className="text-xs font-semibold text-muted-foreground tracking-wider">DELAY</span>
        </div>

        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" suppressHydrationWarning>
          {/* Vertical lines */}
          {[-2, -1, 0, 1, 2].map((i) => (
            <line
              key={`v-${i}`}
              x1={`${50 + i * 20}%`}
              y1="0%"
              x2={`${50 + i * 20}%`}
              y2="100%"
              stroke="currentColor"
              strokeWidth="1"
              className="text-border/20"
            />
          ))}
          {/* Horizontal lines */}
          {[-2, -1, 0, 1, 2].map((i) => (
            <line
              key={`h-${i}`}
              x1="0%"
              y1={`${50 + i * 20}%`}
              x2="100%"
              y2={`${50 + i * 20}%`}
              stroke="currentColor"
              strokeWidth="1"
              className="text-border/20"
            />
          ))}

          {/* Center lines (0,0) */}
          <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="currentColor" strokeWidth="1.5" className="text-success/40" />
          <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="currentColor" strokeWidth="1.5" className="text-success/40" />

          {/* Quadrant backgrounds */}
          <rect x="50%" y="0%" width="50%" height="50%" fill="currentColor" className="text-destructive/5" />
          <rect x="0%" y="0%" width="50%" height="50%" fill="currentColor" className="text-success/5" />
        </svg>

        {/* Matrix bubbles */}
        {matrix.map((point) => {
          const xPercent = 50 + point.x * 20
          const yPercent = 50 - point.y * 20

          return (
            <div
              key={`${point.x},${point.y}`}
              className="absolute flex items-center justify-center group cursor-pointer"
              style={{
                left: `${xPercent}%`,
                top: `${yPercent}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {/* Bubble container */}
              <div className="relative">
                {/* Outer ring with hover effect */}
                <div className="absolute inset-0 rounded-full bg-background/50 backdrop-blur-sm border border-border/40 group-hover:border-foreground/40 transition-all group-hover:scale-110" />

                {/* Content */}
                <div className="relative px-3 py-2 flex flex-col items-center justify-center min-w-[60px]">
                  <span className="text-[11px] font-semibold text-foreground">{point.data.length}</span>
                  <span className="text-[9px] text-muted-foreground whitespace-nowrap">
                    {point.data.length === 1 ? 'project' : 'projects'}
                  </span>

                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-background/95 backdrop-blur-sm border border-border rounded-md p-2 whitespace-nowrap text-[10px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-lg">
                    {point.data
                      .slice(0, 3)
                      .map((p) => p.name)
                      .join(', ')}
                    {point.data.length > 3 && ` +${point.data.length - 3}`}
                  </div>

                  {/* Category color indicators */}
                  <div className="absolute -bottom-1 flex gap-1">
                    {point.data.slice(0, 3).map((p, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: categoryColors[p.category] }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Category Legend - Below Matrix */}
      <div className="w-full mt-8 px-6 mb-6">
        <div className="glass-card rounded-lg p-4 border border-border/40 backdrop-blur-sm bg-gradient-to-r from-background/40 to-background/20">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-sm font-semibold text-foreground tracking-wide">Work Typology:</span>
            <div className="flex items-center gap-3 flex-wrap">
              {(
                [
                  'all',
                  'Infraestruturas Rodoviárias',
                  'Infraestruturas Ferroviárias',
                  'Infraestruturas Hidráulicas',
                  'Infraestruturas Portuárias',
                  'Infraestruturas Aeroportos',
                  'Infraestruturas Urbanas',
                  'Construção Civil',
                  'Mineração',
                  'Oil&Gas',
                  'Power (energia)',
                  'Outras obras'
                ] as const
              ).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all whitespace-nowrap text-sm ${
                    selectedCategory === cat
                      ? 'bg-foreground/10 text-foreground font-semibold border border-foreground/30'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/50 border border-transparent'
                  }`}
                >
                  {cat !== 'all' ? (
                    <>
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: categoryColors[cat as Project['category']],
                          boxShadow:
                            selectedCategory === cat
                              ? `0 0 8px ${categoryColors[cat as Project['category']]}`
                              : 'none'
                        }}
                      />
                      <span>{cat}</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2.5 h-2.5 rounded-full border-2 border-muted-foreground/60 flex-shrink-0" />
                      <span>All</span>
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
