

# Fix: Dubbel konvertering av molnbas

## Problem
Molnbasen konverteras från meter till fot **två gånger**:
1. I `useJsonWeather.ts` (rad 101): `cloudbase_meter * 3.28084`
2. I `AtmosphereCard.tsx` (rad 28): `cloudBase * 3.28084`

Detta ger 160m x 3.28 x 3.28 = 1730 ft istället for korrekta 527 ft.

## Losning
Ta bort den extra konverteringen i `AtmosphereCard.tsx`. Hooken levererar redan varden i fot, sa kortet ska anvanda vardet direkt.

## Filandringar

### `src/components/weather/AtmosphereCard.tsx`
- Ta bort rad 28: `const cloudBaseFeet = cloudBase * 3.28084;`
- Andra visningen till att anvanda `cloudBase` direkt (som redan ar i fot fran hooken)
- Uppdatera referensen fran `cloudBaseFeet` till `cloudBase` i JSX

## Teknisk detalj
Konverteringen meter till fot sker i `useJsonWeather.ts` och behover inte upprepas. Vardet som kommer in i `AtmosphereCard` via props ar redan i fot.

