import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

function getSafeNext(value: string | null) {
  if (!value) return "/dashboard";

  if (!value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }

  return value;
}

function getAuthErrorUrl(
  request: NextRequest,
  message: string,
) {
  const url = request.nextUrl.clone();

  url.pathname = "/auth";
  url.search = "";
  url.searchParams.set("error", message);

  return url;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const next = getSafeNext(
    request.nextUrl.searchParams.get("next"),
  );

  const providerError =
    request.nextUrl.searchParams.get("error_description") ||
    request.nextUrl.searchParams.get("error");

  if (providerError) {
    return NextResponse.redirect(
      getAuthErrorUrl(
        request,
        "No se pudo completar la autenticación.",
      ),
    );
  }

  if (!code) {
    return NextResponse.redirect(
      getAuthErrorUrl(
        request,
        "El enlace de autenticación no es válido o está incompleto.",
      ),
    );
  }

  const supabase = await createClient();

  const { error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    console.error(
      "Error intercambiando el código de autenticación:",
      exchangeError.message,
    );

    return NextResponse.redirect(
      getAuthErrorUrl(
        request,
        "El enlace expiró o ya fue utilizado. Inténtalo nuevamente.",
      ),
    );
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.redirect(
      getAuthErrorUrl(
        request,
        "No se pudo iniciar la sesión.",
      ),
    );
  }

  return NextResponse.redirect(
    new URL(next, request.nextUrl.origin),
  );
}