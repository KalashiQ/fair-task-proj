import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from '@/pages/AuthPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { useAuthContext } from '@/shared/hooks';

/**
 * Компонент роутера приложения
 * Управляет навигацией между страницами на основе состояния аутентификации
 */
export const AppRouter: React.FC = () => {
  const { isAuthenticated } = useAuthContext();

  return (
    <Router>
      <Routes>
        <Route 
          path="/auth" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage />} 
        />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <DashboardPage /> : <Navigate to="/auth" replace />} 
        />
        <Route 
          path="/" 
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/auth"} replace />} 
        />
      </Routes>
    </Router>
  );
};
