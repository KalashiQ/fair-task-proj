import { useState, useCallback } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  user: string | null;
}

/**
 * Хук для управления состоянием аутентификации
 * Предоставляет методы для входа и выхода из системы
 */
export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false, 
    user: 'admin',
  });

  const login = useCallback((email: string, password: string): boolean => {
    // Проверяем admin/admin
    if (email === 'admin' && password === 'admin') {
      setAuthState({
        isAuthenticated: true,
        user: 'admin',
      });
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setAuthState({
      isAuthenticated: false,
      user: null,
    });
  }, []);

  return {
    isAuthenticated: authState.isAuthenticated,
    user: authState.user,
    login,
    logout,
  };
};
