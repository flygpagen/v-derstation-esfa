

# Rotera bansiffrorna i banriktningen

## Problem
Siffrorna "04" och "22" motroteras just nu (`rotate(-40deg)`) så att de alltid är horisontella. Istället ska de vara vridna i linje med banriktningen — "22" pekar mot 220° och "04" pekar mot 40°.

## Åtgärd

### `src/components/weather/WindCard.tsx`

- **"22" (rad 84-88)**: Siffran sitter i toppen av banan (NE-änden) och ska peka mot 220° (söderut). Rotera 180° relativt banan: `rotate(180deg)` istället för `rotate(-40deg)`.
- **"04" (rad 89-93)**: Siffran sitter i botten (SW-änden) och ska peka mot 40° (norrut). Ta bort motrotationen helt — siffran behöver ingen extra rotation eftersom banan redan är roterad 40°: `rotate(0deg)` / ta bort rotate.

Resultatet: båda siffrorna linjerar med den riktning de indikerar, precis som på en riktig bana.

