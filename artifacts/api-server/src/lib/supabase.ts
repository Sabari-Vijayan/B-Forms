import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export function isSupabaseConfigured(): boolean {
  return (
    supabaseUrl.startsWith("https://") &&
    supabaseAnonKey.length > 0 &&
    supabaseServiceKey.length > 0
  );
}

export function createSupabaseClient(accessToken?: string) {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL, " +
      "NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY secrets " +
      "to your project values from supabase.com/dashboard → Project Settings → API."
    );
  }
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
    global: {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    },
  });
}

export function createAdminClient() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL, " +
      "NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY secrets."
    );
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });
}
