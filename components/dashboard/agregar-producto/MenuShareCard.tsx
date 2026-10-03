"use client";

import { useState } from "react";
import QRCode from "react-qr-code";
import { Check, Copy, ExternalLink } from "lucide-react";

export default function MenuShareCard({ slug }: { slug: string }) {
  const [copiado, setCopiado] = useState(false);
  const [copiando, setCopiando] = useState(false);
  const [error, setError] = useState("");

  const slugLimpio = slug.trim();
  const tiendaUrl = `https://www.catalagox.com/${encodeURIComponent(slugLimpio)}`;

  const copiar = async () => {
    if (copiando) return;

    setCopiando(true);
    setCopiado(false);
    setError("");

    try {
      await navigator.clipboard.writeText(tiendaUrl);
      setCopiado(true);
    } catch {
      setError(
        "No pudimos copiar el enlace. Puedes seleccionarlo y copiarlo manualmente.",
      );
    } finally {
      setCopiando(false);
    }
  };

  if (!slugLimpio) {
    return (
      <div className="w-full max-w-md rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6">
        <p className="text-sm text-[var(--text-secondary)]">
          Configura el enlace de tu tienda para poder compartirla.
        </p>
      </div>
    );
  }

  return (
    <section
      aria-label="Compartir tienda"
      className="w-full max-w-md rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-5 text-[var(--text-primary)] shadow-sm sm:p-6"
    >
      <h2 className="text-xl font-bold">
        Comparte tu tienda
      </h2>

      <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
        Tus clientes pueden escanear este código QR o abrir el enlace
        para consultar tus productos.
      </p>

      <div className="my-6 flex justify-center">
        <div className="w-full max-w-[232px] rounded-xl bg-white p-4">
          <QRCode
            value={tiendaUrl}
            size={200}
            bgColor="#ffffff"
            fgColor="#000000"
            title="Código QR de tu tienda"
            style={{
              display: "block",
              width: "100%",
              height: "auto",
            }}
          />
        </div>
      </div>

      <a
        href={tiendaUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir el enlace de tu tienda en una pestaña nueva"
        className="mb-5 block break-all rounded-xl border border-[var(--border-card)] bg-[var(--bg-secondary)] p-3 text-center text-sm text-[var(--text-primary)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
      >
        {tiendaUrl}
      </a>

      <div className="flex flex-col gap-3">
        <a
          href={tiendaUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Ver tienda, se abre en una pestaña nueva"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-bold text-[var(--color-text-inverse)] transition-colors hover:bg-[var(--color-primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
        >
          <ExternalLink size={18} aria-hidden="true" />
          Ver tienda
        </a>

        <button
          type="button"
          onClick={() => void copiar()}
          disabled={copiando}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[var(--border-card)] bg-[var(--bg-secondary)] px-4 py-2.5 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-card-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {copiado ? (
            <Check size={18} aria-hidden="true" />
          ) : (
            <Copy size={18} aria-hidden="true" />
          )}

          {copiando
            ? "Copiando..."
            : copiado
              ? "Enlace copiado"
              : "Copiar enlace"}
        </button>
      </div>

      <p role="status" className="sr-only">
        {copiado ? "Enlace copiado correctamente." : ""}
      </p>

      {error && (
        <p
          role="alert"
          className="mt-3 text-sm leading-relaxed text-[var(--color-danger)]"
        >
          {error}
        </p>
      )}
    </section>
  );
}