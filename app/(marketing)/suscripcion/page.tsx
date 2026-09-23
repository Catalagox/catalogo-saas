"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import PricingCard from "@/components/marketing/PricingCard";
import BotonSuscripcionPortal from "@/components/dashboard/ajustes/BotonSuscripcionPortal";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

interface EstadoSuscripcion {
  tieneClienteStripe: boolean;
  tieneSuscripcionEnCurso: boolean;
}

export default function SuscripcionPage() {
  const router = useRouter();

  const [loadingPlan, setLoadingPlan] = useState<string>("");
  const [revisandoCuenta, setRevisandoCuenta] = useState(true);
  const [errorCuenta, setErrorCuenta] = useState("");

  const [tieneClienteStripe, setTieneClienteStripe] = useState(false);
  const [tieneSuscripcionEnCurso, setTieneSuscripcionEnCurso] =
    useState(false);

  useEffect(() => {
    let activo = true;

    const revisarCuenta = async () => {
      try {
        const response = await fetch("/api/checkout", {
          method: "GET",
          cache: "no-store",
        });

        const data = (await response.json()) as
          | EstadoSuscripcion
          | { error?: string };

        if (!response.ok) {
          throw new Error(
            "error" in data
              ? data.error || "No pudimos comprobar tu suscripción."
              : "No pudimos comprobar tu suscripción.",
          );
        }

        if (activo) {
          const estado = data as EstadoSuscripcion;

          setTieneClienteStripe(
            Boolean(estado.tieneClienteStripe),
          );
          setTieneSuscripcionEnCurso(
            Boolean(estado.tieneSuscripcionEnCurso),
          );
          setErrorCuenta("");
        }
      } catch (error) {
        console.error(
          "Error al revisar la suscripción:",
          error,
        );

        if (activo) {
          // Si Stripe no responde, no ofrecemos otro pago a ciegas.
          setErrorCuenta(
            "No pudimos comprobar tu suscripción. Recarga la página para intentarlo de nuevo.",
          );
        }
      } finally {
        if (activo) {
          setRevisandoCuenta(false);
        }
      }
    };

    revisarCuenta();

    return () => {
      activo = false;
    };
  }, []);

  const handleSuscribirse = async (
    planType: "monthly" | "annual",
  ) => {
    if (
      revisandoCuenta ||
      Boolean(errorCuenta) ||
      tieneSuscripcionEnCurso ||
      loadingPlan
    ) {
      return;
    }

    setLoadingPlan(planType);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/auth");
        return;
      }

      /*
       * El servidor vuelve a comprobar el estado real en Stripe
       * antes de crear o recuperar una sesión de Checkout.
       */
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planType }),
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        if (response.status === 409) {
          // Puede haberse activado otra suscripción desde que
          // cargamos la página. Evitamos otro intento de pago.
          setTieneSuscripcionEnCurso(true);
        }

        throw new Error(
          data.error ||
            "Ocurrió un error al iniciar el proceso de pago.",
        );
      }

      if (window.gtag) {
        window.gtag(
          "event",
          "manual_event_SIGNUP",
          {},
        );
      }

      window.location.assign(data.url);
    } catch (error) {
      console.error(
        "Error en la suscripción:",
        error,
      );

      alert(
        error instanceof Error
          ? error.message
          : "Ocurrió un error al conectar con el servidor de pago.",
      );
    } finally {
      setLoadingPlan("");
    }
  };

  const deshabilitarPlanes =
    revisandoCuenta ||
    Boolean(errorCuenta) ||
    tieneSuscripcionEnCurso ||
    loadingPlan !== "";

  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-50 px-6 py-24 text-slate-900 md:py-20">
      {/* Resplandores luminosos de fondo */}
      <div className="pointer-events-none absolute -left-10 top-0 h-96 w-96 animate-blob rounded-full bg-emerald-300/30 opacity-70 blur-3xl mix-blend-multiply" />
      <div className="pointer-events-none absolute -right-10 top-10 h-96 w-96 animate-blob rounded-full bg-green-200/40 opacity-70 blur-3xl mix-blend-multiply animation-delay-2000" />
      <div className="pointer-events-none absolute -bottom-10 left-20 h-96 w-96 animate-blob rounded-full bg-teal-200/30 opacity-70 blur-3xl mix-blend-multiply animation-delay-4000" />

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* Encabezado principal */}
        <div className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 shadow-xs">
            Crea tu Tienda Online • Catalagox
          </div>

          <h1 className="mb-6 text-4xl font-black tracking-tight text-slate-900 md:text-6xl">
            Lleva tu tienda online al <br />
            <span className="text-emerald-600">
              siguiente nivel
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg font-medium leading-relaxed text-slate-600">
            Publica tus productos, gestiona tus ventas y
            recibe pedidos por WhatsApp con tu propia tienda
            virtual profesional.
          </p>
        </div>

        {errorCuenta && (
          <div
            role="alert"
            className="mx-auto mb-8 max-w-4xl rounded-xl border border-amber-200 bg-amber-50 p-4 text-center text-sm font-medium text-amber-900"
          >
            {errorCuenta}
          </div>
        )}

        {/* Tarjetas de precios */}
        <div className="mx-auto grid max-w-4xl grid-cols-1 items-stretch gap-8 md:grid-cols-2">
          <PricingCard
            title="Plan Pro Mensual"
            price="10"
            period="/mes"
            badgeText="Opción Flexible"
            badgeColor="bg-emerald-50 text-emerald-700 border border-emerald-200"
            isLoading={loadingPlan === "monthly"}
            isDisabled={deshabilitarPlanes}
            onSubmit={() =>
              handleSuscribirse("monthly")
            }
          />

          <PricingCard
            title="Plan Pro Anual"
            price="108"
            period="/año"
            badgeText="Ahorra 10% - Más Popular"
            badgeColor="bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
            isPopular
            subPriceText="Equivale a solo $9.00 al mes"
            isLoading={loadingPlan === "annual"}
            isDisabled={deshabilitarPlanes}
            onSubmit={() =>
              handleSuscribirse("annual")
            }
          />
        </div>

        {/* Acceso al portal aunque el dashboard esté bloqueado */}
        {tieneClienteStripe && (
          <div className="mx-auto mt-10 max-w-4xl rounded-2xl border border-emerald-200 bg-white p-6 text-center shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-slate-900">
              {tieneSuscripcionEnCurso
                ? "Ya tienes una suscripción"
                : "Gestiona tu facturación"}
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
              {tieneSuscripcionEnCurso
                ? "Si tienes un pago pendiente, puedes actualizar tu tarjeta. También puedes revisar tus pagos o cancelar tu suscripción desde Stripe."
                : "Puedes revisar tus pagos anteriores en Stripe. Si quieres volver a contratar un plan, selecciona una de las opciones de arriba."}
            </p>

            <div className="mt-5">
              <BotonSuscripcionPortal />
            </div>
          </div>
        )}

        {/* Enlace de soporte */}
        <p className="mt-16 text-center text-sm text-slate-500">
          ¿Tienes alguna duda sobre nuestras tiendas
          online?{" "}
          <Link
            href="/contacto"
            className="font-bold text-emerald-600 transition-colors hover:underline"
          >
            Habla con nuestro equipo
          </Link>
        </p>
      </div>

      <style jsx>{`
        @keyframes shine {
          100% {
            left: 125%;
          }
        }

        .animate-shine {
          animation: shine 1.5s infinite;
        }

        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.05);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.95);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        @keyframes tilt {
          0%,
          50%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(0.5deg);
          }
          75% {
            transform: rotate(-0.5deg);
          }
        }

        .animate-tilt {
          animation: tilt 10s infinite linear;
        }
      `}</style>
    </section>
  );
}