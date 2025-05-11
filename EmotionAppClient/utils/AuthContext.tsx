// filepath: e:\demo\EmotionApp\code\EmotionAppClient\utils\AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { isAuthenticated, login, logout, register, getCurrentUser, User } from './apiService';

// Auth context interface
interface AuthContextProps {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  refreshUser: () => Promise<User | null>;
}

// Create the context with default values
const AuthContext = createContext<AuthContextProps>({
  isLoggedIn: false,
  isLoading: true,
  user: null,
  login: async () => false,
  logout: async () => {},
  register: async () => false,
  refreshUser: async () => null,
});

// Auth Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  // Check authentication state on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const authenticated = await isAuthenticated();
      setIsLoggedIn(authenticated);
      
      if (authenticated) {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      }
      
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Login handler
  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const success = await login({ email, password });
      setIsLoggedIn(success);
      
      if (success) {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      }
      
      return success;
    } catch (error) {
      console.error('Login handler error:', error);
      return false;
    }
  };

  // Logout handler
  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
      setIsLoggedIn(false);
      setUser(null);
    } catch (error) {
      console.error('Logout handler error:', error);
    }
  };

  // Register handler
  const handleRegister = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      const success = await register({ username, email, password });
      return success;
    } catch (error) {
      console.error('Register handler error:', error);
      return false;
    }
  };
  
  // Refresh user information
  const refreshUser = async (): Promise<User | null> => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      return currentUser;
    } catch (error) {
      console.error('Refresh user error:', error);
      return null;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isLoggedIn, 
        isLoading,
        user,
        login: handleLogin, 
        logout: handleLogout,
        register: handleRegister,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for accessing auth context
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};