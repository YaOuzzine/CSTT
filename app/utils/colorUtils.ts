import { ColorVariants } from '@/types/dashboard'

// Centralized color mapping for consistency across components
export const colorVariants: ColorVariants = {
  red: {
    text: 'text-red-600',
    bg: 'bg-red-600',
    darkText: 'dark:text-red-400',
    darkBg: 'dark:bg-red-500'
  },
  green: {
    text: 'text-green-600',
    bg: 'bg-green-600',
    darkText: 'dark:text-green-400',
    darkBg: 'dark:bg-green-500'
  },
  blue: {
    text: 'text-blue-600',
    bg: 'bg-blue-600',
    darkText: 'dark:text-blue-400',
    darkBg: 'dark:bg-blue-500'
  },
  yellow: {
    text: 'text-yellow-600',
    bg: 'bg-yellow-600',
    darkText: 'dark:text-yellow-400',
    darkBg: 'dark:bg-yellow-500'
  },
  purple: {
    text: 'text-purple-600',
    bg: 'bg-purple-600',
    darkText: 'dark:text-purple-400',
    darkBg: 'dark:bg-purple-500'
  }
}

// Utility function to get color classes
export const getColorClasses = (color: keyof ColorVariants, type: 'text' | 'bg') => {
  const variant = colorVariants[color]
  return type === 'text' 
    ? `${variant.text} ${variant.darkText}`
    : `${variant.bg} ${variant.darkBg}`
}