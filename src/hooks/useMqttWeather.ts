import { useState, useEffect, useCallback } from 'react';
import mqtt, { MqttClient } from 'mqtt';
import type { WeatherData } from '@/components/WeatherDashboard';

const MQTT_BROKER = 'wss://mqtt.hassleholmsflygklubb.se:8084/mqtt';

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

  const updateWeatherField = useCallback((topic: string, value: string) => {
    const numValue = parseFloat(value);
    
    setWeatherData(prev => {
      const updated = { ...prev, lastUpdated: new Date() };
      
      // Map MQTT topics to weather data fields
      // Common Weewx MQTT topic patterns
      if (topic.includes('outTemp') || topic.includes('temperature')) {
        updated.temperature = numValue;
      } else if (topic.includes('windchill') || topic.includes('feelsLike') || topic.includes('appTemp')) {
        updated.feelsLike = numValue;
      } else if (topic.includes('outTempMax') || topic.includes('tempHigh')) {
        updated.tempHigh = numValue;
      } else if (topic.includes('outTempMin') || topic.includes('tempLow')) {
        updated.tempLow = numValue;
      } else if (topic.includes('windSpeed') || topic.includes('wind_speed')) {
        updated.windSpeed = numValue;
      } else if (topic.includes('windGust') || topic.includes('wind_gust')) {
        updated.windGust = numValue;
      } else if (topic.includes('windDir') || topic.includes('wind_dir')) {
        updated.windDirection = numValue;
        updated.windDirectionText = getWindDirection(numValue);
      } else if (topic.includes('barometer') || topic.includes('pressure')) {
        updated.barometer = numValue;
      } else if (topic.includes('outHumidity') || topic.includes('humidity')) {
        updated.humidity = numValue;
      } else if (topic.includes('dewpoint')) {
        updated.dewpoint = numValue;
      } else if (topic.includes('UV') || topic.includes('uv')) {
        updated.uvIndex = numValue;
      } else if (topic.includes('radiation') || topic.includes('solar')) {
        updated.solarRadiation = numValue;
      } else if (topic.includes('dayRain') || topic.includes('rain_day')) {
        updated.rainDay = numValue;
      } else if (topic.includes('rainRate') || topic.includes('rain_rate')) {
        updated.rainRate = numValue;
      } else if (topic.includes('sunrise')) {
        updated.sunrise = value;
      } else if (topic.includes('sunset')) {
        updated.sunset = value;
      }
      
      return updated;
    });
  }, []);

  useEffect(() => {
    let client: MqttClient | null = null;

    const connect = () => {
      console.log('Connecting to MQTT broker:', MQTT_BROKER);
      
      try {
        client = mqtt.connect(MQTT_BROKER, {
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
          updateWeatherField(topic, value);
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
  }, [updateWeatherField]);

  return { weatherData, isConnected, error };
};
