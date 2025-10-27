import { createContext } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
