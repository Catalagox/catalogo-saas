
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type PlanKey =
  | "basic_monthly"
  | "pro_monthly"
  | "pro_annual";

type PlanType = "monthly" | "annual";

type PlanConfig = {
  planTipo: "basic" | "pro";
  planIntervalo: PlanType;
  planType: PlanType;
  priceId: string | undefined;
};

const PLANES: Record<PlanKey, PlanConfig> = {
  basic_monthly: {
    planTipo: "basic",
    planIntervalo: "monthly",
    planType: "monthly",
    priceId: process.env.STRIPE_PRICE_ID_BASIC_MONTHLY,
  },

  pro_monthly: {
    planTipo: "pro",
    planIntervalo: "monthly",
    planType: "monthly",
    priceId: process.env.STRIPE_PRICE_ID_PRO_MONTHLY,
  },

  pro_annual: {
    planTipo: "pro",
    planIntervalo: "annual",
    planType: "annual",
    priceId: process.env.STRIPE_PRICE_ID_PRO_ANNUAL,
  },
};

const ESTADOS_FINALIZADOS = new Set([
  "canceled",
  "incomplete_expired",
]);

function esPlanKey(valor: unknown): valor is PlanKey {
  return (
    valor === "basic_monthly" ||
    valor === "pro_monthly" ||
    valor === "pro_annual"
  );
}

function obtenerStripe(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("Falta STRIPE_SECRET_KEY");
  }

  return new Stripe(secretKey);
}

function obtenerBaseUrl(): string {
  const configurada =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.catalagox.com";

  const url = new URL(configurada);

  if (
    process.env.NODE_ENV === "production" &&
    url.protocol !== "https:"
  ) {
    throw new Error("NEXT_PUBLIC_SITE_URL debe utilizar HTTPS");
  }

  return url.origin;
}

async function obtenerCuenta() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user || !user.email) {
    return {
      supabase,
      user: null,
      catalogo: null,
    };
  }

  const { data: catalogo, error: catalogoError } =
    await supabase
      .from("catalogos")
      .select("id, stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle();

  if (catalogoError) {
    throw catalogoError;
  }

  return { supabase, user, catalogo };
}

async function tieneSuscripcionEnCurso(
  stripe: Stripe,
  customerId: string,
): Promise<boolean> {
  // Recorremos todas las páginas para no ignorar
  // suscripciones antiguas del mismo cliente.
  for await (const subscription of stripe.subscriptions.list({
    customer: customerId,
    status: "all",
    limit: 100,
  })) {
    if (!ESTADOS_FINALIZADOS.has(subscription.status)) {
      return true;
    }
  }

  return false;
}

function obtenerPlanSolicitado(
  datos: {
    planKey?: unknown;
    planType?: unknown;
  },
): PlanKey | null {
  if (esPlanKey(datos.planKey)) {
    return datos.planKey;
  }

  if (datos.planKey !== undefined) {
    return null;
  }

  // Compatibilidad con el frontend anterior.
  if (datos.planType === "monthly") {
    return "pro_monthly";
  }

  if (datos.planType === "annual") {
    return "pro_annual";
  }

  return null;
}

