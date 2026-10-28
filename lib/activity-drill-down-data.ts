// ─── Mock data + derived calculations for the Activity Drill-Down ─────────────

export type ResourceCategory = 'labor' | 'equipment' | 'materials'
export const RESOURCE_CATEGORIES: ResourceCategory[] = ['labor', 'equipment', 'materials']

export const PROJECT_START = '2026-09-01'
export const PROJECT_END = '2026-11-15'

const DAY_MS = 86_400_000
const START_MS = Date.UTC(2026, 8, 1)

export function dateToIndex(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return Math.round((Date.UTC(y, m - 1, d) - START_MS) / DAY_MS)
}

export function indexToDate(index: number) {
  return new Date(START_MS + index * DAY_MS).toISOString().slice(0, 10)
}

export const TOTAL_DAYS = dateToIndex(PROJECT_END)

export function getTodayIso() {
  const now = new Date()
  const iso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  if (iso < PROJECT_START) return PROJECT_START
  if (iso > PROJECT_END) return PROJECT_END
  return iso
}

// Deterministic pseudo-random value in [0, 1) so mock data is stable between renders.
function hash(input: string) {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0) / 4294967296
}

const smooth = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x))

// ─── Resource pools ───────────────────────────────────────────────────────────

const LABOR_POOL: Array<[string, number]> = [
  ['Foreman', 48], ['Carpenter', 34], ['Concrete Specialist', 38], ['Steel Fixer', 36],
  ['Crane Operator', 42], ['Welder', 40], ['Electrician', 39], ['Apprentice', 22],
  ['Plumber', 38], ['Facade Installer', 36], ['Helper', 24], ['Surveyor', 52],
  ['Machine Operator', 40], ['Waterproofing Technician', 35], ['Painter', 30],
  ['HVAC Technician', 41], ['Scaffolder', 33], ['Safety Officer', 45], ['Mason', 34],
  ['General Labourer', 26], ['Site Engineer', 60], ['Formwork Carpenter', 35],
  ['Rigger', 38], ['Tiler', 32], ['Glazier', 37], ['Insulation Installer', 31],
  ['Drywall Installer', 30],
]

const EQUIPMENT_POOL: Array<[string, number]> = [
  ['Concrete Pump', 95], ['Tower Crane', 140], ['Mobile Crane 50t', 120], ['Excavator 20t', 85],
  ['Backhoe Loader', 60], ['Site Dumper', 45], ['Plate Compactor', 18], ['Roller Compactor', 70],
  ['Welding Machine', 15], ['Lifting Platform', 35], ['Telehandler', 55], ['Concrete Mixer Truck', 80],
  ['Generator 60kVA', 22], ['Scaffold Hoist', 25], ['Cable Puller', 20], ['Pipe Bender', 12],
  ['Pressure Tester', 10], ['Hilux 4x4', 18], ['Laser Level', 8], ['Poker Vibrator', 6],
  ['Air Compressor', 16], ['Core Drill', 14],
]

const MATERIALS_POOL: Array<[string, string, number, number]> = [
  ['Concrete C30/37', 'm³', 115, 120], ['Rebar B500', 'kg', 1.1, 9000], ['Formwork Panels', 'm²', 18, 400],
  ['Steel S355', 'kg', 1.6, 20000], ['Bolts M24', 'units', 2.4, 1200], ['Cladding Panels', 'm²', 85, 320],
  ['Fixings Kit', 'units', 3.2, 650], ['Cable 3×2.5mm²', 'ml', 1.8, 900], ['Conduit 25mm', 'ml', 1.2, 900],
  ['Copper Pipe 28mm', 'ml', 9.5, 600], ['Pipe Fittings', 'units', 4.5, 300], ['Waterproofing Membrane', 'm²', 14, 500],
  ['Bitumen Primer', 'l', 6, 200], ['Aggregate 0/31.5', 'ton', 22, 300], ['Sand', 'ton', 18, 150],
  ['Cement CEM II', 'bags', 7.5, 400], ['Precast Kerbs', 'units', 12, 250], ['Handrail Posts', 'units', 38, 80],
  ['Stainless Handrail', 'ml', 65, 120], ['Anti-slip Coating', 'm²', 24, 180], ['Geotextile', 'm²', 2.1, 800],
  ['Drainage Pipe 160mm', 'ml', 16, 220], ['Insulation Boards', 'm²', 11, 450], ['Plasterboard', 'm²', 6.5, 600],
  ['Acrylic Paint', 'l', 9, 350], ['Sealant Cartridges', 'units', 5.5, 220], ['Anchors M12', 'units', 1.9, 900],
  ['Tie Wire', 'kg', 3.2, 150], ['Curing Compound', 'l', 4.8, 160], ['Expansion Joint Strip', 'ml', 7.5, 140],
]

