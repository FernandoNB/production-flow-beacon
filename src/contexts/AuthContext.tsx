
import React, { createContext, useState, useEffect, useContext } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  googleLogin: (response: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('pcp_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse user from localStorage', error);
        localStorage.removeItem('pcp_user');
      }
    }
    setIsLoading(false);
  }, []);

  const googleLogin = (response: any) => {
    try {
      // In a real app, you would validate this token on your backend
      const profile = response.profileObj || {
        googleId: 'sample-id',
        email: response.email || 'user@example.com',
        name: response.name || 'User',
        imageUrl: response.picture,
      };
      
      const user: User = {
        id: profile.googleId || 'sample-id',
        email: profile.email,
        name: profile.name,
        picture: profile.imageUrl,
        role: 'admin', // You would get this from your backend in a real app
      };
      
      setUser(user);
      localStorage.setItem('pcp_user', JSON.stringify(user));
    } catch (error) {
      console.error('Login error', error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pcp_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        googleLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
