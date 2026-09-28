import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ThemeMode } from '@/types';

type ThemeContextValue = { theme: ThemeMode; setTheme: (theme: ThemeMode) => void; resolvedTheme: 'light' | 'dark' };
const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => (localStorage.getItem('rovik-theme') as ThemeMode) || 'system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const apply = () => {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const next = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;
      setResolvedTheme(next);
      document.documentElement.dataset.theme = next;
      document.documentElement.classList.toggle('dark', next === 'dark');
    };
    apply();
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [theme]);

  const setTheme = (next: ThemeMode) => {
    setThemeState(next);
    localStorage.setItem('rovik-theme', next);
  };

  const value = useMemo(() => ({ theme, setTheme, resolvedTheme }), [theme, resolvedTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
