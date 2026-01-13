import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HistoryChart } from '@/components/weather/HistoryChart';
import { useWeatherContext } from '@/contexts/WeatherContext';

const History = () => {
  const { history } = useWeatherContext();

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
              Historik
            </h1>
            <p className="text-muted-foreground text-sm">
              Temperatur och vindhastighet över tid
            </p>
          </div>
        </header>

        {history.length < 2 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-muted-foreground">
              Samlar in data... Historiken visas när tillräckligt med mätpunkter har samlats in.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              ({history.length} av minst 2 datapunkter)
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            <HistoryChart 
              data={history} 
              dataKey="temperature" 
              title="Temperatur" 
              unit="°C" 
              color="hsl(var(--primary))"
            />
            <HistoryChart 
              data={history} 
              dataKey="windSpeed" 
              title="Vindhastighet" 
              unit="knop" 
              color="hsl(142, 76%, 36%)"
              secondaryDataKey="windGust"
              secondaryLabel="Byvind"
              secondaryColor="hsl(142, 76%, 56%)"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
