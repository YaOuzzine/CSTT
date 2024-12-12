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
  Lightbulb
} from "lucide-react";
import api from "../../../../lib/api";

// Type Definitions
interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  created_at: string;
}

interface ProjectMetric {
  id: string;
  title: string;
  value: string;
  change: string;
}

interface QuickAction {
  id: string;
  title: string;
  href: string;
}

interface AISuggestions {
  primary_suggestion: string;
  secondary_suggestions: string[];
}

// Icon and Color Mappings
const METRIC_ICONS = {
  'test-cases': TestTube2,
  'defects': Bug,
  'passed': CheckCircle2,
  'coverage': BarChart2
};

const METRIC_COLORS = {
  'test-cases': "text-blue-500",
  'defects': "text-red-500",
  'passed': "text-green-500",
  'coverage': "text-purple-500"
};

// AI Suggestions Component
function AISuggestionsCard({ suggestions }: { suggestions: AISuggestions }) {
  return (
    <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Smart Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Primary Recommendation
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {suggestions.primary_suggestion}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Additional Recommendations
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              {suggestions.secondary_suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProjectDashboard({ params }: { params: { teamId: string; projectId: string } }) {
  const { teamId, projectId } = params;
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [metrics, setMetrics] = useState<ProjectMetric[]>([]);
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestions | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectDashboardData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/projects/${projectId}/dashboard/`);
        
        // Extract and set project details
        setProject({
          id: response.data.project.id,
          name: response.data.project.name,
          description: response.data.project.description,
          status: response.data.project.status,
          created_at: response.data.project.created_at
        });

        // Set metrics and quick actions
        setMetrics(response.data.metrics);
        setQuickActions(response.data.quick_actions);
        
        // Set AI suggestions if available
        setAiSuggestions(response.data.ai_suggestions);
      } catch (error) {
        console.error("Failed to load project dashboard:", error);
        setError("Failed to load project details");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDashboardData();
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
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
                  Created {project ? new Date(project.created_at).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </section>

          {/* Metrics Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => {
              const Icon = METRIC_ICONS[metric.id as keyof typeof METRIC_ICONS] || TestTube2;
              const color = METRIC_COLORS[metric.id as keyof typeof METRIC_COLORS] || "text-gray-500";
              
              return (
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
                        <Icon className={`h-8 w-8 ${color}`} />
                      </div>
                    </CardContent>
                  </Card>
                </button>
              );
            })}
          </div>

          {/* Quick Actions */}
          <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action) => {
                  const actionIcons = {
                    'create-test': Plus,
                    'report-defect': Bug,
                    'schedule-run': Calendar,
                    'team': Users
                  };
                  
                  const Icon = actionIcons[action.id as keyof typeof actionIcons] || Plus;
                  
                  const actionColors = {
                    'create-test': 'bg-blue-500',
                    'report-defect': 'bg-red-500',
                    'schedule-run': 'bg-green-500',
                    'team': 'bg-purple-500'
                  };
                  
                  const color = actionColors[action.id as keyof typeof actionColors] || 'bg-gray-500';

                  return (
                    <button
                      key={action.id}
                      onClick={() => handleNavigate(action.href)}
                      className="flex items-center p-3 rounded-lg border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                    >
                      <div className={`${color} p-2 rounded-md text-white`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300">
                        {action.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* AI Suggestions Section */}
          {aiSuggestions && (
            <div className="mt-8">
              <AISuggestionsCard suggestions={aiSuggestions} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}