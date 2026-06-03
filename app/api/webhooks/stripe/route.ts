import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || "sk_test_mockKeyForBuild",
  {
    // @ts-ignore
    apiVersion: "2025-01-27",
  }
);

const supabaseUrl =
  process.env.SUPABASE_URL || "https://placeholder-url.supabase.co";

const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key";

const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey
);

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();

  const sig = headersList.get("stripe-signature");

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) {
      return NextResponse.json(
        { error: "Faltan firmas de seguridad" },
        { status: 400 }
      );
    }

    event = stripe.webhooks.constructEvent(
      body,
      sig,
      webhookSecret
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 400 }
    );
  }

  // =====================================================
  // NUEVA SUSCRIPCIÓN
  // =====================================================

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const supabaseUserId = session.metadata?.supabaseUserId;

    if (supabaseUserId) {
      await supabaseAdmin
        .from("catalogos")
        .update({
          stripe_customer_id:
            typeof session.customer === "string"
              ? session.customer
              : null,

          stripe_subscription_id:
            typeof session.subscription === "string"
              ? session.subscription
              : null,

          subscription_status: "active",

          suscripcion_activa: true,
        })
        .eq("user_id", supabaseUserId);
    }
  }

  // =====================================================
  // CAMBIO DE ESTADO DE SUSCRIPCIÓN
  // =====================================================

  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as any;

    await supabaseAdmin
      .from("catalogos")
      .update({
        subscription_status: subscription.status,
        suscripcion_activa:
          subscription.status === "active" ||
          subscription.status === "trialing",
      })
      .eq("stripe_subscription_id", subscription.id);
  }

  // =====================================================
  // SUSCRIPCIÓN CANCELADA
  // =====================================================

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as any;

    await supabaseAdmin
      .from("catalogos")
      .update({
        subscription_status: "canceled",
        suscripcion_activa: false,
      })
      .eq("stripe_subscription_id", subscription.id);
  }

  // =====================================================
  // PAGO FALLIDO
  // =====================================================

  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object as any;

const subscriptionId = invoice.subscription ?? null;

    if (subscriptionId) {
      await supabaseAdmin
        .from("catalogos")
        .update({
          subscription_status: "past_due",
          suscripcion_activa: false,
        })
        .eq("stripe_subscription_id", subscriptionId);
    }
  }

  return NextResponse.json(
    { received: true },
    { status: 200 }
  );
}