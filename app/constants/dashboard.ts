// app/constants/dashboard.ts
export const DASHBOARD_METRICS = [
    {
      id: "test-cases",
      title: "Total Test Cases",
      value: "245",
      change: "+12 this week",
      icon: "TestTube2",
      href: "/test-cases",
      color: "blue"
    },
    {
      id: "defects",
      title: "Active Defects",
      value: "23",
      change: "8 high priority",
      icon: "Bug",
      href: "/defects",
      color: "red"
    },
    {
      id: "test-data",
      title: "Test Data Sets",
      value: "89",
      change: "12 templates available",
      icon: "Database",
      href: "/test-data",
      color: "green"
    },
    {
      id: "coverage",
      title: "Test Coverage",
      value: "84%",
      change: "+2.5% from last week",
      icon: "BarChart2",
      href: "/analytics/test-coverage",
      color: "purple"
    }
  ] as const;
  
  export const RECENT_ACTIVITIES = [
    {
      id: "defect-127",
      type: "defect",
      title: "New defect reported",
      description: "Login validation error #127",
      icon: "Bug",
      timeAgo: "2m ago",
      href: "/defects/127",
      color: "red"
    },
    // ... other activities
  ] as const;
  
  export const QUICK_ACTIONS = [
    {
      id: "new-test",
      title: "New Test Case",
      icon: "Plus",
      href: "/test-cases/create",
      color: "blue"
    },
    // ... other actions
  ] as const;