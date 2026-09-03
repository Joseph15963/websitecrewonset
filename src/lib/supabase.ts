import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | undefined;

export function getSupabaseClient() {
  if (client) return client;
  const url =
    import.meta.env.VITE_SUPABASE_URL ??
    import.meta.env.NEXT_PUBLIC_SUPABASE_URL ??
    import.meta.env.SUPABASE_URL;
  const key =
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
    import.meta.env.VITE_SUPABASE_ANON_KEY ??
    import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    import.meta.env.SUPABASE_PUBLISHABLE_KEY ??
    import.meta.env.SUPABASE_ANON_KEY;

  if (!url || !key) return null;
  client = createClient(url, key);
  return client;
}
