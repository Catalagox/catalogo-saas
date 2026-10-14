import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

type CatalogoStripe = {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
};

type ReferenciaStripe =
  | string
  | { id: string }
  | null
  | undefined;

// Compatibilidad con versiones anteriores y recientes de Stripe.
type SubscriptionCompatible = Stripe.Subscription & {
  current_period_end?: number;
};

type InvoiceCompatible = {
  customer?: ReferenciaStripe;
  subscription?: ReferenciaStripe;
  parent?: {
    subscription_details?: {
      subscription?: ReferenciaStripe;
    } | null;
  } | null;
};

function obtenerId(valor: ReferenciaStripe): string | null {
  if (typeof valor === "string") return valor;
  return valor?.id ?? null;
}

function obtenerSubscriptionId(invoice: InvoiceCompatible): string | null {
  return (
    obtenerId(invoice.parent?.subscription_details?.subscription) ||
    obtenerId(invoice.subscription)
  );
}

function obtenerVencimiento(subscription: Stripe.Subscription): string | null {
  const compatible = subscription as SubscriptionCompatible;

  // Catalagox utiliza un plan por suscripción.
  const item = subscription.items.data[0] as
    | (Stripe.SubscriptionItem & { current_period_end?: number })
    | undefined;

  const timestamp =
    compatible.current_period_end ?? item?.current_period_end;

  if (!timestamp) return null;

  return new Date(timestamp * 1000).toISOString();
}

function tieneAcceso(status: Stripe.Subscription.Status): boolean {
  return status === "active" || status === "trialing";
}

function esTerminal(status: Stripe.Subscription.Status): boolean {
  return status === "canceled" || status === "incomplete_expired";
}

