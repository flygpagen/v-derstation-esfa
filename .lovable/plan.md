

# Korrigera banvisningen i vindkompasssen

## Problem
1. **Siffrorna sitter fel**: "04" och "22" är placerade på fel ände. På en riktig bana sitter siffran vid tröskeln – "04" vid sydvästra änden och "22" vid nordöstra änden. Nu är de omvända.
2. **Banans utseende**: Banan ska vara grön (gräsbana) med vita siffror, inte grå.

## Åtgärd

### `src/components/weather/WindCard.tsx`

**Byt plats på siffrorna:**
- "04" flyttas från toppen (NE-änden) till botten (SW-änden)
- "22" flyttas från botten till toppen

**Ändra färger:**
- Banans bakgrund: `bg-muted-foreground/60` → `bg-green-700/70` (grön gräsbana)
- Tröskelmarkeringar: `bg-muted-foreground/80` → `bg-white/80` (vita)
- Siffrornas textfärg: `text-foreground` → `text-white` och placeras **på** banan istället för utanför

