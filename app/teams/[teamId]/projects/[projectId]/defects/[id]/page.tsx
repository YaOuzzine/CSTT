'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../../components/ui/card"
import { Alert, AlertDescription } from "../../../../../../components/ui/alert"
import api from '../../../../../../lib/api'
import {
  Save,
  X,
  AlertCircle,
  Loader2,
  User,
  Calendar,
  Clock,
  Edit,
  Tag,
  ArrowLeft
} from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  email: string
}

interface Defect {
  id: string
  title: string
  description: string
  status: string
  priority: string
  severity: string
  assignee: string
  assignee_id: string | null
  reporter: string
  created_at: string
  updated_at: string
  tags: string[]
  affected_area: string
}

interface DefectDetailPageProps {
  params: {
    teamId: string
    projectId: string
    id: string
  }
}

const statusOptions = ['Open', 'In Progress', 'Fixed', 'Closed']
const priorityOptions = ['Critical', 'High', 'Medium', 'Low']
const severityOptions = ['High', 'Medium', 'Low']

export default function DefectDetailPage({ params }: DefectDetailPageProps) {
  const router = useRouter()
  const [defect, setDefect] = useState<Defect | null>(null)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState<Partial<Defect>>({})

  useEffect(() => {
    fetchDefect()
  }, [params.id])

  const fetchDefect = async () => {
    try {
      setLoading(true)
      const response = await api.get(
        `/teams/${params.teamId}/projects/${params.projectId}/defects/${params.id}/`
      )
      setDefect(response.data)
      setTeamMembers(response.data.team_members)
      setEditedData(response.data)
    } catch (err: any) {
      console.error('Failed to fetch defect:', err)
      setError('Failed to load defect details')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError('')

      const response = await api.patch(
        `/teams/${params.teamId}/projects/${params.projectId}/defects/${params.id}/`,
        editedData
      )

      setDefect(response.data)
      setIsEditing(false)
    } catch (err: any) {
      console.error('Failed to update defect:', err)
      setError('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (!defect) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load defect</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 transition-colors duration-500">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Defects
          </button>

          <div className="flex items-center space-x-4">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setEditedData(defect)
                  }}
                  className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save
                </button>
              </div>
            )}
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          <CardContent className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="title"
                  value={editedData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {defect.title}
                </h2>
              )}
            </div>

            {/* Status, Priority, Severity */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                {isEditing ? (
                  <select
                    name="status"
                    value={editedData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium inline-block
                    ${defect.status === 'Open' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                      defect.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                      defect.status === 'Fixed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'}`}
                  >
                    {defect.status}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                {isEditing ? (
                  <select
                    name="priority"
                    value={editedData.priority}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    {priorityOptions.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium inline-block
                    ${defect.priority === 'Critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                      defect.priority === 'High' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                      defect.priority === 'Medium' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'}`}
                  >
                    {defect.priority}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Severity
                </label>
                {isEditing ? (
                  <select
                    name="severity"
                    value={editedData.severity}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    {severityOptions.map((severity) => (
                      <option key={severity} value={severity}>
                        {severity}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium inline-block
                    ${defect.severity === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                      defect.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'}`}
                  >
                    {defect.severity}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              {isEditing ? (
                <textarea
                  name="description"
                  value={editedData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {defect.description}
                </p>
              )}
            </div>

            {/* Assignment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Assignee
              </label>
              {isEditing ? (
                <select
                  name="assignee_id"
                  value={editedData.assignee_id || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Unassigned</option>
                  {teamMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {defect.assignee || 'Unassigned'}
                  </span>
                </div>
              )}
            </div>

            {/* Affected Area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Affected Area
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="affected_area"
                  value={editedData.affected_area || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Login, Payment Processing, User Profile"
                />
              ) : (
                <p className="text-gray-700 dark:text-gray-300">
                  {defect.affected_area || 'Not specified'}
                </p>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tags
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="tags"
                  value={editedData.tags?.join(', ') || ''}
                  onChange={(e) => {
                    const tagsArray = e.target.value
                      .split(',')
                      .map(tag => tag.trim())
                      .filter(Boolean);
                    setEditedData(prev => ({
                      ...prev,
                      tags: tagsArray
                    }));
                  }}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter comma-separated tags"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {defect.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                  {(!defect.tags || defect.tags.length === 0) && (
                    <span className="text-gray-500 dark:text-gray-400">
                      No tags
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Reported by {defect.reporter}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Created on {new Date(defect.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Last updated {new Date(defect.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}