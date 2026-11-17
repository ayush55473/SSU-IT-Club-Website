/**
 * ==============================================================================
 * SSU IT CLUB — VISITOR GEOLOCATION & LOCALE HELPER SERVICE
 * ==============================================================================
 * Provider: ipapi.co (https://ipapi.co/) & Browser Intl API
 * Auth: 100% FREE, NO API KEY REQUIRED, NO CREDIT CARD NEEDED.
 * Purpose: Detects visitor country code (+91 for India) and timezone to auto-format
 *          phone fields in registration forms and present event dates accurately.
 * ==============================================================================
 */

const SESSION_CACHE_KEY = 'ssu_it_club_geo_locale_v1';

// Default locale for Sri Sri University (Odisha, India)
const DEFAULT_LOCALE = {
  countryCode: 'IN',
  countryName: 'India',
  callingCode: '+91',
  city: 'Cuttack',
  region: 'Odisha',
  timezone: 'Asia/Kolkata',
  currency: 'INR'
};

/**
 * Detects visitor geolocation data with session caching and defensive fallback
 * @returns {Promise<Object>}
 */
export async function getVisitorGeoLocale() {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;

  // 1. Session Storage Cache (persists for browser tab session)
  try {
    const cached = sessionStorage.getItem(SESSION_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.callingCode) return parsed;
    }
  } catch {
    // Ignore storage errors
  }

  // 2. Fetch from ipapi.co (Free, No Auth)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const response = await fetch('https://ipapi.co/json/', {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`ipapi returned status ${response.status}`);
    }

    const data = await response.json();
    const result = {
      countryCode: data.country_code || DEFAULT_LOCALE.countryCode,
      countryName: data.country_name || DEFAULT_LOCALE.countryName,
      callingCode: data.country_calling_code || DEFAULT_LOCALE.callingCode,
      city: data.city || DEFAULT_LOCALE.city,
      region: data.region || DEFAULT_LOCALE.region,
      timezone: data.timezone || DEFAULT_LOCALE.timezone,
      currency: data.currency || DEFAULT_LOCALE.currency
    };

    try {
      sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(result));
    } catch {
      // Ignore sessionStorage quota
    }

    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    return DEFAULT_LOCALE;
  }
}
