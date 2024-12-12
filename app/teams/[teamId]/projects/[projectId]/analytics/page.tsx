'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { BarChart3, Bug, Scaling, Clock, Loader2 } from 'lucide-react'
import { GradientBackground } from '../../../../../components/ui/gradient-background'
import api from '../../../../../lib/api'

// Types
interface Metric {
  id: string
  name: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: keyof typeof METRIC_ICONS
}

interface TestExecutionTrend {
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

// Components
function MetricsCard({ metric }: { metric: Metric }) {
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

function TestTrendChart({ data }: { data: TestExecutionTrend[] }) {
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
            <LineChart data={data}>
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

function DefectDistributionChart({ data }: { data: DefectData[] }) {
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
                data={data}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
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
          {data.map((entry, index) => (
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

export default function AnalyticsPage({ params }: { params: { projectId: string } }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [analyticsData, setAnalyticsData] = useState<any>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/projects/${params.projectId}/analytics/`)
        setAnalyticsData(response.data)
      } catch (err) {
        console.error('Failed to fetch analytics:', err)
        setError('Failed to load analytics data')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [params.projectId])

  // Prepare metrics for display
  const prepareMetrics = (): Metric[] => {
    if (!analyticsData) return []

    const { test_execution, defects } = analyticsData
    return [
      {
        id: '1',
        name: 'Test Execution',
        value: test_execution.total_executions.toString(),
        change: `+${((test_execution.passed_executions / test_execution.total_executions * 100) || 0).toFixed(1)}%`,
        trend: 'up',
        icon: 'execution'
      },
      {
        id: '2',
        name: 'Test Coverage',
        value: `${test_execution.test_coverage}%`,
        change: '+2.1%',
        trend: 'up',
        icon: 'coverage'
      },
      {
        id: '3',
        name: 'Active Defects',
        value: defects.open_defects.toString(),
        change: `-${((defects.open_defects / defects.total_defects * 100) || 0).toFixed(1)}%`,
        trend: 'down',
        icon: 'defects'
      },
      {
        id: '4',
        name: 'Defect Res. Time',
        value: analyticsData.defects.avg_resolution_time || 'N/A',
        change: '-',
        trend: 'down',
        icon: 'performance'
      }
    ]
  }

  // Prepare defect distribution data
  const prepareDefectData = (): DefectData[] => {
    if (!analyticsData) return []

    return analyticsData.defects.defect_distribution.map((item: any) => ({
      name: item.severity.charAt(0).toUpperCase() + item.severity.slice(1),
      value: item.count
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        <p className="ml-4 text-gray-600">Loading analytics...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

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
            {prepareMetrics().map(metric => (
              <MetricsCard key={metric.id} metric={metric} />
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid gap-6 md:grid-cols-3">
            {analyticsData?.test_execution_trend && (
              <TestTrendChart 
                data={analyticsData.test_execution_trend.map((item: any) => ({
                  date: new Date(item.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  }),
                  passed: item.passed,
                  failed: item.failed,
                  skipped: item.skipped
                }))} 
              />
            )}
            {analyticsData?.defects.defect_distribution && (
              <DefectDistributionChart data={prepareDefectData()} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}