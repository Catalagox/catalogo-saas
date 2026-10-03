"use client";

import {
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { Upload } from "lucide-react";

interface FormLogoProps {
  logo: string;
  subiendoLogo: boolean;
  subirLogo: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export default function FormLogo({
  logo,
  subiendoLogo,
  subirLogo,
}: FormLogoProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const enviandoRef = useRef(false);

  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState("");
  const [logoFallido, setLogoFallido] = useState<string | null>(null);

  const ocupado = subiendoLogo || procesando;
  const mostrarLogo = Boolean(logo) && logoFallido !== logo;

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (ocupado || enviandoRef.current) return;
    if (!event.target.files?.[0]) return;

    const input = event.currentTarget;

    enviandoRef.current = true;
    setProcesando(true);
    setError("");

    try {
      await subirLogo(event);
      setLogoFallido(null);
    } catch (err) {
      console.error("Error subiendo logo:", err);
      setError("No pudimos subir el logo. Inténtalo nuevamente.");
    } finally {
      input.value = "";
      enviandoRef.current = false;
      setProcesando(false);
    }
  };

  return (
    <section
      id="logo"
      aria-label="Logo de la tienda"
      aria-busy={ocupado}
      className="space-y-5 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-5 text-[var(--text-primary)] sm:p-6"
    >
      <div>
        <h2 className="text-xl font-bold">
          Logo de la tienda
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
          Agrega el logo que identifica tu negocio.
        </p>
      </div>

      <div className="flex justify-center">
        {mostrarLogo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logo}
            alt="Logo de tu tienda"
            onError={() => setLogoFallido(logo)}
            className="h-28 w-28 rounded-full border border-[var(--border-card)] bg-[var(--bg-secondary)] object-cover"
          />
        ) : (
          <div className="flex h-28 w-28 items-center justify-center rounded-full border border-dashed border-[var(--border-card)] bg-[var(--bg-secondary)] text-sm text-[var(--text-secondary)]">
            Sin logo
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        disabled={ocupado}
        onChange={(event) => void handleUpload(event)}
        aria-label="Seleccionar logo de la tienda"
        className="hidden"
      />

      <button
        type="button"
        disabled={ocupado}
        onClick={() => inputRef.current?.click()}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-bold text-[var(--color-text-inverse)] transition-colors enabled:hover:bg-[var(--color-primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-wait disabled:opacity-60"
      >
        <Upload size={18} aria-hidden="true" />

        {ocupado
          ? "Subiendo..."
          : logo
            ? "Cambiar logo"
            : "Subir logo"}
      </button>

      {error && (
        <p
          role="alert"
          className="text-sm leading-relaxed text-[var(--color-danger)]"
        >
          {error}
        </p>
      )}
    </section>
  );
}