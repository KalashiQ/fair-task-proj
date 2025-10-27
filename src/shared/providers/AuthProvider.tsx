import React from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '@/shared/hooks';
import { AuthContext } from '@/shared/contexts/AuthContext';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Провайдер аутентификации
 * Предоставляет контекст аутентификации для всего приложения
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};
