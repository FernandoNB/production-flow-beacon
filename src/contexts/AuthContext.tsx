
import React, { createContext, useState, useEffect, useContext } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (profileData: Partial<User>) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simulação de um banco de dados de usuários
const userDB: Record<string, { name: string; email: string; password: string; role: 'admin' | 'user' | 'viewer'; picture?: string }> = {};

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

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulação de verificação no banco de dados
    const userRecord = Object.values(userDB).find(u => u.email === email);
    
    if (userRecord && userRecord.password === password) {
      const loggedUser: User = {
        id: email,
        email: email,
        name: userRecord.name,
        role: userRecord.role,
        picture: userRecord.picture,
      };
      
      setUser(loggedUser);
      localStorage.setItem('pcp_user', JSON.stringify(loggedUser));
      return true;
    }
    
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Verifica se o email já está cadastrado
    if (Object.values(userDB).some(u => u.email === email)) {
      return false;
    }
    
    // Registra o novo usuário
    userDB[email] = {
      name,
      email,
      password,
      role: 'user', // Por padrão, novos usuários têm o papel 'user'
    };
    
    // Faz login com o usuário recém-criado
    return login(email, password);
  };

  const updateUserProfile = (profileData: Partial<User>): boolean => {
    try {
      if (!user) return false;
      
      // Update user record in the DB
      if (userDB[user.email]) {
        if (profileData.name) userDB[user.email].name = profileData.name;
        if (profileData.picture) userDB[user.email].picture = profileData.picture;
      }
      
      // Update current user state
      const updatedUser = {
        ...user,
        ...profileData
      };
      
      setUser(updatedUser);
      localStorage.setItem('pcp_user', JSON.stringify(updatedUser));
      
      return true;
    } catch (error) {
      console.error('Failed to update user profile:', error);
      return false;
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
        login,
        register,
        logout,
        updateUserProfile,
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
