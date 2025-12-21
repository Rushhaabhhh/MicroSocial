import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthResponse } from '../types';
import { authService } from '../services/auth';
import { apiClient } from '../services/api';
import { storageService } from '../services/storage';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isSignedIn: boolean;
  signUp: (name: string, email: string, username: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    try {
      const savedToken = await apiClient.getToken();
      if (savedToken) {
        setToken(savedToken);
        const response = await authService.getCurrentUser();
        if (response.success && response.data) {
          setUser(response.data);
        }
      }
    } catch (error) {
      console.error('Auth restore failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (name: string, email: string, username: string, password: string) => {
    try {
      const response = await authService.signup(name, email, username, password);
      if (response.success && response.data) {
        await apiClient.setToken(response.data.token);
        setToken(response.data.token);
        setUser(response.data.user);
      } else {
        throw new Error(response.error || 'Signup failed');
      }
    } catch (error) {
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      if (response.success && response.data) {
        await apiClient.setToken(response.data.token);
        setToken(response.data.token);
        setUser(response.data.user);
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authService.logout();
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const checkAuth = async () => {
    try {
      const response = await authService.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Check auth failed:', error);
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isSignedIn: !!token,
    signUp,
    signIn,
    signOut,
    checkAuth,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
