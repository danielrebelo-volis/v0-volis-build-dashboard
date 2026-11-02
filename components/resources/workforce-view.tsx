'use client'

import { useMemo, useState } from 'react'
import { Clock, Euro, HardHat, TrendingUp } from 'lucide-react'
import { StatCard } from '@/components/activity-drill-down/kpi-cards'
import { FilterSelect, MissingPriceValue, PartialPriceValue } from '@/components/resources/filter-select'
import { TreeTable, type TreeColumn } from '@/components/resources/tree-table'
import {
  DISCIPLINES,
  JOB_TITLES,
  type Discipline,
  type JobTitle,
  type WorkforceNode,
  buildWorkforceTree,
  countActivities,
  eurPerManHour,
  formatEurEU,
  formatQtyEU,
  formatRateEU,
  unitRate,
} from '@/lib/workforce-resources-data'

export const EARNED_VALUE_INFO = 'Value of the work executed, at internal (budget cost) price.'
const PRODUCTION_PER_MH_INFO =
  'Value produced, at internal price, per man-hour logged. No labour benchmark yet: read it as a trend over time or a comparison between locations. Highly mechanised activities raise the aggregate value.'

const NO_PRICE_MESSAGE = 'No price assigned to this activity'
const excludesMessage = (n: number) =>
  `Excludes ${n} ${n === 1 ? 'activity' : 'activities'} with no price assigned`

const getId = (n: WorkforceNode) => n.id
const getLabel = (n: WorkforceNode) => n.label
const getChildren = (n: WorkforceNode) => n.children
const wbsOrder = (a: WorkforceNode, b: WorkforceNode) => a.order - b.order
const expandTopTwoLevels = (_: WorkforceNode, depth: number) => depth < 2

const dash = <span className="font-mono text-muted-foreground">—</span>
const mono = (v: string) => <span className="font-mono text-foreground">{v}</span>

function EarnedValueCell({ node }: { node: WorkforceNode }) {
  if (node.earnedValue === null) return node.manHours > 0 ? <MissingPriceValue message={NO_PRICE_MESSAGE} /> : dash
  if (!node.isActivity && node.missingPriceCount > 0)
    return <PartialPriceValue value={formatEurEU(node.earnedValue)} message={excludesMessage(node.missingPriceCount)} />
  return mono(formatEurEU(node.earnedValue))
}

function EurPerManHourCell({ node }: { node: WorkforceNode }) {
  if (node.manHours <= 0) return dash
  if (node.earnedValue === null) return <MissingPriceValue message={NO_PRICE_MESSAGE} />
  return mono(formatEurEU(eurPerManHour(node) ?? 0))
}

const COLUMNS: TreeColumn<WorkforceNode>[] = [
  { key: 'unit', label: 'Unit', align: 'left', render: (n) => (n.unit ? <span className="text-muted-foreground">{n.unit}</span> : dash), sortValue: (n) => n.unit },
  { key: 'qty', label: 'Qty Executed', render: (n) => (n.qty === null ? dash : mono(formatQtyEU(n.qty))), sortValue: (n) => n.qty },
  { key: 'manHours', label: 'Man-Hours', render: (n) => mono(formatQtyEU(n.manHours)), sortValue: (n) => n.manHours },
  {
    key: 'unitRate',
    label: 'Unit Rate (hh/unit)',
    render: (n) => {
      const r = unitRate(n)
      return r === null ? dash : mono(formatRateEU(r))
    },
    sortValue: unitRate,
  },
  { key: 'earnedValue', label: 'Earned Value', render: (n) => <EarnedValueCell node={n} />, sortValue: (n) => n.earnedValue },
  { key: 'eurPerMh', label: '€ / Man-Hour', render: (n) => <EurPerManHourCell node={n} />, sortValue: eurPerManHour },
]

export function WorkforceView({ from, to }: { from: number; to: number }) {
  const [discipline, setDiscipline] = useState<Discipline | 'all'>('all')
  const [jobTitle, setJobTitle] = useState<JobTitle | 'all'>('all')

  const root = useMemo(() => buildWorkforceTree(from, to, { discipline, jobTitle }), [from, to, discipline, jobTitle])
  const counts = root ? countActivities(root) : { total: 0, withHours: 0 }
  const manHours = root?.manHours ?? 0
  const earnedValue = root?.earnedValue ?? null
  const productionPerMh = root ? eurPerManHour(root) : null
  const missing = root?.missingPriceCount ?? 0

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          icon={TrendingUp}
          title="Production per Man-Hour"
          info={PRODUCTION_PER_MH_INFO}
          value={productionPerMh === null ? '—' : `${formatEurEU(productionPerMh)}/hh`}
          caption="Earned value / man-hours"
          footer={missing > 0 ? `${excludesMessage(missing)} from earned value` : `Across ${counts.total} activities`}
        />
        <StatCard
          icon={Euro}
          title="Earned Value"
          info={EARNED_VALUE_INFO}
          value={earnedValue === null ? '—' : formatEurEU(earnedValue)}
          caption="Actual progress × internal price"
          footer={missing > 0 ? excludesMessage(missing) : `Across ${counts.total} activities`}
        />
        <StatCard
          icon={Clock}
          title="Man-Hours"
          value={`${formatQtyEU(manHours)} hh`}
          caption={jobTitle === 'all' ? 'Hours logged by all workers' : `Hours logged by ${jobTitle} only`}
          footer={`${counts.withHours} of ${counts.total} activities with hours logged`}
        />
      </div>

      <div className="glass-card rounded-lg p-4">
        <div className="flex flex-wrap items-end gap-4">
          <FilterSelect id="wf-discipline" label="Discipline" value={discipline} onChange={setDiscipline} options={DISCIPLINES} allLabel="All disciplines" />
          <FilterSelect id="wf-job-title" label="Job Title" value={jobTitle} onChange={setJobTitle} options={JOB_TITLES} allLabel="All job titles" />
          {jobTitle !== 'all' && (
            <p className="pb-2 text-[11px] text-muted-foreground">
              Earned Value refers to the whole activity, not only the selected category.
            </p>
          )}
        </div>
      </div>

      <TreeTable
        key={`${discipline}-${jobTitle}`}
        title="Workforce by Activity"
        count={counts.total}
        icon={HardHat}
        nodes={root ? [root] : []}
        getId={getId}
        getLabel={getLabel}
        getChildren={getChildren}
        columns={COLUMNS}
        defaultCompare={wbsOrder}
        initialExpanded={expandTopTwoLevels}
      />
    </div>
  )
}
