import Link from "next/link";
import { redirect } from "next/navigation";
import { PackageCheck, ShoppingBag } from "lucide-react";
import PedidoAcciones from "@/components/dashboard/pedidos/PedidoAcciones";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type PedidoItem = {
  id: string;
  nombre_producto: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
};

type Pedido = {
  id: string;
  numero: number;
  comprador_nombre: string;
  comprador_telefono: string;
  comprador_email: string | null;
  direccion_entrega: string | null;
  notas: string | null;
  moneda: string;
  total: number;
  metodo_pago: string;
  estado_pedido: string;
  estado_pago: string;
  created_at: string;
  pedido_items: PedidoItem[];
};

function formatearImporte(valor: number, moneda: string) {
  try {
    return new Intl.NumberFormat("es", {
      style: "currency",
      currency: moneda,
      maximumFractionDigits: 2,
    }).format(Number(valor));
  } catch {
    return `${moneda} ${Number(valor).toLocaleString("es")}`;
  }
}

function formatearFecha(fecha: string) {
  return new Intl.DateTimeFormat("es", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(fecha));
}

function etiquetaEstado(estado: string) {
  const etiquetas: Record<string, string> = {
    nuevo: "Nuevo",
    confirmado: "Confirmado",
    en_preparacion: "En preparación",
    listo: "Listo",
    enviado: "Enviado",
    entregado: "Entregado",
    cancelado: "Cancelado",
    pendiente: "Pendiente",
    procesando: "Procesando",
    pagado: "Pagado",
    fallido: "Fallido",
    reembolsado: "Reembolsado",
  };
  return etiquetas[estado] ?? estado;
}

export default async function PedidosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth?redirect=%2Fdashboard%2Fpedidos");

  const { data: catalogo, error: catalogoError } = await supabase
    .from("catalogos")
    .select("id, nombre")
    .eq("user_id", user.id)
    .maybeSingle();

  if (catalogoError) throw new Error("No pudimos consultar tu tienda.");
  if (!catalogo) redirect("/onboarding?next=%2Fdashboard%2Fpedidos");

  const { data, error } = await supabase
    .from("pedidos")
    .select(`
      id, numero, comprador_nombre, comprador_telefono, comprador_email,
      direccion_entrega, notas, moneda, total, metodo_pago,
      estado_pedido, estado_pago, created_at,
      pedido_items (id, nombre_producto, cantidad, precio_unitario, subtotal)
    `)
    .eq("catalogo_id", catalogo.id)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Error cargando pedidos:", error);
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
        <h1 className="text-xl font-bold">No pudimos cargar los pedidos</h1>
        <p className="mt-2 text-sm">Recarga la página e inténtalo nuevamente.</p>
      </div>
    );
  }

  const pedidos = (data ?? []) as Pedido[];
  return (
    <div className="space-y-7 text-[var(--text-primary)]">
      <header>
        <div className="flex items-center gap-3">
          <ShoppingBag size={28} className="text-[var(--color-primary)]" />
          <h1 className="text-2xl font-black sm:text-3xl">Pedidos</h1>
        </div>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Pedidos recibidos en {catalogo.nombre}.
        </p>
      </header>

      {pedidos.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] px-6 py-14 text-center">
          <PackageCheck size={42} className="mx-auto text-[var(--color-primary)]" />
          <h2 className="mt-4 text-lg font-bold">Todavía no tienes pedidos</h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Cuando un cliente confirme su carrito, el pedido aparecerá aquí.
          </p>
          <Link href="/dashboard" className="mt-6 inline-flex rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-bold text-white">
            Volver al dashboard
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {pedidos.map((pedido) => {
            const numeroWhatsApp = pedido.comprador_telefono.replace(/\D/g, "");
            const referencia = `PED-${String(pedido.numero).padStart(6, "0")}`;
            return (
              <article key={pedido.id} className="overflow-hidden rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)]">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--border-card)] p-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                      Pedido {referencia}
                    </p>
                    <h2 className="mt-1 text-lg font-bold">{pedido.comprador_nombre}</h2>
                    <p className="mt-1 text-xs text-[var(--text-secondary)]">
                      {formatearFecha(pedido.created_at)}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xl font-black">{formatearImporte(pedido.total, pedido.moneda)}</p>
                    <div className="mt-2 flex flex-wrap gap-2 sm:justify-end">
                      <span className="rounded-full border border-[var(--border-card)] px-3 py-1 text-xs font-bold">
                        {etiquetaEstado(pedido.estado_pedido)}
                      </span>
                      <span className="rounded-full border border-[var(--border-card)] px-3 py-1 text-xs font-bold">
                        Pago: {etiquetaEstado(pedido.estado_pago)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid gap-6 p-5 lg:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-bold">Productos</h3>
                    <ul className="mt-3 space-y-2">
                      {pedido.pedido_items.map((item) => (
                        <li key={item.id} className="flex justify-between gap-4 text-sm">
                          <span>{item.cantidad} × {item.nombre_producto}</span>
                          <span className="shrink-0 font-semibold">{formatearImporte(item.subtotal, pedido.moneda)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2 text-sm">
                    <h3 className="font-bold">Datos del comprador</h3>
                    <p>Teléfono: {pedido.comprador_telefono}</p>
                    {pedido.comprador_email && <p>Correo: {pedido.comprador_email}</p>}
                    {pedido.direccion_entrega && <p>Entrega: {pedido.direccion_entrega}</p>}
                    {pedido.notas && <p>Nota: {pedido.notas}</p>}
                    <p className="text-[var(--text-secondary)]">
                      Método: {pedido.metodo_pago === "whatsapp" ? "Coordinación por WhatsApp" : pedido.metodo_pago}
                    </p>
                    {numeroWhatsApp && (
                      <a
                        href={`https://wa.me/${numeroWhatsApp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex rounded-xl bg-[#25D366] px-4 py-2.5 font-bold text-white"
                      >
                        Contactar por WhatsApp
                      </a>
                    )}
                  </div>
                </div>
                <div className="px-5 pb-5">
                  <PedidoAcciones
                    pedidoId={pedido.id}
                    estadoPedido={pedido.estado_pedido}
                    estadoPago={pedido.estado_pago}
                  />
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
