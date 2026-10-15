"use client";

import { useId, useRef, useState } from "react";
import { Save, ArrowRight } from "lucide-react";
import Link from "next/link";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import SelectorPaises from "@/components/ui/SelectorPaises";
import { countriesRegistry, isCountryCode } from "@/lib/countries";

interface FormContactoProps {
  paisCode: string;
  setPaisCode: (val: string) => void;
  whatsapp: string;
  setWhatsapp: (val: string) => void;
  guardarContacto: () => Promise<void>;
}

export default function FormContacto({
  paisCode,
  setPaisCode,
  whatsapp,
  setWhatsapp,
  guardarContacto,
}: FormContactoProps) {
  const id = useId();
  const guardandoRef = useRef(false);

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const codigoNormalizado = (paisCode || "PE").toUpperCase();
  const codigoSeguro = isCountryCode(codigoNormalizado)
    ? codigoNormalizado
    : "PE";

  const datosPais = countriesRegistry[codigoSeguro];

  const limpiarMensajes = () => setError("");

  const handlePaisChange = (nuevoCodigo: string) => {
    if (guardando) return;

    const codigo = nuevoCodigo.toUpperCase();
    if (!isCountryCode(codigo)) return;

    const telefonoActual = whatsapp.replace(/\D/g, "");
    const prefijoAnterior = datosPais.phoneCode.replace(/\D/g, "");
    const prefijoNuevo = countriesRegistry[codigo].phoneCode.replace(/\D/g, "");

    setPaisCode(codigo);

    if (!telefonoActual || telefonoActual === prefijoAnterior) {
      setWhatsapp(prefijoNuevo);
    }

    limpiarMensajes();
  };

  const guardar = async () => {
    if (guardandoRef.current) return;

    setError("");

    if (!isCountryCode(paisCode.toUpperCase())) {
      setError("Selecciona un país válido para tu negocio.");
      return;
    }

    guardandoRef.current = true;
    setGuardando(true);

    try {
      await guardarContacto();
    } catch (err) {
      console.error("Error guardando contacto:", err);
      setError("No pudimos guardar el contacto. Inténtalo nuevamente.");
    } finally {
      guardandoRef.current = false;
      setGuardando(false);
    }
  };


  return (
    <section
      aria-labelledby={`${id}-titulo`}
      aria-busy={guardando}
      className="contacto-theme space-y-5 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-5 text-[var(--text-primary)] sm:p-6"
    >
      <div>
        <h2 id={`${id}-titulo`} className="text-xl font-bold">
          Contacto y país
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
          Configura el país de tu negocio, su moneda y el número de
          WhatsApp donde recibirás tus pedidos.
        </p>
      </div>

      <fieldset
        disabled={guardando}
        className="m-0 min-w-0 space-y-5 border-0 p-0"
      >
        <legend className="sr-only">Datos de contacto</legend>

        <div className="space-y-2">
          <p className="text-sm font-semibold">
            País de tu negocio
          </p>

          <SelectorPaises
            value={codigoSeguro}
            onChange={handlePaisChange}
          />

          <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
            Define la moneda de tu catálogo:{" "}
            <span className="font-semibold text-[var(--text-primary)]">
              {datosPais.currency} ({datosPais.symbol})
            </span>
            .
          </p>
        </div>

        <hr className="border-[var(--border-card)]" />

        <div className="space-y-2">
          <label
            htmlFor={`${id}-whatsapp`}
            className="block text-sm font-semibold"
          >
            WhatsApp
          </label>

          <PhoneInput
            country={codigoSeguro.toLowerCase()}
            value={whatsapp}
            onChange={(telefono) => {
              if (guardando) return;
              setWhatsapp(telefono);
              limpiarMensajes();
            }}
            disabled={guardando}
            enableSearch
            disableSearchIcon
            searchPlaceholder="Buscar país"
            searchNotFound="No se encontraron países"
            inputProps={{
              id: `${id}-whatsapp`,
              name: "whatsapp",
              autoComplete: "tel",
              "aria-describedby": `${id}-whatsapp-ayuda`,
            }}
            containerStyle={{
              width: "100%",
            }}
            inputStyle={{
              width: "100%",
              height: "48px",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-card)",
              color: "var(--text-primary)",
              borderRadius: "12px",
              fontSize: "14px",
            }}
            buttonStyle={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-card)",
              borderRadius: "12px 0 0 12px",
            }}
            dropdownStyle={{
              background: "var(--bg-card)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-card)",
              borderRadius: "12px",
              maxWidth: "100%",
            }}
            searchStyle={{
              background: "var(--bg-secondary)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-card)",
              borderRadius: "8px",
            }}
          />

          <p
            id={`${id}-whatsapp-ayuda`}
            className="text-xs leading-relaxed text-[var(--text-secondary)]"
          >
            Ingresa el número completo con su código de país.
            Puedes cambiar el prefijo desde la bandera.
          </p>
        </div>


        <button
          type="button"
          onClick={() => void guardar()}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-bold text-[var(--color-text-inverse)] transition-colors enabled:hover:bg-[var(--color-primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-wait disabled:opacity-60 sm:w-auto"
        >
          <Save size={18} aria-hidden="true" />
          {guardando ? "Guardando..." : "Guardar contacto"}
        </button>
      </fieldset>

      <Link
        href="/dashboard/tienda-online/editor"
        className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border-card)] bg-[var(--bg-secondary)] p-4 transition-colors hover:bg-[var(--bg-card-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
      >
        <div>
          <p className="text-sm font-semibold">Redes sociales de tu tienda</p>
          <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
            Configura sus enlaces y visibilidad en el editor, en Pie de página.
            Los enlaces que ya tenías guardados se conservan.
          </p>
        </div>
        <ArrowRight size={18} className="shrink-0" aria-hidden="true" />
      </Link>

      {error && (
        <p
          role="alert"
          className="text-sm leading-relaxed text-[var(--color-danger)]"
        >
          {error}
        </p>
      )}

      <style jsx global>{`
        .contacto-theme .react-tel-input .selected-flag,
        .contacto-theme .react-tel-input .flag-dropdown.open,
        .contacto-theme .react-tel-input .flag-dropdown.open .selected-flag {
          background: var(--bg-secondary);
          border-radius: 12px 0 0 12px;
        }

        .contacto-theme .react-tel-input .selected-flag:hover,
        .contacto-theme .react-tel-input .selected-flag:focus,
        .contacto-theme .react-tel-input .country-list .country:hover,
        .contacto-theme .react-tel-input .country-list .country.highlight {
          background: var(--bg-card-hover);
        }

        .contacto-theme .react-tel-input .country-list .search {
          background: var(--bg-card);
        }

        .contacto-theme .react-tel-input .country-list .country .dial-code,
        .contacto-theme .react-tel-input .country-list .no-entries-message {
          color: var(--text-secondary);
        }

        .contacto-theme .react-tel-input .search-box::placeholder {
          color: var(--text-secondary);
        }

        .contacto-theme .react-tel-input .form-control:focus,
        .contacto-theme .react-tel-input .search-box:focus,
        .contacto-theme .react-tel-input .selected-flag:focus-visible {
          outline: 2px solid var(--color-primary);
          outline-offset: 2px;
        }

        .contacto-theme .react-tel-input .selected-flag .arrow {
          border-top-color: var(--text-secondary);
        }

        .contacto-theme .react-tel-input .selected-flag .arrow.up {
          border-top-color: transparent;
          border-bottom-color: var(--text-secondary);
        }

        .contacto-theme .react-tel-input .form-control:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }
      `}</style>
    </section>
  );
}