import { AuthProvider } from '@/shared/providers';
import { AppRouter } from './app/AppRouter';
import './App.css';

/**
 * Главный компонент приложения
 * Оборачивает приложение в провайдеры и роутер
 */
function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App
