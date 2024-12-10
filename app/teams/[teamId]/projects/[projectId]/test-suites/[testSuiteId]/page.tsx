"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../../components/ui/card";
import { Search, Plus, Filter, MoreVertical, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import api from "../../../../../../lib/api";

function TestSuitePage({ params }: { params: { teamId: string; projectId: string; testSuiteId: string } }) {
  const { teamId, projectId, testSuiteId } = params;
  const [testCases, setTestCases] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchTestCases = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/test-suites/${testSuiteId}/test-cases/`);
        setTestCases(response.data);
      } catch (error) {
        console.error("Error fetching test cases:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestCases();
  }, [testSuiteId]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Passed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "Failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "Pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "High":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      case "Medium":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const filteredTestCases = testCases.filter((testCase) =>
    testCase.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Test Cases</h1>
            <p className="text-gray-500 dark:text-gray-400">Manage and monitor your test suite</p>
          </div>
          <Link
            href={`/teams/${teamId}/projects/${projectId}/test-suites/${testSuiteId}/test-cases/create`}
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Test Case
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
                  placeholder="Search test cases..."
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

        {/* Test Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p>Loading test cases...</p>
          ) : filteredTestCases.length > 0 ? (
            filteredTestCases.map((testCase) => (
              <Link
  href={`/teams/${teamId}/projects/${projectId}/test-suites/${testSuiteId}/test-cases/${testCase.id}`}
  className="block group"
>
              <Card
                key={testCase.id}
                className="group hover:scale-102 transition-all duration-200 backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl"
              >
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                    {testCase.title}
                  </CardTitle>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(testCase.status)}
                        <span className="text-sm text-gray-500 dark:text-gray-400">{testCase.status}</span>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityClass(
                          testCase.priority
                        )}`}
                      >
                        {testCase.priority}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Type</p>
                        <p className="font-medium text-gray-900 dark:text-white">{testCase.type}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Last Run</p>
                        <p className="font-medium text-gray-900 dark:text-white">{testCase.lastRun}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-500 dark:text-gray-400">Assignee</p>
                        <p className="font-medium text-gray-900 dark:text-white">{testCase.assignee}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </Link>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No test cases found for this test suite.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TestSuitePage;