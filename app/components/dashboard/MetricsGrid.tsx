'use client'

// components/dashboard/MetricsGrid.tsx
import { Card, CardContent } from "../../components/ui/card"
import { BarChart3, Bug, TestTube2, Database } from 'lucide-react'
import { cn } from "../../lib/utils";

interface MetricCardProps {
  id: string
  title: string
  value: string | number
  change: string
  icon: keyof typeof ICONS
  color: string
}

// Define icons object outside the component
const ICONS = {
  testCases: TestTube2,
  testData: Database,
  defects: Bug,
  coverage: BarChart3,
} as const

function MetricCard({ title, value, change, icon }: MetricCardProps) {
  const Icon = ICONS[icon]
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>
            <h3 className="text-2xl font-bold mt-2">
              {value}
            </h3>
            <p className="text-sm mt-1 text-muted-foreground">
              {change}
            </p>
          </div>
          {Icon && <Icon className="h-8 w-8 text-muted-foreground" />}
        </div>
      </CardContent>
    </Card>
  )
}

export default function MetricsGrid({ metrics }: { metrics: MetricCardProps[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <MetricCard key={metric.id} {...metric} />
      ))}
    </div>
  )
}