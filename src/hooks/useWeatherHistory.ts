import { useState, useCallback } from 'react';

export interface HistoryDataPoint {
  time: string;
  timestamp: number;
  temperature: number;
  windSpeed: number;
  windGust: number;
}

const MAX_HISTORY_POINTS = 60; // Keep last 60 data points (about 1 hour at ~1 min intervals)

export const useWeatherHistory = () => {
  const [history, setHistory] = useState<HistoryDataPoint[]>([]);

  const addDataPoint = useCallback((temperature: number, windSpeed: number, windGust: number) => {
    const now = new Date();
    const newPoint: HistoryDataPoint = {
      time: now.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' }),
      timestamp: now.getTime(),
      temperature,
      windSpeed,
      windGust,
    };

    setHistory(prev => {
      // Avoid duplicate entries within 30 seconds
      const lastPoint = prev[prev.length - 1];
      if (lastPoint && now.getTime() - lastPoint.timestamp < 30000) {
        return prev;
      }

      const updated = [...prev, newPoint];
      // Keep only the last MAX_HISTORY_POINTS entries
      if (updated.length > MAX_HISTORY_POINTS) {
        return updated.slice(-MAX_HISTORY_POINTS);
      }
      return updated;
    });
  }, []);

  return { history, addDataPoint };
};