// GET: consultar si el usuario tiene una suscripción.
export async function GET() {
  try {
    const { user, catalogo } = await obtenerCuenta();

    if (!user || !catalogo?.stripe_customer_id) {
      return NextResponse.json(
        {
          tieneClienteStripe: false,
          tieneSuscripcionEnCurso: false,
        },
        {
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    const stripe = obtenerStripe();

    const tieneSuscripcion =
      await tieneSuscripcionEnCurso(
        stripe,
        catalogo.stripe_customer_id,
      );

    return NextResponse.json(
      {
        tieneClienteStripe: true,
        tieneSuscripcionEnCurso: tieneSuscripcion,
      },
      {
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    console.error(
      "Error consultando suscripción:",
      error,
    );

    return NextResponse.json(
      {
        error: "No pudimos comprobar tu suscripción.",
      },
      { status: 500 },
    );
  }
}

// POST: crear sesión de Checkout.
export async function POST(req: Request) {
  try {
    const { supabase, user, catalogo } =
      await obtenerCuenta();

    if (!user) {
      return NextResponse.json(
        {
          error: "Inicia sesión para contratar un plan.",
        },
        { status: 401 },
      );
    }

    if (!catalogo) {
      return NextResponse.json(
        {
          error: "Primero completa el registro de tu tienda.",
        },
        { status: 409 },
      );
    }

    const body: unknown = await req
      .json()
      .catch(() => null);

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        { error: "Selecciona un plan válido." },
        { status: 400 },
      );
    }

    const datos = body as {
      planKey?: unknown;
      planType?: unknown;
    };

    const planKey = obtenerPlanSolicitado(datos);

    if (!planKey) {
      return NextResponse.json(
        { error: "Selecciona un plan válido." },
        { status: 400 },
      );
    }

    const plan = PLANES[planKey];

    if (!plan.priceId) {
      console.error(
        "Precio Stripe no configurado:",
        planKey,
      );

      return NextResponse.json(
        {
          error:
            "El precio de este plan no está configurado.",
        },
        { status: 500 },
      );
    }

    const stripe = obtenerStripe();
    const baseUrl = obtenerBaseUrl();

    // Verificamos que el Price ID exista y corresponda
    // al importe e intervalo esperados.
    const price = await stripe.prices.retrieve(plan.priceId);

    const importesEsperados: Record<PlanKey, number> = {
      basic_monthly: 500,
      pro_monthly: 1000,
      pro_annual: 10800,
    };

    const intervaloEsperado =
      plan.planIntervalo === "annual" ? "year" : "month";

    if (
      !price.active ||
      price.type !== "recurring" ||
      price.currency !== "usd" ||
      price.unit_amount !== importesEsperados[planKey] ||
      price.recurring?.interval !== intervaloEsperado ||
      price.recurring?.interval_count !== 1
    ) {
      console.error(
        "Configuración de precio incompatible:",
        {
          planKey,
          priceId: plan.priceId,
        },
      );

      return NextResponse.json(
        {
          error:
            "La configuración del plan necesita revisión.",
        },
        { status: 500 },
      );
    }

    let customerId: string;

    if (catalogo.stripe_customer_id) {
      customerId = catalogo.stripe_customer_id;
    } else {
      const customer = await stripe.customers.create(
        {
          email: user.email!,
          metadata: {
            supabaseUserId: user.id,
          },
        },
        {
          idempotencyKey:
            `catalagox-customer-${catalogo.id}`,
        },
      );

      const { data: actualizado, error: updateError } =
        await supabase
          .from("catalogos")
          .update({
            stripe_customer_id: customer.id,
          })
          .eq("id", catalogo.id)
          .eq("user_id", user.id)
          .is("stripe_customer_id", null)
          .select("stripe_customer_id")
          .maybeSingle();

      if (updateError) {
        throw updateError;
      }

      if (actualizado?.stripe_customer_id) {
        customerId = actualizado.stripe_customer_id;
      } else {
        const { data: vigente, error: readError } =
          await supabase
            .from("catalogos")
            .select("stripe_customer_id")
            .eq("id", catalogo.id)
            .eq("user_id", user.id)
            .single();

        if (readError || !vigente?.stripe_customer_id) {
          throw (
            readError ||
            new Error("No se pudo recuperar el cliente Stripe")
          );
        }

        customerId = vigente.stripe_customer_id;
      }
    }

    // Protección contra suscripciones duplicadas.
    if (
      await tieneSuscripcionEnCurso(
        stripe,
        customerId,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Ya tienes una suscripción en curso. Usa «Gestionar suscripción» para revisar tu pago o cancelarla.",
        },
        { status: 409 },
      );
    }

    // Reutilizamos sesiones abiertas del mismo plan.
    const sesionesAbiertas =
      await stripe.checkout.sessions.list({
        customer: customerId,
        status: "open",
        limit: 100,
      });

    const sesionExistente =
      sesionesAbiertas.data.find((session) => {
        if (
          session.mode !== "subscription" ||
          session.metadata?.supabaseUserId !== user.id ||
          !session.url
        ) {
          return false;
        }

        if (session.metadata?.planKey) {
          return session.metadata.planKey === planKey;
        }

        return (
          plan.planTipo === "pro" &&
          session.metadata?.planType === plan.planType
        );
      });

    if (sesionExistente?.url) {
      return NextResponse.json({
        url: sesionExistente.url,
      });
    }

    const metadataStripe = {
      supabaseUserId: user.id,
      planKey,
      planTipo: plan.planTipo,
      planIntervalo: plan.planIntervalo,
      planType: plan.planType,
    };

    const session =
      await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: customerId,
        payment_method_types: ["card"],

        line_items: [
          {
            price: plan.priceId,
            quantity: 1,
          },
        ],

        success_url:
          `${baseUrl}/dashboard?success=true`,

        cancel_url:
          `${baseUrl}/suscripcion?canceled=true`,

        metadata: metadataStripe,

        subscription_data: {
          metadata: metadataStripe,
        },
      });

    if (!session.url) {
      throw new Error(
        "Stripe no devolvió la URL de Checkout",
      );
    }

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error(
      "Error al crear Checkout:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "No pudimos iniciar el pago. Inténtalo nuevamente.",
      },
      { status: 500 },
    );
  }
}
