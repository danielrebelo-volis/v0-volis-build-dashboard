'use client'

import { useState } from 'react'
import { DashboardHeader } from "@/components/dashboard-header"
import { EVMMatrix } from "@/components/evm-matrix"
import { MetricsSidebar } from "@/components/metrics-sidebar"
import { ProjectList } from "@/components/project-list"
import { TrendsSection } from "@/components/trends-section"
import { Filter, Download, RefreshCw, GitCompare, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type FilterType = 'typology' | 'region' | 'week' | null
type FilterValue = string | null

export default function Dashboard() {
  const [filterType, setFilterType] = useState<FilterType>(null)
  const [filterValue, setFilterValue] = useState<FilterValue>(null)

  const handleFilterSelect = (type: FilterType, value: string) => {
    setFilterType(type)
    setFilterValue(value)
  }

  const clearFilters = () => {
    setFilterType(null)
    setFilterValue(null)
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
              Real-time earned value analysis across all active projects
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

        {/* Main Grid Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* Metrics Sidebar */}
          <div className="col-span-12 lg:col-span-2">
            <MetricsSidebar />
          </div>
          
          {/* EVM Matrix - Central Focus */}
          <div className="col-span-12 lg:col-span-7">
            <div className="mb-4 flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 text-muted-foreground bg-transparent">
                    <Filter className="w-4 h-4" />
                    <span className="hidden sm:inline">Filters</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Filter by Typology</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleFilterSelect('typology', 'commercial')} className="flex items-center justify-between">
                    <span>Commercial</span>
                    {filterType === 'typology' && filterValue === 'commercial' && <Check className="w-4 h-4 text-accent" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterSelect('typology', 'residential')} className="flex items-center justify-between">
                    <span>Residential</span>
                    {filterType === 'typology' && filterValue === 'residential' && <Check className="w-4 h-4 text-accent" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterSelect('typology', 'infrastructure')} className="flex items-center justify-between">
                    <span>Infrastructure</span>
                    {filterType === 'typology' && filterValue === 'infrastructure' && <Check className="w-4 h-4 text-accent" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterSelect('typology', 'industrial')} className="flex items-center justify-between">
                    <span>Industrial</span>
                    {filterType === 'typology' && filterValue === 'industrial' && <Check className="w-4 h-4 text-accent" />}
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Filter by Region</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleFilterSelect('region', 'north')} className="flex items-center justify-between">
                    <span>North</span>
                    {filterType === 'region' && filterValue === 'north' && <Check className="w-4 h-4 text-accent" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterSelect('region', 'south')} className="flex items-center justify-between">
                    <span>South</span>
                    {filterType === 'region' && filterValue === 'south' && <Check className="w-4 h-4 text-accent" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterSelect('region', 'east')} className="flex items-center justify-between">
                    <span>East</span>
                    {filterType === 'region' && filterValue === 'east' && <Check className="w-4 h-4 text-accent" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterSelect('region', 'west')} className="flex items-center justify-between">
                    <span>West</span>
                    {filterType === 'region' && filterValue === 'west' && <Check className="w-4 h-4 text-accent" />}
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Filter by Week</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleFilterSelect('week', 'week-1')} className="flex items-center justify-between">
                    <span>Week 1</span>
                    {filterType === 'week' && filterValue === 'week-1' && <Check className="w-4 h-4 text-accent" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterSelect('week', 'week-2')} className="flex items-center justify-between">
                    <span>Week 2</span>
                    {filterType === 'week' && filterValue === 'week-2' && <Check className="w-4 h-4 text-accent" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterSelect('week', 'week-3')} className="flex items-center justify-between">
                    <span>Week 3</span>
                    {filterType === 'week' && filterValue === 'week-3' && <Check className="w-4 h-4 text-accent" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterSelect('week', 'week-4')} className="flex items-center justify-between">
                    <span>Week 4</span>
                    {filterType === 'week' && filterValue === 'week-4' && <Check className="w-4 h-4 text-accent" />}
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={clearFilters}>
                    Clear Filters
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="glass-card rounded-lg p-4 relative w-auto h-11/12">
              <div className="absolute top-4 left-4 z-10">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-xs text-muted-foreground">Live data</span>
                  {filterType && filterValue && (
                    <span className="ml-2 text-xs bg-accent/20 text-accent px-2 py-1 rounded">
                      {filterType}: {filterValue}
                    </span>
                  )}
                </div>
              </div>
              <EVMMatrix filterType={filterType} filterValue={filterValue} />
            </div>
          </div>
          
          {/* Uptrends/Downtrends Section */}
          <div className="col-span-12 lg:col-span-3">
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
      </main>
    </div>
  )
}
