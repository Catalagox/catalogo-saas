import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || "sk_test_mockKeyForBuild",
  {
    // @ts-ignore
    apiVersion: "2026-04-22.dahlia",
  }
);

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  let event: Stripe.Event;

  try {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature");

    if (!sig) {
      return NextResponse.json(
        { error: "Missing stripe signature" },
        { status: 400 }
      );
    }

    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log("✅ Evento recibido:", event.type);
  } catch (err: any) {
    console.error("❌ Error en Webhook:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  // =====================================================
  // 1. CHECKOUT COMPLETADO
  // =====================================================
  if (event.type === "checkout.session.completed") {
    console.log("🔥 CHECKOUT COMPLETED");

    const session = event.data.object as Stripe.Checkout.Session;

    const supabaseUserId = session.metadata?.supabaseUserId;
    const customerId = session.customer as string;
    const subscriptionId = session.subscription as string;

    console.log({
      supabaseUserId,
      customerId,
      subscriptionId,
    });

    if (supabaseUserId) {
      const { data, error } = await supabaseAdmin
        .from("catalogos")
        .update({
          stripe_customer_id: customerId || null,
          stripe_subscription_id: subscriptionId || null,
          subscription_status: "active",
          suscripcion_activa: true,
        })
        .eq("user_id", supabaseUserId)
        .select();

      console.log("📌 Resultado UPDATE checkout:");
      console.log("data:", data);
      console.log("error:", error);
    } else {
      console.log("❌ supabaseUserId no encontrado");
    }
  }

  // =====================================================
  // 2. SUBSCRIPTION CREATED / UPDATED
  // =====================================================
  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated"
  ) {
    console.log("🔥 SUBSCRIPTION EVENT");

    const subscription = event.data.object as Stripe.Subscription;

    const customerId = subscription.customer as string;
    const supabaseUserId = subscription.metadata?.supabaseUserId;

    console.log({
      customerId,
      supabaseUserId,
      subscriptionId: subscription.id,
      status: subscription.status,
    });

    const updateData = {
      stripe_subscription_id: subscription.id,
      subscription_status: subscription.status,
      suscripcion_activa:
        subscription.status === "active" ||
        subscription.status === "trialing",
    };

    let result;

    if (customerId) {
      result = await supabaseAdmin
        .from("catalogos")
        .update(updateData)
        .eq("stripe_customer_id", customerId)
        .select();
    } else if (supabaseUserId) {
      result = await supabaseAdmin
        .from("catalogos")
        .update(updateData)
        .eq("user_id", supabaseUserId)
        .select();
    }

    console.log("📌 Resultado UPDATE subscription:");
    console.log(result);
  }

  // =====================================================
  // 3. FACTURA PAGADA
  // =====================================================
  if (
    event.type === "invoice.payment_succeeded" ||
    event.type === "invoice_payment.paid"
  ) {
    console.log("🔥 INVOICE PAYMENT SUCCEEDED");

    const invoice = event.data.object as any;

    const customerId = invoice.customer;

    const periodEndTimestamp =
      invoice.lines?.data?.[0]?.period?.end;

    let planVenceEl: string | null = null;

    if (periodEndTimestamp) {
      planVenceEl = new Date(
        periodEndTimestamp * 1000
      ).toISOString();
    }

    console.log({
      customerId,
      planVenceEl,
    });

    if (customerId) {
      const { data, error } = await supabaseAdmin
        .from("catalogos")
        .update({
          subscription_status: "active",
          suscripcion_activa: true,
          plan_vence_el: planVenceEl,
        })
        .eq("stripe_customer_id", customerId)
        .select();

      console.log("📌 Resultado UPDATE invoice:");
      console.log("data:", data);
      console.log("error:", error);
    }
  }

  // =====================================================
  // 4. SUBSCRIPTION DELETED
  // =====================================================
  if (event.type === "customer.subscription.deleted") {
    console.log("🔥 SUBSCRIPTION DELETED");

    const subscription = event.data.object as Stripe.Subscription;

    const customerId = subscription.customer as string;

    const { data, error } = await supabaseAdmin
      .from("catalogos")
      .update({
        subscription_status: "canceled",
        suscripcion_activa: false,
      })
      .eq("stripe_customer_id", customerId)
      .select();

    console.log(data);
    console.log(error);
  }

  // =====================================================
  // 5. PAYMENT FAILED
  // =====================================================
  if (event.type === "invoice.payment_failed") {
    console.log("🔥 PAYMENT FAILED");

    const invoice = event.data.object as any;

    const customerId = invoice.customer;

    const { data, error } = await supabaseAdmin
      .from("catalogos")
      .update({
        subscription_status: "past_due",
        suscripcion_activa: false,
      })
      .eq("stripe_customer_id", customerId)
      .select();

    console.log(data);
    console.log(error);
  }

  return NextResponse.json(
    { received: true },
    { status: 200 }
  );
}