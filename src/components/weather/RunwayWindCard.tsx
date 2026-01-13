import { Plane } from 'lucide-react';
import { formatValue } from '@/lib/formatNumber';

interface RunwayWindCardProps {
  windDirection: number;
  windSpeed: number;
}

const RUNWAY_04 = 40;
const RUNWAY_22 = 220;

export const RunwayWindCard = ({ windDirection, windSpeed }: RunwayWindCardProps) => {
  // Calculate wind components for both runway directions
  const calculateWindComponents = (runwayHeading: number) => {
    // Wind direction is where wind comes FROM
    // We need to find the relative angle between wind and runway
    const relativeAngle = ((windDirection - runwayHeading + 360) % 360) * (Math.PI / 180);
    
    // Headwind is positive when wind comes from ahead (0°), negative for tailwind (180°)
    const headwind = windSpeed * Math.cos(relativeAngle);
    // Crosswind: positive = from right, negative = from left
    const crosswind = windSpeed * Math.sin(relativeAngle);
    
    return { headwind, crosswind };
  };

  const rwy04 = calculateWindComponents(RUNWAY_04);
  const rwy22 = calculateWindComponents(RUNWAY_22);

  // Determine which runway is better (more headwind)
  const preferredRunway = rwy04.headwind >= rwy22.headwind ? '04' : '22';
  const preferredComponents = preferredRunway === '04' ? rwy04 : rwy22;

  const getWindLabel = (headwind: number) => {
    if (headwind > 0.5) return 'Motvind';
    if (headwind < -0.5) return 'Medvind';
    return 'Neutral';
  };

  const getCrosswindLabel = (crosswind: number) => {
    if (Math.abs(crosswind) < 0.5) return '';
    return crosswind > 0 ? 'från höger' : 'från vänster';
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 rounded-xl bg-primary/10">
          <Plane className="w-6 h-6 text-primary" />
        </div>
        <span className="text-sm text-muted-foreground">Banvind ESFA</span>
      </div>

      {/* Runway visualization */}
      <div className="flex justify-center mb-6">
        <div className="relative w-48 h-48">
          {/* Compass rose background */}
          <div className="absolute inset-0 rounded-full border-2 border-border/30">
            <span className="absolute top-1 left-1/2 -translate-x-1/2 text-xs font-medium text-muted-foreground">N</span>
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs font-medium text-muted-foreground">S</span>
            <span className="absolute left-1 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">V</span>
            <span className="absolute right-1 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">Ö</span>
          </div>

          {/* Runway strip */}
          <div 
            className="absolute left-1/2 top-1/2 w-3 h-32 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-muted-foreground/60"
            style={{ transform: `translate(-50%, -50%) rotate(${RUNWAY_04}deg)` }}
          >
            {/* Runway end markers */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-5 h-1 bg-muted-foreground/80 rounded-sm" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-1 bg-muted-foreground/80 rounded-sm" />
            
            {/* Runway designators */}
            <span 
              className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-foreground"
              style={{ transform: `translateX(-50%) rotate(-${RUNWAY_04}deg)` }}
            >
              04
            </span>
            <span 
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold text-foreground"
              style={{ transform: `translateX(-50%) rotate(-${RUNWAY_04}deg)` }}
            >
              22
            </span>
          </div>

          {/* Wind arrow */}
          <div 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ transform: `translate(-50%, -50%) rotate(${windDirection}deg)` }}
          >
            <div className="relative h-20 flex flex-col items-center">
              {/* Arrow pointing down (wind direction FROM) */}
              <div className="w-0.5 h-14 bg-primary" />
              <div 
                className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-primary"
              />
            </div>
          </div>

          {/* Wind direction label */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-8 text-center">
            <span className="text-sm font-semibold text-foreground">{formatValue(windDirection, 0)}°</span>
          </div>
        </div>
      </div>

      {/* Wind components for each runway */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className={`text-center p-3 rounded-xl ${preferredRunway === '04' ? 'bg-primary/20 ring-1 ring-primary/30' : 'bg-secondary/50'}`}>
          <p className="text-xs text-muted-foreground mb-1">Bana 04</p>
          <p className={`text-lg font-bold ${rwy04.headwind >= 0 ? 'text-green-500' : 'text-destructive'}`}>
            {rwy04.headwind >= 0 ? '+' : ''}{formatValue(rwy04.headwind, 0)} kt
          </p>
          <p className="text-xs text-muted-foreground">{getWindLabel(rwy04.headwind)}</p>
          <p className="text-sm text-foreground mt-1">
            {formatValue(Math.abs(rwy04.crosswind), 0)} kt {getCrosswindLabel(rwy04.crosswind)}
          </p>
        </div>
        <div className={`text-center p-3 rounded-xl ${preferredRunway === '22' ? 'bg-primary/20 ring-1 ring-primary/30' : 'bg-secondary/50'}`}>
          <p className="text-xs text-muted-foreground mb-1">Bana 22</p>
          <p className={`text-lg font-bold ${rwy22.headwind >= 0 ? 'text-green-500' : 'text-destructive'}`}>
            {rwy22.headwind >= 0 ? '+' : ''}{formatValue(rwy22.headwind, 0)} kt
          </p>
          <p className="text-xs text-muted-foreground">{getWindLabel(rwy22.headwind)}</p>
          <p className="text-sm text-foreground mt-1">
            {formatValue(Math.abs(rwy22.crosswind), 0)} kt {getCrosswindLabel(rwy22.crosswind)}
          </p>
        </div>
      </div>

      {/* Recommended runway */}
      <div className="text-center pt-3 border-t border-border/50">
        <p className="text-xs text-muted-foreground">Rekommenderad bana</p>
        <p className="text-2xl font-bold text-primary">{preferredRunway}</p>
      </div>
    </div>
  );
};
