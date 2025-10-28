import { AuthProvider } from '@/shared/providers';
import React, { useEffect } from 'react';
import { fetchOrderCount } from '@/shared';
import { AppRouter } from './app/AppRouter';
import './App.css';

/**
 * Главный компонент приложения
 * Оборачивает приложение в провайдеры и роутер
 */
function App() {
  useEffect(() => {
    const controller = new AbortController();
    // Префетч метрики за последний час сразу при загрузке приложения
    fetchOrderCount('hour', { signal: controller.signal }).catch(() => {
      // тихо игнорируем: это прогрев кэша / предварительный запрос
    });
    return () => controller.abort();
  }, []);

  return (
    <AuthProvider>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh',
        backgroundColor: '#ffffff' // Белый фон для отступов
      }}>
        <div style={{ flex: 1, overflow: 'auto' }}>
          <AppRouter />
        </div>
      </div>
    </AuthProvider>
  );
}

export default App
