/**
 * ==============================================================================
 * SSU IT CLUB — CAMPUS WEATHER API SERVICE (OPEN-METEO)
 * ==============================================================================
 * Provider: Open-Meteo (https://open-meteo.com)
 * Auth: 100% FREE, NO API KEY REQUIRED, NO CREDIT CARD NEEDED.
 * Location: Sri Sri University Campus, Bidyadharpur, Cuttack, Odisha, India
 * Coordinates: 20.4625° N, 85.8830° E
 * ==============================================================================
 */

const CACHE_KEY = 'ssu_it_club_campus_weather_v1';
const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes TTL

// Coordinates for Sri Sri University Main Campus, Cuttack, Odisha
const SSU_COORDINATES = {
  latitude: 20.4625,
  longitude: 85.8830,
  city: 'Cuttack (SSU Campus)',
  state: 'Odisha'
};

// WMO Weather Interpretation Codes (WW)
const WMO_CODE_MAP = {
  0: { label: 'Clear Sky', icon: 'Sun', mood: 'Sunny & Pleasant' },
  1: { label: 'Mainly Clear', icon: 'Sun', mood: 'Fair & Bright' },
  2: { label: 'Partly Cloudy', icon: 'CloudSun', mood: 'Pleasant Clouds' },
  3: { label: 'Overcast', icon: 'Cloud', mood: 'Cloudy Skies' },
  45: { label: 'Foggy', icon: 'CloudFog', mood: 'Misty Campus' },
  48: { label: 'Depositing Rime Fog', icon: 'CloudFog', mood: 'Misty' },
  51: { label: 'Light Drizzle', icon: 'CloudDrizzle', mood: 'Gentle Drizzle' },
  53: { label: 'Moderate Drizzle', icon: 'CloudDrizzle', mood: 'Light Rain' },
  55: { label: 'Dense Drizzle', icon: 'CloudDrizzle', mood: 'Drizzle' },
  61: { label: 'Slight Rain', icon: 'CloudRain', mood: 'Light Showers' },
  63: { label: 'Moderate Rain', icon: 'CloudRain', mood: 'Active Showers' },
  65: { label: 'Heavy Rain', icon: 'CloudRain', mood: 'Heavy Showers' },
  71: { label: 'Slight Snow Fall', icon: 'Snowflake', mood: 'Chilly' },
  80: { label: 'Rain Showers', icon: 'CloudRain', mood: 'Passing Showers' },
  81: { label: 'Moderate Showers', icon: 'CloudRain', mood: 'Rain Showers' },
  82: { label: 'Violent Showers', icon: 'CloudLightning', mood: 'Stormy Rain' },
  95: { label: 'Thunderstorm', icon: 'CloudLightning', mood: 'Thunderstorms' },
  96: { label: 'Thunderstorm with Hail', icon: 'CloudLightning', mood: 'Storm & Hail' },
};

// Fallback campus weather if network or API is unreachable
const DEFAULT_FALLBACK_WEATHER = {
  temperature: 28,
  humidity: 62,
  windSpeed: 8,
  weatherCode: 1,
  condition: 'Mainly Clear',
  mood: 'Fair & Pleasant',
  icon: 'Sun',
  city: 'Cuttack (SSU Campus)',
  lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  isFallback: true
};

/**
 * Fetches real-time weather for Sri Sri University Campus from Open-Meteo
 * @returns {Promise<Object>} Weather payload
 */
export async function getCampusWeather() {
  if (typeof window === 'undefined') return DEFAULT_FALLBACK_WEATHER;

  // 1. Check local cache
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_DURATION_MS && parsed.data) {
        return parsed.data;
      }
    }
  } catch (err) {
    // Ignore localStorage parse errors
  }

  // 2. Fetch from Open-Meteo API (Free, No Key)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${SSU_COORDINATES.latitude}&longitude=${SSU_COORDINATES.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=Asia%2FKolkata`;
    
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Open-Meteo returned status ${response.status}`);
    }

    const data = await response.json();
    const current = data.current || {};
    const code = current.weather_code ?? 0;
    const wmoInfo = WMO_CODE_MAP[code] || WMO_CODE_MAP[0];

    const weatherPayload = {
      temperature: Math.round(current.temperature_2m ?? 27),
      humidity: Math.round(current.relative_humidity_2m ?? 60),
      windSpeed: Math.round(current.wind_speed_10m ?? 7),
      weatherCode: code,
      condition: wmoInfo.label,
      mood: wmoInfo.mood,
      icon: wmoInfo.icon,
      city: SSU_COORDINATES.city,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isFallback: false
    };

    // Cache successful response
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        timestamp: Date.now(),
        data: weatherPayload
      }));
    } catch {
      // localStorage quota or private mode safe
    }

    return weatherPayload;
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn("Using campus weather fallback:", error.message || error);
    return DEFAULT_FALLBACK_WEATHER;
  }
}
