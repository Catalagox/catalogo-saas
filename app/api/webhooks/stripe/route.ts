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
    // 🔥 BODY CRUDO (Stripe lo necesita EXACTO)
    const body = await req.text();

    // 🔥 HEADER CORRECTO
    const sig = req.headers.get("stripe-signature");

    if (!sig) {
      return NextResponse.json(
        { error: "Missing stripe signature" },
        { status: 400 }
      );
    }

    // 🔥 CONSTRUIR EVENTO STRIPE
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`❌ Error en Webhook: ${err.message}`);
    return NextResponse.json(
      { error: err.message },
      { status: 400 }
    );
  }

  // =====================================================
  // 1. CHECKOUT COMPLETADO (Primer pago exitoso)
  // =====================================================
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const supabaseUserId = session.metadata?.supabaseUserId;
    const customerId = session.customer as string;
    const subscriptionId = session.subscription as string;

    if (supabaseUserId) {
      await supabaseAdmin
        .from("catalogos")
        .update({
          stripe_customer_id: customerId || null,
          stripe_subscription_id: subscriptionId || null,
          subscription_status: "active",
          suscripcion_activa: true,
        })
        .eq("user_id", supabaseUserId);
    }
  }

  // =====================================================
  // 2. SUBSCRIPTION CREATED / UPDATED
  // =====================================================
  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated"
  ) {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;
    const supabaseUserId = subscription.metadata?.supabaseUserId;

    const updateData = {
      stripe_subscription_id: subscription.id,
      subscription_status: subscription.status, 
      suscripcion_activa:
        subscription.status === "active" ||
        subscription.status === "trialing",
    };

    if (customerId) {
      await supabaseAdmin
        .from("catalogos")
        .update(updateData)
        .eq("stripe_customer_id", customerId);
    } else if (supabaseUserId) {
      await supabaseAdmin
        .from("catalogos")
        .update(updateData)
        .eq("user_id", supabaseUserId);
    }
  }

  // =====================================================
  // 🔥 NUEVO: 3. FACTURA PAGADA CON ÉXITO (invoice_payment.paid)
  // =====================================================
  if (event.type === "invoice_payment.paid") {
    const invoicePayment = event.data.object as any;
    
    // Buscamos el ID del cliente que viene en la factura para saber a quién activar
    const customerId = invoicePayment.customer; 

    if (customerId) {
      await supabaseAdmin
        .from("catalogos")
        .update({
          subscription_status: "active",
          suscripcion_activa: true,
        })
        .eq("stripe_customer_id", customerId);
    }
  }

  // =====================================================
  // 4. SUBSCRIPTION DELETED
  // =====================================================
  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;

    await supabaseAdmin
      .from("catalogos")
      .update({
        subscription_status: "canceled",
        suscripcion_activa: false,
      })
      .eq("stripe_customer_id", customerId);
  }

  // =====================================================
  // 5. PAYMENT FAILED
  // =====================================================
  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object as any;
    const customerId = invoice.customer;

    await supabaseAdmin
      .from("catalogos")
      .update({
        subscription_status: "past_due",
        suscripcion_activa: false,
      })
      .eq("stripe_customer_id", customerId);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}