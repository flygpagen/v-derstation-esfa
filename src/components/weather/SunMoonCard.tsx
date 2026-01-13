import { Sunrise, Sunset, Moon, CloudSun } from 'lucide-react';
import { useMemo } from 'react';
import SunCalc from 'suncalc';

interface SunMoonCardProps {
  sunrise: string;
  sunset: string;
  moonPhase: string;
  moonVisibility: number;
}

// Vinslöv coordinates
const LATITUDE = 56.10;
const LONGITUDE = 13.92;

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
};

export const SunMoonCard = ({ sunrise, sunset, moonPhase, moonVisibility }: SunMoonCardProps) => {
  const { civilDawn, civilDusk, calculatedSunrise, calculatedSunset, moonIllumination, moonPhaseName } = useMemo(() => {
    const now = new Date();
    const times = SunCalc.getTimes(now, LATITUDE, LONGITUDE);
    const moon = SunCalc.getMoonIllumination(now);
    
    // Get moon phase name
    const phase = moon.phase;
    let phaseName = '';
    if (phase < 0.03 || phase >= 0.97) phaseName = 'Nymåne';
    else if (phase < 0.22) phaseName = 'Tilltagande skära';
    else if (phase < 0.28) phaseName = 'Första kvarteret';
    else if (phase < 0.47) phaseName = 'Tilltagande halv';
    else if (phase < 0.53) phaseName = 'Fullmåne';
    else if (phase < 0.72) phaseName = 'Avtagande halv';
    else if (phase < 0.78) phaseName = 'Sista kvarteret';
    else phaseName = 'Avtagande skära';
    
    return {
      civilDawn: formatTime(times.dawn),
      civilDusk: formatTime(times.dusk),
      calculatedSunrise: formatTime(times.sunrise),
      calculatedSunset: formatTime(times.sunset),
      moonIllumination: Math.round(moon.fraction * 100),
      moonPhaseName: phaseName,
    };
  }, []);

  // Use MQTT data if available, otherwise use calculated values
  const displaySunrise = sunrise !== '--:--' ? sunrise : calculatedSunrise;
  const displaySunset = sunset !== '--:--' ? sunset : calculatedSunset;
  const displayMoonPhase = moonPhase || moonPhaseName;
  const displayMoonVisibility = moonVisibility || moonIllumination;

  return (
    <div className="glass-card p-6">
      <div className="flex items-start justify-between mb-6">
        <h3 className="section-title">
          <Moon className="w-5 h-5 text-primary" />
          Sol & Måne
        </h3>
      </div>

      <div className="flex items-center justify-between">
        {/* Sun times */}
        <div className="flex-1 space-y-3">
          {/* Civil dawn */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-400/20 to-purple-400/20">
              <CloudSun className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="stat-label text-xs">Borgerlig gryning</p>
              <p className="stat-value text-base">{civilDawn}</p>
            </div>
          </div>
          
          {/* Sunrise */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-400/20 to-yellow-400/20">
              <Sunrise className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="stat-label text-xs">Soluppgång</p>
              <p className="stat-value text-base">{displaySunrise}</p>
            </div>
          </div>
          
          {/* Sunset */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-400/20">
              <Sunset className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="stat-label text-xs">Solnedgång</p>
              <p className="stat-value text-base">{displaySunset}</p>
            </div>
          </div>
          
          {/* Civil dusk */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-400/20 to-indigo-400/20">
              <CloudSun className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="stat-label text-xs">Borgerlig skymning</p>
              <p className="stat-value text-base">{civilDusk}</p>
            </div>
          </div>
        </div>

        {/* Moon */}
        <div className="flex-1 flex flex-col items-center">
          <div className="relative">
            {/* Moon visualization */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 relative overflow-hidden animate-float">
              {/* Shadow for moon phase */}
              <div 
                className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-900/90"
                style={{ 
                  transform: `translateX(${50 - displayMoonVisibility}%)`,
                }}
              />
              {/* Craters */}
              <div className="absolute w-4 h-4 rounded-full bg-slate-300/50 top-3 left-3" />
              <div className="absolute w-3 h-3 rounded-full bg-slate-300/50 bottom-4 right-5" />
              <div className="absolute w-2 h-2 rounded-full bg-slate-300/50 top-8 left-8" />
            </div>
          </div>
          
          <div className="text-center mt-4">
            <p className="font-medium text-foreground">{displayMoonPhase}</p>
            <p className="text-sm text-muted-foreground">{displayMoonVisibility}% synlig</p>
          </div>
        </div>
      </div>
    </div>
  );
};
