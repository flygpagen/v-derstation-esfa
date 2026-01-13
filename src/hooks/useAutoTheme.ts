import { useState, useEffect } from 'react';
import SunCalc from 'suncalc';
import { LATITUDE, LONGITUDE } from '@/lib/constants';

type Theme = 'light' | 'dark';

export const useAutoTheme = (): Theme => {
  const [theme, setTheme] = useState<Theme>(() => {
    const now = new Date();
    const times = SunCalc.getTimes(now, LATITUDE, LONGITUDE);
    return now >= times.sunrise && now < times.sunset ? 'light' : 'dark';
  });

  useEffect(() => {
    const updateTheme = () => {
      const now = new Date();
      const times = SunCalc.getTimes(now, LATITUDE, LONGITUDE);
      const isDaytime = now >= times.sunrise && now < times.sunset;
      setTheme(isDaytime ? 'light' : 'dark');
    };

    // Update immediately
    updateTheme();

    // Check every minute for theme changes
    const interval = setInterval(updateTheme, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return theme;
};
