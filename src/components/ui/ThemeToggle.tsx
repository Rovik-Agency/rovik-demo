import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/layout/ThemeProvider';
import type { ThemeMode } from '@/types';

const options: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
  { value: 'light', label: 'Light', icon: <Sun className="h-4 w-4" /> },
  { value: 'dark', label: 'Dark', icon: <Moon className="h-4 w-4" /> },
  { value: 'system', label: 'System', icon: <Monitor className="h-4 w-4" /> }
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex rounded-full border border-soft bg-card p-1" aria-label="Theme selector">
      {options.map((option) => (
        <button key={option.value} onClick={() => setTheme(option.value)} className={`focus-ring rounded-full p-2 transition ${theme === option.value ? 'bg-ink text-white dark:bg-white dark:text-ink' : 'text-muted hover:text-current'}`} aria-label={option.label}>
          {option.icon}
        </button>
      ))}
    </div>
  );
}
