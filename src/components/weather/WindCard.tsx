import { Wind, Navigation } from 'lucide-react';
import { formatValue } from '@/lib/formatNumber';

interface WindCardProps {
  speed: number;
  gust: number;
  direction: number;
  directionText: string;
}

export const WindCard = ({ speed, gust, direction, directionText }: WindCardProps) => {
  const getWindStrength = (speed: number): string => {
    if (speed < 1) return 'Stiltje';
    if (speed < 4) return 'Svag vind';
    if (speed < 8) return 'Måttlig vind';
    if (speed < 14) return 'Frisk vind';
    if (speed < 21) return 'Hård vind';
    if (speed < 28) return 'Mycket hård vind';
    return 'Storm';
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 rounded-xl bg-primary/10">
          <Wind className="w-6 h-6 text-primary animate-wind" />
        </div>
        <span className="text-sm text-muted-foreground">Vind</span>
      </div>

      <div className="flex items-center justify-between">
        {/* Compass */}
        <div className="wind-compass flex items-center justify-center">
          <div className="absolute inset-2 rounded-full border border-border/30 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Cardinal directions */}
              <span className="absolute top-1 text-xs font-medium text-muted-foreground">N</span>
              <span className="absolute bottom-1 text-xs font-medium text-muted-foreground">S</span>
              <span className="absolute left-1 text-xs font-medium text-muted-foreground">V</span>
              <span className="absolute right-1 text-xs font-medium text-muted-foreground">Ö</span>
            </div>
            
            {/* Wind direction arrow */}
            <Navigation 
              className="w-8 h-8 text-primary transition-transform duration-700 ease-out"
              style={{ transform: `rotate(${direction}deg)` }}
              fill="hsl(var(--primary))"
            />
          </div>
          
          {/* Direction label */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-center">
            <span className="text-lg font-semibold text-foreground">{directionText}</span>
            <span className="text-sm text-muted-foreground ml-1">{formatValue(direction, 0)}°</span>
          </div>
        </div>

        {/* Wind stats */}
        <div className="flex-1 ml-8 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="stat-label">Styrka</p>
              <p className="stat-value">{formatValue(speed)}</p>
            </div>
            <div>
              <p className="stat-label">Byvind</p>
              <p className="stat-value">{formatValue(gust)}</p>
            </div>
          </div>
          
          <div className="pt-2 border-t border-border/50">
            <p className="text-sm text-muted-foreground">knop</p>
            <p className="text-foreground font-medium">{getWindStrength(speed)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};