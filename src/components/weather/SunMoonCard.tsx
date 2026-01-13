import { Sunrise, Sunset, Moon } from 'lucide-react';

interface SunMoonCardProps {
  sunrise: string;
  sunset: string;
  moonPhase: string;
  moonVisibility: number;
}

export const SunMoonCard = ({ sunrise, sunset, moonPhase, moonVisibility }: SunMoonCardProps) => {
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
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-400/20 to-yellow-400/20">
              <Sunrise className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <p className="stat-label">Soluppgång</p>
              <p className="stat-value">{sunrise}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-400/20">
              <Sunset className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="stat-label">Solnedgång</p>
              <p className="stat-value">{sunset}</p>
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
                  transform: `translateX(${50 - moonVisibility}%)`,
                }}
              />
              {/* Craters */}
              <div className="absolute w-4 h-4 rounded-full bg-slate-300/50 top-3 left-3" />
              <div className="absolute w-3 h-3 rounded-full bg-slate-300/50 bottom-4 right-5" />
              <div className="absolute w-2 h-2 rounded-full bg-slate-300/50 top-8 left-8" />
            </div>
          </div>
          
          <div className="text-center mt-4">
            <p className="font-medium text-foreground">{moonPhase}</p>
            <p className="text-sm text-muted-foreground">{moonVisibility}% synlig</p>
          </div>
        </div>
      </div>
    </div>
  );
};
