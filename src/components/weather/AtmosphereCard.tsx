import { Gauge, Droplets, ThermometerSnowflake, Sun, Zap } from 'lucide-react';
import { formatValue } from '@/lib/formatNumber';
interface AtmosphereCardProps {
  barometer: number;
  humidity: number;
  dewpoint: number;
  uvIndex: number;
  solarRadiation: number;
}
export const AtmosphereCard = ({
  barometer,
  humidity,
  dewpoint,
  uvIndex,
  solarRadiation
}: AtmosphereCardProps) => {
  // Calculate QNH and QFE (simplified approximation)
  const qnh = barometer - 1;
  const qfe = barometer - 5;
  return <div className="glass-card p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="p-2 rounded-xl bg-primary/10">
          <Gauge className="w-6 h-6 text-primary" />
        </div>
        <span className="text-muted-foreground text-lg">Atmosfär</span>
      </div>

      <div className="space-y-4">
        {/* Pressure readings */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 rounded-xl bg-secondary/50">
            <p className="stat-label">Barometer</p>
            <p className="stat-value text-base">{formatValue(barometer, 0)}</p>
            <p className="text-xs text-muted-foreground">hPa</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-secondary/50">
            <p className="stat-label">QNH</p>
            <p className="stat-value text-base">{formatValue(qnh, 0)}</p>
            <p className="text-xs text-muted-foreground">hPa</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-secondary/50">
            <p className="stat-label">QFE</p>
            <p className="stat-value text-base">{formatValue(qfe, 0)}</p>
            <p className="text-xs text-muted-foreground">hPa</p>
          </div>
        </div>

        {/* Other readings */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
            <Droplets className="w-5 h-5 text-blue-400" />
            <div>
              <p className="stat-label">Luftfuktighet</p>
              <p className="font-semibold">{formatValue(humidity, 0)}%</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
            <ThermometerSnowflake className="w-5 h-5 text-cyan-400" />
            <div>
              <p className="stat-label">Daggpunkt</p>
              <p className="font-semibold">{formatValue(dewpoint)}°C</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
            <Sun className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="stat-label">UV-index</p>
              <p className="font-semibold">{formatValue(uvIndex)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
            <Zap className="w-5 h-5 text-amber-400" />
            <div>
              <p className="stat-label">Solinstrålning</p>
              <p className="font-semibold">{formatValue(solarRadiation, 0)} W/m²</p>
            </div>
          </div>
        </div>
      </div>
    </div>;
};