import { useEffect } from 'react';
import AppRouter from './routes/AppRouter';
import { useThemeStore } from './store/themeStore';

/**
 * App.jsx — FSAD-PS34
 * Root component. Syncs themeStore on mount and applies smooth scrolling.
 * Toaster is rendered inside AppRouter (inside BrowserRouter context).
 */
export default function App() {
  const { isDark } = useThemeStore();

  // Apply smooth scroll globally
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => { document.documentElement.style.scrollBehavior = ''; };
  }, []);

  // Keep documentElement class in sync with React state
  // (themeStore.onRehydrateStorage handles first load; this handles React state changes)
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return <AppRouter />;
}