// ─── Activities ───────────────────────────────────────────────────────────────

interface ActivityConfig {
  id: string
  name: string
  unit: string
  totalQty: number
  start: string
  end: string
  baselineShift: number // days the current baseline moved vs. original plan
  lag: number // days actual work started after the current baseline
  pace: number // >1 = executing faster than baseline
  costRate: number // actual unit-cost multiplier
  scale: number // resource budget scale
  labor: [number, number] // [pool offset, count]
  equipment: [number, number]
  materials: [number, number]
}

const ACTIVITY_CONFIGS: ActivityConfig[] = [
  { id: 'A001', name: 'Concrete Foundations', unit: 'm³', totalQty: 850, start: '2026-09-01', end: '2026-11-15', baselineShift: 4, lag: 3, pace: 0.88, costRate: 1.08, scale: 1.2, labor: [0, 6], equipment: [0, 5], materials: [0, 26] },
  { id: 'A002', name: 'Steel Structure Assembly', unit: 'ton', totalQty: 420, start: '2026-09-01', end: '2026-11-15', baselineShift: 7, lag: 2, pace: 0.92, costRate: 1.06, scale: 1.5, labor: [3, 8], equipment: [1, 7], materials: [3, 12] },
  { id: 'A003', name: 'Facade Cladding', unit: 'm²', totalQty: 1800, start: '2026-09-01', end: '2026-11-15', baselineShift: 3, lag: 0, pace: 1.12, costRate: 0.95, scale: 1, labor: [9, 5], equipment: [9, 6], materials: [5, 8] },
  { id: 'A004', name: 'Electrical Rough-In', unit: 'ml', totalQty: 8500, start: '2026-09-01', end: '2026-11-15', baselineShift: 5, lag: 6, pace: 0.9, costRate: 1.1, scale: 1.3, labor: [6, 9], equipment: [14, 6], materials: [7, 14] },
  { id: 'A005', name: 'Plumbing Installation', unit: 'ml', totalQty: 6200, start: '2026-09-01', end: '2026-11-15', baselineShift: 2, lag: 1, pace: 1.05, costRate: 0.98, scale: 1.1, labor: [8, 7], equipment: [15, 8], materials: [9, 11] },
  { id: 'A006', name: 'Access Ramp – Concrete Slab', unit: 'm³', totalQty: 60, start: '2026-09-01', end: '2026-11-15', baselineShift: 2, lag: 0, pace: 1.15, costRate: 0.94, scale: 0.4, labor: [0, 5], equipment: [0, 9], materials: [0, 10] },
  { id: 'A007', name: 'Access Ramp – Handrails & Balustrades', unit: 'ml', totalQty: 240, start: '2026-09-01', end: '2026-11-15', baselineShift: 3, lag: 5, pace: 0.85, costRate: 1.12, scale: 0.35, labor: [5, 6], equipment: [10, 5], materials: [17, 7] },
  { id: 'A008', name: 'Loading Dock Ramp – Waterproofing', unit: 'm²', totalQty: 900, start: '2026-09-01', end: '2026-11-15', baselineShift: 0, lag: 0, pace: 1.1, costRate: 0.97, scale: 0.5, labor: [13, 6], equipment: [7, 5], materials: [11, 9] },
  { id: 'A009', name: 'Bulk Excavation & Earthworks', unit: 'm³', totalQty: 12000, start: '2026-09-01', end: '2026-11-15', baselineShift: 0, lag: 2, pace: 0.95, costRate: 1.04, scale: 1.4, labor: [12, 10], equipment: [3, 12], materials: [13, 8] },
  { id: 'A010', name: 'Roof Waterproofing', unit: 'm²', totalQty: 2400, start: '2026-09-01', end: '2026-11-15', baselineShift: 4, lag: 3, pace: 1, costRate: 1.03, scale: 0.9, labor: [13, 8], equipment: [9, 7], materials: [11, 12] },
  { id: 'A011', name: 'HVAC Ductwork Installation', unit: 'ml', totalQty: 3200, start: '2026-09-01', end: '2026-11-15', baselineShift: 6, lag: 4, pace: 0.93, costRate: 1.07, scale: 1.2, labor: [0, 25], equipment: [0, 14], materials: [18, 12] },
  { id: 'A012', name: 'Interior Drywall Partitions', unit: 'm²', totalQty: 5200, start: '2026-09-01', end: '2026-11-15', baselineShift: 3, lag: 2, pace: 1.04, costRate: 0.99, scale: 1.1, labor: [19, 8], equipment: [12, 6], materials: [22, 8] },
  { id: 'A013', name: 'Ramp Emergency Lighting', unit: 'units', totalQty: 48, start: '2026-09-01', end: '2026-11-15', baselineShift: 1, lag: 2, pace: 0.9, costRate: 1.05, scale: 0.2, labor: [6, 5], equipment: [14, 5], materials: [7, 6] },
]

