// app/components/dashboard/QuickActions.tsx
'use client'

import { memo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import * as Icons from "lucide-react"
import { QuickAction } from '../../types/dashboard'
import { getColorClasses } from '../../utils/colorUtils'

interface QuickActionsProps {
  actions: QuickAction[]
}

// Individual action button component
const ActionButton = memo(function ActionButton({ 
  title, 
  icon: IconName, 
  color,
  href 
}: QuickAction) {
  // Dynamically get the icon component from lucide-react
  const Icon = Icons[IconName as keyof typeof Icons] || Icons.Activity
  const buttonColorClass = getColorClasses(color, 'bg')

  return (
    <a href={href} className="block">
      <button 
        className={`
          inline-flex items-center justify-center 
          rounded-md text-sm font-medium 
          ring-offset-background transition-colors 
          focus-visible:outline-none focus-visible:ring-2 
          focus-visible:ring-ring focus-visible:ring-offset-2 
          disabled:pointer-events-none disabled:opacity-50 
          ${buttonColorClass} text-white 
          hover:opacity-90 h-10 px-4 py-2 w-full
        `}
      >
        <Icon className="mr-2 h-4 w-4" />
        {title}
      </button>
    </a>
  )
})

// Main QuickActions component
export default memo(function QuickActions({ actions }: QuickActionsProps) {
  return (
    <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
          {actions.map((action) => (
            <ActionButton key={action.id} {...action} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
})