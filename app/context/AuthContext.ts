// context/AuthContext.js
"use client";
import React, { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      setIsAuthenticated(false);
      router.push('/login'); // Redirect to login page
    }
  }, [token, router]);

  const renewToken = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
    router.push('/login'); // Redirect to login
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, renewToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
