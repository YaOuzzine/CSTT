'use client'

// components/dashboard/DashboardClient.tsx
import MetricsGrid from '../components/dashboard/MetricsGrid'
import QuickActions from '../components/dashboard/QuickActions'
import RecentActivity from '../components/dashboard/RecentActivity'
import { GradientBackground } from '../components/ui/gradient-background'
import { dashboardMetrics, quickActions, recentActivities } from '../data/dashboardData'

export default function DashboardClient() {
  return (
    <div className="relative min-h-screen pb-8">
      <GradientBackground />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <section className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome to your testing command center
            </p>
          </section>

          {/* Metrics Grid */}
          <MetricsGrid metrics={dashboardMetrics} />

          {/* Quick Actions and Recent Activity */}
          <div className="grid gap-6 md:grid-cols-2">
            <QuickActions actions={quickActions} />
            <RecentActivity activities={recentActivities} />
          </div>
        </div>
      </div>
    </div>
  )
}