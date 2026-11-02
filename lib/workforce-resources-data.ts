// ─── Mock workforce logs for the Resources tab ────────────────────────────────
// Same road paving project as Equipment. Build logs, per activity, the quantity
// executed and the hours of every worker involved, so performance is measured
// at activity level only. Earned value uses the activity's internal price.

import { TOTAL_DAYS } from '@/lib/activity-drill-down-data'

export const JOB_TITLES = ['Encarregado', 'Manobrador', 'Motorista', 'Asfaltador', 'Servente'] as const
export type JobTitle = (typeof JOB_TITLES)[number]

export const DISCIPLINES = ['Fresagem', 'Pavimentação', 'Limpeza e Remoção'] as const
export type Discipline = (typeof DISCIPLINES)[number]

type ActivityKind = 'fresagem' | 'rega' | 'regularizacao' | 'drenante' | 'limpeza'

export type { ActivityKind }

interface ActivityTemplate {
  label: string
  shortLabel: string
  unit: string
  discipline: Discipline
  hhPerUnit: number
  unitPrice: number
  stage: [number, number]
  jobShares: Partial<Record<JobTitle, number>>
}

const TEMPLATES: Record<ActivityKind, ActivityTemplate> = {
  limpeza: {
    label: 'Limpeza e remoção de material',
    shortLabel: 'Limpeza',
    unit: 'm³',
    discipline: 'Limpeza e Remoção',
    hhPerUnit: 0.6,
    unitPrice: 14,
    stage: [0, 10],
    jobShares: { Servente: 0.5, Manobrador: 0.25, Motorista: 0.15, Encarregado: 0.1 },
  },
  fresagem: {
    label: 'Fresagem',
    shortLabel: 'Fresagem',
    unit: 'm²',
    discipline: 'Fresagem',
    hhPerUnit: 0.02,
    unitPrice: 2.8,
    stage: [0, 12],
    jobShares: { Manobrador: 0.45, Motorista: 0.25, Servente: 0.2, Encarregado: 0.1 },
  },
  rega: {
    label: 'Rega de colagem',
    shortLabel: 'Rega de colagem',
    unit: 'm²',
    discipline: 'Pavimentação',
    hhPerUnit: 0.004,
    unitPrice: 0.45,
    stage: [8, 16],
    jobShares: { Motorista: 0.35, Servente: 0.35, Manobrador: 0.2, Encarregado: 0.1 },
  },
  regularizacao: {
    label: 'Camada de regularização',
    shortLabel: 'Regularização',
    unit: 't',
    discipline: 'Pavimentação',
    hhPerUnit: 0.15,
    unitPrice: 62,
    stage: [10, 24],
    jobShares: { Asfaltador: 0.35, Manobrador: 0.3, Motorista: 0.2, Encarregado: 0.1, Servente: 0.05 },
  },
  drenante: {
    label: 'Drenante incluído ranhuragem',
    shortLabel: 'Drenante',
    unit: 'm²',
    discipline: 'Pavimentação',
    hhPerUnit: 0.03,
    unitPrice: 9.5,
    stage: [18, 32],
    jobShares: { Asfaltador: 0.4, Manobrador: 0.3, Servente: 0.15, Encarregado: 0.15 },
  },
}

// Section length ~11 km; lanes 3.5 m wide, shoulders 2.5 m wide.
const LANE_AREA = 38_500
const SHOULDER_AREA = 27_500
const plannedQty = (kind: ActivityKind, isLane: boolean) => {
  const area = isLane ? LANE_AREA : SHOULDER_AREA
  if (kind === 'regularizacao') return Math.round(area * (isLane ? 0.06 : 0.05) * 2.4)
  if (kind === 'limpeza') return isLane ? 1_200 : 900
  return area
}

interface ActivitySpec {
  id: string
  kind: ActivityKind
  locationLabel: string
  directionLabel: string
  isLane: boolean
  start: number
  end: number
  noPrice?: boolean
  zeroProgress?: boolean
  notStarted?: boolean
}

interface LocationSpec {
  id: string
  label: string
  activities: ActivitySpec[]
}

interface DirectionSpec {
  id: string
  label: string
  locations: LocationSpec[]
}

const LOCATIONS = [
  { key: 'bd', label: 'Berma Direita', isLane: false },
  { key: 'vd', label: 'Via Direita', isLane: true },
  { key: 've', label: 'Via Esquerda', isLane: true },
  { key: 'be', label: 'Berma Esquerda', isLane: false },
] as const

const LANE_KINDS: ActivityKind[] = ['fresagem', 'rega', 'regularizacao', 'drenante']
const SHOULDER_KINDS: ActivityKind[] = ['limpeza', 'rega', 'regularizacao']

