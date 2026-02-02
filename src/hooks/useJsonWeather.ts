import { useState, useEffect, useCallback, useRef } from 'react';
import type { WeatherData } from '@/components/WeatherDashboard';

const JSON_URL = '/wx/loop.json';
const POLL_INTERVAL = 30000; // 30 seconds

const MPS_TO_KNOTS = 1.94384;
const METERS_TO_FEET = 3.28084;

const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NNÖ', 'NÖ', 'ÖNÖ', 'Ö', 'ÖSÖ', 'SÖ', 'SSÖ', 'S', 'SSV', 'SV', 'VSV', 'V', 'VNV', 'NV', 'NNV'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

const initialWeatherData: WeatherData = {
  temperature: 0,
  feelsLike: 0,
  windSpeed: 0,
  windGust: 0,
  windDirection: 0,
  windDirectionText: 'N',
  barometer: 1013,
  humidity: 0,
  dewpoint: 0,
  uvIndex: 0,
  solarRadiation: 0,
  cloudBase: 0,
  rainDay: 0,
  rainRate: 0,
  sunrise: '--:--',
  sunset: '--:--',
  moonPhase: '',
  moonVisibility: 0,
  lastUpdated: new Date(),
};

interface JsonWeatherResponse {
  dateTime: number;
  outTemp_C: number | null;
  outHumidity: number | null;
  windSpeed_mps: number | null;
  windGust_mps: number | null;
  windDir: number | null;
  pressure_mbar: number | null;
  barometer_mbar: number | null;
  dewpoint_C: number | null;
  windchill_C: number | null;
  heatindex_C: number | null;
  cloudbase_meter: number | null;
  rain_mm: number | null;
  rainRate_mm_per_hour: number | null;
  radiation_Wpm2: number | null;
  UV: number | null;
}

export const useJsonWeather = () => {
  const [weatherData, setWeatherData] = useState<WeatherData>(initialWeatherData);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchWeatherData = useCallback(async () => {
    // Abort any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(JSON_URL, {
        signal: abortControllerRef.current.signal,
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: JsonWeatherResponse = await response.json();

      // Helper to safely get number values
      const num = (val: number | null | undefined, fallback: number = 0): number => {
        return val !== null && val !== undefined && !isNaN(val) ? val : fallback;
      };

      const windDir = num(data.windDir, 0);
      const temperature = num(data.outTemp_C, 0);

      // Use windchill for cold, heatindex for hot, otherwise actual temp
      let feelsLike = temperature;
      if (data.windchill_C !== null && temperature < 10) {
        feelsLike = data.windchill_C;
      } else if (data.heatindex_C !== null && temperature > 27) {
        feelsLike = data.heatindex_C;
      }

      setWeatherData(prev => ({
        ...prev,
        temperature,
        feelsLike,
        windSpeed: num(data.windSpeed_mps) * MPS_TO_KNOTS,
        windGust: num(data.windGust_mps) * MPS_TO_KNOTS,
        windDirection: windDir,
        windDirectionText: getWindDirection(windDir),
        barometer: num(data.barometer_mbar ?? data.pressure_mbar, prev.barometer),
        humidity: num(data.outHumidity, prev.humidity),
        dewpoint: num(data.dewpoint_C, prev.dewpoint),
        uvIndex: num(data.UV, prev.uvIndex),
        solarRadiation: num(data.radiation_Wpm2, prev.solarRadiation),
        cloudBase: num(data.cloudbase_meter) * METERS_TO_FEET,
        rainDay: num(data.rain_mm, prev.rainDay),
        rainRate: num(data.rainRate_mm_per_hour, prev.rainRate),
        lastUpdated: data.dateTime ? new Date(data.dateTime * 1000) : new Date(),
      }));

      setIsConnected(true);
      setError(null);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return; // Ignore aborted requests
      }
      console.error('Failed to fetch weather data:', err);
      setIsConnected(false);
      setError(err instanceof Error ? err.message : 'Kunde inte hämta väderdata');
    }
  }, []);

  useEffect(() => {
    // Fetch immediately on mount
    fetchWeatherData();

    // Set up polling interval
    const intervalId = setInterval(fetchWeatherData, POLL_INTERVAL);

    return () => {
      clearInterval(intervalId);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchWeatherData]);

  return { weatherData, isConnected, error };
};
