import { Thermometer, TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';
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
  return <div className="glass-card p-4 md:p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="section-title">
          <Thermometer className="w-[24px] h-[24px] text-primary" />
          Temperatur
        </h3>
      </div>
      
      {/* Temperature info */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-4xl md:text-5xl font-bold text-foreground">
            {formatValue(temperature)}
            <span className="text-2xl md:text-3xl align-top">°C</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Känns som: <span className="text-foreground font-medium">{formatValue(feelsLike)}°</span>
          </p>
        </div>
        
        
      </div>
      
      {/* Camera stream */}
      {streamUrl && <a href="https://hlmfk.se/webbkameror" target="_blank" rel="noopener noreferrer" className="relative aspect-video rounded-lg overflow-hidden bg-black/20 block hover:ring-2 hover:ring-primary/50 transition-all group">
          <img src={streamUrl} alt="Webbkamera" className="w-full h-full object-cover" />
          <div className="absolute top-2 right-2 bg-black/60 rounded-md p-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
            <ExternalLink className="w-4 h-4 text-white" />
          </div>
        </a>}
    </div>;
};