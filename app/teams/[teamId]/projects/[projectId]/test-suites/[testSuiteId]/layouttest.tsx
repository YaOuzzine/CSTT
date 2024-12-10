"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Settings, Users, LogOut, ChevronDown, ChevronRight, TestTube2, Loader2 } from "lucide-react";
import api from "../../../../../../lib/api";

const secondaryNavigation = [
  { name: "Profile", href: "/profile", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
];

const navbarLinks = [
  { name: "Test Suites", href: "test-suites" },
  { name: "Test Cases", href: "test-cases" },
  { name: "Test Data", href: "test-data" },
  { name: "Defects", href: "defects" },
  { name: "Analytics", href: "analytics" },
];

const TestCaseLayout = ({ children, params }: { children: React.ReactNode; params: { teamId: string; projectId: string } }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [testSuites, setTestSuites] = useState([]);
  const [testCases, setTestCases] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [latestTeams, setLatestTeams] = useState([]);
  const [testSuitesExpanded, setTestSuitesExpanded] = useState(true);
  const [testCasesExpanded, setTestCasesExpanded] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const teamResponse = await api.get(`/teams/${params.teamId}/`);
        setTeamName(teamResponse.data.name);

        const testSuitesResponse = await api.get(`/projects/${params.projectId}/test-suites/`);
        setTestSuites(testSuitesResponse.data);

        const testCasesResponse = await api.get(`/projects/${params.projectId}/test-cases/`);
        setTestCases(testCasesResponse.data);

        const latestTeamsResponse = await api.get("/teams/latest/");
        setLatestTeams(latestTeamsResponse.data);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.teamId, params.projectId]);

  const handleLogout = () => {
    setShowAlert(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 transition-transform duration-200 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200/50 dark:border-gray-700/50">
            <Link href="/" className="flex items-center space-x-2">
              <TestTube2 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold">CSTT</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
            {loading ? (
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Teams Section */}
                <div>
                  <div className="flex items-center justify-between px-2 py-2 text-sm font-medium rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <Link
                      href="/teams"
                      className="flex items-center flex-grow text-gray-700 dark:text-gray-300"
                    >
                      <span>Teams</span>
                    </Link>
                  </div>
                </div>

                {/* Test Suites Section */}
                <div className="mt-6">
                  <div className="flex items-center justify-between px-2 py-2 text-sm font-medium rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <span className="flex-grow text-gray-700 dark:text-gray-300">Test Suites</span>
                    <button
                      onClick={() => setTestSuitesExpanded(!testSuitesExpanded)}
                      className="text-gray-700 dark:text-gray-300"
                    >
                      {testSuitesExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                    </button>
                  </div>

                  {testSuitesExpanded && (
                    <div className="ml-4 space-y-1 mt-2">
                      {testSuites.map((suite) => (
                        <button
                          key={suite.id}
                          onClick={() =>
                            router.push(`/teams/${params.teamId}/projects/${params.projectId}/test-suites/${suite.id}`)
                          }
                          className={cn(
                            "w-full text-left px-2 py-2 text-sm font-medium rounded-lg transition-colors",
                            pathname.includes(`/test-suites/${suite.id}`)
                              ? "bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                          )}
                        >
                          {suite.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Test Cases Section */}
                <div className="mt-6">
                  <div className="flex items-center justify-between px-2 py-2 text-sm font-medium rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <span className="flex-grow text-gray-700 dark:text-gray-300">Test Cases</span>
                    <button
                      onClick={() => setTestCasesExpanded(!testCasesExpanded)}
                      className="text-gray-700 dark:text-gray-300"
                    >
                      {testCasesExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                    </button>
                  </div>

                  {testCasesExpanded && (
                    <div className="ml-4 space-y-1 mt-2">
                      {testCases.map((testCase) => (
                        <button
                          key={testCase.id}
                          onClick={() =>
                            router.push(
                              `/teams/${params.teamId}/projects/${params.projectId}/test-suites/${testCase.suiteId}/test-cases/${testCase.id}`
                            )
                          }
                          className={cn(
                            "w-full text-left px-2 py-2 text-sm font-medium rounded-lg transition-colors",
                            pathname.includes(`/test-cases/${testCase.id}`)
                              ? "bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                          )}
                        >
                          {testCase.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Secondary Navigation */}
            <div className="pt-6 mt-6 border-t border-gray-200/50 dark:border-gray-700/50">
              {secondaryNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-colors",
                    pathname === item.href
                      ? "bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </Link>
              ))}

              <button
                onClick={handleLogout}
                className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors mt-2"
              >
                <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400" />
                Logout
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col min-h-screen">

        {/* Page Content */}
        <main className="flex-1">
          <div className="py-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default TestCaseLayout;