export const ACTIVITIES = ACTIVITY_CONFIGS.map((a) => ({
  id: a.id,
  label: `${a.id} – ${a.name}`,
  unit: a.unit,
}))

export const DEFAULT_ACTIVITY_ID = ACTIVITY_CONFIGS[0].id

// ─── Model ────────────────────────────────────────────────────────────────────

export interface Resource {
  id: string
  category: ResourceCategory
  name: string
  unit: string
  budgetQty: number
  unitCost: number
  usage: number
  rate: number
}

export interface ActivityModel {
  id: string
  label: string
  unit: string
  totalQty: number
  unitPrice: number
  budgetByCategory: Record<ResourceCategory, number>
  resources: Resource[]
  todayIdx: number
  plannedFrac: (day: number) => number
  baselineFrac: (day: number) => number
  actualFrac: (day: number) => number
  actualCostCum: Record<ResourceCategory, Float64Array>
  resourceQtyCum: Float64Array[]
  resourceCostCum: Float64Array[]
}

function pick<T>(pool: T[], [offset, count]: [number, number]) {
  return Array.from({ length: count }, (_, i) => pool[(offset + i) % pool.length])
}

function buildResources(cfg: ActivityConfig): Resource[] {
  const make = (category: ResourceCategory, name: string, unit: string, unitCost: number, baseQty: number): Resource => {
    const key = `${cfg.id}-${category}-${name}`
    return {
      id: key,
      category,
      name,
      unit,
      unitCost,
      budgetQty: Math.max(1, Math.round(baseQty * cfg.scale)),
      usage: 0.95 + hash(`${key}-usage`) * 0.12,
      rate: cfg.costRate * (0.94 + hash(`${key}-rate`) * 0.14),
    }
  }

  return [
    ...pick(LABOR_POOL, cfg.labor).map(([name, rate]) =>
      make('labor', name, 'h', rate, 60 + hash(`${cfg.id}-${name}-h`) * 220),
    ),
    ...pick(EQUIPMENT_POOL, cfg.equipment).map(([name, rate]) =>
      make('equipment', name, 'h', rate, 20 + hash(`${cfg.id}-${name}-h`) * 120),
    ),
    ...pick(MATERIALS_POOL, cfg.materials).map(([name, unit, cost, base]) =>
      make('materials', name, unit, cost, base * (0.4 + hash(`${cfg.id}-${name}-q`) * 0.9)),
    ),
  ]
}

const SPIKE_EXTRA_SHARE = 0.12 // extra share of labor budget burned during the spike week
const OVERTIME_PREMIUM = 1.6

