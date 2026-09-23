"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";

export default function BotonSuscripcionPortal() {
  const [loading, setLoading] = useState(false);

  const handleOpenPortal = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || "No se pudo abrir el portal.");
      }

      window.location.assign(data.url);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "No se pudo abrir el portal.",
      );
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleOpenPortal}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-5 py-2.5 text-sm font-semibold text-gray-200 transition hover:bg-gray-700 disabled:cursor-wait disabled:opacity-60"
    >
      <CreditCard className="h-4 w-4" />
      {loading ? "Abriendo portal..." : "Gestionar o cancelar suscripción"}
    </button>
  );
}