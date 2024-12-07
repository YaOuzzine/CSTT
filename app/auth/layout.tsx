export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <div className="max-w-md w-full px-6 py-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          {children}
        </div>
      </div>
    );
  }
  