

# Större bana och tydligare vindpil i kompassen

## Ändringar i `src/components/weather/WindCard.tsx`

### Kompassen (rad 69)
- Öka från `w-44 h-44` till `w-56 h-56`

### Banan (rad 79)
- Bredare: `w-3` → `w-4`
- Längre: `h-28` → `h-36`
- Tröskelmarkeringar bredare: `w-4` → `w-5`
- Siffror större: `text-[9px]` → `text-[11px]`

### Vindpilen (rad 95-101)
- Längre skaft: `h-16` → `h-20`, `h-10` → `h-14`
- Tjockare skaft: `w-0.5` → `w-1`
- Större pilspets: `border-l-[5px]`/`border-r-[5px]` → `border-l-[7px]`/`border-r-[7px]`, `border-t-[8px]` → `border-t-[10px]`

