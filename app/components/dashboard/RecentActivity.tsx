'use client'

import { memo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import * as LucideIcons from "lucide-react"
import { Activity } from '../../types/dashboard'
import { getColorClasses } from '../../utils/colorUtils'

interface RecentActivityProps {
  activities: Activity[]
}

// Individual activity item component
const ActivityItem = memo(function ActivityItem({ 
  title, 
  description, 
  timeAgo, 
  icon, 
  color,
  href 
}: Activity) {
  // Dynamically get the icon component
  const Icon = LucideIcons[icon as keyof typeof LucideIcons] || LucideIcons.Activity
  const colorClasses = getColorClasses(color, 'text')

  return (
    <a 
      href={href}
      className="block transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg p-3"
    >
      <div className="flex items-center space-x-3">
        <div className={`flex-shrink-0 ${colorClasses}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-grow min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {title}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {description}
          </p>
        </div>
        <div className="flex-shrink-0 text-xs text-gray-500 dark:text-gray-400">
          {timeAgo}
        </div>
      </div>
    </a>
  )
})

// Main RecentActivity component
const RecentActivity = memo(function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {activities.map((activity) => (
            <ActivityItem key={activity.id} {...activity} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
})

export default RecentActivity;