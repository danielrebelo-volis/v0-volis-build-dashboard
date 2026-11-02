// ─── Mock equipment logs for the Resources tab ────────────────────────────────
// Road paving project: pavement rehabilitation on a motorway section.
// Only allocation-based hours are tracked (worked vs idle); breakdowns and
// parked time are not tracked yet.

import { TOTAL_DAYS, indexToDate } from '@/lib/activity-drill-down-data'

export interface EquipmentItem {
  id: string
  name: string
  typology: string
}

interface EquipmentProfile extends EquipmentItem {
  allocationRate: number
  workedShare: number
}

export interface EquipmentRow extends EquipmentItem {
  hoursWorked: number
  hoursIdle: number
  productiveAvailability: number | null
}

export interface EquipmentGroup {
  typology: string
  items: EquipmentRow[]
  hoursWorked: number
  hoursIdle: number
  productiveAvailability: number | null
}

export interface EquipmentSummary {
  groups: EquipmentGroup[]
  hoursWorked: number
  hoursIdle: number
  productiveAvailability: number | null
  itemCount: number
  activeCount: number
}

// Deterministic pseudo-random value in [0, 1) so mock data is stable between renders.
function hash(input: string) {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  // Murmur3 finalizer: FNV alone clusters on near-identical keys like "EQ-1-alloc-12".
  h ^= h >>> 16
  h = Math.imul(h, 0x85ebca6b)
  h ^= h >>> 13
  h = Math.imul(h, 0xc2b2ae35)
  h ^= h >>> 16
  return (h >>> 0) / 4294967296
}

const PROFILES: EquipmentProfile[] = [
  // Pavers: high productive availability
  { id: 'EQ-10234', name: 'Asphalt Paver Vögele Super 1800-3', typology: 'Pavers', allocationRate: 0.72, workedShare: 0.88 },
  { id: 'EQ-10235', name: 'Asphalt Paver Vögele Super 2100-3i', typology: 'Pavers', allocationRate: 0.68, workedShare: 0.86 },
  { id: 'EQ-10241', name: 'Asphalt Paver Dynapac SD2550CS', typology: 'Pavers', allocationRate: 0.6, workedShare: 0.83 },
  { id: 'EQ-10247', name: 'Mini Paver Bomag BF 300 C', typology: 'Pavers', allocationRate: 0.35, workedShare: 0.79 },

  // Rollers: high idle share (waiting behind the paver)
  { id: 'EQ-10302', name: 'Tandem Roller Hamm HD+ 120i', typology: 'Rollers', allocationRate: 0.8, workedShare: 0.46 },
  { id: 'EQ-10303', name: 'Tandem Roller Hamm HD+ 140i', typology: 'Rollers', allocationRate: 0.78, workedShare: 0.43 },
  { id: 'EQ-10309', name: 'Tandem Roller Bomag BW 174 AP-5', typology: 'Rollers', allocationRate: 0.74, workedShare: 0.49 },
  { id: 'EQ-10311', name: 'Pneumatic Roller Hamm GRW 280i', typology: 'Rollers', allocationRate: 0.7, workedShare: 0.38 },
  { id: 'EQ-10314', name: 'Combination Roller Dynapac CC4200', typology: 'Rollers', allocationRate: 0.66, workedShare: 0.41 },
  { id: 'EQ-10318', name: 'Light Tandem Roller Bomag BW 120 AD-5', typology: 'Rollers', allocationRate: 0.42, workedShare: 0.34 },

  // Milling machines: high productive availability
  { id: 'EQ-10401', name: 'Cold Milling Machine Wirtgen W 210 Fi', typology: 'Milling Machines', allocationRate: 0.76, workedShare: 0.9 },
  { id: 'EQ-10402', name: 'Cold Milling Machine Wirtgen W 200 Fi', typology: 'Milling Machines', allocationRate: 0.7, workedShare: 0.87 },
  { id: 'EQ-10409', name: 'Compact Milling Machine Wirtgen W 50 Ri', typology: 'Milling Machines', allocationRate: 0.45, workedShare: 0.81 },

  // Trucks: high idle share (queueing at plant and paver)
  { id: 'EQ-10512', name: 'Tipper Truck Volvo FMX 460 8x4', typology: 'Trucks', allocationRate: 0.86, workedShare: 0.52 },
  { id: 'EQ-10513', name: 'Tipper Truck MAN TGS 41.480', typology: 'Trucks', allocationRate: 0.84, workedShare: 0.48 },
  { id: 'EQ-10517', name: 'Tipper Truck Scania G 450 XT', typology: 'Trucks', allocationRate: 0.82, workedShare: 0.45 },
  { id: 'EQ-10521', name: 'Tipper Truck Mercedes-Benz Arocs 3245', typology: 'Trucks', allocationRate: 0.8, workedShare: 0.5 },
  { id: 'EQ-10524', name: 'Tipper Truck Iveco T-Way 410', typology: 'Trucks', allocationRate: 0.76, workedShare: 0.41 },
  { id: 'EQ-10528', name: 'Tipper Truck Renault K 480', typology: 'Trucks', allocationRate: 0.72, workedShare: 0.39 },
  { id: 'EQ-10533', name: 'Water Bowser DAF CF 450', typology: 'Trucks', allocationRate: 0.6, workedShare: 0.36 },
  { id: 'EQ-10536', name: 'Bitumen Sprayer Truck Volvo FM 330', typology: 'Trucks', allocationRate: 0.58, workedShare: 0.55 },

  // Excavators
  { id: 'EQ-10604', name: 'Crawler Excavator CAT 323', typology: 'Excavators', allocationRate: 0.5, workedShare: 0.66 },
  { id: 'EQ-10607', name: 'Crawler Excavator Komatsu PC210LC-11', typology: 'Excavators', allocationRate: 0.38, workedShare: 0.61 },
  { id: 'EQ-10611', name: 'Wheeled Excavator Volvo EWR150E', typology: 'Excavators', allocationRate: 0, workedShare: 0 },

  // Motor graders
  { id: 'EQ-10702', name: 'Motor Grader CAT 140 GC', typology: 'Motor Graders', allocationRate: 0.52, workedShare: 0.7 },
  { id: 'EQ-10705', name: 'Motor Grader Komatsu GD655-7', typology: 'Motor Graders', allocationRate: 0.4, workedShare: 0.64 },

  // Loaders
  { id: 'EQ-10803', name: 'Wheel Loader CAT 950 GC', typology: 'Loaders', allocationRate: 0.66, workedShare: 0.6 },
  { id: 'EQ-10806', name: 'Wheel Loader Volvo L120H', typology: 'Loaders', allocationRate: 0.6, workedShare: 0.57 },
  { id: 'EQ-10810', name: 'Skid Steer Loader Bobcat S650', typology: 'Loaders', allocationRate: 0.48, workedShare: 0.52 },
]

