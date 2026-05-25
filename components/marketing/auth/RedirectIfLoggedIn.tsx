"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function RedirectIfLoggedIn() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        // Si ya está logueado, va directo al dashboard
        router.replace("/dashboard");
      } else {
        // Si no, quitamos la pantalla de carga para que vea la landing
        setCheckingAuth(false);
      }
    };

    checkUser();
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="fixed inset-0 z-[200] bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-semibold text-slate-500 animate-pulse">
          Cargando CatalogoX...
        </p>
      </div>
    );
  }

  // Si no está logueado, no renderiza nada y permite ver la página
  return null;
}
