import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PaginasDashboard from "@/components/dashboard/paginas/PaginasDashboard";
import type { PaginaTienda } from "@/lib/tienda-diseno/types";

export const dynamic = "force-dynamic";

export default async function PaginasPage() {
  const supabase = await createClient();
  const { data: { user }, error: errorUsuario } = await supabase.auth.getUser();
  if (errorUsuario || !user) redirect("/auth?redirect=%2Fdashboard%2Fpaginas");

  const { data: tienda, error: errorTienda } = await supabase
    .from("catalogos").select("id, nombre").eq("user_id", user.id).maybeSingle();
  if (errorTienda) throw new Error("No pudimos cargar tu tienda.");
  if (!tienda) redirect("/onboarding?next=%2Fdashboard%2Fpaginas");

  const { data: paginas, error } = await supabase
    .from("paginas_tienda")
    .select("id, catalogo_id, titulo, slug, contenido, estado, created_at, updated_at")
    .eq("catalogo_id", tienda.id)
    .order("created_at", { ascending: false })
    .order("id", { ascending: true });
  if (error) throw new Error("No pudimos cargar las páginas de tu tienda.");

  return <PaginasDashboard key={tienda.id} catalogoId={tienda.id}
    nombreTienda={tienda.nombre} paginasIniciales={(paginas ?? []) as PaginaTienda[]} />;
}
