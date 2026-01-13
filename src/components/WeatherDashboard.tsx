import { TemperatureCard } from './weather/TemperatureCard';
import { WindCard } from './weather/WindCard';
import { AtmosphereCard } from './weather/AtmosphereCard';
import { SunMoonCard } from './weather/SunMoonCard';
import { WeatherHeader } from './weather/WeatherHeader';
import { RainCard } from './weather/RainCard';
import { useWeatherContext } from '@/contexts/WeatherContext';

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

export const WeatherDashboard = () => {
  const { weatherData, isConnected } = useWeatherContext();

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <WeatherHeader 
          isConnected={isConnected} 
          lastUpdated={weatherData.lastUpdated} 
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Combined Wind & Runway card - first on mobile, spans 2 columns */}
          <WindCard 
            speed={weatherData.windSpeed}
            gust={weatherData.windGust}
            direction={weatherData.windDirection}
            directionText={weatherData.windDirectionText}
          />
          
          {/* Main temperature */}
          <TemperatureCard 
            temperature={weatherData.temperature}
            feelsLike={weatherData.feelsLike}
            high={weatherData.tempHigh}
            low={weatherData.tempLow}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Atmosphere readings */}
          <AtmosphereCard 
            barometer={weatherData.barometer}
            humidity={weatherData.humidity}
            dewpoint={weatherData.dewpoint}
            uvIndex={weatherData.uvIndex}
            solarRadiation={weatherData.solarRadiation}
          />
          
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
