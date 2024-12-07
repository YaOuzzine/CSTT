"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { TestTube2, Settings, Users, LogOut, ChevronDown, ChevronUp } from "lucide-react";
import api from "../lib/api";

const secondaryNavigation = [
  { name: "Profile", href: "/profile", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
];

const TeamsLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [latestTeams, setLatestTeams] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false); // State to toggle the expansion of the "Teams" section

  // Fetch latest three teams
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

  const handleLogout = () => {
    setShowAlert(true);
    // Add logout logic here
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

          {/* Teams Navigation */}
          <nav className="flex-1 space-y-1 px-2 py-4">
            <div className="flex items-center justify-between px-2 py-2 text-sm font-medium rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <Link
                href="/teams"
                className="flex items-center flex-grow space-x-2 text-gray-700 dark:text-gray-300"
              >
                <span>Teams</span>
              </Link>
              <button
                className="text-gray-700 dark:text-gray-300"
                onClick={() => setIsExpanded((prev) => !prev)}
              >
                {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
            </div>

            {isExpanded && latestTeams.length > 0 && (
              <div className="ml-4 space-y-1">
                {latestTeams.map((team) => {
                  const isActive = pathname === `/teams/${team.id}`;
                  return (
                    <Link
                      key={team.id}
                      href={`/teams/${team.id}`}
                      className={cn(
                        "group flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-colors",
                        isActive
                          ? "bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      )}
                    >
                      {team.name}
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Secondary Navigation */}
            <div className="pt-4 mt-4 space-y-1 border-t border-gray-200/50 dark:border-gray-700/50">
              {secondaryNavigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-colors",
                      isActive
                        ? "bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </Link>
                );
              })}

              <button
                onClick={handleLogout}
                className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400" />
                Logout
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <main className="flex-1">
          <div className="py-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default TeamsLayout;
