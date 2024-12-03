

// Base interface for common properties

import { LucideIcon } from 'lucide-react'

interface BaseItem {
  id: string
  title: string
  icon: string // Icon name from lucide-react
  color: 'red' | 'green' | 'blue' | 'yellow' | 'purple'
}

// Activity item structure
export interface Activity extends BaseItem {
  description: string
  timeAgo: string
  type: 'defect' | 'test' | 'data'
  href: string
}

// Quick action structure
export interface QuickAction extends BaseItem {
  href: string
  description?: string
}

// Type for the color mapping utility
export type ColorVariants = {
  [key in Activity['color']]: {
    text: string
    bg: string
    darkText: string
    darkBg: string
  }
}

export interface MetricCardProps {
  id: string
  title: string
  value: string
  change: string
  icon: LucideIcon  // Changed from string to LucideIcon
  href: string
  color: string
}