"use client"

import { Bell, Search, Settings, ChevronDown, Sparkles, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function DashboardHeader() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border/50">
      {/* Logo & Title */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <img style="background-color: white;"
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mota-Engil.svg-jOnANF2tKtMSNJhsW6KwGJrzNMS38H.png"
            alt="Mota Engil Logo"
            className="h-8 w-auto"
          />
        </div>

        <nav className="hidden md:flex items-center gap-1">
          <Button variant="ghost" size="sm" className="text-foreground text-sm">
            Dashboard
          </Button>
          <Button disabled="on" variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-sm">
            Projects
          </Button>
          <Button disabled="on" variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-sm">
            Analytics
          </Button>
          <Button disabled="on" variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-sm">
            Reports
          </Button>
        </nav>
      </div>

      {/* Search & Actions */}
      <div disabled="on" className="flex items-center gap-3">
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
        <Button disabled="on" variant="outline" size="sm" className="gap-1.5 border-accent/30 text-accent hover:bg-accent/10 hover:text-accent bg-transparent">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">AI Insights</span>
        </Button>

        {/* Notifications */}
        <Button disabled="on" variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          <Sun className="w-4 h-4 rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0" />
          <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Settings */}
        <Button disabled="on" variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Settings className="w-4 h-4" />
        </Button>

        {/* User */}
        <Button disabled="on" variant="ghost" size="sm" className="gap-2">
          <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center">
            <span className="text-xs font-medium text-accent">ME</span>
          </div>
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        </Button>
      </div>
    </header>
  )
}
