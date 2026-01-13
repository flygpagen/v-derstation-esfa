import { Thermometer, TrendingUp, TrendingDown } from 'lucide-react';
import { formatValue } from '@/lib/formatNumber';

interface TemperatureCardProps {
  temperature: number;
  feelsLike: number;
  high: number;
  low: number;
  streamUrl?: string;
}

export const TemperatureCard = ({
  temperature,
  feelsLike,
  high,
  low,
  streamUrl
}: TemperatureCardProps) => {
  return (
    <div className="glass-card p-4 md:p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="section-title">
          <Thermometer className="w-[24px] h-[24px] text-primary" />
          Temperatur
        </h3>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        {/* Camera stream */}
        {streamUrl && (
          <div className="relative aspect-video md:w-1/2 rounded-lg overflow-hidden bg-black/20 flex-shrink-0">
            <img 
              src={streamUrl}
              alt="Webbkamera"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {/* Temperature info */}
        <div className={`flex flex-col justify-center ${streamUrl ? 'md:w-1/2' : 'w-full'}`}>
          <div className="text-center md:text-left">
            <div className="text-4xl md:text-5xl font-bold text-foreground">
              {formatValue(temperature)}
              <span className="text-2xl md:text-3xl align-top">°C</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Känns som: <span className="text-foreground font-medium">{formatValue(feelsLike)}°</span>
            </p>
          </div>
          
          <div className="flex items-center justify-center md:justify-start gap-4 mt-4 pt-3 border-t border-border/50">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-muted-foreground">Högsta</span>
              <span className="font-medium">{formatValue(high)}°</span>
            </div>
            <div className="flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-muted-foreground">Lägsta</span>
              <span className="font-medium">{formatValue(low)}°</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