const roundHalf = (v: number) => Math.round(v * 2) / 2
const clamp01 = (v: number) => Math.max(0, Math.min(1, v))

// 2026-09-01 (day index 0) is a Tuesday; Sundays have no shifts.
const isSunday = (dayIdx: number) => (dayIdx + 2) % 7 === 0

type DailyLog = { worked: Float32Array; idle: Float32Array }

const LOGS: Record<string, DailyLog> = Object.fromEntries(
  PROFILES.map((p) => {
    const worked = new Float32Array(TOTAL_DAYS + 1)
    const idle = new Float32Array(TOTAL_DAYS + 1)
    for (let d = 0; d <= TOTAL_DAYS; d++) {
      if (isSunday(d) || hash(`${p.id}-alloc-${d}`) >= p.allocationRate) continue
      const allocated = roundHalf(7 + hash(`${p.id}-hours-${d}`) * 4)
      const share = clamp01(p.workedShare + (hash(`${p.id}-share-${d}`) - 0.5) * 0.2)
      const w = roundHalf(allocated * share)
      worked[d] = w
      idle[d] = allocated - w
    }
    return [p.id, { worked, idle }]
  }),
)

export const productiveAvailability = (worked: number, idle: number) =>
  worked + idle > 0 ? (worked / (worked + idle)) * 100 : null

function sumRange(arr: Float32Array, from: number, to: number) {
  let s = 0
  for (let d = from; d <= to; d++) s += arr[d]
  return s
}

export function computeEquipmentSummary(fromIdx: number, toIdx: number): EquipmentSummary {
  const byTypology = new Map<string, EquipmentRow[]>()

  for (const p of PROFILES) {
    const log = LOGS[p.id]
    const hoursWorked = sumRange(log.worked, fromIdx, toIdx)
    const hoursIdle = sumRange(log.idle, fromIdx, toIdx)
    const row: EquipmentRow = {
      id: p.id,
      name: p.name,
      typology: p.typology,
      hoursWorked,
      hoursIdle,
      productiveAvailability: productiveAvailability(hoursWorked, hoursIdle),
    }
    byTypology.set(p.typology, [...(byTypology.get(p.typology) ?? []), row])
  }

  const groups: EquipmentGroup[] = Array.from(byTypology, ([typology, items]) => {
    const hoursWorked = items.reduce((s, r) => s + r.hoursWorked, 0)
    const hoursIdle = items.reduce((s, r) => s + r.hoursIdle, 0)
    return { typology, items, hoursWorked, hoursIdle, productiveAvailability: productiveAvailability(hoursWorked, hoursIdle) }
  })

  const hoursWorked = groups.reduce((s, g) => s + g.hoursWorked, 0)
  const hoursIdle = groups.reduce((s, g) => s + g.hoursIdle, 0)
  const allRows = groups.flatMap((g) => g.items)

  return {
    groups,
    hoursWorked,
    hoursIdle,
    productiveAvailability: productiveAvailability(hoursWorked, hoursIdle),
    itemCount: allRows.length,
    activeCount: allRows.filter((r) => r.hoursWorked + r.hoursIdle > 0).length,
  }
}

export function buildWeeklyEquipmentHours(fromIdx: number, toIdx: number) {
  const weeks: Array<{ week: string; worked: number; idle: number }> = []
  for (let start = fromIdx; start <= toIdx; start += 7) {
    const end = Math.min(start + 6, toIdx)
    let worked = 0
    let idle = 0
    for (const p of PROFILES) {
      worked += sumRange(LOGS[p.id].worked, start, end)
      idle += sumRange(LOGS[p.id].idle, start, end)
    }
    const [, m, d] = indexToDate(start).split('-')
    weeks.push({ week: `${d}/${m}`, worked: Math.round(worked), idle: Math.round(idle) })
  }
  return weeks
}
