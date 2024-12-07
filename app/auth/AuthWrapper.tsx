// components/auth/AuthWrapper.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import axios from 'axios';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for authentication token
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        // No token found, redirect to login
        router.push('/auth/login');
        return;
      }

      try {
        // Verify token with backend
        const response = await axios.get('http://127.0.0.1:8000/verify/', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });          

        if (!response.data.valid) {
          // Token is invalid or expired
          localStorage.removeItem('authToken');
          router.push('/auth/login');
          return;
        }

        // Token is valid
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/auth/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-gray-500 dark:text-gray-400">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Only render children if authenticated
  return isAuthenticated ? <>{children}</> : null;
}