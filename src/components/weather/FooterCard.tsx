import { ExternalLink } from "lucide-react";

export const FooterCard = () => {
  return (
    <div className="glass-card p-6">
      <div className="space-y-3 text-sm text-muted-foreground">
        <p>Väderdata från ESFA – Hässleholms flygplats. Stationen uppdateras var 30:e sekund. Data på denna sida är ej underlag för färdplanering!

        </p>
        <p>
          <a
            href="https://hlmfk.se"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline">

            Hässleholms Flygklubb
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </p>
        <p className="text-xs">© {new Date().getFullYear()} Hässleholms Flygklubb</p>
      </div>
    </div>);

};