import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY",
  );
}

/*
 * Una sola instancia para todos los componentes del navegador.
 * @supabase/ssr administra la sesión mediante cookies.
 */
export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey,
);

export function createClient() {
  return supabase;
}