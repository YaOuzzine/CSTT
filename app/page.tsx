"use client"
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { Users, User } from "lucide-react";
import AuthWrapper from "./auth/AuthWrapper";
import { LoadingSkeleton } from "./components/dashboard/loading";
import { Card, CardContent } from "./components/ui/card";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthWrapper>
      <Suspense fallback={<LoadingSkeleton />}>
        <div className="relative min-h-screen overflow-hidden">
          {/* Animated background layers */}
          <div className="fixed inset-0 -z-10">
            {/* Base gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900" />
            
            {/* Animated gradient orbs */}
            <div 
              className="absolute top-0 left-0 w-[800px] h-[800px] rounded-full" 
              style={{
                background: "radial-gradient(circle, rgba(255, 0, 0, 0.4) 0%, transparent 70%)",
                animation: "moveGradient1 15s linear infinite"
              }}
            />
            <div 
              className="absolute bottom-0 right-0 w-[670px] h-[670px] rounded-full" 
              style={{
                background: "radial-gradient(circle, rgba(147, 51, 234, 0.6) 0%, transparent 70%)",
                animation: "moveGradient2 10s linear infinite"
              }}
            />
            <div 
              className="absolute top-1/2 left-1/2 w-[900px] h-[900px] rounded-full" 
              style={{
                background: "radial-gradient(circle, rgba(255, 178, 0, 0.5) 0%, transparent 70%)",
                animation: "moveGradient3 20s linear infinite"
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full text-center">
              {/* Logo and Heading */}
              <div className={`mb-12 transition-all duration-2000 transform ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}>
                <div className="flex justify-center mb-8">
                  <div className="h-28 w-28 bg-blue-600 rounded-2xl shadow-xl flex items-center justify-center transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                    <span className="text-4xl font-bold text-white">CSST</span>
                  </div>
                </div>
                <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
                  Welcome to{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    CSTT
                  </span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Your comprehensive toolkit for managing software testing workflows,
                  from test cases to defect tracking.
                </p>
              </div>

              {/* Action Cards */}
              <div className={`grid md:grid-cols-2 gap-6 mb-12 transition-all duration-1000 delay-300 transform ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}>
                <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all group">
                  <Link href="/teams">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <Users className="h-8 w-8 text-blue-600" />
                        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center transform group-hover:rotate-90 transition-transform duration-300">
                          <span className="text-blue-600 font-bold">→</span>
                        </div>
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Manage Teams
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300">
                        Collaborate with your team members and manage testing projects efficiently.
                      </p>
                    </CardContent>
                  </Link>
                </Card>

                <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all group">
                  <Link href="/profile">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <User className="h-8 w-8 text-purple-600" />
                        <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center transform group-hover:rotate-90 transition-transform duration-300">
                          <span className="text-purple-600 font-bold">→</span>
                        </div>
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Your Profile
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300">
                        Manage your personal settings and preferences.
                      </p>
                    </CardContent>
                  </Link>
                </Card>
              </div>

              {/* Quick Links */}
              <div className={`flex flex-wrap justify-center gap-4 transition-all duration-1000 delay-500 transform ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}>
                {["Test Cases", "Defects", "Analytics", "Settings"].map((item) => (
                  <button
                    key={item}
                    className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Animation keyframes */}
        <style jsx global>{`
          @keyframes moveGradient1 {
            0% {
              transform: translate(0, 0) rotate(0deg);
            }
            50% {
              transform: translate(30%, 20%) rotate(180deg);
            }
            100% {
              transform: translate(0, 0) rotate(360deg);
            }
          }

          @keyframes moveGradient2 {
            0% {
              transform: translate(0, 0) rotate(0deg);
            }
            50% {
              transform: translate(-30%, -20%) rotate(-180deg);
            }
            100% {
              transform: translate(0, 0) rotate(-360deg);
            }
          }

          @keyframes moveGradient3 {
            0% {
              transform: translate(-50%, -50%) rotate(0deg);
            }
            50% {
              transform: translate(-40%, -60%) rotate(180deg);
            }
            100% {
              transform: translate(-50%, -50%) rotate(360deg);
            }
          }
        `}</style>
      </Suspense>
    </AuthWrapper>
  );
}