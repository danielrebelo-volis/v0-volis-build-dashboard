// ─── Mock material consumption for the Resources tab ──────────────────────────
// Same road paving project and activities as Workforce. Build logs the quantity
// of each material consumed per activity; cost = quantity × list unit price.

import { TOTAL_DAYS } from '@/lib/activity-drill-down-data'
import { ACTIVITY_LOGS, type ActivityKind, type Discipline, sumRange } from '@/lib/workforce-resources-data'

export const MATERIAL_TYPES = [
  'Misturas Betuminosas',
  'Ligantes',
  'Combustíveis',
  'Geossintéticos',
  'Consumíveis',
  'Água',
] as const
export type MaterialType = (typeof MATERIAL_TYPES)[number]

interface Material {
  id: string
  name: string
  type: MaterialType
  unit: string
  unitPrice: number
}

const MATERIALS: Material[] = [
  { id: 'MAT-2101', name: 'Mistura betuminosa AC 20 bin 35/50', type: 'Misturas Betuminosas', unit: 't', unitPrice: 48 },
  { id: 'MAT-2108', name: 'Mistura betuminosa drenante PA 12,5 PMB', type: 'Misturas Betuminosas', unit: 't', unitPrice: 62 },
  { id: 'MAT-2203', name: 'Emulsão betuminosa C60B3 ADH', type: 'Ligantes', unit: 'kg', unitPrice: 0.55 },
  { id: 'MAT-2301', name: 'Gasóleo', type: 'Combustíveis', unit: 'L', unitPrice: 1.45 },
  { id: 'MAT-2402', name: 'Membrana anti-fissuras SAMI', type: 'Geossintéticos', unit: 'm²', unitPrice: 3.2 },
  { id: 'MAT-2505', name: 'Picos de fresagem W6/20', type: 'Consumíveis', unit: 'kg', unitPrice: 38 },
  { id: 'MAT-2601', name: 'Água industrial', type: 'Água', unit: 'm³', unitPrice: 1.5 },
]

const MATERIAL_BY_ID = new Map(MATERIALS.map((m) => [m.id, m]))

// Typical consumption per unit of activity output (mock, no theoretical rates in the product yet).
const CONSUMPTION: Record<ActivityKind, Array<[materialId: string, perUnit: number]>> = {
  limpeza: [['MAT-2301', 1.2], ['MAT-2601', 0.05]],
  fresagem: [['MAT-2301', 0.15], ['MAT-2505', 0.0008], ['MAT-2601', 0.002]],
  rega: [['MAT-2203', 0.5]],
  regularizacao: [['MAT-2101', 1.02], ['MAT-2301', 0.6]],
  drenante: [['MAT-2108', 0.09], ['MAT-2402', 0.15], ['MAT-2301', 0.12]],
}

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

interface ConsumptionLog {
  material: Material
  activity: (typeof ACTIVITY_LOGS)[number]
  qty: Float32Array
}

const CONSUMPTION_LOGS: ConsumptionLog[] = ACTIVITY_LOGS.flatMap((activity) =>
  CONSUMPTION[activity.spec.kind].map(([materialId, perUnit]) => {
    const material = MATERIAL_BY_ID.get(materialId)!
    const qty = new Float32Array(TOTAL_DAYS + 1)
    const bias = 0.92 + hash(`${activity.spec.id}-${materialId}`) * 0.16
    for (let d = 0; d <= TOTAL_DAYS; d++) {
      const executed = activity.qty[d]
      if (executed > 0) {
        qty[d] = executed * perUnit * bias * (0.95 + hash(`${activity.spec.id}-${materialId}-${d}`) * 0.1)
      } else if (activity.spec.zeroProgress && activity.hours[d] > 0 && material.id === 'MAT-2301') {
        // Plant running without output still burns fuel.
        qty[d] = activity.hours[d] * 2.5
      }
    }
    return { material, activity, qty }
  }),
)

// ─── Tree ─────────────────────────────────────────────────────────────────────

export interface MaterialNode {
  id: string
  label: string
  level: number
  isLeaf: boolean
  unit: string | null
  qty: number | null
  activityUnit: string | null
  activityQty: number | null
  cost: number
  children: MaterialNode[]
}

export interface MaterialFilters {
  discipline: Discipline | 'all'
  materialType: MaterialType | 'all'
}

export const unitConsumption = (n: MaterialNode) =>
  n.qty !== null && n.activityQty !== null && n.activityQty > 0 ? n.qty / n.activityQty : null

const shared = <T,>(values: T[]) => (values.length > 0 && values.every((v) => v === values[0]) ? values[0] : null)

function groupNode(id: string, label: string, level: number, children: MaterialNode[]): MaterialNode {
  const unit = shared(children.map((c) => c.unit))
  const activityUnit = unit ? shared(children.map((c) => c.activityUnit)) : null
  return {
    id,
    label,
    level,
    isLeaf: false,
    unit,
    qty: unit ? children.reduce((s, c) => s + (c.qty ?? 0), 0) : null,
    activityUnit,
    activityQty: activityUnit ? children.reduce((s, c) => s + (c.activityQty ?? 0), 0) : null,
    cost: children.reduce((s, c) => s + c.cost, 0),
    children,
  }
}

export function buildMaterialsTree(from: number, to: number, filters: MaterialFilters) {
  const byMaterial = new Map<string, MaterialNode[]>()

  for (const log of CONSUMPTION_LOGS) {
    if (filters.discipline !== 'all' && log.activity.template.discipline !== filters.discipline) continue
    if (filters.materialType !== 'all' && log.material.type !== filters.materialType) continue
    const qty = sumRange(log.qty, from, to)
    if (qty <= 0) continue
    const { spec, template } = log.activity
    const leaf: MaterialNode = {
      id: `${log.material.id}-${spec.id}`,
      label: `${template.shortLabel} · ${spec.locationLabel} · ${spec.directionLabel}`,
      level: 2,
      isLeaf: true,
      unit: log.material.unit,
      qty,
      activityUnit: template.unit,
      activityQty: sumRange(log.activity.qty, from, to),
      cost: qty * log.material.unitPrice,
      children: [],
    }
    byMaterial.set(log.material.id, [...(byMaterial.get(log.material.id) ?? []), leaf])
  }

  const types = MATERIAL_TYPES.map((type) => {
    const materials = MATERIALS.filter((m) => m.type === type && byMaterial.has(m.id)).map((m) =>
      groupNode(m.id, m.name, 1, byMaterial.get(m.id)!),
    )
    return materials.length > 0 ? groupNode(`type-${type}`, type, 0, materials) : null
  }).filter((n): n is MaterialNode => n !== null)

  return { types, totalCost: types.reduce((s, t) => s + t.cost, 0) }
}
