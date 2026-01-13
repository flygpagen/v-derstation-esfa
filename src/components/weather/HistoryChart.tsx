import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { HistoryDataPoint } from '@/hooks/useWeatherHistory';
import { formatValue } from '@/lib/formatNumber';

interface HistoryChartProps {
  data: HistoryDataPoint[];
  dataKey: keyof HistoryDataPoint;
  title: string;
  unit: string;
  color: string;
  secondaryDataKey?: keyof HistoryDataPoint;
  secondaryLabel?: string;
  secondaryColor?: string;
}

export const HistoryChart = ({ 
  data, 
  dataKey, 
  title, 
  unit, 
  color,
  secondaryDataKey,
  secondaryLabel,
  secondaryColor,
}: HistoryChartProps) => {
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => formatValue(value)}
              unit={` ${unit}`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))',
              }}
              formatter={(value: number) => [`${formatValue(value)} ${unit}`, title]}
              labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
            />
            {secondaryDataKey && (
              <Legend 
                wrapperStyle={{ paddingTop: '10px' }}
              />
            )}
            <Line 
              type="monotone" 
              dataKey={dataKey as string}
              name={title}
              stroke={color} 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: color }}
            />
            {secondaryDataKey && secondaryColor && (
              <Line 
                type="monotone" 
                dataKey={secondaryDataKey as string}
                name={secondaryLabel || secondaryDataKey as string}
                stroke={secondaryColor} 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                activeDot={{ r: 4, fill: secondaryColor }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
