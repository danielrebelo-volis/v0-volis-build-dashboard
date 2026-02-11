import { DashboardHeader } from '@/components/dashboard-header'
import { ProjectComparison } from '@/components/project-comparison'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata = {
  title: 'Compare Projects - Volis Build',
  description: 'Side-by-side project performance comparison',
}

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="px-6 pt-6">
        <Link href="/">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Main Page
          </Button>
        </Link>
      </div>
      <ProjectComparison />
    </div>
  )
}
