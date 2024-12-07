const AppLayout = ({ children, sidebarOnly }: { children: React.ReactNode; sidebarOnly?: boolean }) => {
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
          <nav className="flex-1 space-y-1 px-4 py-6">
            {/* Add team-specific links */}
          </nav>
        </div>
  
        {/* Main content */}
        <div className={`lg:pl-64 flex flex-col ${sidebarOnly ? "" : "lg:pl-0"}`}>
          {children}
        </div>
      </div>
    );
  };
  