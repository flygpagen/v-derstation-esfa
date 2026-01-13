import { Sun, Moon, MonitorCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/contexts/ThemeContext';

export const ThemeSwitcher = () => {
  const { theme, themeMode, setThemeMode } = useTheme();

  const getIcon = () => {
    if (themeMode === 'auto') {
      return <MonitorCog className="w-4 h-4" />;
    }
    return theme === 'light' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9">
          {getIcon()}
          <span className="sr-only">Byt tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => setThemeMode('auto')}
          className={themeMode === 'auto' ? 'bg-accent' : ''}
        >
          <MonitorCog className="w-4 h-4 mr-2" />
          Auto (sol)
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setThemeMode('light')}
          className={themeMode === 'light' ? 'bg-accent' : ''}
        >
          <Sun className="w-4 h-4 mr-2" />
          Ljust
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setThemeMode('dark')}
          className={themeMode === 'dark' ? 'bg-accent' : ''}
        >
          <Moon className="w-4 h-4 mr-2" />
          Mörkt
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
