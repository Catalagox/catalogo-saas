"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AparienciaForm from "@/components/dashboard/apariencia/AparienciaForm";
import PhonePreview from "@/components/dashboard/apariencia/PhonePreview";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Palette } from "lucide-react";

export default function AparienciaPage() {
  const [nombre, setNombre] = useState("");
  const [colorPrimario, setColorPrimario] = useState("#f97316");
  const [colorFondo, setColorFondo] = useState("#111827");
  const [estiloMenu, setEstiloMenu] = useState<"lista" | "galeria">("lista");
  const [catalogoId, setCatalogoId] = useState<string | null>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [colorHeader, setColorHeader] = useState("#f97316");
  const [colorTextHeader, setColorTextHeader] = useState("#ffffff");
  const [colorBorderHeader, setColorBorderHeader] = useState("#ffffff10");
  const [colorFooter, setColorFooter] = useState("#111827");
  const [colorTexto, setColorTexto] = useState("#ffffff");
  const [colorPrecio, setColorPrecio] = useState("#22c55e");
  const [colorHamburguesa, setColorHamburguesa] = useState("#ffffff");
  const [colorTarjeta, setColorTarjeta] = useState("#ffffff10");

  const [colorLupa, setColorLupa] = useState("#ffffff");
  const [colorFondoCategoria, setColorFondoCategoria] = useState("#ffffff");
  const [colorTextoCategoria, setColorTextoCategoria] = useState("#111827");
  const [colorBorderCategoria, setColorBorderCategoria] = useState("#e5e7eb");

  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("catalogos")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error cargando catálogo:", error);
        return;
      }

      if (data) {
        setCatalogoId(data.id);
        setNombre(data.nombre || "");
        setEstiloMenu(data.estilo_menu || "lista");
        setLogo(data.logo || null);
        setColorPrimario(data.color_primario || "#f97316");
        setColorFondo(data.color_fondo || "#111827");
        setColorHeader(data.color_header || "#f97316");
        setColorTextHeader(data.color_text_header || "#ffffff");
        setColorBorderHeader(data.color_border_header || "#ffffff10");
        setColorFooter(data.color_footer || "#111827");
        setColorTexto(data.color_texto || "#ffffff");
        setColorPrecio(data.color_precio || "#22c55e");
        setColorHamburguesa(data.color_hamburguesa || "#ffffff");
        setColorTarjeta(data.color_tarjeta || "#ffffff10");

        setColorLupa(data.color_lupa || "#ffffff");
        setColorFondoCategoria(data.color_fondo_categoria || "#ffffff");
        setColorTextoCategoria(data.color_texto_categoria || "#111827");
        setColorBorderCategoria(data.color_border_categoria || "#e5e7eb");

        await cargarMenu(data.id);
      }
    } catch (err) {
      console.error("Error general:", err);
    } finally {
      setLoading(false);
    }
  };

  const cargarMenu = async (catalogoId: string) => {
    try {
      const { data: categoriasData } = await supabase
        .from("categorias")
        .select("*")
        .eq("catalogo_id", catalogoId);

      const { data: productosData } = await supabase
        .from("productos")
        .select("*")
        .eq("catalogo_id", catalogoId)
        .eq("disponible", true);

      const categoriasSafe = categoriasData || [];
      const productosSafe = productosData || [];

      const resultado = categoriasSafe.map((cat: any) => ({
        ...cat,
        productos: productosSafe.filter((p: any) => p.categoria_id === cat.id),
      }));

      setCategorias(resultado);
    } catch (err) {
      console.error(err);
      setCategorias([]);
    }
  };

  const guardar = async () => {
    if (!catalogoId) return;

    const { error } = await supabase
      .from("catalogos")
      .update({
        nombre,
        estilo_menu: estiloMenu,
        color_primario: colorPrimario,
        color_fondo: colorFondo,
        color_header: colorHeader,
        color_text_header: colorTextHeader,
        color_border_header: colorBorderHeader,
        color_footer: colorFooter,
        color_texto: colorTexto,
        color_precio: colorPrecio,
        color_hamburguesa: colorHamburguesa,
        color_tarjeta: colorTarjeta,

        color_lupa: colorLupa,
        color_fondo_categoria: colorFondoCategoria,
        color_texto_categoria: colorTextoCategoria,
        color_border_categoria: colorBorderCategoria,
      })
      .eq("id", catalogoId);

    if (error) {
      console.error(error);
      alert("Error al guardar");
      return;
    }

    alert("Guardado exitosamente");
  };

 // 🔄 LOADING (SKELETON PÁGINA APARIENCIA)
  if (loading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 animate-pulse">
        {/* 🟢 HEADER SKELETON (PageHeader) */}
        <div className="flex items-center justify-between py-4 border-b border-[var(--border-card)] mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)]" />
            <div className="space-y-2">
              <div className="h-3 w-16 rounded bg-white/10" />
              <div className="h-6 w-56 rounded-lg bg-white/10" />
            </div>
          </div>
          <div className="h-9 w-20 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)]" />
        </div>

        {/* 🟢 DOS COLUMNAS: FORMULARIO Y PREVIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start relative max-w-full">
          
          {/* Columna Izquierda: Simulación del AparienciaForm */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="h-6 w-48 rounded-md bg-white/10 mb-4" />
            
            {/* Input Nombre */}
            <div className="space-y-2">
              <div className="h-3 w-28 rounded bg-white/10" />
              <div className="h-11 w-full rounded-xl bg-white/5 border border-[var(--border-card)]" />
            </div>

            {/* Selector Estilo Menú */}
            <div className="space-y-2">
              <div className="h-3 w-32 rounded bg-white/10" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-10 rounded-xl bg-white/5 border border-[var(--border-card)]" />
                <div className="h-10 rounded-xl bg-white/5 border border-[var(--border-card)]" />
              </div>
            </div>

            {/* Grid de Selectores de Color (Color Pickers) */}
            <div className="space-y-3 pt-2">
              <div className="h-4 w-40 rounded bg-white/10" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="h-12 rounded-xl bg-white/5 border border-[var(--border-card)] flex items-center p-2 gap-2"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/10 shrink-0" />
                    <div className="h-3 w-12 rounded bg-white/10" />
                  </div>
                ))}
              </div>
            </div>

            {/* Botón Guardar */}
            <div className="pt-4">
              <div className="h-12 w-full rounded-xl bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/30" />
            </div>
          </div>

          {/* Columna Derecha: Simulación de la Maqueta PhonePreview (solo visible en LG) */}
          <div className="hidden lg:flex justify-end">
            <div className="w-[300px] h-[580px] rounded-[40px] bg-[var(--bg-card)] border-4 border-[var(--border-card)] p-4 flex flex-col justify-between items-center relative shadow-xl">
              {/* Notch / Cámara del teléfono */}
              <div className="w-28 h-4 bg-white/10 rounded-full mb-4" />
              
              {/* Pantalla simulada */}
              <div className="w-full flex-1 rounded-2xl bg-white/5 border border-white/5 p-3 space-y-3">
                <div className="h-10 w-full rounded-lg bg-white/10" />
                <div className="h-6 w-20 rounded bg-white/10" />
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-20 rounded-lg bg-white/5" />
                  <div className="h-20 rounded-lg bg-white/5" />
                </div>
              </div>

              {/* Barra inferior del teléfono */}
              <div className="w-20 h-1 bg-white/10 rounded-full mt-4" />
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Reutilizable */}
      <PageHeader
        title="Personalizar Apariencia"
        category="Diseño"
        icon={Palette}
        showBackButton={true}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start relative max-w-full">
        <div className="w-full">
          <AparienciaForm
            nombre={nombre}
            setNombre={setNombre}
            colorPrimario={colorPrimario}
            setColorPrimario={setColorPrimario}
            colorFondo={colorFondo}
            setColorFondo={setColorFondo}
            estiloMenu={estiloMenu}
            setEstiloMenu={setEstiloMenu}
            colorHeader={colorHeader}
            setColorHeader={setColorHeader}
            colorTextHeader={colorTextHeader}
            setColorTextHeader={setColorTextHeader}
            colorBorderHeader={colorBorderHeader}
            setColorBorderHeader={setColorBorderHeader}
            colorFooter={colorFooter}
            setColorFooter={setColorFooter}
            colorTexto={colorTexto}
            setColorTexto={setColorTexto}
            colorPrecio={colorPrecio}
            setColorPrecio={setColorPrecio}
            colorHamburguesa={colorHamburguesa}
            setColorHamburguesa={setColorHamburguesa}
            colorTarjeta={colorTarjeta}
            setColorTarjeta={setColorTarjeta}
            colorLupa={colorLupa}
            setColorLupa={setColorLupa}
            colorFondoCategoria={colorFondoCategoria}
            setColorFondoCategoria={setColorFondoCategoria}
            colorTextoCategoria={colorTextoCategoria}
            setColorTextoCategoria={setColorTextoCategoria}
            colorBorderCategoria={colorBorderCategoria}
            setColorBorderCategoria={setColorBorderCategoria}
            guardar={guardar}
          />
        </div>

        {/* Teléfono fijo solo en escritorio */}
        <div className="hidden lg:block lg:sticky lg:top-6 h-fit w-full">
          <div className="flex justify-center lg:justify-end">
            <PhonePreview
              nombre={nombre}
              colorFondo={colorFondo}
              estiloMenu={estiloMenu}
              logo={logo}
              categorias={categorias}
              colorHeader={colorHeader}
              colorTextHeader={colorTextHeader}
              colorBorderHeader={colorBorderHeader}
              colorFooter={colorFooter}
              colorTexto={colorTexto}
              colorPrecio={colorPrecio}
              colorHamburguesa={colorHamburguesa}
              colorTarjeta={colorTarjeta}
              colorLupa={colorLupa}
              colorFondoCategoria={colorFondoCategoria}
              colorTextoCategoria={colorTextoCategoria}
              colorBorderCategoria={colorBorderCategoria}
            />
          </div>
        </div>
      </div>

      {/* Botón solo en pantallas menores a 1024px */}
      <button
        onClick={() => setPreviewOpen(true)}
        className="lg:hidden fixed bottom-24 right-5 z-[60] rounded-full bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-xl"
      >
        Ver vista previa
      </button>

      {/* Modal de Vista Previa Móvil */}
      {previewOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative max-h-full overflow-auto">
            <button
              onClick={() => setPreviewOpen(false)}
              className="absolute right-2 top-2 z-10 h-9 w-9 rounded-full bg-black/70 text-lg text-white"
              aria-label="Cerrar vista previa"
            >
              ×
            </button>

            <PhonePreview
              nombre={nombre}
              colorFondo={colorFondo}
              estiloMenu={estiloMenu}
              logo={logo}
              categorias={categorias}
              colorHeader={colorHeader}
              colorTextHeader={colorTextHeader}
              colorBorderHeader={colorBorderHeader}
              colorFooter={colorFooter}
              colorTexto={colorTexto}
              colorPrecio={colorPrecio}
              colorHamburguesa={colorHamburguesa}
              colorTarjeta={colorTarjeta}
              colorLupa={colorLupa}
              colorFondoCategoria={colorFondoCategoria}
              colorTextoCategoria={colorTextoCategoria}
              colorBorderCategoria={colorBorderCategoria}
            />
          </div>
        </div>
      )}
    </div>
  );
}