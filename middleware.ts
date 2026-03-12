import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Solo se aplica a las rutas privadas
export const config = {
  matcher: ["/dashboard/:path*"],
};

export function middleware(req: NextRequest) {
  // Por ahora no hacemos nada, solo dejamos pasar
  // La autenticación se maneja en tu página /auth o en tu lógica de frontend
  return NextResponse.next();
}