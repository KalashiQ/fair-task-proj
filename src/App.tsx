import { AuthProvider } from '@/shared/providers';
import { Header } from '@/shared/ui';
import { AppRouter } from './app/AppRouter';
import './App.css';

/**
 * Главный компонент приложения
 * Оборачивает приложение в провайдеры и роутер
 */
function App() {
  return (
    <AuthProvider>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh',
        backgroundColor: '#ffffff' // Белый фон для отступов
      }}>
        <Header />
        <div style={{ flex: 1, overflow: 'auto' }}>
          <AppRouter />
        </div>
      </div>
    </AuthProvider>
  );
}

export default App
