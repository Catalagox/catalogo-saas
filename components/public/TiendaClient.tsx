"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import { supabase } from "@/lib/supabaseClient";
import { useCart } from "@/context/CartContext";

/*
 * Usamos nombres de tienda dentro de este componente,
 * pero conservamos temporalmente las rutas antiguas de los
 * archivos para no romper las importaciones.
 *
 * Cuando renombremos esos archivos solamente cambiaremos
 * las rutas de importación.
 */
import TiendaHeader from "@/components/public/TiendaHeader";
import TiendaFooter from "@/components/public/TiendaFooter";
import TiendaLista from "@/components/public/TiendaLista";
import TiendaGaleria from "@/components/public/TiendaGaleria";

import CategoriasSlider from "@/components/public/CategoriasSlider";
import CartDrawer from "@/components/public/CartDrawer";

interface Producto {
  id: string;
  nombre: string;
  descripcion?: string | null;
  precio: number;
  imagen_url?: string | null;
  disponible?: boolean | null;
  stock?: number | null;
  slug: string;
}

interface Categoria {
  id: string;
  nombre: string;
  productos: Producto[];
}

interface Tienda {
  id: string;
  nombre: string;
  logo?: string;
  user_id: string;

  /*
   * Este campo mantiene su nombre porque así está
   * registrado actualmente en Supabase.
   */
  estilo_menu?: "lista" | "galeria";

  slug?: string;
  pais_code?: string;

  // COLORES DE LA TIENDA
  color_primario?: string;
  color_fondo?: string;
  color_header?: string;
  color_text_header?: string;
  color_border_header?: string;
  color_footer?: string;
  color_texto?: string;
  color_precio?: string;
  color_hamburguesa?: string;
  color_tarjeta?: string;
  color_categoria?: string;
  color_lupa?: string;
  color_fondo_categoria?: string;
  color_texto_categoria?: string;
  color_border_categoria?: string;

  // CONTACTO
  whatsapp?: string;

  // REDES SOCIALES
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
}

interface TiendaClientProps {
  /*
   * Conservamos el nombre "catalogo" en la propiedad
   * temporalmente porque la página pública ya lo utiliza.
   * Dentro del componente lo renombramos como "tienda".
   */
  catalogo: Tienda | null;
  categorias: Categoria[];
  countryCode?: string;
  rutaBase: string;
}

