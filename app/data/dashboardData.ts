// data/dashboardData.ts
import { Activity, QuickAction } from '@/types/dashboard'

export const dashboardMetrics = [
  {
    id: 'test-cases',
    title: 'Total Test Cases',
    value: '245',
    change: '+12 this week',
    icon: 'testCases' as const,
    href: '/test-cases',
    color: 'blue'
  },
  {
    id: 'defects',
    title: 'Active Defects',
    value: '23',
    change: '8 high priority',
    icon: 'defects' as const,
    href: '/defects',
    color: 'red'
  },
  {
    id: 'test-data',
    title: 'Test Data Sets',
    value: '89',
    change: '12 templates available',
    icon: 'testData' as const,
    href: '/test-data',
    color: 'green'
  },
  {
    id: 'coverage',
    title: 'Test Coverage',
    value: '84%',
    change: '+2.5% from last week',
    icon: 'coverage' as const,
    href: '/analytics/test-coverage',
    color: 'purple'
  }
];

export const recentActivities: Activity[] = [
  {
    id: 'defect-127',
    title: 'New defect reported',
    description: 'Login validation error #127',
    icon: 'Bug',
    timeAgo: '2m ago',
    type: 'defect',
    color: 'red',
    href: '/defects/127'
  },
  {
    id: 'test-completed',
    title: 'Test case completed',
    description: 'Payment flow verification',
    icon: 'CheckCircle2',
    timeAgo: '1h ago',
    type: 'test',
    color: 'green',
    href: '/test-cases'
  },
  {
    id: 'test-scheduled',
    title: 'Test run scheduled',
    description: 'User registration suite',
    icon: 'Clock',
    timeAgo: '3h ago',
    type: 'test',
    color: 'blue',
    href: '/test-cases'
  }
];

export const quickActions: QuickAction[] = [
  {
    id: 'new-test',
    title: 'New Test Case',
    icon: 'Plus',
    color: 'blue',
    href: '/test-cases/create'
  },
  {
    id: 'report-defect',
    title: 'Report Defect',
    icon: 'Bug',
    color: 'red',
    href: '/defects/create'
  },
  {
    id: 'generate-data',
    title: 'Generate Data',
    icon: 'Database',
    color: 'green',
    href: '/test-data/create'
  },
  {
    id: 'view-reports',
    title: 'View Reports',
    icon: 'BarChart2',
    color: 'purple',
    href: '/analytics'
  }
];