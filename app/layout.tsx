import { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "./components/theme-provider"
import { ThemeToggle } from "./components/ThemeToggle"
import Link from "next/link"
import { BarChart3, TestTube2, Database, Bug, Settings } from "lucide-react"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'CSTT - Comprehensive Software Testing Toolkit',
  description: 'Test case generation, test data management, and defect analysis platform',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system" storageKey="app-theme">
          <div className="min-h-screen bg-background">
            <nav className="fixed top-0 z-50 w-full border-b bg-background">
              <div className="container flex h-16 items-center px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                  <span className="text-xl font-bold">CSTT</span>
                </Link>

                {/* Main Navigation */}
                <div className="flex-1 ml-8 hidden md:flex">
                  <div className="flex space-x-6">
                    <Link href="/test-cases" className="flex items-center text-sm font-medium transition-colors hover:text-primary">
                      <TestTube2 className="mr-2 h-4 w-4" />
                      Test Cases
                    </Link>
                    <Link href="/test-data" className="flex items-center text-sm font-medium transition-colors hover:text-primary">
                      <Database className="mr-2 h-4 w-4" />
                      Test Data
                    </Link>
                    <Link href="/defects" className="flex items-center text-sm font-medium transition-colors hover:text-primary">
                      <Bug className="mr-2 h-4 w-4" />
                      Defects
                    </Link>
                    <Link href="/analytics" className="flex items-center text-sm font-medium transition-colors hover:text-primary">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Analytics
                    </Link>
                  </div>
                </div>

                {/* Right side items */}
                <div className="flex items-center space-x-4">
                  <ThemeToggle />
                  <Link href="/settings" className="flex items-center text-sm font-medium transition-colors hover:text-primary">
                    <Settings className="h-4 w-4" />
                  </Link>
                  <button className="h-8 w-8 rounded-full bg-muted">
                    <span className="sr-only">User menu</span>
                  </button>
                </div>

                {/* Mobile menu button */}
                <button className="ml-2 md:hidden">
                  <span className="sr-only">Open menu</span>
                  <Settings className="h-6 w-6" />
                </button>
              </div>
            </nav>

            {/* Content */}
            <main className="container mt-16 px-4 pb-8">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}