// Per-activity overrides that create the edge cases the table must handle.
const OVERRIDES: Record<string, Partial<ActivitySpec>> = {
  'dec-bd-limpeza': { noPrice: true },
  'dec-be-regularizacao': { zeroProgress: true },
  'dec-ve-drenante': { notStarted: true },
}
const LOCATION_KIND_OVERRIDES: Record<string, ActivityKind[]> = {
  // All activities share m², so this location's group row shows unit, qty and rate.
  'dec-ve': ['fresagem', 'rega', 'drenante'],
}

const DIRECTIONS: DirectionSpec[] = [
  { key: 'cre', label: 'Sentido Crescente', base: 0 },
  { key: 'dec', label: 'Sentido Decrescente', base: 34 },
].map(({ key, label, base }) => ({
  id: key,
  label,
  locations: LOCATIONS.map((loc, li) => {
    const locId = `${key}-${loc.key}`
    const kinds = LOCATION_KIND_OVERRIDES[locId] ?? (loc.isLane ? LANE_KINDS : SHOULDER_KINDS)
    return {
      id: locId,
      label: loc.label,
      activities: kinds.map((kind) => {
        const id = `${locId}-${kind}`
        const [s, e] = TEMPLATES[kind].stage
        return { id, kind, locationLabel: loc.label, directionLabel: label, isLane: loc.isLane, start: base + li * 4 + s, end: base + li * 4 + e, ...OVERRIDES[id] }
      }),
    }
  }),
}))

export const PROJECT_LABEL = 'Beneficiação do Pavimento do Sublanço Cartaxo/Santarém, A1'
export const PHASE_LABEL = 'Fase 1 - Pavimentação'

// ─── Daily logs ───────────────────────────────────────────────────────────────

function hash(input: string) {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  h ^= h >>> 16
  h = Math.imul(h, 0x85ebca6b)
  h ^= h >>> 13
  h = Math.imul(h, 0xc2b2ae35)
  h ^= h >>> 16
  return (h >>> 0) / 4294967296
}

const roundHalf = (v: number) => Math.round(v * 2) / 2
// 2026-09-01 (day index 0) is a Tuesday; Sundays have no shifts.
const isSunday = (dayIdx: number) => (dayIdx + 2) % 7 === 0

export interface ActivityLog {
  spec: ActivitySpec
  template: ActivityTemplate
  plannedQty: number
  internalPrice: number | null
  qty: Float32Array
  hours: Float32Array
}

const LOGS: ActivityLog[] = DIRECTIONS.flatMap((d) =>
  d.locations.flatMap((l) =>
    l.activities.map((spec) => {
      const template = TEMPLATES[spec.kind]
      const planned = plannedQty(spec.kind, spec.isLane)
      const qty = new Float32Array(TOTAL_DAYS + 1)
      const hours = new Float32Array(TOTAL_DAYS + 1)
      const rate = template.hhPerUnit * (0.85 + hash(`${spec.id}-rate`) * 0.3)
      const end = Math.min(spec.end, TOTAL_DAYS)
      let workdays = 0
      for (let day = spec.start; day <= spec.end; day++) if (!isSunday(day)) workdays++

      if (!spec.notStarted) {
        let cumulative = 0
        for (let day = spec.start; day <= end; day++) {
          if (isSunday(day)) continue
          if (spec.zeroProgress) {
            hours[day] = roundHalf(8 + hash(`${spec.id}-h-${day}`) * 16)
            continue
          }
          const q = Math.min(planned - cumulative, (planned / workdays) * (0.75 + hash(`${spec.id}-q-${day}`) * 0.5))
          if (q <= 0) break
          cumulative += q
          qty[day] = q
          hours[day] = roundHalf(q * rate * (0.85 + hash(`${spec.id}-h-${day}`) * 0.3))
        }
      }

      return {
        spec,
        template,
        plannedQty: planned,
        internalPrice: spec.noPrice ? null : planned * template.unitPrice,
        qty,
        hours,
      }
    }),
  ),
)

const LOG_BY_ID = new Map(LOGS.map((l) => [l.spec.id, l]))

export const ACTIVITY_LOGS: readonly ActivityLog[] = LOGS

export function earnedValueSummary(from: number, to: number, discipline: Discipline | 'all') {
  let earnedValue = 0
  let missingPriceCount = 0
  for (const log of LOGS) {
    if (discipline !== 'all' && log.template.discipline !== discipline) continue
    const qty = sumRange(log.qty, from, to)
    if (log.internalPrice === null) {
      if (sumRange(log.hours, from, to) > 0) missingPriceCount++
      continue
    }
    earnedValue += (qty / log.plannedQty) * log.internalPrice
  }
  return { earnedValue, missingPriceCount }
}

export function sumRange(arr: Float32Array, from: number, to: number) {
  let s = 0
  for (let d = from; d <= to; d++) s += arr[d]
  return s
}

