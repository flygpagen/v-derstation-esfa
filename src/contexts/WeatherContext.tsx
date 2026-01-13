import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useMqttWeather } from '@/hooks/useMqttWeather';
import { useWeatherHistory, HistoryDataPoint } from '@/hooks/useWeatherHistory';
import type { WeatherData } from '@/components/WeatherDashboard';

interface WeatherContextType {
  weatherData: WeatherData;
  isConnected: boolean;
  error: string | null;
  history: HistoryDataPoint[];
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
  const { weatherData, isConnected, error } = useMqttWeather();
  const { history, addDataPoint } = useWeatherHistory();

  // Add data point to history whenever weather data updates
  useEffect(() => {
    if (weatherData.temperature !== 0 || weatherData.windSpeed !== 0) {
      addDataPoint(weatherData.temperature, weatherData.windSpeed, weatherData.windGust);
    }
  }, [weatherData.temperature, weatherData.windSpeed, weatherData.windGust, addDataPoint]);

  return (
    <WeatherContext.Provider value={{ weatherData, isConnected, error, history }}>
      {children}
    </WeatherContext.Provider>
  );
};
