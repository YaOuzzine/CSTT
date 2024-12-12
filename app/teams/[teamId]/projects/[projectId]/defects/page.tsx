'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from "../../../../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../components/ui/tabs"
import { Alert, AlertDescription } from "../../../../../components/ui/alert"
import Link from 'next/link'
import api from '../../../../../lib/api'
import {
  Search,
  Plus,
  Filter,
  Bug,
  Clock,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Calendar,
  User,
  Loader2,
  type LucideIcon
} from 'lucide-react'

// Types
interface Defect {
  id: string
  title: string
  description: string
  status: string
  priority: string
  severity: string
  assignee: string
  reporter: string
  created_at: string
  updated_at: string
  tags: string[]
  affected_area: string
}

interface DefectsPageProps {
  params: {
    teamId: string
    projectId: string
  }
}

// Status configuration for styling
const statusConfig: Record<string, { color: string, icon: LucideIcon }> = {
  'Open': { 
    color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20', 
    icon: AlertCircle 
  },
  'In Progress': { 
    color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20', 
    icon: Clock 
  },
  'Fixed': { 
    color: 'text-green-500 bg-green-50 dark:bg-green-900/20', 
    icon: CheckCircle2 
  },
  'Closed': { 
    color: 'text-gray-500 bg-gray-50 dark:bg-gray-900/20', 
    icon: Bug 
  }
}

const priorityConfig: Record<string, string> = {
  'Critical': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  'High': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  'Medium': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  'Low': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
}

interface DefectCardProps {
  defect: Defect
}

const DefectCard: React.FC<DefectCardProps> = ({ defect }) => {
  const StatusIcon = statusConfig[defect.status]?.icon || Bug
  const statusColor = statusConfig[defect.status]?.color || 'text-gray-500 bg-gray-50'
  const priorityColor = priorityConfig[defect.priority] || 'bg-gray-100 text-gray-800'
  
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                  {defect.id}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColor}`}>
                  {defect.priority}
                </span>
              </div>
              <h3 className="text-lg font-semibold mt-1 text-gray-900 dark:text-white">
                {defect.title}
              </h3>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${statusColor}`}>
              <StatusIcon className="h-4 w-4" />
              <span>{defect.status}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300">
            {defect.description}
          </p>

          {/* Meta Information */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <User className="h-4 w-4" />
              <span>{defect.assignee || 'Unassigned'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(defect.updated_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Tags */}
          {defect.tags && defect.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {defect.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function DefectsPage({ params }: DefectsPageProps) {
  const [defects, setDefects] = useState<Defect[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedView, setSelectedView] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')

  useEffect(() => {
    fetchDefects()
  }, [selectedView, selectedPriority])

  const fetchDefects = async () => {
    try {
      setLoading(true)
      setError('')

      const queryParams = new URLSearchParams({
        view: selectedView,
        ...(selectedPriority !== 'all' && { priority: selectedPriority }),
        ...(searchQuery && { search: searchQuery })
      })

      const response = await api.get(
        `/teams/${params.teamId}/projects/${params.projectId}/defects/?${queryParams}`
      )
      setDefects(response.data)
    } catch (err: any) {
      console.error('Failed to fetch defects:', err)
      setError('Failed to load defects. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDefects()
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 transition-colors duration-500">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0)_50%)] dark:bg-[radial-gradient(circle_at_50%_120%,rgba(66,65,110,0.1),rgba(0,0,0,0)_50%)] animate-pulse duration-[8000ms]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Defects</h1>
            <p className="text-gray-500 dark:text-gray-400">Track and manage software defects</p>
          </div>
          
          <Link 
            href={`/teams/${params.teamId}/projects/${params.projectId}/defects/create`}
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <Plus className="h-5 w-5 mr-2" />
            Report Defect
          </Link>
        </div>

        {/* Filters Section */}
        <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search defects..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Priority Filter */}
              <select
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all"
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              {/* View Toggle */}
              <Tabs value={selectedView} onValueChange={setSelectedView} className="min-w-[200px]">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="my">My Defects</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Defects Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-3 text-gray-500 dark:text-gray-400">Loading defects...</span>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {defects.map((defect) => (
                <Link 
                  key={defect.id} 
                  href={`/teams/${params.teamId}/projects/${params.projectId}/defects/${defect.id}`}
                >
                  <DefectCard defect={defect} />
                </Link>
              ))}
            </div>

            {/* Empty State */}
            {defects.length === 0 && (
              <div className="text-center py-12">
                <Bug className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No defects found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchQuery 
                    ? "Try adjusting your search or filters to find what you're looking for."
                    : "Get started by reporting your first defect."
                  }
                </p>
                {!searchQuery && (
                  <Link
                    href={`/teams/${params.teamId}/projects/${params.projectId}/defects/create`}
                    className="inline-flex items-center justify-center px-4 py-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Report Defect
                  </Link>
                )}
              </div>
            )}
          </>
        )}

        {/* Statistics Card */}
        {defects.length > 0 && (
          <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 shadow-xl mt-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {defects.filter(d => d.status === 'Open').length}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Open</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {defects.filter(d => d.status === 'In Progress').length}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">In Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {defects.filter(d => d.priority === 'Critical').length}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Critical</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {defects.filter(d => d.status === 'Fixed').length}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Fixed</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}