"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function RedirectIfLoggedIn() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // 1. Verificación e listener oficial de sesión en Supabase
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.replace("/dashboard");
      } else {
        setCheckingAuth(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  // Loader ULTRA MODERNO & MINIMALISTA
  if (checkingAuth) {
    return (
      <div className="fixed inset-0 z-[200] bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 flex flex-col items-center justify-center transition-colors">
        
        {/* BARRA DE CARGA SUPERIOR ULTRA FINA (ESTILO VERCEL / NEXT.JS) */}
        <div className="fixed top-0 left-0 w-full h-[3px] bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
          <div className="h-full bg-emerald-500 w-full animate-[shimmer_1.5s_infinite_linear] origin-left bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500" />
        </div>

        {/* LOGO DE BRANDING CON EFECTO RESPIRACIÓN/PULSO */}
        <div className="flex flex-col items-center gap-3 animate-fade-in">
          <div className="relative flex items-center justify-center">
            {/* Resplandor ambiental posterior */}
            <div className="absolute w-16 h-16 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
            
            {/* Texto o Isotipo del Logotipo */}
            <span className="text-2xl font-black tracking-tighter relative select-none">
              Catalogox
            </span>
          </div>

          {/* INDICADOR DE CARGA SUTIL */}
          <div className="flex items-center gap-1.5 pt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
          </div>
        </div>

      </div>
    );
  }

  return null;
}