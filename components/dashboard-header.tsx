"use client"

import { Bell, Search, Settings, ChevronDown, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DashboardHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border/50">
      {/* Logo & Title */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
            <span className="text-background font-bold text-sm">V</span>
          </div>
          <span className="font-semibold text-lg text-foreground tracking-tight">Volis Build</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-1">
          <Button variant="ghost" size="sm" className="text-foreground text-sm">
            Dashboard
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-sm">
            Projects
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-sm">
            Analytics
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-sm">
            Reports
          </Button>
        </nav>
      </div>

      {/* Search & Actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border/50 w-64">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search projects..."
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none flex-1"
          />
          <kbd className="hidden lg:inline-flex px-1.5 py-0.5 text-[10px] text-muted-foreground bg-muted rounded">⌘K</kbd>
        </div>

        {/* AI Assistant Button */}
        <Button variant="outline" size="sm" className="gap-1.5 border-accent/30 text-accent hover:bg-accent/10 hover:text-accent bg-transparent">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">AI Insights</span>
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
        </Button>

        {/* Settings */}
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Settings className="w-4 h-4" />
        </Button>

        {/* User */}
        <Button variant="ghost" size="sm" className="gap-2">
          <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center">
            <span className="text-xs font-medium text-accent">JD</span>
          </div>
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        </Button>
      </div>
    </header>
  )
}
