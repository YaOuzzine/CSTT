// app/page.tsx
import { Suspense } from 'react'
import DashboardClient from './components/dashboard/DashboardClient'
import { MetricsGridSkeleton } from './components/dashboard/loading'

export default function Home() {
  return (
    <Suspense fallback={<MetricsGridSkeleton />}>
      <DashboardClient />
    </Suspense>
  )
}