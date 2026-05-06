import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY ?? "";
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
    const missing = [];
    if (!supabaseUrl.startsWith("https://")) missing.push("SUPABASE_URL (must start with https://)");
    if (!supabaseAnonKey) missing.push("SUPABASE_ANON_KEY");
    if (!supabaseServiceKey) missing.push("SUPABASE_SERVICE_ROLE_KEY");
    
    throw new Error(`Supabase is not configured. Missing: ${missing.join(", ")}`);
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
    throw new Error("Supabase is not configured. Ensure SUPABASE_URL, SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY are set.");
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });
}
