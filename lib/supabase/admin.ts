import "server-only";

import { createClient } from "@supabase/supabase-js";

/**
 * Cliente administrativo de Supabase.
 *
 * IMPORTANTE:
 * - Solo puede utilizarse en Route Handlers, Server Actions
 *   y otros archivos que se ejecuten exclusivamente en el servidor.
 * - Nunca debe importarse desde un componente con "use client".
 * - Utiliza una clave secreta que omite las políticas RLS.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "Falta la variable NEXT_PUBLIC_SUPABASE_URL",
    );
  }

  if (!supabaseServiceRoleKey) {
    throw new Error(
      "Falta la variable SUPABASE_SERVICE_ROLE_KEY",
    );
  }

  return createClient(
    supabaseUrl,
    supabaseServiceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    },
  );
}