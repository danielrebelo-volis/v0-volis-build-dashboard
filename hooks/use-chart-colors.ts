"use client"

import { useTheme } from "next-themes"

export function useChartColors() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return {
    grid: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
    axis: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)",
    axisLight: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.25)",
    tooltipBg: isDark ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.95)",
    tooltipBorder: isDark ? "1px solid rgba(0,200,255,0.3)" : "1px solid rgba(108,92,231,0.3)",
    gridPattern: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)",
    gridPatternLine: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)",
    plannedLine: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)",
    plannedLineDashed: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.25)",
    tickFill: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
    tickFillLight: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
    isDark,
  }
}
