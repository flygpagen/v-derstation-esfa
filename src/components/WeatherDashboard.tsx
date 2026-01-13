import { useState, useEffect } from 'react';
import { TemperatureCard } from './weather/TemperatureCard';
import { WindCard } from './weather/WindCard';
import { AtmosphereCard } from './weather/AtmosphereCard';
import { SunMoonCard } from './weather/SunMoonCard';
import { WeatherHeader } from './weather/WeatherHeader';
import { RainCard } from './weather/RainCard';

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  tempHigh: number;
  tempLow: number;
  windSpeed: number;
  windGust: number;
  windDirection: number;
  windDirectionText: string;
  barometer: number;
  humidity: number;
  dewpoint: number;
  uvIndex: number;
  solarRadiation: number;
  rainDay: number;
  rainRate: number;
  sunrise: string;
  sunset: string;
  moonPhase: string;
  moonVisibility: number;
  lastUpdated: Date;
}

// Simulated weather data - in a real app this would come from an API
const generateWeatherData = (): WeatherData => {
  const baseTemp = 1.2 + (Math.random() - 0.5) * 0.5;
  const windDir = 120 + Math.random() * 30;
  
  return {
    temperature: Math.round(baseTemp * 10) / 10,
    feelsLike: Math.round((baseTemp - 3.6) * 10) / 10,
    tempHigh: Math.round((baseTemp + 0.1) * 10) / 10,
    tempLow: Math.round((baseTemp - 1.9) * 10) / 10,
    windSpeed: Math.round(4 + Math.random() * 3),
    windGust: Math.round(7 + Math.random() * 4),
    windDirection: Math.round(windDir),
    windDirectionText: getWindDirection(windDir),
    barometer: Math.round(1012 + Math.random() * 3),
    humidity: Math.round(95 + Math.random() * 5),
    dewpoint: Math.round((baseTemp - 0.1) * 10) / 10,
    uvIndex: 0,
    solarRadiation: 0,
    rainDay: Math.round(1.3 * 10) / 10,
    rainRate: 0,
    sunrise: '08:27',
    sunset: '15:58',
    moonPhase: 'Avtagande Skära',
    moonVisibility: 22,
    lastUpdated: new Date(),
  };
};

const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NNÖ', 'NÖ', 'ÖNÖ', 'Ö', 'ÖSÖ', 'SÖ', 'SSÖ', 'S', 'SSV', 'SV', 'VSV', 'V', 'VNV', 'NV', 'NNV'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

export const WeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState<WeatherData>(generateWeatherData());
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setWeatherData(generateWeatherData());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <WeatherHeader 
          isConnected={isConnected} 
          lastUpdated={weatherData.lastUpdated} 
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main temperature - spans 1 column on large screens */}
          <TemperatureCard 
            temperature={weatherData.temperature}
            feelsLike={weatherData.feelsLike}
            high={weatherData.tempHigh}
            low={weatherData.tempLow}
          />
          
          {/* Wind card */}
          <WindCard 
            speed={weatherData.windSpeed}
            gust={weatherData.windGust}
            direction={weatherData.windDirection}
            directionText={weatherData.windDirectionText}
          />
          
          {/* Atmosphere readings */}
          <AtmosphereCard 
            barometer={weatherData.barometer}
            humidity={weatherData.humidity}
            dewpoint={weatherData.dewpoint}
            uvIndex={weatherData.uvIndex}
            solarRadiation={weatherData.solarRadiation}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rain data */}
          <RainCard 
            rainDay={weatherData.rainDay}
            rainRate={weatherData.rainRate}
          />
          
          {/* Sun & Moon */}
          <SunMoonCard 
            sunrise={weatherData.sunrise}
            sunset={weatherData.sunset}
            moonPhase={weatherData.moonPhase}
            moonVisibility={weatherData.moonVisibility}
          />
        </div>
      </div>
    </div>
  );
};
