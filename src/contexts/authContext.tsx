'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  setAuthenticated: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  checkAuth: async () => {},
  setAuthenticated: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/profile', {
        credentials: 'include',
      });
      
      if (response.ok) {
        setIsAuthenticated(true);
        return;
      } else {
        setIsAuthenticated(false);
        // Only redirect if on a protected admin page
        if (pathname?.startsWith('/admin') && 
            pathname !== '/admin/login' && 
            pathname !== '/admin/signup') {
          router.push('/admin/login');
        }
      }
    } catch (error) {
      setIsAuthenticated(false);
      // Only redirect if on a protected admin page
      if (pathname?.startsWith('/admin') && 
          pathname !== '/admin/login' && 
          pathname !== '/admin/signup') {
        router.push('/admin/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const setAuthenticated = (value: boolean) => {
    setIsAuthenticated(value);
  };

  useEffect(() => {
    // Skip auth check for login and signup pages
    if (pathname === '/admin/login' || pathname === '/admin/signup') {
      setIsLoading(false);
      return;
    }

    // Only check auth for admin pages
    if (pathname?.startsWith('/admin')) {
      checkAuth();
    } else {
      setIsLoading(false);
    }
  }, [pathname]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, checkAuth, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);