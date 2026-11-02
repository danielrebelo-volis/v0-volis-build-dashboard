'use client'

import { useMemo, useState } from 'react'
import { Euro, Package, Percent, Receipt } from 'lucide-react'
import { StatCard } from '@/components/activity-drill-down/kpi-cards'
import { FilterSelect } from '@/components/resources/filter-select'
import { TreeTable, type TreeColumn } from '@/components/resources/tree-table'
import { EARNED_VALUE_INFO } from '@/components/resources/workforce-view'
import {
  DISCIPLINES,
  type Discipline,
  earnedValueSummary,
  formatEurEU,
  formatPctEU,
  formatQtyEU,
  formatRateEU,
} from '@/lib/workforce-resources-data'
import {
  MATERIAL_TYPES,
  type MaterialNode,
  type MaterialType,
  buildMaterialsTree,
  unitConsumption,
} from '@/lib/materials-resources-data'

const MATERIAL_COST_RATIO_INFO =
  'Share of the value produced that was consumed in materials. No benchmark yet: read it as a trend or a comparison between locations. Material-intensive activities (e.g. paving) raise the aggregate value.'

const getId = (n: MaterialNode) => n.id
const getLabel = (n: MaterialNode) => n.label
const getChildren = (n: MaterialNode) => n.children
const byCostDesc = (a: MaterialNode, b: MaterialNode) => b.cost - a.cost
const expandTypes = (_: MaterialNode, depth: number) => depth === 0

const dash = <span className="font-mono text-muted-foreground">—</span>
const mono = (v: string) => <span className="font-mono text-foreground">{v}</span>

function buildColumns(totalCost: number): TreeColumn<MaterialNode>[] {
  return [
    { key: 'unit', label: 'Unit', align: 'left', render: (n) => (n.unit ? <span className="text-muted-foreground">{n.unit}</span> : dash), sortValue: (n) => n.unit },
    { key: 'qty', label: 'Qty Consumed', render: (n) => (n.qty === null ? dash : mono(formatQtyEU(n.qty))), sortValue: (n) => n.qty },
    {
      key: 'unitConsumption',
      label: 'Unit Consumption',
      render: (n) => {
        const v = unitConsumption(n)
        if (v === null) return dash
        return (
          <span className="font-mono text-foreground">
            {formatRateEU(v)} <span className="text-muted-foreground">{`${n.unit}/${n.activityUnit}`}</span>
          </span>
        )
      },
      sortValue: unitConsumption,
    },
    { key: 'cost', label: 'Material Cost', render: (n) => mono(formatEurEU(n.cost)), sortValue: (n) => n.cost },
    {
      key: 'share',
      label: '% of Total Cost',
      render: (n) => mono(totalCost > 0 ? formatPctEU((n.cost / totalCost) * 100) : '—'),
      sortValue: (n) => n.cost,
    },
  ]
}

export function MaterialsView({ from, to }: { from: number; to: number }) {
  const [discipline, setDiscipline] = useState<Discipline | 'all'>('all')
  const [materialType, setMaterialType] = useState<MaterialType | 'all'>('all')

  const { types, totalCost } = useMemo(
    () => buildMaterialsTree(from, to, { discipline, materialType }),
    [from, to, discipline, materialType],
  )
  const { earnedValue, missingPriceCount } = useMemo(() => earnedValueSummary(from, to, discipline), [from, to, discipline])
  const columns = useMemo(() => buildColumns(totalCost), [totalCost])

  const materialCount = types.reduce((s, t) => s + t.children.length, 0)
  const ratio = earnedValue > 0 ? (totalCost / earnedValue) * 100 : null
  const excludes =
    missingPriceCount > 0
      ? `Excludes ${missingPriceCount} ${missingPriceCount === 1 ? 'activity' : 'activities'} with no price assigned`
      : null

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          icon={Percent}
          title="Material Cost Ratio"
          info={MATERIAL_COST_RATIO_INFO}
          value={ratio === null ? '—' : formatPctEU(ratio)}
          caption="Material cost / earned value"
          footer={excludes ? `${excludes} from earned value` : 'Material cost over value produced'}
        />
        <StatCard
          icon={Receipt}
          title="Material Cost"
          value={formatEurEU(totalCost)}
          caption="Quantity consumed × unit price"
          footer={`${materialCount} ${materialCount === 1 ? 'material' : 'materials'} consumed`}
        />
        <StatCard
          icon={Euro}
          title="Earned Value"
          info={EARNED_VALUE_INFO}
          value={formatEurEU(earnedValue)}
          caption="Actual progress × internal price"
          footer={excludes ?? 'All activities in the selected discipline'}
        />
      </div>

      <div className="glass-card rounded-lg p-4">
        <div className="flex flex-wrap items-end gap-4">
          <FilterSelect id="mat-discipline" label="Discipline" value={discipline} onChange={setDiscipline} options={DISCIPLINES} allLabel="All disciplines" />
          <FilterSelect id="mat-type" label="Material Type" value={materialType} onChange={setMaterialType} options={MATERIAL_TYPES} allLabel="All material types" />
          {materialType !== 'all' && (
            <p className="pb-2 text-[11px] text-muted-foreground">
              Earned Value refers to all activities, not only those consuming the selected material type.
            </p>
          )}
        </div>
      </div>

      <TreeTable
        key={`${discipline}-${materialType}`}
        title="Materials"
        count={materialCount}
        icon={Package}
        nodes={types}
        getId={getId}
        getLabel={getLabel}
        getChildren={getChildren}
        columns={columns}
        defaultCompare={byCostDesc}
        initialExpanded={expandTypes}
      />
    </div>
  )
}