export async function POST(req: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (
    !stripeSecretKey ||
    !webhookSecret ||
    !supabaseUrl ||
    !supabaseServiceKey
  ) {
    console.error("Webhook Stripe: faltan variables de entorno.");

    return NextResponse.json(
      { error: "Error de configuración del servidor" },
      { status: 500 }
    );
  }

  const stripe = new Stripe(stripeSecretKey);

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error: unknown) {
    console.error(
      "Webhook Stripe: firma inválida.",
      error instanceof Error ? error.message : "Error desconocido"
    );

    return NextResponse.json(
      { error: "Firma de Stripe inválida" },
      { status: 400 }
    );
  }

  const columnas =
    "id, user_id, stripe_customer_id, stripe_subscription_id";

  async function buscarCatalogo(
    subscriptionId: string,
    customerId: string,
    userId?: string
  ): Promise<CatalogoStripe | null> {
    // Primero buscamos la suscripción exacta.
    const vinculada = await supabaseAdmin
      .from("catalogos")
      .select(columnas)
      .eq("stripe_subscription_id", subscriptionId)
      .maybeSingle();

    if (vinculada.error) {
      throw new Error(vinculada.error.message);
    }

    if (vinculada.data) {
      return vinculada.data as CatalogoStripe;
    }

    if (userId) {
      const porUsuario = await supabaseAdmin
        .from("catalogos")
        .select(columnas)
        .eq("user_id", userId)
        .maybeSingle();

      if (porUsuario.error) {
        throw new Error(porUsuario.error.message);
      }

      if (porUsuario.data) {
        return porUsuario.data as CatalogoStripe;
      }
    }

    const porCliente = await supabaseAdmin
      .from("catalogos")
      .select(columnas)
      .eq("stripe_customer_id", customerId)
      .maybeSingle();

    if (porCliente.error) {
      throw new Error(porCliente.error.message);
    }

    return porCliente.data as CatalogoStripe | null;
  }

  async function sincronizarSuscripcion(
    subscriptionId: string,
    opciones: {
      userId?: string;
      permitirVincular?: boolean;
      permitirReemplazarCancelada?: boolean;
    } = {}
  ) {
    // Usamos el estado actual, no el estado antiguo del evento.
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const customerId = obtenerId(subscription.customer);

    if (!customerId) {
      throw new Error("La suscripción no tiene un cliente válido.");
    }

    const userId =
      opciones.userId || subscription.metadata?.supabaseUserId;

    const catalogo = await buscarCatalogo(
      subscription.id,
      customerId,
      userId
    );

    if (!catalogo) {
      // Stripe reintentará el evento si la tienda aún no está creada.
      throw new Error(
        `No se encontró un catálogo para la suscripción ${subscription.id}.`
      );
    }

    const subscriptionAnterior = catalogo.stripe_subscription_id;
    const mismaSuscripcion = subscriptionAnterior === subscription.id;

    if (!mismaSuscripcion) {
      if (!opciones.permitirVincular || !tieneAcceso(subscription.status)) {
        console.log("Evento de suscripción no vinculada ignorado:", {
          eventId: event.id,
          subscriptionId: subscription.id,
          subscriptionVinculada: subscriptionAnterior,
        });
        return;
      }

      if (subscriptionAnterior) {
        // Solo un checkout nuevo puede reemplazar un plan terminado.
        if (!opciones.permitirReemplazarCancelada) {
          console.log("Suscripción repetida ignorada:", subscription.id);
          return;
        }

        const anterior = await stripe.subscriptions.retrieve(
          subscriptionAnterior
        );

        if (!esTerminal(anterior.status)) {
          console.log("Se conserva la suscripción existente:", {
            actual: subscriptionAnterior,
            repetida: subscription.id,
          });
          return;
        }
      }
    }

    const planVenceEl = obtenerVencimiento(subscription);

    if (tieneAcceso(subscription.status) && !planVenceEl) {
      // No inventamos meses ni fechas de vencimiento.
      throw new Error(
        `Stripe no devolvió el fin del período de ${subscription.id}.`
      );
    }

    const updateData: {
      stripe_customer_id: string;
      stripe_subscription_id: string;
      subscription_status: string;
      suscripcion_activa: boolean;
      plan_vence_el?: string;
    } = {
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      subscription_status: subscription.status,
      suscripcion_activa: tieneAcceso(subscription.status),
    };

    if (planVenceEl) {
      updateData.plan_vence_el = planVenceEl;
    }

    let query = supabaseAdmin
      .from("catalogos")
      .update(updateData)
      .eq("id", catalogo.id);

    // Evita que dos eventos sobrescriban el vínculo simultáneamente.
    if (subscriptionAnterior === null) {
      query = query.is("stripe_subscription_id", null);
    } else {
      query = query.eq("stripe_subscription_id", subscriptionAnterior);
    }

    const { data, error } = await query.select("id");

    if (error) {
      throw new Error(error.message);
    }

    if (!data?.length) {
      // El vínculo cambió durante el procesamiento: reintentamos.
      throw new Error(
        "El vínculo de la suscripción cambió durante la actualización."
      );
    }

    console.log("Catálogo sincronizado con Stripe:", {
      eventId: event.id,
      catalogoId: catalogo.id,
      subscriptionId: subscription.id,
      status: subscription.status,
      planVenceEl,
    });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.mode !== "subscription") break;

        const subscriptionId = obtenerId(session.subscription);

        if (!subscriptionId) {
          throw new Error("Checkout no contiene una suscripción.");
        }

        await sincronizarSuscripcion(subscriptionId, {
          userId: session.metadata?.supabaseUserId,
          permitirVincular: true,
          permitirReemplazarCancelada: true,
        });

        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        await sincronizarSuscripcion(subscription.id, {
          permitirVincular: true,
        });

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        // Una suscripción repetida nunca desactiva la vinculada.
        await sincronizarSuscripcion(subscription.id);

        break;
      }

      case "invoice.paid":
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as unknown as InvoiceCompatible;
        const subscriptionId = obtenerSubscriptionId(invoice);

        // Ignoramos facturas que no pertenecen a una suscripción.
        if (!subscriptionId) break;

        await sincronizarSuscripcion(subscriptionId, {
          permitirVincular: true,
        });

        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as unknown as InvoiceCompatible;
        const subscriptionId = obtenerSubscriptionId(invoice);

        if (!subscriptionId) break;

        // Consultamos el estado actual: una factura antigua fallida
        // no desactiva una suscripción que ya volvió a estar activa.
        await sincronizarSuscripcion(subscriptionId);

        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error procesando webhook Stripe:", {
      eventId: event.id,
      eventType: event.type,
      error: error instanceof Error ? error.message : "Error desconocido",
    });

    // Stripe podrá reintentar cuando falle la API o la base de datos.
    return NextResponse.json(
      { error: "No se pudo procesar el evento de Stripe" },
      { status: 500 }
    );
  }
}