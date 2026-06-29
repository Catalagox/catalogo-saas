"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Check, Zap } from "lucide-react";

export default function SuscripcionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSuscribirse = async () => {
    setLoading(true);

    try {
      // 🔥 Verificar sesión SOLO al intentar pagar
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // ❌ Usuario no logueado
      if (!session) {
        router.push("/auth");
        return;
      }

      // ✅ Usuario logueado → continuar checkout
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
          email: session.user.email,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Error iniciando el pago.");
      }
    } catch (error) {
      console.error(error);
      alert("Error iniciando pago");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#050807] px-6 py-24 md:py-20">
      <div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-400 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-4000" />

      <div className="relative max-w-5xl mx-auto">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[#22c55e] px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
            Acceso Ilimitado
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6">
            Eleva tu negocio al <br />
            <span className="text-[#22c55e]">siguiente nivel</span>
          </h1>

          <p className="text-[#b4b9b5] text-lg max-w-2xl mx-auto font-medium">
            Únete a cientos de restaurantes que ya digitalizaron su experiencia
            con nuestro plan profesional.
          </p>
        </div>

        <div className="max-w-[440px] mx-auto group relative">
          <div className="absolute -inset-0.5 rounded-[42px] bg-gradient-to-r from-emerald-500 via-emerald-400 to-green-600 opacity-40 blur-md group-hover:opacity-100 transition-opacity duration-500 animate-tilt"></div>

          <div className="relative bg-[#0e1412] border border-[#1e261b] rounded-[40px] p-8 md:p-10 shadow-2xl transition-all duration-500 group-hover:-translate-y-1">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#22c55e] text-[#050807] text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
              Recomendado
            </div>

            {/* PRECIO */}
            <div className="text-center mb-10">
              <h3 className="text-[#7f8781] font-bold text-sm uppercase tracking-widest mb-2">
                Plan Pro
              </h3>

              <div className="flex items-baseline justify-center gap-1">
                <span className="text-2xl font-bold text-[#7f8781]">$</span>

                <span className="text-8xl font-black text-white tracking-tighter">
                  5
                </span>

                <span className="text-[#7f8781] font-semibold">/mes</span>
              </div>
            </div>

            {/* CARACTERÍSTICAS */}
            <div className="space-y-4 mb-10">
              {[
                "1 Catalógo Digital Profesional",
                "QR Personalizado de Alta Calidad",
                "Edición de Productos",
                "Soporte Prioritario 24/7",
                "Panel de Administración Pro",
                "Sin Comisiones por Venta",
                "Sin Contratos ni Permanencia",
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 group/item">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20 transition-transform group-hover/item:scale-110">
                    <Check size={14} strokeWidth={3} />
                  </div>

                  <span className="text-[#c4c7c4] font-medium text-[15px]">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* BOTÓN */}
            <button
              onClick={handleSuscribirse}
              disabled={loading}
              className="relative overflow-hidden w-full py-5 rounded-2xl bg-[#22c55e] hover:bg-[#16a34a] text-[#050807] font-bold text-lg shadow-xl transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-70 cursor-pointer"
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
                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-shine" />
              )}
            </button>

            {/* FOOTER */}
            <div className="mt-6 flex items-center justify-center gap-2 text-[#7f8781]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />

              <p className="text-xs font-medium uppercase tracking-tight">
                Garantía de satisfacción
              </p>
            </div>
          </div>
        </div>

        {/* CONTACTO */}
        <p className="text-center text-[#7f8781] mt-10 text-sm">
          ¿Tienes dudas?{" "}
          <Link
            href="/contacto"
            className="text-[#22c55e] font-bold hover:underline"
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
