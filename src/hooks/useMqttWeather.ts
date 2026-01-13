import { useState, useEffect, useCallback } from 'react';
import mqtt, { MqttClient } from 'mqtt';
import type { WeatherData } from '@/components/WeatherDashboard';

const MQTT_BROKER = 'wss://mqtt.hassleholmsflygklubb.se:8443';
const MQTT_USERNAME = 'HFK';
const MQTT_PASSWORD = 'hfk1969';

const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NNÖ', 'NÖ', 'ÖNÖ', 'Ö', 'ÖSÖ', 'SÖ', 'SSÖ', 'S', 'SSV', 'SV', 'VSV', 'V', 'VNV', 'NV', 'NNV'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

const initialWeatherData: WeatherData = {
  temperature: 0,
  feelsLike: 0,
  tempHigh: 0,
  tempLow: 0,
  windSpeed: 0,
  windGust: 0,
  windDirection: 0,
  windDirectionText: 'N',
  barometer: 1013,
  humidity: 0,
  dewpoint: 0,
  uvIndex: 0,
  solarRadiation: 0,
  rainDay: 0,
  rainRate: 0,
  sunrise: '--:--',
  sunset: '--:--',
  moonPhase: '',
  moonVisibility: 0,
  lastUpdated: new Date(),
};

export const useMqttWeather = () => {
  const [weatherData, setWeatherData] = useState<WeatherData>(initialWeatherData);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateWeatherData = useCallback((topic: string, message: string) => {
    // Handle JSON payload from weather/loop topic
    if (topic === 'weather/loop') {
      try {
        const data = JSON.parse(message);
        
        // Helper to safely parse numbers from string values
        const num = (val: unknown, fallback: number = 0): number => {
          if (val === null || val === undefined) return fallback;
          const parsed = typeof val === 'string' ? parseFloat(val) : Number(val);
          return isNaN(parsed) ? fallback : parsed;
        };
        
        const windDir = num(data.windDir, 0);
        
        setWeatherData(prev => ({
          ...prev,
          temperature: num(data.outTemp_C, prev.temperature),
          feelsLike: num(data.appTemp_C ?? data.windchill_C, prev.feelsLike),
          windSpeed: num(data.windSpeed_knot, 0) * 0.514444, // Convert knots to m/s
          windGust: num(data.windGust_knot, 0) * 0.514444, // Convert knots to m/s
          windDirection: windDir,
          windDirectionText: getWindDirection(windDir),
          barometer: num(data.barometer_mbar, prev.barometer),
          humidity: num(data.outHumidity, prev.humidity),
          dewpoint: num(data.dewpoint_C, prev.dewpoint),
          uvIndex: num(data.UV, prev.uvIndex),
          solarRadiation: num(data.radiation_Wpm2, prev.solarRadiation),
          rainDay: num(data.dayRain_mm, prev.rainDay),
          rainRate: num(data.rainRate_mm_per_hour, prev.rainRate),
          lastUpdated: new Date(),
        }));
      } catch (err) {
        console.error('Failed to parse weather JSON:', err);
      }
    }
  }, []);

  useEffect(() => {
    let client: MqttClient | null = null;

    const connect = () => {
      console.log('Connecting to MQTT broker:', MQTT_BROKER);
      
      try {
        client = mqtt.connect(MQTT_BROKER, {
          username: MQTT_USERNAME,
          password: MQTT_PASSWORD,
          reconnectPeriod: 5000,
          connectTimeout: 10000,
        });

        client.on('connect', () => {
          console.log('Connected to MQTT broker');
          setIsConnected(true);
          setError(null);
          
          // Subscribe to all weather topics - using wildcard
          client?.subscribe('#', (err) => {
            if (err) {
              console.error('Subscribe error:', err);
              setError('Kunde inte prenumerera på väderdata');
            } else {
              console.log('Subscribed to all topics');
            }
          });
        });

        client.on('message', (topic, message) => {
          const value = message.toString();
          console.log(`MQTT: ${topic} = ${value}`);
          updateWeatherData(topic, value);
        });

        client.on('error', (err) => {
          console.error('MQTT error:', err);
          setError(`MQTT-fel: ${err.message}`);
          setIsConnected(false);
        });

        client.on('close', () => {
          console.log('MQTT connection closed');
          setIsConnected(false);
        });

        client.on('reconnect', () => {
          console.log('Reconnecting to MQTT broker...');
        });

      } catch (err) {
        console.error('Failed to create MQTT client:', err);
        setError('Kunde inte skapa MQTT-anslutning');
      }
    };

    connect();

    return () => {
      if (client) {
        console.log('Disconnecting from MQTT broker');
        client.end();
      }
    };
  }, [updateWeatherData]);

  return { weatherData, isConnected, error };
};
