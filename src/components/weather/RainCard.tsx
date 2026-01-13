import { CloudRain, Droplet } from 'lucide-react';
import { formatValue } from '@/lib/formatNumber';

interface RainCardProps {
  rainDay: number;
  rainRate: number;
}

export const RainCard = ({ rainDay, rainRate }: RainCardProps) => {
  const isRaining = rainRate > 0;

  return (
    <div className="glass-card p-6">
      <div className="flex items-start justify-between mb-6">
        <h3 className="section-title">
          <CloudRain className="w-5 h-5 text-primary" />
          Nederbörd
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="relative">
          {/* Rain container visualization */}
          <div className="h-32 w-full rounded-xl bg-secondary/50 relative overflow-hidden">
            {/* Water level */}
            <div 
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500/60 to-blue-400/40 transition-all duration-1000"
              style={{ height: `${Math.min(rainDay * 10, 100)}%` }}
            >
              {/* Ripple effect */}
              {isRaining && (
                <>
                  <div className="absolute top-0 left-1/4 w-8 h-2 bg-blue-300/30 rounded-full animate-ping" />
                  <div className="absolute top-0 right-1/3 w-6 h-2 bg-blue-300/30 rounded-full animate-ping delay-300" />
                </>
              )}
            </div>
            
            {/* Measurement lines */}
            <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none">
              {[10, 8, 6, 4, 2, 0].map((val) => (
                <div key={val} className="flex items-center gap-1">
                  <div className="w-full h-px bg-border/30" />
                  <span className="text-[10px] text-muted-foreground w-6">{val}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-3 text-center">
            <p className="stat-label">Idag</p>
            <p className="stat-value">{formatValue(rainDay)} mm</p>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center">
          <div className={`p-6 rounded-2xl ${isRaining ? 'bg-blue-500/20' : 'bg-secondary/50'}`}>
            <Droplet 
              className={`w-12 h-12 ${isRaining ? 'text-blue-400' : 'text-muted-foreground'}`}
              fill={isRaining ? 'hsl(var(--weather-rain))' : 'transparent'}
            />
          </div>
          
          <div className="mt-4 text-center">
            <p className="stat-label">Regnintensitet</p>
            <p className="stat-value">{formatValue(rainRate)} mm/h</p>
            <p className="text-sm text-muted-foreground mt-1">
              {isRaining ? 'Det regnar nu' : 'Inget regn'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};