"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

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
      // 🔥 Aquí luego conectamos Stripe backend
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error(error);
      alert("Error iniciando pago");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando...
      </div>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-6">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl text-center">

        <h1 className="text-4xl font-extrabold mb-6">
          Suscripción mensual
        </h1>

        <p className="text-gray-600 mb-10">
          Accede a tu menú digital con QR personalizado por solo:
        </p>

        <div className="mb-10">
          <p className="text-6xl font-extrabold">
            $5
          </p>
          <p className="text-gray-500 text-lg">
            por mes
          </p>
        </div>

        <ul className="text-gray-600 space-y-3 mb-10 text-left">
          <li>✔ 1 menú digital</li>
          <li>✔ QR personalizado</li>
          <li>✔ Enlace para compartir</li>
          <li>✔ Edición ilimitada</li>
        </ul>

        <button
          onClick={handleSuscribirse}
          disabled={loading}
          className="w-full py-4 rounded-xl bg-black text-white font-semibold hover:opacity-90 disabled:opacity-50 transition"
        >
          {loading ? "Redirigiendo..." : "Suscribirme ahora"}
        </button>

      </div>
    </section>
  );
}