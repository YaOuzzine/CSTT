"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { GradientBackground } from "../../../../components/ui/gradient-background";
import {
  Loader2,
  TestTube2,
  Bug,
  CheckCircle2,
  BarChart2,
  Plus,
  Calendar,
  Users,
} from "lucide-react";
import api from "../../../../lib/api";

// Mock data - replace with real API data
const projectMetrics = [
  {
    id: "test-cases",
    title: "Test Cases",
    value: "124",
    change: "+12 this week",
    icon: TestTube2,
    color: "text-blue-500",
  },
  {
    id: "defects",
    title: "Active Defects",
    value: "23",
    change: "8 high priority",
    icon: Bug,
    color: "text-red-500",
  },
  {
    id: "passed",
    title: "Tests Passed",
    value: "89%",
    change: "+2.5% from last run",
    icon: CheckCircle2,
    color: "text-green-500",
  },
  {
    id: "coverage",
    title: "Test Coverage",
    value: "76%",
    change: "+1.2% this sprint",
    icon: BarChart2,
    color: "text-purple-500",
  },
];

const quickActions = [
  {
    id: "create-test",
    title: "Create Test Case",
    href: "test-suites",
    icon: Plus,
    color: "bg-blue-500",
  },
  {
    id: "report-defect",
    title: "Report Defect",
    href: "defects/create",
    icon: Bug,
    color: "bg-red-500",
  },
  {
    id: "schedule-run",
    title: "Schedule Test Run",
    href: "test-runs/schedule",
    icon: Calendar,
    color: "bg-green-500",
  },
  {
    id: "team",
    title: "Manage Team",
    href: "team",
    icon: Users,
    color: "bg-purple-500",
  },
];

export default function ProjectDashboard({ params }: { params: { teamId: string; projectId: string } }) {
  const { teamId, projectId } = params;
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await api.get(`/projects/${projectId}/`);
        setProject(response.data);
      } catch (error) {
        console.error("Failed to load project data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId]);

  const handleNavigate = (path: string) => {
    router.push(`/teams/${teamId}/projects/${projectId}/${path}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        <p className="ml-4 text-gray-600 dark:text-gray-300">Loading project details...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-8">
      <GradientBackground />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Project Header */}
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {project?.name}
                </h1>
                <p className="text-gray-500 dark:text-gray-400">{project?.description}</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  {project?.status}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Created {new Date(project?.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </section>

          {/* Metrics Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {projectMetrics.map((metric) => (
              <button
                key={metric.id}
                onClick={() => handleNavigate(metric.id)}
                className="text-left"
              >
                <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {metric.title}
                        </p>
                        <h3 className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">
                          {metric.value}
                        </h3>
                        <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
                          {metric.change}
                        </p>
                      </div>
                      <metric.icon className={`h-8 w-8 ${metric.color}`} />
                    </div>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>

          {/* Quick Actions */}
          <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleNavigate(action.href)}
                    className="flex items-center p-3 rounded-lg border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                  >
                    <div className={`${action.color} p-2 rounded-md text-white`}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300">
                      {action.title}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
