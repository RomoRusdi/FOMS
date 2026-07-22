export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * When Supabase env vars are absent the app runs in DEMO mode: the data layer
 * serves the design's sample data and auth is bypassed, so `npm run dev` shows
 * the hi-fi screens immediately. Provide the two NEXT_PUBLIC_SUPABASE_* vars to
 * switch to the real backend.
 */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
