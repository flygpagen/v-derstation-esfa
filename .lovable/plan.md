

# Heltal for temperatur/daggpunkt + solposition uppdateras vid ny data

## Andringar

### 1. Temperatur och daggpunkt som heltal

**`src/components/weather/TemperatureCard.tsx`**
- Rad 27: `formatValue(temperature)` -> `formatValue(temperature, 0)`
- Rad 31: `formatValue(feelsLike)` -> `formatValue(feelsLike, 0)`

**`src/components/weather/AtmosphereCard.tsx`**
- Rad 65: `formatValue(dewpoint)` -> `formatValue(dewpoint, 0)`

### 2. Solens position uppdateras nar ny data hamtas

Problemet: `useMemo` i `SunMoonCard.tsx` (rad 85) har en tom beroendelista `[]`, sa solens position beraknas bara en gang vid forsta renderingen och uppdateras aldrig.

**`src/components/WeatherDashboard.tsx`**
- Skicka med `lastUpdated` som prop till `SunMoonCard`

**`src/components/weather/SunMoonCard.tsx`**
- Lagg till `lastUpdated: Date` i `SunMoonCardProps`
- Andra `useMemo`-beroendelistan fran `[]` till `[lastUpdated]` sa att solpositionen raknas om varje gang ny vaderdata hamtas (var 30:e sekund)

