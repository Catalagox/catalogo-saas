"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
// 📥 Importamos el componente tipado de forma limpia
import PricingCard from "@/components/marketing/PricingCard";

export default function SuscripcionPage() {
  const router = useRouter();
  
  // 🎯 Definimos explícitamente que el estado almacena un string
  const [loadingPlan, setLoadingPlan] = useState<string>(""); 

  // 🎯 Restringimos planType para que solo acepte "monthly" o "annual"
  const handleSuscribirse = async (planType: "monthly" | "annual") => {
    setLoadingPlan(planType);

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
          planType: planType, 
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
      setLoadingPlan("");
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#050807] px-6 py-24 md:py-20">
      {/* Animaciones de fondo originales */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-400 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-4000" />

      <div className="relative max-w-5xl mx-auto">
        
        {/* Encabezado */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[#22c55e] px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
            Acceso Ilimitado
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6">
            Eleva tu negocio al <br />
            <span className="text-[#22c55e]">siguiente nivel</span>
          </h1>

          <p className="text-[#b4b9b5] text-lg max-w-2xl mx-auto font-medium">
            Únete a cientos de negocios que ya digitalizaron su experiencia
            con nuestro plan profesional.
          </p>
        </div>

        {/* 📊 Cuadrícula que renderiza ambas tarjetas de manera independiente */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          
          {/* Formulario 1: Plan Mensual */}
          <PricingCard
            title="Plan Pro Mensual"
            price="5"
            period="/mes"
            badgeText="Recomendado"
            badgeColor="bg-[#1e261b] text-[#22c55e] border border-[#22c55e]/20"
            isLoading={loadingPlan === "monthly"}
            isDisabled={loadingPlan !== ""}
            onSubmit={() => handleSuscribirse("monthly")}
          />

          {/* Formulario 2: Plan Anual */}
          <PricingCard
            title="Plan Pro Anual"
            price="54"
            period="/año"
            badgeText="Ahorra 10% - Mejor Valor"
            badgeColor="bg-[#22c55e] text-[#050807]"
            isPopular={true}
            subPriceText="Equivale a $4.50 al mes"
            isLoading={loadingPlan === "annual"}
            isDisabled={loadingPlan !== ""}
            onSubmit={() => handleSuscribirse("annual")}
          />

        </div>

        {/* Contacto */}
        <p className="text-center text-[#7f8781] mt-16 text-sm">
          ¿Tienes dudas?{" "}
          <Link
            href="/contacto"
            className="text-[#22c55e] font-bold hover:underline"
          >
            Habla con nosotros
          </Link>
        </p>
      </div>

      {/* Estilos CSS Globales */}
      <style jsx>{`
        @keyframes shine { 100% { left: 125%; } }
        .animate-shine { animation: shine 1.5s infinite; }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        @keyframes tilt {
          0%, 50%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(0.5deg); }
          75% { transform: rotate(-0.5deg); }
        }
        .animate-tilt { animation: tilt 10s infinite linear; }
      `}</style>
    </section>
  );
}