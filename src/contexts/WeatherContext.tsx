import { createContext, useContext, ReactNode } from 'react';
import { useJsonWeather } from '@/hooks/useJsonWeather';
import type { WeatherData } from '@/components/WeatherDashboard';

interface WeatherContextType {
  weatherData: WeatherData;
  isConnected: boolean;
  error: string | null;
}

const WeatherContext = createContext<WeatherContextType | null>(null);

export const useWeatherContext = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeatherContext must be used within a WeatherProvider');
  }
  return context;
};

interface WeatherProviderProps {
  children: ReactNode;
}

export const WeatherProvider = ({ children }: WeatherProviderProps) => {
  const { weatherData, isConnected, error } = useJsonWeather();

  return (
    <WeatherContext.Provider value={{ weatherData, isConnected, error }}>
      {children}
    </WeatherContext.Provider>
  );
};