export default function TiendaClient({
  catalogo: tienda,
  categorias,
  countryCode,
  rutaBase,
}: TiendaClientProps) {
  const categoriasVisitadas = useRef<Set<string>>(new Set());

  const { cantidadTotal } = useCart();

  const [carritoAbierto, setCarritoAbierto] = useState(false);

  const [componenteMontado, setComponenteMontado] = useState(false);

  useEffect(() => {
    setComponenteMontado(true);
  }, []);

  /*
   * Registra una sola visualización por categoría
   * durante la visita actual.
   */
  const registrarVistaCategoria = useCallback(
    async (categoriaId: string) => {
      if (!tienda?.user_id) {
        return;
      }

      if (categoriasVisitadas.current.has(categoriaId)) {
        return;
      }

      /*
       * Marcamos la categoría antes de iniciar la petición
       * para evitar envíos duplicados por eventos rápidos.
       */
      categoriasVisitadas.current.add(categoriaId);

      const { error } = await supabase.from("estadisticas").insert({
        user_id: tienda.user_id,
        tipo: "categoria_view",
      });

      if (error) {
        console.error("Error registrando vista de categoría:", error);
      }
    },
    [tienda?.user_id],
  );

  /*
   * Este caso normalmente no debería ocurrir porque la
   * página del servidor ya comprueba la tienda. Se conserva
   * como respaldo visual.
   */
  if (!tienda) {
    return (
      <div className="mx-auto min-h-screen w-full max-w-2xl animate-pulse space-y-6 p-4">
        <div className="h-32 w-full rounded-2xl bg-gray-800/50" />

        <div className="flex gap-2 overflow-hidden">
          <div className="h-8 w-24 shrink-0 rounded-full bg-gray-800/50" />
          <div className="h-8 w-24 shrink-0 rounded-full bg-gray-800/50" />
          <div className="h-8 w-24 shrink-0 rounded-full bg-gray-800/50" />
        </div>

        <div className="space-y-4 pt-4">
          <div className="h-24 w-full rounded-xl bg-gray-800/40" />
          <div className="h-24 w-full rounded-xl bg-gray-800/40" />
          <div className="h-24 w-full rounded-xl bg-gray-800/40" />
        </div>
      </div>
    );
  }

  const categoriasSeguras = Array.isArray(categorias) ? categorias : [];

  const vistaTienda = tienda.estilo_menu ?? "lista";

  const paisTienda = countryCode ?? tienda.pais_code ?? "PE";

  const colorFondo = tienda.color_fondo ?? "#fefefe";

  const colorHeader = tienda.color_header ?? "#2c2c2c";

  const colorTextoHeader = tienda.color_text_header ?? "#ffffff";

  const colorBordeHeader =
    tienda.color_border_header ?? "rgba(255,255,255,0.1)";

  const colorFooter = tienda.color_footer ?? "#111827";

  const colorTexto = tienda.color_texto ?? "#4f4d4d";

  const colorPrecio = tienda.color_precio ?? "#22c55e";

  const colorHamburguesa = tienda.color_hamburguesa ?? "#ffffff";

  const colorTarjeta = tienda.color_tarjeta ?? "#ffffff10";

  const colorCategoria = tienda.color_categoria ?? "#eae9e9";

  const colorPrimario = tienda.color_primario ?? "#f97316";

  const colorLupa = tienda.color_lupa ?? "#ffffff";

  const colorFondoCategoria = tienda.color_fondo_categoria ?? "#ffffff";

  const colorTextoCategoria = tienda.color_texto_categoria ?? "#111827";

  const colorBordeCategoria = tienda.color_border_categoria ?? "#e5e7eb";

  const temaTienda = {
    "--color-bg": colorFondo,
    "--color-header": colorHeader,
    "--color-text-header": colorTextoHeader,
    "--color-border-header": colorBordeHeader,
    "--color-footer": colorFooter,
    "--color-text": colorTexto,
    "--color-price": colorPrecio,
    "--color-hamburguesa": colorHamburguesa,
    "--color-card": colorTarjeta,
    "--color-categoria": colorCategoria,
    "--color-primary": colorPrimario,
    "--color-lupa": colorLupa,
    "--color-fondo-categoria": colorFondoCategoria,
    "--color-texto-categoria": colorTextoCategoria,
    "--color-border-categoria": colorBordeCategoria,
  } as CSSProperties;

  return (
    <div
      className="relative flex min-h-screen w-full flex-col bg-[var(--color-bg)] transition-colors duration-300"
      style={temaTienda}
    >
      {/* ENCABEZADO DE LA TIENDA */}
      <TiendaHeader
        catalogo={tienda}
        categorias={categoriasSeguras}
        rutaBase={rutaBase}
      />

      {/* NAVEGACIÓN POR CATEGORÍAS */}
      <CategoriasSlider
        categorias={categoriasSeguras}
        onTrackCategoria={registrarVistaCategoria}
        colorFondoCategoria={colorFondoCategoria}
        colorTextoCategoria={colorTextoCategoria}
        colorBorderCategoria={colorBordeCategoria}
        colorHeader={colorHeader}
        colorTextHeader={colorTextoHeader}
        colorBorderHeader={colorBordeHeader}
      />

      {/* PRODUCTOS DE LA TIENDA */}
      <main className="mx-auto mb-0 w-full max-w-7xl flex-grow px-0 pb-0 pt-8 sm:px-6 lg:px-8">
        {vistaTienda === "lista" ? (
          <TiendaLista
            categorias={categoriasSeguras}
            countryCode={paisTienda}
            rutaBase={rutaBase}
            colorFondoCategoria={colorFondoCategoria}
            colorTextoCategoria={colorTextoCategoria}
            colorBorderCategoria={colorBordeCategoria}
          />
        ) : (
          <TiendaGaleria
            categorias={categoriasSeguras}
            rutaBase={rutaBase}
            countryCode={paisTienda}
            colorFondoCategoria={colorFondoCategoria}
            colorTextoCategoria={colorTextoCategoria}
            colorBorderCategoria={colorBordeCategoria}
          />
        )}
      </main>

      {/* PIE DE LA TIENDA */}
      <TiendaFooter
        instagram={tienda.instagram}
        facebook={tienda.facebook}
        tiktok={tienda.tiktok}
        youtube={tienda.youtube}
        nombreTienda={tienda.nombre}
      />

      {/* BOTÓN FLOTANTE DEL CARRITO */}
      {componenteMontado && cantidadTotal > 0 && (
        <button
          type="button"
          onClick={() => setCarritoAbierto(true)}
          aria-label={`Ver carrito con ${cantidadTotal} ${
            cantidadTotal === 1 ? "producto" : "productos"
          }`}
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center gap-2 rounded-full p-4 text-white shadow-2xl transition-transform active:scale-95 touch-manipulation"
          style={{
            backgroundColor: "var(--color-primary)",
          }}
        >
          <span aria-hidden="true" className="text-2xl">
            🛒
          </span>

          <span className="absolute -right-1 -top-1 rounded-full bg-white px-2 py-0.5 text-xs font-bold text-black shadow">
            {cantidadTotal}
          </span>
        </button>
      )}

      {/* PANEL DEL CARRITO */}
      {componenteMontado && (
        <CartDrawer
          isOpen={carritoAbierto}
          onClose={() => setCarritoAbierto(false)}
          catalogoNombre={tienda.nombre}
          whatsapp={tienda.whatsapp}
          userCountry={paisTienda}
        />
      )}
    </div>
  );
}
