import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { ProjectDashboard } from '@/components/project-dashboard'
import { PROJECT_TABS, isProjectTab } from '@/lib/project-tabs'

type Props = {
  params: Promise<{ id: string; tab: string }>
  searchParams: Promise<{ tab?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tab } = await params
  const label = PROJECT_TABS.find((t) => t.id === tab)?.label
  return { title: label ? `${label} | Volis Build` : 'Volis Build' }
}

export default async function ProjectTabPage({ params, searchParams }: Props) {
  const { id, tab } = await params
  if (!isProjectTab(tab)) notFound()

  // Keep old `/overview?tab=<section>` links working.
  const { tab: legacyTab } = await searchParams
  if (legacyTab && legacyTab !== tab && isProjectTab(legacyTab)) {
    redirect(`/project/${id}/${legacyTab}`)
  }

  return <ProjectDashboard projectId={id} activeTab={tab} />
}
