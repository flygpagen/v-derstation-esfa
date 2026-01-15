import { Sunrise, Sunset, Sun, CloudSun, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useMemo } from 'react';
import SunCalc from 'suncalc';
import { LATITUDE, LONGITUDE } from '@/lib/constants';
interface SunMoonCardProps {
  sunrise: string;
  sunset: string;
}
const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('sv-SE', {
    hour: '2-digit',
    minute: '2-digit'
  });
};
const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h ${mins}m`;
};
const formatDifference = (minutes: number): string => {
  const sign = minutes >= 0 ? '+' : '';
  const absMinutes = Math.abs(minutes);
  if (absMinutes < 60) {
    return `${sign}${Math.round(minutes)}m`;
  }
  const hours = Math.floor(absMinutes / 60);
  const mins = Math.round(absMinutes % 60);
  return `${sign}${minutes >= 0 ? '' : '-'}${hours}h ${mins}m`;
};
export const SunMoonCard = ({
  sunrise,
  sunset
}: SunMoonCardProps) => {
  const {
    civilDawn,
    civilDusk,
    calculatedSunrise,
    calculatedSunset,
    dawnTime,
    sunriseTime,
    sunsetTime,
    duskTime,
    currentSunPosition,
    dayLength,
    dayLengthDiff
  } = useMemo(() => {
    const now = new Date();
    const times = SunCalc.getTimes(now, LATITUDE, LONGITUDE);

    // Calculate yesterday's times for comparison
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayTimes = SunCalc.getTimes(yesterday, LATITUDE, LONGITUDE);

    // Calculate day length in minutes
    const todayDayLength = (times.sunset.getTime() - times.sunrise.getTime()) / 60000;
    const yesterdayDayLength = (yesterdayTimes.sunset.getTime() - yesterdayTimes.sunrise.getTime()) / 60000;
    const diff = todayDayLength - yesterdayDayLength;

    // Calculate sun position as percentage through the day (dawn to dusk)
    const dawnMs = times.dawn.getTime();
    const duskMs = times.dusk.getTime();
    const nowMs = now.getTime();
    let sunPosition = 0;
    if (nowMs < dawnMs) {
      sunPosition = 0; // Before dawn
    } else if (nowMs > duskMs) {
      sunPosition = 1; // After dusk
    } else {
      sunPosition = (nowMs - dawnMs) / (duskMs - dawnMs);
    }
    return {
      civilDawn: formatTime(times.dawn),
      civilDusk: formatTime(times.dusk),
      calculatedSunrise: formatTime(times.sunrise),
      calculatedSunset: formatTime(times.sunset),
      dawnTime: times.dawn,
      sunriseTime: times.sunrise,
      sunsetTime: times.sunset,
      duskTime: times.dusk,
      currentSunPosition: sunPosition,
      dayLength: todayDayLength,
      dayLengthDiff: diff
    };
  }, []);

  // Calculate relative positions on the curve (0-1)
  const getRelativePosition = (time: Date) => {
    const dawnMs = dawnTime.getTime();
    const duskMs = duskTime.getTime();
    return (time.getTime() - dawnMs) / (duskMs - dawnMs);
  };
  const sunrisePos = getRelativePosition(sunriseTime);
  const sunsetPos = getRelativePosition(sunsetTime);

  // Fixed positions for key points
  const horizonY = 65;
  const belowHorizonY = 78;
  
  // Dawn and dusk are below horizon, sunrise and sunset are on horizon
  const dawnPoint = { x: 10, y: belowHorizonY };
  const sunrisePoint = { x: 10 + sunrisePos * 280, y: horizonY };
  const sunsetPoint = { x: 10 + sunsetPos * 280, y: horizonY };
  const duskPoint = { x: 290, y: belowHorizonY };

  // Calculate point on the sun path for current position
  const getPointOnPath = (t: number) => {
    // The path goes: dawn (below) -> sunrise (horizon) -> peak (top) -> sunset (horizon) -> dusk (below)
    if (t <= sunrisePos) {
      // Dawn to sunrise segment (below horizon rising to horizon)
      const segmentT = t / sunrisePos;
      const x = dawnPoint.x + segmentT * (sunrisePoint.x - dawnPoint.x);
      const y = dawnPoint.y + segmentT * (sunrisePoint.y - dawnPoint.y);
      return { x, y };
    } else if (t >= sunsetPos) {
      // Sunset to dusk segment (horizon descending to below horizon)
      const segmentT = (t - sunsetPos) / (1 - sunsetPos);
      const x = sunsetPoint.x + segmentT * (duskPoint.x - sunsetPoint.x);
      const y = sunsetPoint.y + segmentT * (duskPoint.y - sunsetPoint.y);
      return { x, y };
    } else {
      // Sunrise to sunset - arc above horizon
      const arcT = (t - sunrisePos) / (sunsetPos - sunrisePos);
      // Quadratic Bezier from sunrise through peak to sunset
      const P0 = sunrisePoint;
      const P1 = { x: (sunrisePoint.x + sunsetPoint.x) / 2, y: 5 }; // Control point at peak
      const P2 = sunsetPoint;
      const oneMinusT = 1 - arcT;
      const x = oneMinusT * oneMinusT * P0.x + 2 * oneMinusT * arcT * P1.x + arcT * arcT * P2.x;
      const y = oneMinusT * oneMinusT * P0.y + 2 * oneMinusT * arcT * P1.y + arcT * arcT * P2.y;
      return { x, y };
    }
  };

  const currentPoint = getPointOnPath(currentSunPosition);
  
  // Build the SVG path: dawn -> sunrise (line), sunrise -> sunset (arc), sunset -> dusk (line)
  const midX = (sunrisePoint.x + sunsetPoint.x) / 2;
  const sunPath = `M ${dawnPoint.x} ${dawnPoint.y} L ${sunrisePoint.x} ${sunrisePoint.y} Q ${midX} 5 ${sunsetPoint.x} ${sunsetPoint.y} L ${duskPoint.x} ${duskPoint.y}`;

  // Use MQTT data if available, otherwise use calculated values
  const displaySunrise = sunrise !== '--:--' ? sunrise : calculatedSunrise;
  const displaySunset = sunset !== '--:--' ? sunset : calculatedSunset;

  // Check if sun is currently above horizon
  const isSunUp = currentSunPosition > 0 && currentSunPosition < 1;
  return <div className="glass-card p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="section-title">
          <Sun className="w-5 h-5 text-primary" />
          Sol
        </h3>
      </div>

      <div className="space-y-4">
        {/* Sun path visualization */}
        <div className="w-full">
          <svg viewBox="0 0 300 100" className="w-full h-28 rounded-xl">
            <defs>
              {/* Sky gradient */}
              <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
              </linearGradient>
              {/* Ground gradient */}
              <linearGradient id="groundGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#16a34a" stopOpacity="0.6" />
              </linearGradient>
              {/* Sun glow */}
              <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" />
                <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </radialGradient>
            </defs>
            
            {/* Sky background */}
            <rect x="0" y="0" width="300" height="65" fill="url(#skyGradient)" rx="4" />
            
            {/* Ground/horizon */}
            <rect x="0" y="65" width="300" height="35" fill="url(#groundGradient)" rx="0" />
            <line x1="0" y1="65" x2="300" y2="65" stroke="hsl(var(--border))" strokeWidth="1" strokeOpacity="0.5" />
            
            {/* Sun path (dashed) */}
            <path d={sunPath} stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" strokeDasharray="4 3" fill="none" strokeOpacity="0.4" />
            
            {/* Dawn point (below horizon) */}
            <circle cx={dawnPoint.x} cy={dawnPoint.y} r="4" fill="#818cf8" />
            <text x={dawnPoint.x + 12} y={dawnPoint.y + 3} fontSize="7" fill="hsl(var(--muted-foreground))" textAnchor="start">
              {civilDawn}
            </text>
            
            {/* Sunrise point (on horizon) */}
            <circle cx={sunrisePoint.x} cy={sunrisePoint.y} r="4" fill="#f97316" />
            <text x={sunrisePoint.x} y={sunrisePoint.y - 8} fontSize="7" fill="hsl(var(--muted-foreground))" textAnchor="middle">
              {displaySunrise}
            </text>
            
            {/* Sunset point (on horizon) */}
            <circle cx={sunsetPoint.x} cy={sunsetPoint.y} r="4" fill="#f97316" />
            <text x={sunsetPoint.x} y={sunsetPoint.y - 8} fontSize="7" fill="hsl(var(--muted-foreground))" textAnchor="middle">
              {displaySunset}
            </text>
            
            {/* Dusk point (below horizon) */}
            <circle cx={duskPoint.x} cy={duskPoint.y} r="4" fill="#a78bfa" />
            <text x={duskPoint.x - 12} y={duskPoint.y + 3} fontSize="7" fill="hsl(var(--muted-foreground))" textAnchor="end">
              {civilDusk}
            </text>
            
            {/* Current sun position */}
            {isSunUp && <>
                <circle cx={currentPoint.x} cy={currentPoint.y} r="12" fill="url(#sunGlow)" />
                <circle cx={currentPoint.x} cy={currentPoint.y} r="6" fill="#fbbf24" />
              </>}
          </svg>
        </div>

        {/* Day length display */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-500" />
            <span className="text-sm text-muted-foreground">Dagslängd</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">{formatDuration(dayLength)}</span>
            <div className={`flex items-center gap-0.5 text-xs ${dayLengthDiff > 0 ? 'text-green-500' : dayLengthDiff < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
              {dayLengthDiff > 0 ? <TrendingUp className="w-3 h-3" /> : dayLengthDiff < 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
              <span>{formatDifference(dayLengthDiff)}</span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-400" />
              <span className="text-muted-foreground">Borgerlig gryning</span>
            </div>
            <span className="font-medium text-foreground">{civilDawn}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-muted-foreground">Soluppgång</span>
            </div>
            <span className="font-medium text-foreground">{displaySunrise}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-muted-foreground">Solnedgång</span>
            </div>
            <span className="font-medium text-foreground">{displaySunset}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-400" />
              <span className="text-muted-foreground">Borgerlig skymning</span>
            </div>
            <span className="font-medium text-foreground">{civilDusk}</span>
          </div>
        </div>
      </div>
    </div>;
};