// ─── Tree ─────────────────────────────────────────────────────────────────────

export interface WorkforceNode {
  id: string
  label: string
  level: number
  order: number
  isActivity: boolean
  unit: string | null
  qty: number | null
  manHours: number
  earnedValue: number | null
  missingPriceCount: number
  children: WorkforceNode[]
}

export interface WorkforceFilters {
  discipline: Discipline | 'all'
  jobTitle: JobTitle | 'all'
}

export const unitRate = (n: WorkforceNode) =>
  n.qty !== null && n.qty > 0 && n.manHours > 0 ? n.manHours / n.qty : null

export const eurPerManHour = (n: WorkforceNode) =>
  n.manHours > 0 && n.earnedValue !== null ? n.earnedValue / n.manHours : null

function activityNode(log: ActivityLog, order: number, from: number, to: number, jobTitle: WorkforceFilters['jobTitle']): WorkforceNode {
  const qty = sumRange(log.qty, from, to)
  const totalHours = sumRange(log.hours, from, to)
  const share = jobTitle === 'all' ? 1 : (log.template.jobShares[jobTitle] ?? 0)
  const unitPrice = log.internalPrice === null ? null : log.internalPrice / log.plannedQty
  return {
    id: log.spec.id,
    label: log.template.label,
    level: 4,
    order,
    isActivity: true,
    unit: log.template.unit,
    qty,
    manHours: roundHalf(totalHours * share),
    earnedValue: unitPrice === null ? null : qty * unitPrice,
    missingPriceCount: log.internalPrice === null && totalHours * share > 0 ? 1 : 0,
    children: [],
  }
}

function groupNode(id: string, label: string, level: number, order: number, children: WorkforceNode[]): WorkforceNode {
  const activities: WorkforceNode[] = []
  const collect = (n: WorkforceNode) => (n.isActivity ? activities.push(n) : n.children.forEach(collect))
  children.forEach(collect)

  const sharedUnit = activities.every((a) => a.unit === activities[0]?.unit) ? (activities[0]?.unit ?? null) : null
  const priced = activities.filter((a) => a.earnedValue !== null)

  return {
    id,
    label,
    level,
    order,
    isActivity: false,
    unit: sharedUnit,
    qty: sharedUnit ? activities.reduce((s, a) => s + (a.qty ?? 0), 0) : null,
    manHours: activities.reduce((s, a) => s + a.manHours, 0),
    earnedValue: priced.length > 0 ? priced.reduce((s, a) => s + (a.earnedValue ?? 0), 0) : null,
    missingPriceCount: activities.reduce((s, a) => s + a.missingPriceCount, 0),
    children,
  }
}

export function buildWorkforceTree(from: number, to: number, filters: WorkforceFilters): WorkforceNode | null {
  const directions = DIRECTIONS.map((d, di) => {
    const locations = d.locations
      .map((l, li) => {
        const activities = l.activities
          .map((spec, ai) => ({ log: LOG_BY_ID.get(spec.id)!, ai }))
          .filter(({ log }) => filters.discipline === 'all' || log.template.discipline === filters.discipline)
          // Activities where the selected category never works are not relevant to that category.
          .filter(({ log }) => filters.jobTitle === 'all' || (log.template.jobShares[filters.jobTitle] ?? 0) > 0)
          .map(({ log, ai }) => activityNode(log, ai, from, to, filters.jobTitle))
        return activities.length > 0 ? groupNode(l.id, l.label, 3, li, activities) : null
      })
      .filter((n): n is WorkforceNode => n !== null)
    return locations.length > 0 ? groupNode(d.id, d.label, 2, di, locations) : null
  }).filter((n): n is WorkforceNode => n !== null)

  if (directions.length === 0) return null
  const phase = groupNode('phase-1', PHASE_LABEL, 1, 0, directions)
  return groupNode('project', PROJECT_LABEL, 0, 0, [phase])
}

export function countActivities(node: WorkforceNode): { total: number; withHours: number } {
  if (node.isActivity) return { total: 1, withHours: node.manHours > 0 ? 1 : 0 }
  return node.children.reduce(
    (acc, c) => {
      const r = countActivities(c)
      return { total: acc.total + r.total, withHours: acc.withHours + r.withHours }
    },
    { total: 0, withHours: 0 },
  )
}

// ─── European number formatting ───────────────────────────────────────────────

const qtyFormatter = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 1 })
const intFormatter = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 })
const rateFormatter = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 3, maximumFractionDigits: 3 })

export const formatQtyEU = (v: number) => qtyFormatter.format(v)
export const formatRateEU = (v: number) => rateFormatter.format(v)
export const formatEurEU = (v: number) => `€${intFormatter.format(Math.round(v))}`
const pctFormatter = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
export const formatPctEU = (v: number) => `${pctFormatter.format(v)}%`
