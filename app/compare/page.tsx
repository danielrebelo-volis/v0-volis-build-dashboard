import { DashboardHeader } from '@/components/dashboard-header'
import { ProjectComparison } from '@/components/project-comparison'

export const metadata = {
  title: 'Compare Projects - Volis Build',
  description: 'Side-by-side project performance comparison',
}

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <ProjectComparison />
    </div>
  )
}
