import { Wind } from 'lucide-react';
import { formatValue } from '@/lib/formatNumber';
interface WindCardProps {
  speed: number;
  gust: number;
  direction: number;
  directionText: string;
}
const RUNWAY_04 = 40;
const RUNWAY_22 = 220;
export const WindCard = ({
  speed,
  gust,
  direction,
  directionText
}: WindCardProps) => {
  const getWindStrength = (speed: number): string => {
    if (speed < 1) return 'Stiltje';
    if (speed < 4) return 'Svag vind';
    if (speed < 8) return 'Måttlig vind';
    if (speed < 14) return 'Frisk vind';
    if (speed < 21) return 'Hård vind';
    if (speed < 28) return 'Mycket hård vind';
    return 'Storm';
  };

  // Calculate wind components for both runway directions
  const calculateWindComponents = (runwayHeading: number) => {
    const relativeAngle = (direction - runwayHeading + 360) % 360 * (Math.PI / 180);
    const headwind = speed * Math.cos(relativeAngle);
    const crosswind = speed * Math.sin(relativeAngle);
    return {
      headwind,
      crosswind
    };
  };
  const rwy04 = calculateWindComponents(RUNWAY_04);
  const rwy22 = calculateWindComponents(RUNWAY_22);
  const preferredRunway = rwy04.headwind >= rwy22.headwind ? '04' : '22';
  const getWindLabel = (headwind: number) => {
    if (headwind > 0.5) return 'Motvind';
    if (headwind < -0.5) return 'Medvind';
    return 'Neutral';
  };
  const getCrosswindLabel = (crosswind: number) => {
    if (Math.abs(crosswind) < 0.5) return '';
    return crosswind > 0 ? 'från höger' : 'från vänster';
  };
  return <div className="glass-card p-6 lg:col-span-2">
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-2">
          <div className="p-2 rounded-xl bg-primary/10">
            <Wind className="w-6 h-6 text-primary animate-wind" />
          </div>
          
        </div>
        <span className="text-muted-foreground text-lg">Vind</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Runway visualization - shows first on mobile */}
        <div className="flex flex-col order-first md:order-last">
          <div className="flex justify-center mb-4">
            <div className="relative w-48 h-48 md:w-40 md:h-40">
              {/* Compass rose background */}
              <div className="absolute inset-0 rounded-full border-2 border-border/30">
                <span className="absolute top-1 left-1/2 -translate-x-1/2 text-sm md:text-xs font-medium text-muted-foreground">N</span>
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-sm md:text-xs font-medium text-muted-foreground">S</span>
                <span className="absolute left-1 top-1/2 -translate-y-1/2 text-sm md:text-xs font-medium text-muted-foreground">V</span>
                <span className="absolute right-1 top-1/2 -translate-y-1/2 text-sm md:text-xs font-medium text-muted-foreground">Ö</span>
              </div>

              {/* Runway strip */}
              <div className="absolute left-1/2 top-1/2 w-3 md:w-2.5 h-32 md:h-28 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-muted-foreground/60" style={{
              transform: `translate(-50%, -50%) rotate(${RUNWAY_04}deg)`
            }}>
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-5 md:w-4 h-1 bg-muted-foreground/80 rounded-sm" />
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 md:w-4 h-1 bg-muted-foreground/80 rounded-sm" />
                
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm md:text-xs font-bold text-foreground" style={{
                transform: `translateX(-50%) rotate(-${RUNWAY_04}deg)`
              }}>
                  04
                </span>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-sm md:text-xs font-bold text-foreground" style={{
                transform: `translateX(-50%) rotate(-${RUNWAY_04}deg)`
              }}>
                  22
                </span>
              </div>

              {/* Wind arrow */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{
              transform: `translate(-50%, -50%) rotate(${direction}deg)`
            }}>
                <div className="relative h-20 md:h-16 flex flex-col items-center">
                  <div className="w-1 md:w-0.5 h-12 md:h-10 bg-primary" />
                  <div className="w-0 h-0 border-l-[6px] md:border-l-[5px] border-l-transparent border-r-[6px] md:border-r-[5px] border-r-transparent border-t-[10px] md:border-t-[8px] border-t-primary" />
                </div>
              </div>
            </div>
          </div>

          {/* Wind components for each runway */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`text-center p-3 md:p-2 rounded-xl ${preferredRunway === '04' ? 'bg-primary/20 ring-1 ring-primary/30' : 'bg-secondary/50'}`}>
              <p className="text-sm md:text-xs text-muted-foreground mb-0.5">Bana 04</p>
              <p className={`text-lg md:text-base font-bold ${rwy04.headwind >= 0 ? 'text-green-500' : 'text-destructive'}`}>
                {rwy04.headwind >= 0 ? '+' : ''}{formatValue(rwy04.headwind, 0)} kt
              </p>
              <p className="text-sm md:text-xs text-muted-foreground">{getWindLabel(rwy04.headwind)}</p>
              <p className="text-sm md:text-xs text-foreground">
                {formatValue(Math.abs(rwy04.crosswind), 0)} kt {getCrosswindLabel(rwy04.crosswind)}
              </p>
            </div>
            <div className={`text-center p-3 md:p-2 rounded-xl ${preferredRunway === '22' ? 'bg-primary/20 ring-1 ring-primary/30' : 'bg-secondary/50'}`}>
              <p className="text-sm md:text-xs text-muted-foreground mb-0.5">Bana 22</p>
              <p className={`text-lg md:text-base font-bold ${rwy22.headwind >= 0 ? 'text-green-500' : 'text-destructive'}`}>
                {rwy22.headwind >= 0 ? '+' : ''}{formatValue(rwy22.headwind, 0)} kt
              </p>
              <p className="text-sm md:text-xs text-muted-foreground">{getWindLabel(rwy22.headwind)}</p>
              <p className="text-sm md:text-xs text-foreground">
                {formatValue(Math.abs(rwy22.crosswind), 0)} kt {getCrosswindLabel(rwy22.crosswind)}
              </p>
            </div>
          </div>

          {/* Recommended runway */}
          <div className="text-center pt-3 md:pt-2 mt-3 md:mt-2 border-t border-border/50">
            <p className="text-sm md:text-xs text-muted-foreground">Rekommenderad bana</p>
            <p className="text-2xl md:text-xl font-bold text-primary">{preferredRunway}</p>
          </div>
        </div>

        {/* Wind stats - shows second on mobile */}
        <div className="flex flex-col justify-center order-last md:order-first">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="stat-label">Styrka</p>
              <p className="text-3xl font-bold text-foreground">{formatValue(speed)} <span className="text-xl font-medium">kt</span></p>
            </div>
            <div>
              <p className="stat-label">Byvind</p>
              <p className="text-3xl font-bold text-foreground">{formatValue(gust)} <span className="text-xl font-medium">kt</span></p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border/50">
            <div>
              <p className="stat-label">Riktning</p>
              <p className="text-3xl font-bold text-foreground">{formatValue(direction, 0)}°</p>
              <p className="text-lg text-muted-foreground">{directionText}</p>
            </div>
            <div>
              <p className="stat-label">Vindstyrka</p>
              <p className="text-xl font-semibold text-foreground">{getWindStrength(speed)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>;
};