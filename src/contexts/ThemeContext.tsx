import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import SunCalc from 'suncalc';
import { LATITUDE, LONGITUDE } from '@/lib/constants';

type Theme = 'light' | 'dark';
type ThemeMode = 'auto' | 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getAutoTheme = (): Theme => {
  const now = new Date();
  const times = SunCalc.getTimes(now, LATITUDE, LONGITUDE);
  return now >= times.sunrise && now < times.sunset ? 'light' : 'dark';
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem('theme-mode');
    return (stored as ThemeMode) || 'auto';
  });
  
  const [autoTheme, setAutoTheme] = useState<Theme>(getAutoTheme);

  // Calculate effective theme based on mode
  const theme: Theme = themeMode === 'auto' ? autoTheme : themeMode;

  // Update auto theme every minute
  useEffect(() => {
    const updateAutoTheme = () => setAutoTheme(getAutoTheme());
    const interval = setInterval(updateAutoTheme, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  // Persist theme mode
  useEffect(() => {
    localStorage.setItem('theme-mode', themeMode);
  }, [themeMode]);

  return (
    <ThemeContext.Provider value={{ theme, themeMode, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
