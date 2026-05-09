import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// No module-level caching of the client — Vercel function instances persist
// across requests, and a cached client could in principle hold stale state.
// Creating fresh per-call is cheap and rules out an entire class of "why does
// the deployed page see different data than my curl?" debugging.
export function getSupabaseClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set.",
    );
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  });
}
