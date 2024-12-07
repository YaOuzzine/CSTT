// app/defects/page.tsx
'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import Link from 'next/link'
import {
  Search,
  Plus,
  Filter,
  Bug,
  Clock,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  BarChart2,
  Tags,
  Calendar,
  User,
  LucideIcon
} from 'lucide-react'

// Types
interface Defect {
  id: string
  title: string
  description: string
  status: 'Open' | 'In Progress' | 'Fixed' | 'Closed'
  priority: 'Critical' | 'High' | 'Medium' | 'Low'
  severity: 'High' | 'Medium' | 'Low'
  assignee: string
  reporter: string
  created: string
  updated: string
  tags: string[]
  affectedArea: string
}

interface StatusConfig {
  [key: string]: {
    color: string
    icon: LucideIcon
  }
}

interface PriorityConfig {
  [key: string]: string
}

// Mock data for defects
const mockDefects: Defect[] = [
  {
    id: "DEF-001",
    title: "Login Authentication Failure",
    description: "Users unable to log in with correct credentials",
    status: "Open",
    priority: "Critical",
    severity: "High",
    assignee: "John Doe",
    reporter: "Jane Smith",
    created: "2024-03-01",
    updated: "2024-03-02",
    tags: ["Authentication", "Frontend"],
    affectedArea: "User Authentication"
  },
  {
    id: "DEF-002",
    title: "Payment Processing Timeout",
    description: "Payment transactions timing out after 30 seconds",
    status: "In Progress",
    priority: "High",
    severity: "Medium",
    assignee: "Alice Johnson",
    reporter: "Bob Wilson",
    created: "2024-03-03",
    updated: "2024-03-04",
    tags: ["Payment", "Backend"],
    affectedArea: "Payment Processing"
  },
  {
    id: "DEF-003",
    title: "Data Export Format Error",
    description: "CSV export missing column headers",
    status: "Fixed",
    priority: "Medium",
    severity: "Low",
    assignee: "Charlie Brown",
    reporter: "Diana Prince",
    created: "2024-03-05",
    updated: "2024-03-06",
    tags: ["Export", "Data"],
    affectedArea: "Reporting"
  }
]

// Status configuration for styling
const statusConfig: StatusConfig = {
  'Open': { color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20', icon: AlertCircle },
  'In Progress': { color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20', icon: Clock },
  'Fixed': { color: 'text-green-500 bg-green-50 dark:bg-green-900/20', icon: CheckCircle2 },
  'Closed': { color: 'text-gray-500 bg-gray-50 dark:bg-gray-900/20', icon: Bug }
}

const priorityConfig: PriorityConfig = {
  'Critical': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  'High': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  'Medium': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  'Low': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
}

interface DefectCardProps {
  defect: Defect
}

const DefectCard: React.FC<DefectCardProps> = ({ defect }) => {
  const StatusIcon = statusConfig[defect.status].icon
  
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
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityConfig[defect.priority]}`}>
                  {defect.priority}
                </span>
              </div>
              <h3 className="text-lg font-semibold mt-1 text-gray-900 dark:text-white">
                {defect.title}
              </h3>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${statusConfig[defect.status].color}`}>
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
              <span>Assignee: {defect.assignee}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Calendar className="h-4 w-4" />
              <span>Updated: {defect.updated}</span>
            </div>
          </div>

          {/* Tags */}
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
        </div>
      </CardContent>
    </Card>
  )
}

export default function DefectsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedView, setSelectedView] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')

  // Filter defects based on search query and filters
  const filteredDefects = mockDefects.filter(defect => {
    const matchesSearch = defect.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         defect.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPriority = selectedPriority === 'all' || defect.priority.toLowerCase() === selectedPriority
    return matchesSearch && matchesPriority
  })

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
          
          <Link href="/defects/create" className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl">
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
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDefects.map((defect) => (
            <Link key={defect.id} href={`/defects/${defect.id}`}>
              <DefectCard defect={defect} />
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredDefects.length === 0 && (
          <div className="text-center py-12">
            <Bug className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No defects found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}