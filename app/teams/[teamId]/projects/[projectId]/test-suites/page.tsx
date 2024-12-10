"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical 
} from "lucide-react";
import Link from "next/link";
import api from "../../../../../lib/api";

export default function TestSuitePage({ params }: { params: { teamId: string; projectId: string } }) {
  const { teamId, projectId } = params;
  const [testSuites, setTestSuites] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchTestSuites = async () => {
      try {
        const response = await api.get(`/projects/${projectId}/test-suites/`);
        setTestSuites(response.data);
      } catch (error) {
        console.error("Failed to fetch test suites:", error);
      }
    };

    fetchTestSuites();
  }, [projectId]);

  const filteredTestSuites = testSuites.filter((suite) =>
    suite.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNavigation = (testSuiteId) => {
    router.push(`/teams/${teamId}/projects/${projectId}/test-suites/${testSuiteId}/`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Test Suites</h1>
            <p className="text-gray-500 dark:text-gray-400">Manage and monitor your test suites</p>
          </div>
          <Link
            href={`/teams/${teamId}/projects/${projectId}/test-suites/create`}
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Test Suite
          </Link>
        </div>

        {/* Search and Filter Bar */}
        <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search test suites..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Filter className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                Filters
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Test Suites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestSuites.map((suite) => (
            <Card
              key={suite.id}
              onClick={() => handleNavigation(suite.id)}
              className="group cursor-pointer hover:scale-102 transition-all duration-200 backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl"
            >
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                  {suite.name}
                </CardTitle>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 dark:text-gray-400">{suite.description}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Created: {new Date(suite.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
