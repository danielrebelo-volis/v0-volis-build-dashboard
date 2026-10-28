export const PROJECT_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'progress', label: 'Progress' },
  { id: 'economic', label: 'Economic' },
  { id: 'activity-drill-down', label: 'Activity Drill-Down' },
  { id: 'resources', label: 'Resources' },
  { id: 'data-quality', label: 'Data Quality' },
] as const

export type ProjectTab = (typeof PROJECT_TABS)[number]['id']

export function isProjectTab(value: string | undefined): value is ProjectTab {
  return PROJECT_TABS.some((t) => t.id === value)
}
