// filepath: e:\demo\EmotionApp\code\EmotionAppClient\utils\AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { isAuthenticated, login, logout, register } from './apiService';

// Auth context interface
interface AuthContextProps {
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
}

// Create the context with default values
const AuthContext = createContext<AuthContextProps>({
  isLoggedIn: false,
  isLoading: true,
  login: async () => false,
  logout: async () => {},
  register: async () => false,
});

// Auth Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check authentication state on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const authenticated = await isAuthenticated();
      setIsLoggedIn(authenticated);
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Login handler
  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const success = await login({ email, password });
      setIsLoggedIn(success);
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

  return (
    <AuthContext.Provider 
      value={{ 
        isLoggedIn, 
        isLoading,
        login: handleLogin, 
        logout: handleLogout,
        register: handleRegister
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