"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import api from "../../lib/api";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { 
  Plus, 
  Loader2, 
  Search, 
  Filter,
  LayoutGrid,
  List,
  Calendar,
  AlertCircle,
  ArrowUpRight,
  Clock,
  Users
} from "lucide-react";

// Interface for project type
interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  created_at: string;
  members_count: number;
}

// Interface for filter type
interface Filters {
  status: string;
  sortBy: string;
  view: 'grid' | 'list';
}

export default function TeamDetailsPage({ params }) {
  const { teamId } = params;
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  
  // Filter states
  const [filters, setFilters] = useState<Filters>({
    status: 'all',
    sortBy: 'newest',
    view: 'grid'
  });

  // Fetch team projects
  useEffect(() => {
    const fetchTeamProjects = async () => {
      try {
        const projectsResponse = await api.get(`/teams/${teamId}/projects/`);
        setProjects(projectsResponse.data);
        setFilteredProjects(projectsResponse.data);
      } catch (error) {
        console.error("Failed to load team data:", error);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchTeamProjects();
  }, [teamId]);

  // Filter and search projects
  useEffect(() => {
    let result = [...projects];

    // Apply search
    if (searchQuery) {
      result = result.filter(project => 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (filters.status !== 'all') {
      result = result.filter(project => project.status === filters.status);
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    setFilteredProjects(result);
  }, [searchQuery, filters, projects]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        <p className="ml-4 text-gray-600 dark:text-gray-300">Loading team details...</p>
      </div>
    );
  }

  const ProjectCard = ({ project }) => (
    <Link
      href={`${pathname}/projects/${project.id}`}
      className="group"
    >
      <Card className="group-hover:shadow-lg transition-all duration-200 backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            {project.name}
          </CardTitle>
          <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{project.description}</p>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <Users className="h-4 w-4 mr-1" />
              {project.members_count} members
            </div>
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <Clock className="h-4 w-4 mr-1" />
              {new Date(project.created_at).toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  const ProjectListItem = ({ project }) => (
    <Link
      href={`${pathname}/projects/${project.id}`}
      className="group"
    >
      <div className="p-4 rounded-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-200 backdrop-blur-sm bg-white/50 dark:bg-gray-900/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">
              {project.name}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{project.description}</p>
          </div>
          <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
        </div>
        <div className="flex items-center gap-4 mt-4 text-sm">
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <Users className="h-4 w-4 mr-1" />
            {project.members_count} members
          </div>
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <Clock className="h-4 w-4 mr-1" />
            {new Date(project.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Team Projects</h1>
            <p className="text-gray-500 dark:text-gray-400">Manage and monitor your team's projects</p>
          </div>
          
          <Link
            href={`/teams/${teamId}/projects/create`}
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Project
          </Link>
        </div>

        {/* Search and Filters */}
        <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Filters */}
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>

              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="name">Name</option>
              </select>

              {/* View Toggle */}
              <div className="flex rounded-lg border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setFilters(prev => ({ ...prev, view: 'grid' }))}
                  className={`px-3 py-2 rounded-l-lg ${
                    filters.view === 'grid'
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <LayoutGrid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, view: 'list' }))}
                  className={`px-3 py-2 rounded-r-lg ${
                    filters.view === 'list'
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Projects Grid/List */}
        {filters.view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
                No projects found matching your criteria.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <ProjectListItem key={project.id} project={project} />
              ))
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">
                No projects found matching your criteria.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}