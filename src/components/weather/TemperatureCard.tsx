import { Thermometer, TrendingUp, TrendingDown } from 'lucide-react';

interface TemperatureCardProps {
  temperature: number;
  feelsLike: number;
  high: number;
  low: number;
}

export const TemperatureCard = ({ temperature, feelsLike, high, low }: TemperatureCardProps) => {
  const isWarm = temperature > 15;
  
  return (
    <div className="glass-card p-6 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div className="p-2 rounded-xl bg-primary/10">
          <Thermometer className="w-6 h-6 text-primary" />
        </div>
        <span className="text-sm text-muted-foreground">Temperatur</span>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center py-6">
        <div className="temperature-display">
          {temperature.toFixed(1)}
          <span className="text-4xl align-top">°C</span>
        </div>
        <p className="text-muted-foreground mt-2">
          Känns som: <span className="text-foreground font-medium">{feelsLike.toFixed(1)} °C</span>
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-orange-400" />
          <div>
            <p className="stat-label">Högsta</p>
            <p className="stat-value text-lg">{high.toFixed(1)}°</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-blue-400" />
          <div>
            <p className="stat-label">Lägsta</p>
            <p className="stat-value text-lg">{low.toFixed(1)}°</p>
          </div>
        </div>
      </div>
    </div>
  );
};
