import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

type PlanType = "monthly" | "annual";

const ESTADOS_FINALIZADOS = new Set([
  "canceled",
  "incomplete_expired",
]);

async function obtenerCuenta() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user || !user.email) {
    return { supabase, user: null, catalogo: null };
  }

  const { data: catalogo, error: catalogoError } = await supabase
    .from("catalogos")
    .select("id, stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (catalogoError) throw catalogoError;

  return { supabase, user, catalogo };
}

async function tieneSuscripcionEnCurso(
  stripe: Stripe,
  customerId: string,
) {
  // Stripe devuelve aquí las suscripciones que aún no están canceladas.
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: "all",
    limit: 100,
  });

  return subscriptions.data.some(
    (subscription) =>
      !ESTADOS_FINALIZADOS.has(subscription.status),
  );
}

// La página /suscripcion consulta este estado para decidir qué mostrar.
export async function GET() {
  try {
    const { user, catalogo } = await obtenerCuenta();

    if (!user) {
      return NextResponse.json({
        tieneClienteStripe: false,
        tieneSuscripcionEnCurso: false,
      });
    }

    const customerId = catalogo?.stripe_customer_id;

    if (!customerId) {
      return NextResponse.json({
        tieneClienteStripe: false,
        tieneSuscripcionEnCurso: false,
      });
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) throw new Error("Falta STRIPE_SECRET_KEY");

    const stripe = new Stripe(secretKey);

    return NextResponse.json({
      tieneClienteStripe: true,
      tieneSuscripcionEnCurso: await tieneSuscripcionEnCurso(
        stripe,
        customerId,
      ),
    });
  } catch (error) {
    console.error("Error consultando suscripción:", error);

    return NextResponse.json(
      { error: "No pudimos comprobar tu suscripción." },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      throw new Error("Falta STRIPE_SECRET_KEY");
    }

    const { supabase, user, catalogo } = await obtenerCuenta();

    if (!user) {
      return NextResponse.json(
        { error: "Inicia sesión para contratar un plan." },
        { status: 401 },
      );
    }

    if (!catalogo) {
      return NextResponse.json(
        { error: "Primero completa el registro de tu tienda." },
        { status: 409 },
      );
    }

    const body = await req.json().catch(() => null);
    const planType = body?.planType as PlanType | undefined;

    if (planType !== "monthly" && planType !== "annual") {
      return NextResponse.json(
        { error: "Selecciona un plan válido." },
        { status: 400 },
      );
    }

    const priceId =
      planType === "annual"
        ? process.env.STRIPE_PRICE_ID_ANNUAL ||
          process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ANNUAL
        : process.env.STRIPE_PRICE_ID_MONTHLY ||
          process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY ||
          process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;

    if (!priceId) {
      return NextResponse.json(
        { error: "El precio de este plan no está configurado." },
        { status: 500 },
      );
    }

    const stripe = new Stripe(secretKey);
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://www.catalagox.com";

    let customerId: string;

    if (catalogo.stripe_customer_id) {
      customerId = catalogo.stripe_customer_id;
    } else {
      const customer = await stripe.customers.create({
        email: user.email!,
        metadata: {
          supabaseUserId: user.id,
        },
      });

      /*
       * Guardamos el ID solamente si continúa vacío.
       * Si otra solicitud lo guardó primero, usamos ese cliente.
       */
      const { data: actualizado, error: updateError } =
        await supabase
          .from("catalogos")
          .update({ stripe_customer_id: customer.id })
          .eq("id", catalogo.id)
          .eq("user_id", user.id)
          .is("stripe_customer_id", null)
          .select("stripe_customer_id")
          .maybeSingle();

      if (updateError) throw updateError;

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
          throw readError || new Error("No se pudo guardar el cliente");
        }

        customerId = vigente.stripe_customer_id;
      }
    }

    if (await tieneSuscripcionEnCurso(stripe, customerId)) {
      return NextResponse.json(
        {
          error:
            "Ya tienes una suscripción en curso. Usa «Gestionar suscripción» para revisar tu pago o cancelarla.",
        },
        { status: 409 },
      );
    }

    /*
     * Si había un Checkout abierto para este cliente, reutilizamos su URL.
     * Esto evita dejar dos páginas de pago abiertas para la misma cuenta.
     */
    const sesionesAbiertas = await stripe.checkout.sessions.list({
      customer: customerId,
      status: "open",
      limit: 100,
    });

    const sesionExistente = sesionesAbiertas.data.find(
      (session) =>
        session.mode === "subscription" &&
        session.metadata?.supabaseUserId === user.id &&
        session.metadata?.planType === planType &&
        session.url,
    );

    if (sesionExistente?.url) {
      return NextResponse.json({ url: sesionExistente.url });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/dashboard?success=true`,
      cancel_url: `${baseUrl}/suscripcion?canceled=true`,
      metadata: {
        supabaseUserId: user.id,
        planType,
      },
      subscription_data: {
        metadata: {
          supabaseUserId: user.id,
          planType,
        },
      },
    });

    if (!session.url) {
      throw new Error("Stripe no devolvió la URL de Checkout");
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error al crear Checkout:", error);

    return NextResponse.json(
      { error: "No pudimos iniciar el pago. Inténtalo nuevamente." },
      { status: 500 },
    );
  }
}