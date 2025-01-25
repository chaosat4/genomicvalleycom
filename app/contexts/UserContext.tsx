"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

type User = {
  id: string;
  name: string | null;
  email: string;
  is_admin: boolean;
  image: string | null;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const session = useSession();

  useEffect(() => {
    async function loadUser() {
      if (session.status === 'authenticated') {
        try {
          const response = await fetch('/api/me');
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          }
        } catch (error) {
          console.error('Failed to load user:', error);
        }
      }
      setLoading(false);
    }

    loadUser();
  }, [session.status]);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 