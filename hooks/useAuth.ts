import { useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  is_admin: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setUser(null);
          setIsLoading(false);
          return;
        }

        const response = await fetch('/api/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Auth error:', error);
        setUser(null);
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { 
    user, 
    isLoading,
    isAdmin: user?.is_admin ?? false
  };
} 