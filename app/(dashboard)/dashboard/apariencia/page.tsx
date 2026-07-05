"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AparienciaForm from "@/components/dashboard/apariencia/AparienciaForm";
import PhonePreview from "@/components/dashboard/apariencia/PhonePreview";

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
  const [colorCategoria, setColorCategoria] = useState("#ffffff");
  const [colorLupa, setColorLupa] = useState("#ffffff");

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
        setColorCategoria(data.color_categoria || "#ffffff");
        setColorLupa(data.color_lupa || "#ffffff");

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
        color_categoria: colorCategoria,
        color_lupa: colorLupa,
      })
      .eq("id", catalogoId);

    if (error) {
      console.error(error);
      alert("Error al guardar");
      return;
    }

    alert("Guardado ");
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-[var(--text-secondary)]">
        Cargando...
      </div>
    );
  }

  return (
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
          colorCategoria={colorCategoria}
          setColorCategoria={setColorCategoria}
          colorLupa={colorLupa}
          setColorLupa={setColorLupa}
          guardar={guardar}
        />
      </div>

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
            colorCategoria={colorCategoria}
            colorLupa={colorLupa}
          />
        </div>
      </div>

    </div>
  );
}