"use client";

import { useRef, useState } from "react";
import { CreditCard } from "lucide-react";

export default function BotonSuscripcionPortal() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const abriendoRef = useRef(false);

  const handleOpenPortal = async () => {
    if (abriendoRef.current) return;

    abriendoRef.current = true;
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
      });

      const data: { url?: string; error?: string } =
        await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || "No se pudo abrir el portal.");
      }

      window.location.assign(data.url);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo abrir el portal.",
      );

      abriendoRef.current = false;
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => void handleOpenPortal()}
        disabled={loading}
        aria-busy={loading}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[var(--border-card)] bg-[var(--bg-secondary)] px-5 py-2.5 text-sm font-semibold text-[var(--text-primary)] transition-colors enabled:hover:border-[var(--color-primary)] enabled:hover:bg-[var(--bg-card-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-wait disabled:opacity-60"
      >
        <CreditCard size={18} className="shrink-0" aria-hidden="true" />

        {loading
          ? "Abriendo portal..."
          : "Gestionar o cancelar suscripción"}
      </button>

      {error && (
        <p
          role="alert"
          className="text-sm leading-relaxed text-[var(--color-danger)]"
        >
          {error}
        </p>
      )}
    </div>
  );
}