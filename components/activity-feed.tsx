"use client"

import { AlertCircle, CheckCircle2, Clock, FileText, Users } from "lucide-react"

interface ActivityItem {
  id: string
  type: "alert" | "success" | "update" | "document" | "team"
  message: string
  project: string
  time: string
}

const typeIcons = {
  alert: <AlertCircle className="w-4 h-4 text-destructive" />,
  success: <CheckCircle2 className="w-4 h-4 text-success" />,
  update: <Clock className="w-4 h-4 text-warning" />,
  document: <FileText className="w-4 h-4 text-cyan" />,
  team: <Users className="w-4 h-4 text-muted-foreground" />,
}

export function ActivityFeed() {
  const activities: ActivityItem[] = [
    { id: "1", type: "alert", message: "Budget variance exceeded threshold", project: "Harbor Bridge", time: "2m ago" },
    { id: "2", type: "success", message: "Milestone completed: Foundation phase", project: "Tech Campus", time: "15m ago" },
    { id: "3", type: "update", message: "Schedule updated by AI optimization", project: "Metro Tower", time: "1h ago" },
    { id: "4", type: "document", message: "New permit approved", project: "Industrial Park", time: "2h ago" },
    { id: "5", type: "team", message: "New contractor assigned", project: "Riverside Homes", time: "3h ago" },
    { id: "6", type: "success", message: "Quality inspection passed", project: "Skyline Plaza", time: "4h ago" },
  ]

  return (
    <div className="glass-card rounded-lg p-4 h-full">
      <h2 className="text-sm font-medium text-foreground mb-4">Activity Feed</h2>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-3 group">
            <div className="flex-shrink-0 mt-0.5">
              {typeIcons[activity.type]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground leading-snug">{activity.message}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">{activity.project}</span>
                <span className="text-muted-foreground/50">•</span>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
