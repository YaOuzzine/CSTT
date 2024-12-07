// app/analytics/page.tsx
'use client'

import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { BarChart3, Bug, Scaling, Clock } from 'lucide-react'
import { GradientBackground } from '../../../../../components/ui/gradient-background'

// Types
interface MetricType {
  id: string
  name: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: keyof typeof METRIC_ICONS
}

interface TestResult {
  date: string
  passed: number
  failed: number
  skipped: number
}

interface DefectData {
  name: string
  value: number
}

// Constants
const METRIC_ICONS = {
  execution: Clock,
  coverage: BarChart3,
  defects: Bug,
  performance: Scaling
}

const CHART_COLORS = {
  passed: '#22c55e',
  failed: '#ef4444',
  skipped: '#f97316',
  critical: '#dc2626',
  high: '#f97316',
  medium: '#3b82f6',
  low: '#22c55e'
}

// Mock Data
const metrics: MetricType[] = [
  {
    id: '1',
    name: 'Test Execution',
    value: '2,847',
    change: '+12.3%',
    trend: 'up',
    icon: 'execution'
  },
  {
    id: '2',
    name: 'Test Coverage',
    value: '87.5%',
    change: '+2.1%',
    trend: 'up',
    icon: 'coverage'
  },
  {
    id: '3',
    name: 'Active Defects',
    value: '45',
    change: '-5.3%',
    trend: 'down',
    icon: 'defects'
  },
  {
    id: '4',
    name: 'Avg Response Time',
    value: '1.2s',
    change: '-0.3s',
    trend: 'down',
    icon: 'performance'
  }
]

const testResults: TestResult[] = Array.from({ length: 14 }, (_, i) => ({
  date: `2024-03-${String(i + 1).padStart(2, '0')}`,
  passed: Math.floor(Math.random() * 50) + 150,
  failed: Math.floor(Math.random() * 20) + 5,
  skipped: Math.floor(Math.random() * 10) + 2
}))

const defectData: DefectData[] = [
  { name: 'Critical', value: 12 },
  { name: 'High', value: 24 },
  { name: 'Medium', value: 36 },
  { name: 'Low', value: 28 }
]

// Components
function MetricsCard({ metric }: { metric: MetricType }) {
  const Icon = METRIC_ICONS[metric.icon]
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {metric.name}
            </p>
            <h3 className="text-2xl font-bold mt-2">
              {metric.value}
            </h3>
            <p className={`text-sm mt-1 ${
              metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {metric.change}
            </p>
          </div>
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  )
}

function TestTrendChart() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-500" />
          Test Execution Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={testResults}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="passed" 
                stroke={CHART_COLORS.passed}
                name="Passed"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="failed" 
                stroke={CHART_COLORS.failed}
                name="Failed"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="skipped" 
                stroke={CHART_COLORS.skipped}
                name="Skipped"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

function DefectDistributionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="h-5 w-5 text-red-500" />
          Defect Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={defectData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {defectData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={CHART_COLORS[entry.name.toLowerCase() as keyof typeof CHART_COLORS]} 
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-4 mt-4">
          {defectData.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: CHART_COLORS[entry.name.toLowerCase() as keyof typeof CHART_COLORS] }}
              />
              <span className="text-sm text-muted-foreground">
                {entry.name}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function AnalyticsPage() {
  return (
    <div className="relative min-h-screen pb-8">
      <GradientBackground />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <section className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Analytics & Insights
            </h1>
            <p className="text-muted-foreground">
              Comprehensive view of your testing metrics and trends
            </p>
          </section>

          {/* Metrics Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {metrics.map(metric => (
              <MetricsCard key={metric.id} metric={metric} />
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid gap-6 md:grid-cols-3">
            <TestTrendChart />
            <DefectDistributionChart />
          </div>
        </div>
      </div>
    </div>
  )
}