

# Plan: Ersätt MQTT med JSON-polling

## Sammanfattning
Ersätt MQTT-anslutningen med regelbunden hämtning av `/wx/loop.json` var 30:e sekund.

## JSON-datakälla
- **URL:** `/wx/loop.json`
- **Uppdateringsintervall:** 30 sekunder

## Datamappning

| JSON-fält | WeatherData-fält | Konvertering |
|-----------|------------------|--------------|
| `outTemp_C` | `temperature` | Direkt |
| `windchill_C` | `feelsLike` | Direkt |
| `windSpeed_mps` | `windSpeed` | × 1.94384 (m/s → knop) |
| `windGust_mps` | `windGust` | × 1.94384 (m/s → knop) |
| `windDir` | `windDirection` | Direkt + beräkna riktningstext |
| `pressure_mbar` | `barometer` | Direkt |
| `outHumidity` | `humidity` | Direkt |
| `dewpoint_C` | `dewpoint` | Direkt |
| `UV` | `uvIndex` | Direkt |
| `radiation_Wpm2` | `solarRadiation` | Direkt |
| `cloudbase_meter` | `cloudBase` | × 3.28084 (m → ft) |
| `rain_mm` | `rainDay` | Direkt |
| `rainRate_mm_per_hour` | `rainRate` | Direkt |
| `dateTime` | `lastUpdated` | Unix timestamp → Date |

## Filändringar

### 1. Skapa: `src/hooks/useJsonWeather.ts`
Ny hook som:
- Hämtar `/wx/loop.json` var 30:e sekund
- Konverterar vindenheter (m/s → knop)
- Konverterar molnbas (m → ft)
- Hanterar null-värden
- Beräknar vindriktningstext (N, NÖ, Ö, etc.)

### 2. Uppdatera: `src/contexts/WeatherContext.tsx`
- Byt import till `useJsonWeather`

### 3. Uppdatera: `src/components/weather/WeatherHeader.tsx`
- Justera statustext för JSON-källa

### 4. Radera: `src/hooks/useMqttWeather.ts`
- Inte längre behövd

### 5. Ta bort mqtt från `package.json`
- Minskar bundle-storlek med ~50KB

## Tekniska detaljer

**Konverteringar:**
- m/s → knop: `värde × 1.94384`
- meter → fot: `värde × 3.28084`

**Felhantering:**
- Behåller senaste data vid fetch-fel
- Visar "Ej ansluten" i headern vid problem

