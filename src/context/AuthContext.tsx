import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { UserService } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'rating'>) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = UserService.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string, _password?: string) => {
    const users = UserService.getAll();
    const foundUser = users.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      UserService.setCurrentUser(foundUser);
      return true;
    }
    return false;
  };

  const register = async (userData: Omit<User, 'id' | 'rating'>) => {
    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}`,
      rating: 5.0,
    };
    UserService.create(newUser);
    setUser(newUser);
    UserService.setCurrentUser(newUser);
  };

  const logout = () => {
    setUser(null);
    UserService.setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
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
