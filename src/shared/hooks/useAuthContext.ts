import { useContext } from 'react';
import { AuthContext } from '@/shared/contexts/AuthContext';

interface AuthContextType {
  isAuthenticated: boolean;
  user: string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

/**
 * Хук для использования контекста аутентификации
 * @throws Error если используется вне AuthProvider
 */
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
