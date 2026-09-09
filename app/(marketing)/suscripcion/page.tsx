"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
// 📥 Importamos el componente tipado de forma limpia
import PricingCard from "@/components/marketing/PricingCard";

// 🎯 Declaración para que TypeScript reconozca el objeto window.gtag de Google
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function SuscripcionPage() {
  const router = useRouter();

  // 🎯 Estado para rastrear cuál plan está procesando el pago
  const [loadingPlan, setLoadingPlan] = useState<string>("");

  // 🎯 Restringimos planType para que solo acepte "monthly" o "annual"
  const handleSuscribirse = async (planType: "monthly" | "annual") => {
    setLoadingPlan(planType);

    try {
      // 🔥 Verificar sesión SOLO al intentar pagar
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // ❌ Usuario no logueado → Redirigir a registro/login
      if (!session) {
        router.push("/auth");
        return;
      }

      // ✅ Usuario logueado → Continuar al Checkout
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
          email: session.user.email,
          planType: planType,
        }),
      });

      const data = await response.json();

      if (data.url) {
        // 🎯 Disparo del evento de conversión en Google Ads
        if (typeof window !== "undefined" && window.gtag) {
          window.gtag("event", "manual_event_SIGNUP", {});
        }

        window.location.href = data.url;
      } else {
        alert(data.error || "Ocurrió un error al iniciar el proceso de pago.");
      }
    } catch (error) {
      console.error("Error en la suscripción:", error);
      alert("Ocurrió un error al conectar con el servidor de pago.");
    } finally {
      setLoadingPlan("");
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 px-6 py-24 md:py-20">
      {/* Resplandores luminosos de fondo sobre fondo claro */}
      <div className="absolute top-0 -left-10 w-96 h-96 bg-emerald-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob pointer-events-none" />
      <div className="absolute top-10 -right-10 w-96 h-96 bg-green-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000 pointer-events-none" />
      <div className="absolute -bottom-10 left-20 w-96 h-96 bg-teal-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto z-10">
        {/* Encabezado Principal adaptado al nuevo posicionamiento de Tiendas Online */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-6 shadow-xs">
            Crea tu Tienda Online • CatalagoX
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-6">
            Lleva tu tienda online al <br />
            <span className="text-emerald-600">siguiente nivel</span>
          </h1>

          <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Publica tus productos, gestiona tus ventas y recibe pedidos por WhatsApp
            con tu propia tienda virtual profesional.
          </p>
        </div>

        {/* 📊 Tarjetas de Precios Renderizadas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {/* Plan Pro Mensual */}
          <PricingCard
            title="Plan Pro Mensual"
            price="10"
            period="/mes"
            badgeText="Opción Flexible"
            badgeColor="bg-emerald-50 text-emerald-700 border border-emerald-200"
            isLoading={loadingPlan === "monthly"}
            isDisabled={loadingPlan !== ""}
            onSubmit={() => handleSuscribirse("monthly")}
          />

          {/* Plan Pro Anual */}
          <PricingCard
            title="Plan Pro Anual"
            price="108"
            period="/año"
            badgeText="Ahorra 10% - Más Popular"
            badgeColor="bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
            isPopular={true}
            subPriceText="Equivale a solo $9.00 al mes"
            isLoading={loadingPlan === "annual"}
            isDisabled={loadingPlan !== ""}
            onSubmit={() => handleSuscribirse("annual")}
          />
        </div>

        {/* Enlace de Soporte */}
        <p className="text-center text-slate-500 mt-16 text-sm">
          ¿Tienes alguna duda sobre nuestras tiendas online?{" "}
          <Link
            href="/contacto"
            className="text-emerald-600 font-bold hover:underline transition-colors"
          >
            Habla con nuestro equipo
          </Link>
        </p>
      </div>

      {/* Estilos para animaciones suaves de fondo */}
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
            transform: translate(30px, -30px) scale(1.05);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.95);
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