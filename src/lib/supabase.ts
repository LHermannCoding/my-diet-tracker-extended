import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function createSupabaseClient(supabaseToken?: string) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: supabaseToken
        ? { Authorization: `Bearer ${supabaseToken}` }
        : {},
    },
  });
}