function buildActivity(cfg: ActivityConfig, todayIdx: number): ActivityModel {
  const s = dateToIndex(cfg.start)
  const e = dateToIndex(cfg.end)
  const duration = e - s
  const actualStart = s + cfg.baselineShift + cfg.lag
  const actualDuration = duration / cfg.pace

  const plannedFrac = (d: number) => smooth((d - s) / duration)
  const baselineFrac = (d: number) => smooth((d - s - cfg.baselineShift) / duration)
  const actualFrac = (d: number) => {
    const day = Math.min(d, todayIdx)
    return day < 0 ? 0 : smooth((day - actualStart) / actualDuration)
  }

  const resources = buildResources(cfg)
  const len = TOTAL_DAYS + 1

  // One visible manpower cost spike (overtime / extra crew) halfway through the executed period.
  const executedEnd = Math.min(todayIdx, actualStart + actualDuration)
  const spikeMid = Math.round((actualStart + executedEnd) / 2)
  const hasSpike = executedEnd - actualStart > 14
  const spikeFrom = spikeMid - 3
  const spikeTo = spikeMid + 3

  const resourceQtyCum = resources.map(() => new Float64Array(len))
  const resourceCostCum = resources.map(() => new Float64Array(len))
  const actualCostCum: Record<ResourceCategory, Float64Array> = {
    labor: new Float64Array(len),
    equipment: new Float64Array(len),
    materials: new Float64Array(len),
  }

  for (let d = 0; d < len; d++) {
    const progressDelta = actualFrac(d) - actualFrac(d - 1)
    const inSpike = hasSpike && d >= spikeFrom && d <= spikeTo && d <= todayIdx
    const dayCost: Record<ResourceCategory, number> = { labor: 0, equipment: 0, materials: 0 }

    resources.forEach((r, i) => {
      let qty = r.budgetQty * progressDelta * r.usage
      let cost = qty * r.unitCost * r.rate
      if (inSpike && r.category === 'labor') {
        const extra = (r.budgetQty * SPIKE_EXTRA_SHARE) / 7
        qty += extra
        cost += extra * r.unitCost * r.rate * OVERTIME_PREMIUM
      }
      const prevQty = d > 0 ? resourceQtyCum[i][d - 1] : 0
      const prevCost = d > 0 ? resourceCostCum[i][d - 1] : 0
      resourceQtyCum[i][d] = prevQty + qty
      resourceCostCum[i][d] = prevCost + cost
      dayCost[r.category] += cost
    })

    for (const cat of RESOURCE_CATEGORIES) {
      actualCostCum[cat][d] = (d > 0 ? actualCostCum[cat][d - 1] : 0) + dayCost[cat]
    }
  }

  const budgetByCategory: Record<ResourceCategory, number> = { labor: 0, equipment: 0, materials: 0 }
  resources.forEach((r) => {
    budgetByCategory[r.category] += r.budgetQty * r.unitCost
  })
  const budgetCost = budgetByCategory.labor + budgetByCategory.equipment + budgetByCategory.materials
  const margin = 0.15 + hash(`${cfg.id}-margin`) * 0.1

  return {
    id: cfg.id,
    label: `${cfg.id} – ${cfg.name}`,
    unit: cfg.unit,
    totalQty: cfg.totalQty,
    unitPrice: (budgetCost * (1 + margin)) / cfg.totalQty,
    budgetByCategory,
    resources,
    todayIdx,
    plannedFrac,
    baselineFrac,
    actualFrac,
    actualCostCum,
    resourceQtyCum,
    resourceCostCum,
  }
}

const modelCache = new Map<string, ActivityModel>()

export function getActivityModel(id: string, todayIso: string) {
  const todayIdx = dateToIndex(todayIso)
  const key = `${id}-${todayIdx}`
  const cached = modelCache.get(key)
  if (cached) return cached
  const cfg = ACTIVITY_CONFIGS.find((a) => a.id === id) ?? ACTIVITY_CONFIGS[0]
  const model = buildActivity(cfg, todayIdx)
  modelCache.set(key, model)
  return model
}

// ─── Period aggregation ──────────────────────────────────────────────────────

const cumAt = (arr: Float64Array, d: number) => (d < 0 ? 0 : arr[Math.min(d, TOTAL_DAYS)])

export interface ProgressFigures {
  projected: number
  actual: number
  cumProjected: number
  cumActual: number
}

export interface ResourceRow {
  resource: Resource
  quantity: number
  projected: number
  actual: number
}

export interface CategorySummary {
  quantity: number
  itemsUsed: number
  projected: number
  actual: number
}

export interface PeriodSummary {
  physical: ProgressFigures
  economic: ProgressFigures
  cost: ProgressFigures
  categories: Record<ResourceCategory, CategorySummary>
  rows: Record<ResourceCategory, ResourceRow[]>
}

export function clampRange(fromIso: string, toIso: string) {
  const from = Math.max(0, Math.min(TOTAL_DAYS, dateToIndex(fromIso)))
  const to = Math.max(from, Math.min(TOTAL_DAYS, dateToIndex(toIso)))
  return { from, to }
}

