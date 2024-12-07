"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api"; // Centralized Axios instance
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Plus, Loader2 } from "lucide-react";

export default function TeamDetailsPage({ params }) {
  const { teamId } = params; // Access dynamic route parameter
  const [team, setTeam] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch team details and projects
  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        // const teamResponse = await api.get(`/teams/${teamId}/`);
        // setTeam(teamResponse.data);

        const projectsResponse = await api.get(`/teams/${teamId}/projects/`);
        setProjects(projectsResponse.data);
      } catch (error) {
        console.error("Failed to load team data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [teamId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        <p className="ml-4">Loading team details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{team?.name}</h1>
            <p className="text-gray-500 dark:text-gray-400">{team?.description}</p>
          </div>
          <Link
            href={`/teams/${teamId}/projects/create`}
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Project
          </Link>
        </div>

        {/* Projects List */}
        <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <Card key={project.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-500 dark:text-gray-400">
                        {project.description}
                      </p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 col-span-full">
                  No projects available for this team.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
