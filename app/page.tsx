'use client'

import { useState } from 'react'
import { DashboardHeader } from "@/components/dashboard-header"
import { EVMMatrix } from "@/components/evm-matrix"
import { MetricsSidebar } from "@/components/metrics-sidebar"
import { ProjectList } from "@/components/project-list"
import { TrendsSection } from "@/components/trends-section"
import { Download, RefreshCw, GitCompare, Globe, Map, ChevronDown, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const REGIONS = ["Europa", "Africa", "Asia", "LatAm"] as const
type Region = typeof REGIONS[number]

export default function Dashboard() {
  const [status, setStatus] = useState<"ongoing" | "finished">("ongoing")
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null)
  const [mapView, setMapView] = useState(false)
  const [filterType, setFilterType] = useState<'typology' | null>(null)
  const [filterValue, setFilterValue] = useState<string | null>(null)

  const handleFilterSelect = (type: 'typology' | null, value: string | null) => {
    setFilterType(type)
    setFilterValue(value)
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="p-6">
        {/* Page Title & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">Performance Matrix</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Real-time accumulated production analysis across all active projects
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Compare Projects Button */}
            <Link href="/compare">
              <Button size="sm" className="gap-2 bg-foreground text-background hover:bg-foreground/90">
                <GitCompare className="w-4 h-4" />
                <span className="hidden sm:inline">Compare Projects</span>
              </Button>
            </Link>

            <Button variant="outline" size="sm" className="gap-2 text-muted-foreground bg-transparent">
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Main Grid Layout — upper section sized to viewport height */}
        <div className="grid grid-cols-12 gap-6">
          {/* Metrics Sidebar */}
          <div className="col-span-12 lg:col-span-2" style={{ height: 'calc(100svh - 14rem)' }}>
            <MetricsSidebar />
          </div>

          {/* EVM Matrix - Central Focus */}
          <div className="col-span-12 lg:col-span-7 flex flex-col gap-4">
            <div className="glass-card rounded-lg p-4 relative" style={{ height: 'calc(100svh - 14rem)' }}>
              <div className="absolute top-4 left-4 z-10">
                <div className="flex items-center gap-2">
                  {filterType && filterValue && (
                    <span className="ml-2 text-xs bg-accent/20 text-accent px-2 py-1 rounded">
                      {filterType}: {filterValue}
                    </span>
                  )}
                </div>
              </div>

              {/* Controls — top right */}
              <div className="absolute top-3 right-3 z-10 flex items-center gap-2">

                {/* Status toggle */}
                <div className="flex items-center rounded-md border border-border/40 bg-background/60 backdrop-blur p-0.5 text-xs font-medium">
                  {(["ongoing", "finished"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(s)}
                      className={`px-2.5 py-1 rounded capitalize transition-all ${status === s ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {/* Week selector */}
                <div className="flex items-center rounded-md border border-border/40 bg-background/60 backdrop-blur p-0.5 text-xs font-medium">
                  <span className="px-2 text-muted-foreground">W</span>
                  {[1, 2, 3, 4].map((w) => (
                    <button
                      key={w}
                      onClick={() => setSelectedWeek(selectedWeek === w ? null : w)}
                      className={`w-6 h-6 rounded flex items-center justify-center transition-all ${selectedWeek === w ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      {w}
                    </button>
                  ))}
                </div>

                {/* Region dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border/40 bg-background/60 backdrop-blur text-xs font-medium text-muted-foreground hover:text-foreground transition-all">
                      <span>{selectedRegion ?? "Regioes"}</span>
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-36">
                    <DropdownMenuItem onClick={() => setSelectedRegion(null)} className="flex items-center justify-between text-xs">
                      <span>Todas</span>
                      {selectedRegion === null && <Check className="w-3 h-3 text-accent" />}
                    </DropdownMenuItem>
                    {REGIONS.map((r) => (
                      <DropdownMenuItem key={r} onClick={() => setSelectedRegion(r)} className="flex items-center justify-between text-xs">
                        <span>{r}</span>
                        {selectedRegion === r && <Check className="w-3 h-3 text-accent" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Map view toggle */}
                <button
                  onClick={() => setMapView(!mapView)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-medium transition-all ${mapView ? "border-accent bg-accent/10 text-accent" : "border-border/40 bg-background/60 backdrop-blur text-muted-foreground hover:text-foreground"}`}
                >
                  {mapView ? <Globe className="w-3.5 h-3.5" /> : <Map className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{mapView ? "Mapa" : "Matriz"}</span>
                </button>
              </div>

              <EVMMatrix
                selectedStatus={status}
                selectedWeek={selectedWeek}
                selectedRegion={selectedRegion}
                selectedCategory={filterValue as any ?? "all"}
              />
            </div>

            {/* Typology Legend Card - Below Matrix */}
            <div className="glass-card rounded-md px-3 py-2 border border-border/30 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-semibold text-muted-foreground tracking-wide uppercase">Typology</span>
                <div className="flex items-center gap-2 flex-wrap max-w-full">
                  {(["all", "Road Infrastructure", "Railway Infrastructure", "Hydraulic Infrastructure", "Port Infrastructure", "Airport Infrastructure", "Urban Infrastructure", "Civil Construction", "Mining", "Oil&Gas", "Power (Energy)", "Other Works"] as const).map((cat) => {
                    const categoryColors: Record<string, string> = {
                      "Road Infrastructure": "#166534",
                      "Railway Infrastructure": "#fbbf24",
                      "Hydraulic Infrastructure": "#d4d4d8",
                      "Port Infrastructure": "#dc2626",
                      "Airport Infrastructure": "#9333ea",
                      "Urban Infrastructure": "#06b6d4",
                      "Civil Construction": "#00ff88",
                      "Mining": "#f59e0b",
                      "Oil&Gas": "#8b5cf6",
                      "Power (Energy)": "#ec4899",
                      "Other Works": "#64748b"
                    }
                    return (
                      <button
                        key={cat}
                        onClick={() => handleFilterSelect(cat === 'all' ? null : 'typology', cat === 'all' ? null : cat)}
                        className={`flex items-center gap-1 text-[10px] transition-all whitespace-nowrap ${filterType === 'typology' && filterValue === cat || (cat === 'all' && !filterType)
                          ? "text-foreground font-medium"
                          : "text-muted-foreground/60 hover:text-foreground/80"
                          }`}
                      >
                        {cat !== "all" ? (
                          <>
                            <div
                              className="w-1.5 h-1.5 rounded-full"
                              style={{
                                backgroundColor: categoryColors[cat],
                                boxShadow: (filterType === 'typology' && filterValue === cat) ? `0 0 6px ${categoryColors[cat]}80` : 'none'
                              }}
                            />
                            <span>{cat}</span>
                          </>
                        ) : (
                          <>
                            <div className="w-1.5 h-1.5 rounded-full border border-muted-foreground/50" />
                            <span>All</span>
                          </>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Uptrends/Downtrends Section */}
          <div className="col-span-12 lg:col-span-3" style={{ height: 'calc(100svh - 14rem)' }}>
            <TrendsSection />
          </div>

          {/* Project List - Full Width */}
          <div className="col-span-12">
            <ProjectList />
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground border-t border-border/50 pt-4">
          <div className="flex items-center gap-4">
            <span>Last sync: 2 minutes ago</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Data freshness: 99.9%</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-success" />
              All systems operational
            </span>
          </div>
        </div>
      </main >
    </div >
  )
}
