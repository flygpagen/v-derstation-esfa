import { Wind, ArrowRight, ArrowLeft } from 'lucide-react';
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
  const getCrosswindDirection = (crosswind: number) => {
    if (Math.abs(crosswind) < 0.5) return null;
    return crosswind > 0 ? 'right' : 'left';
  };
  return <div className="glass-card p-6 lg:col-span-2">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Wind className="w-5 h-5 text-primary animate-wind" />
        <h3 className="section-title">Vind</h3>
      </div>

      {/* Section 1: Wind Conditions (compact row) */}
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-6 pb-4 border-b border-border/30">
        <span className="text-lg font-bold text-foreground">
          {formatValue(direction, 0)}° {directionText}
        </span>
        <span className="text-lg font-bold text-foreground">
          {formatValue(speed, 0)} kt
          {gust > speed && <span className="text-muted-foreground"> G {formatValue(gust, 0)} kt</span>}
        </span>
        <span className="text-sm text-muted-foreground">{getWindStrength(speed)}</span>
      </div>

      {/* Section 2: Runway Impact (primary focus) */}
      <div className="flex flex-col lg:flex-row gap-6 items-center mb-6">
        {/* Compass with runway and wind */}
        <div className="relative w-56 h-56 flex-shrink-0">
          {/* Compass rose */}
          <div className="absolute inset-0 rounded-full border-2 border-border/30">
            <span className="absolute top-1 left-1/2 -translate-x-1/2 text-xs font-medium text-muted-foreground">N</span>
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs font-medium text-muted-foreground">S</span>
            <span className="absolute left-1 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">V</span>
            <span className="absolute right-1 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">Ö</span>
          </div>

          {/* Runway strip */}
          <div className="absolute left-1/2 top-1/2 w-4 h-36 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-green-700/70" style={{
          transform: `translate(-50%, -50%) rotate(${RUNWAY_04}deg)`
        }}>
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-white/80 rounded-sm" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-white/80 rounded-sm" />
            <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] font-bold text-white" style={{
            transform: `translateX(-50%) rotate(180deg)`
          }}>
              22
            </span>
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-bold text-white">
              04
            </span>
          </div>

          {/* Wind arrow */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{
          transform: `translate(-50%, -50%) rotate(${direction}deg)`
        }}>
            <div className="relative h-16 flex flex-col items-center">
              <div className="w-0.5 h-10 bg-primary" />
              <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[8px] border-t-primary" />
            </div>
          </div>
        </div>

        {/* Runway components side by side */}
        <div className="flex-1 w-full grid grid-cols-2 gap-4">
          {/* Runway 04 */}
          <RunwayCard runway="04" headwind={rwy04.headwind} crosswind={rwy04.crosswind} isPreferred={preferredRunway === '04'} getWindLabel={getWindLabel} getCrosswindDirection={getCrosswindDirection} />
          
          {/* Runway 22 */}
          <RunwayCard runway="22" headwind={rwy22.headwind} crosswind={rwy22.crosswind} isPreferred={preferredRunway === '22'} getWindLabel={getWindLabel} getCrosswindDirection={getCrosswindDirection} />
        </div>
      </div>

      {/* Section 3: Recommended Runway (decision zone) */}
      <div className="items-center justify-between pt-4 border-t border-border/30 flex flex-row">
        <span className="text-muted-foreground text-lg">Rekommenderad bana</span>
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-primary">{preferredRunway}</span>
          <div className="text-xs text-muted-foreground text-right">
            <div className="text-green-500 font-medium">
              +{formatValue(Math.abs(preferredRunway === '04' ? rwy04.headwind : rwy22.headwind), 0)} kt motvind
            </div>
            {Math.abs(preferredRunway === '04' ? rwy04.crosswind : rwy22.crosswind) >= 0.5 && <div>
                {formatValue(Math.abs(preferredRunway === '04' ? rwy04.crosswind : rwy22.crosswind), 0)} kt sidvind
              </div>}
          </div>
        </div>
      </div>
    </div>;
};
interface RunwayCardProps {
  runway: string;
  headwind: number;
  crosswind: number;
  isPreferred: boolean;
  getWindLabel: (headwind: number) => string;
  getCrosswindDirection: (crosswind: number) => 'left' | 'right' | null;
}
const RunwayCard = ({
  runway,
  headwind,
  crosswind,
  isPreferred,
  getWindLabel,
  getCrosswindDirection
}: RunwayCardProps) => {
  const crossDir = getCrosswindDirection(crosswind);
  return <div className={`p-4 rounded-xl text-center transition-colors ${isPreferred ? 'bg-primary/15 ring-1 ring-primary/40' : 'bg-secondary/40'}`}>
      <p className="text-xs text-muted-foreground mb-1">Bana {runway}</p>
      
      {/* Headwind - large and prominent */}
      <p className={`text-2xl font-bold ${headwind >= 0 ? 'text-green-500' : 'text-destructive'}`}>
        {headwind >= 0 ? '+' : ''}{formatValue(headwind, 0)} kt
      </p>
      <p className="text-xs text-muted-foreground mb-2">{getWindLabel(headwind)}</p>
      
      {/* Crosswind with direction arrow */}
      <div className="flex items-center justify-center gap-1 text-sm text-foreground/80">
        {crossDir === 'left' && <ArrowLeft className="w-3 h-3" />}
        <span>{formatValue(Math.abs(crosswind), 0)} kt</span>
        {crossDir === 'right' && <ArrowRight className="w-3 h-3" />}
        {!crossDir && <span className="text-muted-foreground text-xs">—</span>}
      </div>
      {crossDir && <p className="text-xs text-muted-foreground">
          {crossDir === 'right' ? 'från höger' : 'från vänster'}
        </p>}
    </div>;
};