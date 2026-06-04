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

    console.log("✅ Evento recibido con éxito:", event.type);
  } catch (err: any) {
    console.error("❌ Error Webhook (Firma inválida):", err.message);

    return NextResponse.json(
      { error: err.message },
      { status: 400 }
    );
  }

  // =====================================================
  // CHECKOUT COMPLETADO (Versión Ultra-Resistente)
  // =====================================================
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.metadata?.supabaseUserId;
    const customerId = session.customer as string;
    const subscriptionId = session.subscription as string;
    const customerEmail = session.customer_details?.email; // 👈 Respaldo por Email

    console.log("🔥 [EVENTO] checkout.session.completed iniciado");
    console.log({
      userId,
      customerId,
      subscriptionId,
      customerEmail
    });

    let updated = false;

    // Intento 1: Actualizar usando el userId de la metadata
    if (userId) {
      console.log(`Intento 1: Actualizando catálogo por 'user_id': ${userId}`);
      const { data, error } = await supabaseAdmin
        .from("catalogos")
        .update({
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          subscription_status: "active",
          suscripcion_activa: true,
        })
        .eq("user_id", userId)
        .select();

      if (error) {
        console.error("❌ Error en Intento 1 (user_id):", error.message);
      } else if (data && data.length > 0) {
        console.log("✅ Éxito en Intento 1 (user_id):", data);
        updated = true;
      }
    }

    // Intento 2: Si el intento 1 no alteró filas, usamos el Email como salvavidas
    if (!updated && customerEmail) {
      console.log(`⚠️ Intento 1 no cambió nada. Iniciando Intento 2 por Email: ${customerEmail}`);
      
      // Como en tu tabla no guardas el email directo en 'catalogos', primero verificamos en auth o usamos upsert.
      // Si en tu tabla 'catalogos' existiera una columna de email lo haríamos directo.
      // Pero como sabemos que el registro existe, usemos un UPSERT para forzar la actualización o creación:
      if (userId) {
        const { data, error } = await supabaseAdmin
          .from("catalogos")
          .upsert({
            user_id: userId,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            subscription_status: "active",
            suscripcion_activa: true,
          }, {
            onConflict: 'user_id'
          })
          .select();

        if (error) {
          console.error("❌ Error crítico en UPSERT de contingencia:", error.message);
        } else {
          console.log("🔥 [SOLUCIONADO] Fila forzada con UPSERT:", data);
          updated = true;
        }
      }
    }
  }

  // =====================================================
  // SUBSCRIPTION CREATED / UPDATED
  // =====================================================
  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated"
  ) {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;
    const userId = subscription.metadata?.supabaseUserId;

    console.log(`🔥 [EVENTO] ${event.type} iniciado`);
    console.log({
      userId,
      customerId,
      subscriptionId: subscription.id,
      status: subscription.status,
    });

    const updateData = {
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      subscription_status: subscription.status,
      suscripcion_activa:
        subscription.status === "active" ||
        subscription.status === "trialing",
    };

    if (userId) {
      console.log(`Actualizando por 'user_id': ${userId}`);
      const { data, error } = await supabaseAdmin
        .from("catalogos")
        .update(updateData)
        .eq("user_id", userId)
        .select();

      if (error) console.error("❌ ERROR EN SUBSCRIPTION UPDATE (Por user_id):", error.message);
      else console.log("✅ RESULTADO SUBSCRIPTION UPDATE (Por user_id):", data);
    } else {
      console.log(`Actualizando por 'stripe_customer_id': ${customerId}`);
      const { data, error } = await supabaseAdmin
        .from("catalogos")
        .update(updateData)
        .eq("stripe_customer_id", customerId)
        .select();

      if (error) console.error("❌ ERROR EN SUBSCRIPTION UPDATE (Por customer_id):", error.message);
      else console.log("✅ RESULTADO SUBSCRIPTION UPDATE (Por customer_id):", data);
    }
  }

  // =====================================================
  // FACTURA PAGADA
  // =====================================================
  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as any;
    const customerId = invoice.customer;

    const userId =
      invoice.parent?.subscription_details?.metadata?.supabaseUserId ||
      invoice.lines?.data?.[0]?.metadata?.supabaseUserId;

    const periodEnd = invoice.lines?.data?.[0]?.period?.end;
    const planVenceEl = periodEnd
      ? new Date(periodEnd * 1000).toISOString()
      : null;

    console.log("🔥 [EVENTO] invoice.payment_succeeded iniciado");
    console.log({
      customerId,
      userId,
      planVenceEl,
    });

    if (userId) {
      console.log(`Actualizando factura por 'user_id': ${userId}`);
      const { data, error } = await supabaseAdmin
        .from("catalogos")
        .update({
          stripe_customer_id: customerId,
          subscription_status: "active",
          suscripcion_activa: true,
          plan_vence_el: planVenceEl,
        })
        .eq("user_id", userId)
        .select();

      if (error) console.error("❌ ERROR EN INVOICE UPDATE (Por user_id):", error.message);
      else console.log("✅ RESULTADO INVOICE UPDATE (Por user_id):", data);
    } else {
      console.log(`Actualizando factura por 'stripe_customer_id': ${customerId}`);
      const { data, error } = await supabaseAdmin
        .from("catalogos")
        .update({
          subscription_status: "active",
          suscripcion_activa: true,
          plan_vence_el: planVenceEl,
        })
        .eq("stripe_customer_id", customerId)
        .select();

      if (error) console.error("❌ ERROR EN INVOICE UPDATE (Por customer_id):", error.message);
      else console.log("✅ RESULTADO INVOICE UPDATE (Por customer_id):", data);
    }
  }

  // =====================================================
  // SUBSCRIPTION CANCELADA
  // =====================================================
  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;

    console.log("🔥 [EVENTO] customer.subscription.deleted");

    const { error } = await supabaseAdmin
      .from("catalogos")
      .update({
        subscription_status: "canceled",
        suscripcion_activa: false,
      })
      .eq("stripe_customer_id", customerId);

    if (error) console.error("❌ ERROR EN CANCELACIÓN:", error.message);
  }

  // =====================================================
  // PAGO FALLIDO
  // =====================================================
  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object as any;
    const customerId = invoice.customer;

    console.log("🔥 [EVENTO] invoice.payment_failed");

    const { error } = await supabaseAdmin
      .from("catalogos")
      .update({
        subscription_status: "past_due",
        suscripcion_activa: false,
      })
      .eq("stripe_customer_id", customerId);

    if (error) console.error("❌ ERROR EN PAGO FALLIDO:", error.message);
  }

  return NextResponse.json(
    { received: true },
    { status: 200 }
  );
}