export function computePeriod(model: ActivityModel, fromIdx: number, toIdx: number): PeriodSummary {
  const before = fromIdx - 1
  const { totalQty, unitPrice } = model

  const physical: ProgressFigures = {
    projected: totalQty * (model.baselineFrac(toIdx) - model.baselineFrac(before)),
    actual: totalQty * (model.actualFrac(toIdx) - model.actualFrac(before)),
    cumProjected: totalQty * model.baselineFrac(toIdx),
    cumActual: totalQty * model.actualFrac(toIdx),
  }

  const economic: ProgressFigures = {
    projected: physical.projected * unitPrice,
    actual: physical.actual * unitPrice,
    cumProjected: physical.cumProjected * unitPrice,
    cumActual: physical.cumActual * unitPrice,
  }

  const rows: Record<ResourceCategory, ResourceRow[]> = { labor: [], equipment: [], materials: [] }
  const categories: Record<ResourceCategory, CategorySummary> = {
    labor: { quantity: 0, itemsUsed: 0, projected: 0, actual: 0 },
    equipment: { quantity: 0, itemsUsed: 0, projected: 0, actual: 0 },
    materials: { quantity: 0, itemsUsed: 0, projected: 0, actual: 0 },
  }
  const baselineDelta = model.baselineFrac(toIdx) - model.baselineFrac(before)

  model.resources.forEach((r, i) => {
    const row: ResourceRow = {
      resource: r,
      quantity: cumAt(model.resourceQtyCum[i], toIdx) - cumAt(model.resourceQtyCum[i], before),
      projected: r.budgetQty * r.unitCost * baselineDelta,
      actual: cumAt(model.resourceCostCum[i], toIdx) - cumAt(model.resourceCostCum[i], before),
    }
    rows[r.category].push(row)
    const summary = categories[r.category]
    summary.quantity += row.quantity
    summary.projected += row.projected
    summary.actual += row.actual
    if (row.quantity > 0.0001) summary.itemsUsed += 1
  })

  const budgetCost = RESOURCE_CATEGORIES.reduce((sum, c) => sum + model.budgetByCategory[c], 0)
  const cost: ProgressFigures = {
    projected: RESOURCE_CATEGORIES.reduce((sum, c) => sum + categories[c].projected, 0),
    actual: RESOURCE_CATEGORIES.reduce((sum, c) => sum + categories[c].actual, 0),
    cumProjected: budgetCost * model.baselineFrac(toIdx),
    cumActual: RESOURCE_CATEGORIES.reduce((sum, c) => sum + cumAt(model.actualCostCum[c], toIdx), 0),
  }

  return { physical, economic, cost, categories, rows }
}

// ─── Chart series ────────────────────────────────────────────────────────────

export interface CategoryCostPoint {
  planned: number
  baseline: number
  actual: number | null
  period: number | null
}

export interface ChartPoint {
  label: string
  planned: number
  baseline: number
  actual: number | null
  plannedValue: number
  baselineValue: number
  actualValue: number | null
  cost: Record<ResourceCategory, CategoryCostPoint>
}

const round1 = (v: number) => Math.round(v * 10) / 10
const toK = (v: number) => round1(v / 1000)

function formatShortDate(index: number) {
  return new Date(START_MS + index * DAY_MS).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    timeZone: 'UTC',
  })
}

export const getBucketDays = (fromIdx: number, toIdx: number) => (toIdx - fromIdx + 1 <= 45 ? 1 : 7)

export function buildChartSeries(model: ActivityModel, fromIdx: number, toIdx: number): ChartPoint[] {
  const bucket = getBucketDays(fromIdx, toIdx)
  const points: ChartPoint[] = []

  for (let start = fromIdx; start <= toIdx; start += bucket) {
    const end = Math.min(start + bucket - 1, toIdx)
    const hasActual = start <= model.todayIdx
    const planned = model.totalQty * model.plannedFrac(end)
    const baseline = model.totalQty * model.baselineFrac(end)
    const actual = model.totalQty * model.actualFrac(end)

    const cost = {} as Record<ResourceCategory, CategoryCostPoint>
    for (const cat of RESOURCE_CATEGORIES) {
      const budget = model.budgetByCategory[cat]
      cost[cat] = {
        planned: toK(budget * model.plannedFrac(end)),
        baseline: toK(budget * model.baselineFrac(end)),
        actual: hasActual ? toK(cumAt(model.actualCostCum[cat], end)) : null,
        period: hasActual
          ? toK(cumAt(model.actualCostCum[cat], end) - cumAt(model.actualCostCum[cat], start - 1))
          : null,
      }
    }

    points.push({
      label: formatShortDate(end),
      planned: round1(planned),
      baseline: round1(baseline),
      actual: hasActual ? round1(actual) : null,
      plannedValue: toK(planned * model.unitPrice),
      baselineValue: toK(baseline * model.unitPrice),
      actualValue: hasActual ? toK(actual * model.unitPrice) : null,
      cost,
    })
  }

  return points
}

// ─── Formatting ──────────────────────────────────────────────────────────────

const eurFormatter = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })

export const formatEur = (v: number) => eurFormatter.format(Math.round(v) === 0 ? 0 : v)

export const formatQty = (v: number) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: Math.abs(v) < 100 ? 1 : 0 }).format(v)

export const formatPct = (v: number) => `${v.toFixed(1)}%`

export const signed = (v: number, formatted: string) => (v > 0 ? `+${formatted}` : formatted)
