"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { CreditCard } from "lucide-react";

export default function BotonSuscripcionPortal() {
  const [loading, setLoading] = useState(false);

  const handleOpenPortal = async () => {
    try {
      setLoading(true);

      // 1. Obtener la sesión activa del usuario en el navegador
      const { data: { session } } = await supabase.auth.getSession();

      if (!session || !session.access_token) {
        alert("Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.");
        return;
      }

      // 2. Enviar el access_token de forma segura en los headers
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`, // 🔑 Aquí va el token
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al conectar con Stripe");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Ocurrió un error inesperado al abrir el portal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-2">
      <button
        onClick={handleOpenPortal}
        disabled={loading}
        className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200 px-5 py-2.5 rounded-lg font-semibold text-sm transition duration-200 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Conectando con Stripe..." : "Gestionar o cancelar suscripción"}
      </button>
    </div>
  );
}