"use client";

import { useId, useRef, useState } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";

interface FormPasswordProps {
  password: string;
  setPassword: (val: string) => void;
  cambiarPassword: () => Promise<void>;
}

const campoClassName =
  "min-h-11 w-full rounded-xl border border-[var(--border-card)] bg-[var(--bg-secondary)] px-4 py-3 pr-12 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60";

export default function FormPassword({
  password,
  setPassword,
  cambiarPassword,
}: FormPasswordProps) {
  const id = useId();
  const guardandoRef = useRef(false);

  const [confirmacion, setConfirmacion] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const actualizarPassword = async () => {
    if (guardandoRef.current) return;

    setError("");

    if (!password.trim()) {
      setError("Escribe tu nueva contraseña.");
      return;
    }

    if (password !== confirmacion) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    guardandoRef.current = true;
    setGuardando(true);

    try {
      await cambiarPassword();

      setPassword("");
      setConfirmacion("");
      setMostrarPassword(false);
      setMostrarConfirmacion(false);
    } catch (err) {
      console.error("Error actualizando contraseña:", err);
      setError(
        "No pudimos actualizar la contraseña. Inténtalo nuevamente.",
      );
    } finally {
      guardandoRef.current = false;
      setGuardando(false);
    }
  };

  const campos = [
    {
      clave: "password",
      label: "Nueva contraseña",
      valor: password,
      actualizar: setPassword,
      visible: mostrarPassword,
      alternar: () => setMostrarPassword((actual) => !actual),
    },
    {
      clave: "confirmacion",
      label: "Confirmar nueva contraseña",
      valor: confirmacion,
      actualizar: setConfirmacion,
      visible: mostrarConfirmacion,
      alternar: () => setMostrarConfirmacion((actual) => !actual),
    },
  ];

  return (
    <section
      aria-labelledby={`${id}-titulo`}
      aria-busy={guardando}
      className="space-y-5 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-5 text-[var(--text-primary)] sm:p-6"
    >
      <div>
        <h2 id={`${id}-titulo`} className="text-xl font-bold">
          Cambiar contraseña
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
          Usa una contraseña larga y diferente de la que utilizas
          en otros servicios.
        </p>
      </div>

      {campos.map((campo) => (
        <div key={campo.clave} className="space-y-2">
          <label
            htmlFor={`${id}-${campo.clave}`}
            className="block text-sm font-semibold"
          >
            {campo.label}
          </label>

          <div className="relative">
            <input
              id={`${id}-${campo.clave}`}
              name={campo.clave}
              type={campo.visible ? "text" : "password"}
              autoComplete="new-password"
              autoCapitalize="none"
              spellCheck={false}
              value={campo.valor}
              disabled={guardando}
              placeholder={campo.label}
              aria-describedby={error ? `${id}-error` : undefined}
              onChange={(event) => {
                campo.actualizar(event.target.value);
                setError("");
              }}
              className={campoClassName}
            />

            <button
              type="button"
              disabled={guardando}
              onClick={campo.alternar}
              aria-label={
                campo.visible
                  ? `Ocultar ${campo.label.toLowerCase()}`
                  : `Mostrar ${campo.label.toLowerCase()}`
              }
              aria-controls={`${id}-${campo.clave}`}
              aria-pressed={campo.visible}
              className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-[var(--text-secondary)] transition-colors enabled:hover:bg-[var(--bg-card-hover)] enabled:hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {campo.visible ? (
                <EyeOff size={18} aria-hidden="true" />
              ) : (
                <Eye size={18} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => void actualizarPassword()}
        disabled={guardando}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-bold text-[var(--color-text-inverse)] transition-colors enabled:hover:bg-[var(--color-primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-wait disabled:opacity-60 sm:w-auto"
      >
        <LockKeyhole size={18} aria-hidden="true" />
        {guardando ? "Actualizando..." : "Actualizar contraseña"}
      </button>

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-sm leading-relaxed text-[var(--color-danger)]"
        >
          {error}
        </p>
      )}
    </section>
  );
}