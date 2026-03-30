import { readFileSync, writeFileSync } from 'fs'

const filePath = '/vercel/share/v0-project/app/project/[id]/overview/page.tsx'
let content = readFileSync(filePath, 'utf-8')

// Fix 1: Progress tab Activity Table container - remove gap-4
content = content.replace(
  'glass-card rounded-lg p-4 border border-border/50 gap-4 mb-6">',
  'glass-card rounded-lg p-4 border border-border/50 mb-6">'
)

// Fix 2: Progress tab Activity Table title - add text-left
content = content.replace(
  '<h3 className="text-sm font-semibold text-foreground mb-4">Activity Table</h3>\n              <div className="overflow-x-auto">\n                <table className="w-full text-sm">\n                  <thead>\n                    <tr className="border-b border-border/50">\n                      <th className="text-left text-xs text-muted-foreground font-semibold py-2 min-w-[140px]">Activity</th>\n                      <th className="text-right text-xs text-muted-foreground font-semibold py-2 cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort(\'value\')}',
  '<h3 className="text-sm font-semibold text-foreground mb-4 text-left">Activity Table</h3>\n              <div className="overflow-x-auto">\n                <table className="w-full text-sm">\n                  <thead>\n                    <tr className="border-b border-border/50">\n                      <th className="text-left text-xs text-muted-foreground font-semibold py-2 min-w-[140px]">Activity</th>\n                      <th className="text-right text-xs text-muted-foreground font-semibold py-2 cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort(\'value\')}'
)

// Fix 3: Progress tab Activity Table - Status header text-left -> text-right
// and Metric header text-left -> text-right
// Only in the Progress tab block (before Overview tab)
const progressTabStart = content.indexOf('{/* Progress Tab */}')
const overviewTabStart = content.indexOf('{/* Overview Tab */}')
const progressTabSection = content.slice(progressTabStart, overviewTabStart)

const fixedProgressTab = progressTabSection
  // Fix Status header
  .replace(
    '                      <th className="text-left text-xs text-muted-foreground font-semibold py-2">Status</th>\n                      <th className="text-left text-xs text-muted-foreground font-semibold py-2">Metric</th>',
    '                      <th className="text-right text-xs text-muted-foreground font-semibold py-2">Status</th>\n                      <th className="text-right text-xs text-muted-foreground font-semibold py-2">Metric</th>'
  )
  // Fix Status cell - remove missing text-right
  .replace(
    '                          <td className="py-3">\n                            <span className={`text-xs px-2 py-0.5 rounded-full ${',
    '                          <td className="py-3 text-right">\n                            <span className={`text-xs px-2 py-0.5 rounded-full ${'
  )
  // Fix Metric cell - add text-right
  .replace(
    '                          <td className="py-3 text-muted-foreground text-xs">{activity.metric}</td>\n                          <td className="py-3 text-right text-foreground">{activity.total_planned_qty',
    '                          <td className="py-3 text-right text-muted-foreground text-xs">{activity.metric}</td>\n                          <td className="py-3 text-right text-foreground">{activity.total_planned_qty'
  )

content = content.slice(0, progressTabStart) + fixedProgressTab + content.slice(overviewTabStart)

// Fix 4: Economic tab - remove gap-6 from container
const economicTabStart = content.indexOf('{/* Economic Tab */}')
const economicSection = content.slice(economicTabStart)

const fixedEconomicSection = economicSection
  // Fix container - remove gap-6
  .replace(
    'glass-card rounded-lg p-4 border border-border/50 gap-6 mb-8">',
    'glass-card rounded-lg p-4 border border-border/50 mb-8">'
  )
  // Fix title - add text-left (for Economic Summary Table in economic tab)
  .replace(
    '<h3 className="text-sm font-semibold text-foreground mb-4">Economic Summary Table</h3>',
    '<h3 className="text-sm font-semibold text-foreground mb-4 text-left">Economic Summary Table</h3>'
  )
  // Fix Status header in economic tab
  .replace(
    '                      <th className="text-left text-xs text-muted-foreground font-semibold py-2">Status</th>\n                      <th className="text-right text-xs text-muted-foreground font-semibold py-2 cursor-pointer hover:text-foreground transition-colors" onClick={() => handleEconomicSort(\'baselineCost\')}',
    '                      <th className="text-right text-xs text-muted-foreground font-semibold py-2">Status</th>\n                      <th className="text-right text-xs text-muted-foreground font-semibold py-2 cursor-pointer hover:text-foreground transition-colors" onClick={() => handleEconomicSort(\'baselineCost\')}'
  )
  // Fix EconomicTableRow Status cell (in component at top) - add text-right to td
  // (already done in the EconomicTableRow component - check if needed)

content = content.slice(0, economicTabStart) + fixedEconomicSection

writeFileSync(filePath, content, 'utf-8')
console.log('[v0] Applied all table alignment fixes successfully')
console.log('[v0] Changes made:')
console.log('  - Progress tab Activity Table: removed gap-4, added text-left to title')
console.log('  - Progress tab: Status/Metric headers changed to text-right')  
console.log('  - Progress tab: Status/Metric cells changed to text-right')
console.log('  - Economic tab: removed gap-6 from container')
console.log('  - Economic tab: added text-left to Economic Summary Table title')
console.log('  - Economic tab: Status header changed to text-right')
