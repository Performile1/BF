import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Safely access Vite environment variables with fallback for development and test modes
const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : ({} as Record<string, string | undefined>);

export const supabaseUrl = env.VITE_SUPABASE_URL || 'https://mock-project-id.supabase.co';
export const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 'mock-anon-key-placeholder';

export const isSupabaseConfigured = Boolean(
  env.VITE_SUPABASE_URL && 
  env.VITE_SUPABASE_ANON_KEY && 
  env.VITE_SUPABASE_URL !== 'https://mock-project-id.supabase.co'
);

export const supabase = createClient<any>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export { sendBroadcastCampaign, toggleSubscription, deleteAccount } from './apiServices';
