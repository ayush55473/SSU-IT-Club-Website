import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if valid credentials are provided
const isValidUrl = (url) => {
  try {
    return Boolean(url && url.startsWith('http') && !url.includes('your-project-id'));
  } catch {
    return false;
  }
};

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  isValidUrl(supabaseUrl) &&
  supabaseAnonKey.length > 20 &&
  !supabaseAnonKey.includes('your-anon-key')
);

// Initialize Supabase Client if configured, otherwise null
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    })
  : null;

export const ADMIN_PASSCODE = import.meta.env.VITE_ADMIN_PASSCODE || 'SSUITCLUB@2026';
