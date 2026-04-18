import { createClient } from "@supabase/supabase-js";

const supabaseUrl = readRequiredEnv("VITE_SUPABASE_URL");
const supabasePublishableKey =
  readOptionalEnv("VITE_SUPABASE_PUBLISHABLE_KEY") ??
  readOptionalEnv("VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY") ??
  readOptionalEnv("VITE_SUPABASE_ANON_KEY");

if (!supabasePublishableKey) {
  throw new Error(
    "Missing Supabase browser key. Set VITE_SUPABASE_PUBLISHABLE_KEY or VITE_SUPABASE_ANON_KEY.",
  );
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    autoRefreshToken: true,
    detectSessionInUrl: true,
    persistSession: true,
  },
});

function readRequiredEnv(key: keyof ImportMetaEnv) {
  const value = readOptionalEnv(key);
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

function readOptionalEnv(key: keyof ImportMetaEnv) {
  const value = import.meta.env[key];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
