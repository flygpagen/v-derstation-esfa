import { CloudSun, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
interface WeatherHeaderProps {
  isConnected: boolean;
  lastUpdated: Date;
}
export const WeatherHeader = ({
  isConnected,
  lastUpdated
}: WeatherHeaderProps) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('sv-SE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  return <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="p-3 glass-card">
          <CloudSun className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
            Aktuellt väder
          </h1>
          <p className="text-muted-foreground text-sm">ESFA Hässleholms flygklubb</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <ThemeSwitcher />
        
        <Button variant="outline" asChild>
          <Link to="/historik" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            Historik
          </Link>
        </Button>
        
        <div className="glass-card px-4 py-2 flex items-center gap-3">
          <div className={`pulse-dot ${!isConnected && 'bg-red-500'}`} />
          <span className="text-sm text-muted-foreground">
            {isConnected ? 'Ansluten' : 'Frånkopplad'} • {formatDate(lastUpdated)}
          </span>
        </div>
      </div>
    </header>;
};