"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FaGlobeAmericas, FaStore } from "react-icons/fa";
import SelectorPaises from "@/components/ui/SelectorPaises";
import { supabase } from "@/lib/supabaseClient";

interface OnboardingFormProps {
  initialCountryCode: string;
  nextPath: string;
}

type AnalyticsWindow = Window & {
  gtag?: (
    command: "event",
    eventName: string,
    parameters: Record<string, string>,
  ) => void;
};

function getSafeNext(value: string) {
  if (!value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }

  return value;
}

function translateOnboardingError(message: string) {
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes("duplicate key")) {
    return "Ya existe una tienda asociada con esta cuenta.";
  }

  if (normalizedMessage.includes("al menos 3 caracteres")) {
    return "El nombre de la tienda debe tener al menos 3 caracteres.";
  }

  if (normalizedMessage.includes("superar 80 caracteres")) {
    return "El nombre de la tienda no puede superar 80 caracteres.";
  }

  if (normalizedMessage.includes("país seleccionado")) {
    return "Selecciona un país válido.";
  }

  if (
    normalizedMessage.includes("jwt") ||
    normalizedMessage.includes("iniciar sesión")
  ) {
    return "Tu sesión expiró. Inicia sesión nuevamente.";
  }

  return message || "No pudimos crear tu tienda.";
}

async function trackStoreCreated(countryCode: string) {
  // Esperamos brevemente si Analytics todavía está cargando.
  const deadline = Date.now() + 1500;

  while (Date.now() < deadline) {
    const analyticsWindow = window as AnalyticsWindow;

    if (typeof analyticsWindow.gtag === "function") {
      analyticsWindow.gtag("event", "manual_event_SIGNUP", {
        send_to: "G-181DBYJ8QZ",
        country_code: countryCode,
        registration_step: "store_created",
      });

      return;
    }

    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, 100);
    });
  }
}

export default function OnboardingForm({
  initialCountryCode,
  nextPath,
}: OnboardingFormProps) {
  const router = useRouter();
  const submittingRef = useRef(false);

  const [storeName, setStoreName] = useState("");
  const [countryCode, setCountryCode] = useState(
    initialCountryCode,
  );

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (submittingRef.current) return;

    const normalizedName = storeName.trim();
    const normalizedCountry = countryCode.trim().toUpperCase();
    const destination = getSafeNext(nextPath);

    if (normalizedName.length < 3) {
      setErrorMsg(
        "El nombre de la tienda debe tener al menos 3 caracteres.",
      );
      return;
    }

    if (normalizedName.length > 80) {
      setErrorMsg(
        "El nombre de la tienda no puede superar 80 caracteres.",
      );
      return;
    }

    if (!normalizedCountry) {
      setErrorMsg("Selecciona el país de tu negocio.");
      return;
    }

    submittingRef.current = true;
    setLoading(true);
    setErrorMsg("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        const onboardingPath =
          `/onboarding?next=${encodeURIComponent(destination)}`;

        router.replace(
          `/auth?redirect=${encodeURIComponent(onboardingPath)}`,
        );
        return;
      }

      // Si la tienda ya existe, entramos sin enviar otra conversión.
      const {
        data: existingStore,
        error: existingStoreError,
      } = await supabase
        .from("catalogos")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existingStoreError) throw existingStoreError;

      if (existingStore) {
        router.replace(destination);
        router.refresh();
        return;
      }

      const { error: onboardingError } = await supabase.rpc(
        "completar_onboarding",
        {
          p_nombre: normalizedName,
          p_pais_code: normalizedCountry,
        },
      );

      if (onboardingError) throw onboardingError;

      // Confirmamos que la tienda quedó guardada.
      const {
        data: createdStore,
        error: createdStoreError,
      } = await supabase
        .from("catalogos")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (createdStoreError) throw createdStoreError;

      if (!createdStore) {
        throw new Error(
          "No pudimos confirmar la creación de tu tienda.",
        );
      }

      // Analytics no debe impedir el acceso a una tienda creada.
      try {
        await trackStoreCreated(normalizedCountry);
      } catch (analyticsError) {
        console.warn(
          "No se pudo enviar el evento de tienda creada:",
          analyticsError,
        );
      }

      router.replace(destination);
      router.refresh();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === "object" &&
              error !== null &&
              "message" in error &&
              typeof error.message === "string"
            ? error.message
            : "No pudimos crear tu tienda.";

      setErrorMsg(translateOnboardingError(message));
      submittingRef.current = false;
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl sm:p-8 md:p-10">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
          <FaStore size={24} />
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900">
          Prepara tu tienda
        </h1>

        <p className="mt-3 text-gray-500">
          Completa estos datos para configurar tu moneda y crear
          tu tienda online.
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
        🎉 Tus 7 días de prueba comienzan cuando crees la tienda.
      </div>

      {errorMsg && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600"
        >
          {errorMsg}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-gray-700">
            Nombre de tu tienda
          </span>

          <div className="flex items-center rounded-xl border border-gray-300 bg-white px-4 py-3 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500">
            <FaStore className="mr-3 shrink-0 text-gray-400" />

            <input
              type="text"
              name="storeName"
              value={storeName}
              onChange={(event) =>
                setStoreName(event.target.value)
              }
              placeholder="Ej: Tienda Yelimar"
              minLength={3}
              maxLength={80}
              autoComplete="organization"
              disabled={loading}
              className="w-full bg-transparent text-gray-900 outline-none placeholder:text-gray-400"
              required
            />
          </div>

          <p className="mt-2 text-xs text-gray-500">
            Podrás cambiar este nombre más adelante.
          </p>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-gray-700">
            País de tu negocio
          </span>

          <div className="flex items-center rounded-xl border border-gray-300 bg-white px-4 py-1 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500">
            <FaGlobeAmericas className="mr-3 shrink-0 text-gray-400" />

            <SelectorPaises
              value={countryCode}
              onChange={setCountryCode}
              disabled={loading}
              required
              showPlaceholder
              className="w-full cursor-pointer bg-transparent py-3 text-gray-900 outline-none disabled:cursor-not-allowed"
            />
          </div>

          <p className="mt-2 text-xs text-gray-500">
            Usaremos el país para configurar precios, moneda y
            futuras opciones de pago.
          </p>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#16A34A] py-3 font-semibold text-white transition hover:bg-[#15803D] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Creando tu tienda..."
            : "Crear mi tienda"}
        </button>
      </form>
    </div>
  );
}