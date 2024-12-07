"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Menu } from "lucide-react";
import api from "../../lib/api";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [latestTeams, setLatestTeams] = useState([]);

  useEffect(() => {
    const fetchLatestTeams = async () => {
      try {
        const response = await api.get("/teams/latest/");
        setLatestTeams(response.data);
      } catch (error) {
        console.error("Failed to fetch latest teams:", error);
      }
    };

    fetchLatestTeams();
  }, []);

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
        <nav className="flex-1 space-y-1 px-2 py-4">
          <Link
            href="/projects"
            className={cn(
              "group flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-colors",
              pathname === "/projects"
                ? "bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            )}
          >
            <LayoutDashboard className="mr-3 h-5 w-5 flex-shrink-0" />
            Projects
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl px-4">
          <button
            type="button"
            className="lg:hidden -m-2.5 p-2.5 text-gray-700 dark:text-gray-300"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Latest Teams in Navbar */}
          <div className="flex space-x-4">
            {latestTeams.map((team) => (
              <Link
                key={team.id}
                href={`/teams/${team.id}`}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  pathname === `/teams/${team.id}`
                    ? "bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                )}
              >
                {team.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1">
          <div className="py-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
