
# Nytt informationskort i botten av dashboarden

## Vad
Ett nytt kort ("footer-kort") längst ner pa dashboarden med:
- Kort beskrivning av sajten (t.ex. "Vaderdata fran ESFA Hassleholms flygplats")
- Lank till flygklubbens hemsida (hlmfk.se)
- Copyright-text (t.ex. "(c) 2026 Hassleholms Flygklubb")

Kortet anvander samma `glass-card`-stil som ovriga kort pa sidan.

## Filandringar

### Ny fil: `src/components/weather/FooterCard.tsx`
- Skapar ett nytt kort-komponent med `glass-card`-klassen
- Innehaller:
  - En kort beskrivningstext om sajten
  - En lank till flygklubbens hemsida (https://hlmfk.se) med extern-lank-ikon
  - Copyright-rad med aktuellt ar
- Texten ar statisk och latt att redigera direkt i komponenten

### Andras: `src/components/WeatherDashboard.tsx`
- Importera `FooterCard`
- Lagga till `<FooterCard />` efter sista grid-sektionen, i botten av dashboarden

## Tekniska detaljer
- Kortet far klassen `glass-card` for att matcha ovriga kort
- Textstorlek och farger foljer befintliga `text-muted-foreground` och `text-foreground`-tokens
- Lanken oppnas i ny flik med `target="_blank"` och `rel="noopener noreferrer"`
