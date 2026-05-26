import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

// Inicializamos Stripe con tu clave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  // @ts-ignore
  apiVersion: "2025-01-27",
});

// Inicializamos Supabase con la clave de Administrador (Service Role Key)
// Usamos esta porque el webhook corre en el servidor y necesita permiso para editar usuarios sin importar las políticas RLS
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  // El "Webhook Secret" es una clave que te da Stripe para asegurarse de que nadie intente hackearte mandando pagos falsos
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) {
      console.error("Falta la firma de Stripe o el Webhook Secret");
      return NextResponse.json({ error: "Faltan firmas de seguridad" }, { status: 400 });
    }
    // Stripe verifica que la petición sea 100% real y no alterada
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`❌ Error de verificación de Webhook: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // --- AQUÍ EMPIEZA LA LÓGICA DE NEGOCIO ---
  
  // Escuchamos el evento cuando una suscripción se procesa con éxito
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Recuperamos el ID de Supabase que guardamos en la "cajita secreta" (metadata) en el archivo checkout/route.ts
    const supabaseUserId = session.metadata?.supabaseUserId;

    if (supabaseUserId) {
      console.log(`¡Pago exitoso detectado para el usuario: ${supabaseUserId}!`);

      // Calculamos la nueva fecha de vencimiento (Hoy + 30 días)
      const nuevaFechaVencimiento = new Date();
      nuevaFechaVencimiento.setDate(nuevaFechaVencimiento.getDate() + 30);

      // Le sumamos los 30 días al catálogo de este usuario en Supabase
      const { error } = await supabaseAdmin
        .from("catalogos")
        .update({
          plan_vence_el: nuevaFechaVencimiento.toISOString(),
        })
        .eq("user_id", supabaseUserId);

      if (error) {
        console.error("Error al actualizar la membresía en Supabase:", error);
        return NextResponse.json({ error: "Error interno al guardar en BD" }, { status: 500 });
      }

      console.log(`🚀 Catálogo del usuario ${supabaseUserId} actualizado con éxito por 30 días más.`);
    }
  }

  // Le respondemos a Stripe con un 200 OK para decirle "recibido correctamente"
  return NextResponse.json({ received: true }, { status: 200 });
}