"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Check, Zap } from "lucide-react";

export default function SuscripcionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    verificarUsuario();
  }, []);

  const verificarUsuario = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/auth");
      return;
    }

    setChecking(false);
  };

  const handleSuscribirse = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
      });

      const data = await response.json();

      if (data.url) window.location.href = data.url;
    } catch (error) {
      console.error(error);
      alert("Error iniciando pago");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mb-4"></div>

        <p className="text-[var(--color-subscription-text)] font-medium animate-pulse">
          Verificando acceso...
        </p>
      </div>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#fafafa] px-6 py-24 md:py-20">
      {/* BLOBS */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />

      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />

      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />

      <div className="relative max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-100 text-[var(--color-primary)] px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
            Acceso Ilimitado
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[var(--color-subscription-title)] mb-6">
            Eleva tu negocio al <br />
            <span className="text-[var(--color-primary)]">siguiente nivel</span>
          </h1>

          <p className="text-[var(--color-subscription-text)] text-lg max-w-2xl mx-auto font-medium">
            Únete a cientos de restaurantes que ya digitalizaron su experiencia
            con nuestro plan profesional.
          </p>
        </div>

        {/* CARD */}
        <div className="max-w-[440px] mx-auto group relative">
          {/* Animated Border */}
          <div className="absolute -inset-0.5 rounded-[42px] bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-400 opacity-75 blur-sm group-hover:opacity-100 transition-opacity duration-500 group-hover:duration-200 animate-tilt"></div>

          <div className="relative bg-white rounded-[40px] p-8 md:p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] transition-all duration-500 group-hover:shadow-[0_48px_80px_-16px_rgba(0,0,0,0.12)] group-hover:-translate-y-1">
            {/* BADGE */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--color-primary)] text-black text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
              Recomendado
            </div>

            {/* PRICE */}
            <div className="text-center mb-10">
              <h3 className="text-[var(--color-subscription-muted)] font-bold text-sm uppercase tracking-widest mb-2">
                Plan Pro
              </h3>

              <div className="flex items-baseline justify-center gap-1">
                <span className="text-2xl font-bold text-[var(--color-subscription-muted)]">
                  $
                </span>

                <span className="text-8xl font-black text-[var(--color-subscription-title)] tracking-tighter">
                  5
                </span>

                <span className="text-[var(--color-subscription-muted)] font-semibold">
                  /mes
                </span>
              </div>
            </div>

            {/* FEATURES */}
            <div className="space-y-4 mb-10">
              {[
                "1 Menú Digital Profesional",
                "QR Personalizado de Alta Calidad",
                "Edición de Platillos Ilimitada",
                "Soporte Prioritario 24/7",
                "Panel de Administración Pro",
                "Sin Comisiones por Venta",
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 group/item">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-white transition-transform group-hover/item:scale-110">
                    <Check size={14} strokeWidth={3} />
                  </div>

                  <span className="text-[var(--color-subscription-text)] font-medium text-[15px]">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* BUTTON */}
            <button
              onClick={handleSuscribirse}
              disabled={loading}
              className="relative overflow-hidden w-full py-5 rounded-2xl bg-[var(--color-primary)] text-black font-bold text-lg shadow-2xl transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-70"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  "Procesando..."
                ) : (
                  <>
                    ¡Empezar ahora!
                    <Zap size={18} className="fill-current" />
                  </>
                )}
              </span>

              {!loading && (
                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shine" />
              )}
            </button>

            {/* FOOTER */}
            <div className="mt-6 flex items-center justify-center gap-2 text-[var(--color-subscription-muted)]">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />

              <p className="text-xs font-medium uppercase tracking-tight">
                Garantía de satisfacción
              </p>
            </div>
          </div>
        </div>

        {/* CONTACT */}
        <p className="text-center text-[var(--color-subscription-muted)] mt-10 text-sm">
          ¿Tienes dudas?{" "}
          <Link
            href="/contacto"
            className="text-[var(--color-primary)] font-bold hover:underline"
          >
            Habla con nosotros
          </Link>
        </p>
      </div>

      <style jsx>{`
        @keyframes shine {
          100% {
            left: 125%;
          }
        }

        .animate-shine {
          animation: shine 1.5s infinite;
        }

        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }

          33% {
            transform: translate(30px, -50px) scale(1.1);
          }

          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }

          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        @keyframes tilt {
          0%,
          50%,
          100% {
            transform: rotate(0deg);
          }

          25% {
            transform: rotate(0.5deg);
          }

          75% {
            transform: rotate(-0.5deg);
          }
        }

        .animate-tilt {
          animation: tilt 10s infinite linear;
        }
      `}</style>
    </section>
  );
}
