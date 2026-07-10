"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import MenuHeader from "@/components/public/MenuHeader";
import MenuFooter from "@/components/public/MenuFooter";
import MenuLista from "@/components/public/MenuLista";
import MenuGaleria from "@/components/public/MenuGaleria";
import CategoriasSlider from "@/components/public/CategoriasSlider";
import { useCart } from "@/context/CartContext";
import Price from "@/components/ui/Price";

// TIPOS
interface Producto {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  imagen_url?: string;
  disponible?: boolean;
  slug: string;
}

interface Categoria {
  id: string;
  nombre: string;
  productos: Producto[];
}

interface Catalogo {
  id: string;
  nombre: string;
  logo?: string;
  user_id: string;
  estilo_menu?: "lista" | "galeria";
  slug?: string;
  pais_code?: string;

  // COLORES
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

  // REDES
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
}

interface MenuClientProps {
  catalogo: Catalogo | null;
  categorias: Categoria[];
  countryCode?: string;
}

export default function MenuClient({
  catalogo,
  categorias,
  countryCode,
}: MenuClientProps) {
  // Evitar tracking duplicado
  const categoriasVisitadas = useRef<Set<string>>(new Set());

  // Carrito
  const {
    items,
    increaseQuantity,
    decreaseQuantity,
    total,
    cantidadTotal,
    clearCart,
  } = useCart();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Evitar errores de hidratacion con localStorage
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!catalogo) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        Cargando menu...
      </div>
    );
  }

  const safeCategorias = categorias ?? [];
  const viewMode = catalogo.estilo_menu ?? "lista";
  const userCountry = countryCode ?? catalogo.pais_code ?? "PE";

  const colorFondo = catalogo.color_fondo ?? "#fefefe";
  const colorHeader = catalogo.color_header ?? "#2c2c2c";
  const colorTextHeader = catalogo.color_text_header ?? "#ffffff";
  const colorBorderHeader =
    catalogo.color_border_header ?? "rgba(255,255,255,0.1)";
  const colorFooter = catalogo.color_footer ?? "#111827";
  const colorTexto = catalogo.color_texto ?? "#4f4d4d";
  const colorPrecio = catalogo.color_precio ?? "#22c55e";
  const colorHamburguesa = catalogo.color_hamburguesa ?? "#ffffff";
  const colorTarjeta = catalogo.color_tarjeta ?? "#ffffff10";
  const colorCategoria = catalogo.color_categoria ?? "#eae9e9";
  const colorPrimario = catalogo.color_primario ?? "#f97316";
  const colorLupa = catalogo.color_lupa ?? "#ffffff";
  const colorFondoCategoria = catalogo.color_fondo_categoria ?? "#ffffff";
  const colorTextoCategoria = catalogo.color_texto_categoria ?? "#df0c0c";
  const colorBorderCategoria = catalogo.color_border_categoria ?? "#e5e7eb";

  const theme = {
    "--color-bg": colorFondo,
    "--color-header": colorHeader,
    "--color-text-header": colorTextHeader,
    "--color-border-header": colorBorderHeader,
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
    "--color-border-categoria": colorBorderCategoria,
  } as React.CSSProperties;

  const trackCategoria = async (categoriaId: string) => {
    if (categoriasVisitadas.current.has(categoriaId)) return;
    categoriasVisitadas.current.add(categoriaId);

    try {
      await supabase.from("estadisticas").insert({
        user_id: catalogo.user_id,
        tipo: "categoria_view",
      });
    } catch (err) {
      console.error("TRACKING CATEGORIA ERROR:", err);
    }
  };

  const formatPriceWithCurrency = (amount: number) => {
    if (userCountry === "PE") return `S/. ${amount.toLocaleString()}`;
    if (userCountry === "CL") return `$CLP ${amount.toLocaleString()}`;
    if (userCountry === "CO") return `$COP ${amount.toLocaleString()}`;
    if (userCountry === "MX") return `$MXN ${amount.toLocaleString()}`;
    if (userCountry === "AR") return `$ARS ${amount.toLocaleString()}`;
    return `$${amount.toLocaleString()}`;
  };

  const enviarPedidoWhatsApp = () => {
    if (items.length === 0 || !catalogo.whatsapp) return;

    let mensaje = `*Hola! Me gustaria realizar el siguiente pedido en ${catalogo.nombre}:*\n\n`;

    items.forEach((item) => {
      const subtotal = item.precio * item.cantidad;
      mensaje += `- ${item.cantidad}x *${item.nombre}* - ${formatPriceWithCurrency(
        item.precio
      )} (Subtotal: ${formatPriceWithCurrency(subtotal)})\n`;
    });

    mensaje += `\n*Total a pagar: ${formatPriceWithCurrency(total)}*`;
    mensaje += `\n\n_Pedido enviado desde el catalogo web._`;

    const numeroFormateado = catalogo.whatsapp.replace(/[^0-9]/g, "");
    const whatsappUrl = `https://wa.me/${numeroFormateado}?text=${encodeURIComponent(
      mensaje
    )}`;

    window.open(whatsappUrl, "_blank");

    clearCart();
    setIsCartOpen(false);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col bg-[var(--color-bg)] transition-colors duration-300 relative"
      style={theme}
    >
      {/* HEADER PRINCIPAL */}
      <MenuHeader catalogo={catalogo} categorias={safeCategorias} />

      {/* SUB-BARRA DE CATEGORIAS */}
<CategoriasSlider
  categorias={safeCategorias}
  onTrackCategoria={trackCategoria}
  colorFondoCategoria={colorFondoCategoria}
  colorTextoCategoria={colorTextoCategoria}
  colorBorderCategoria={colorBorderCategoria}
  colorHeader={colorHeader}
  colorTextHeader={colorTextHeader}
  colorBorderHeader={colorBorderHeader}
/>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto w-full px-0 sm:px-6 lg:px-8 pt-8 pb-0 mb-0 flex-grow">
        {viewMode === "lista" ? (
          <MenuLista
            categorias={safeCategorias}
            countryCode={userCountry}
            colorFondoCategoria={colorFondoCategoria}
            colorTextoCategoria={colorTextoCategoria}
            colorBorderCategoria={colorBorderCategoria}
          />
        ) : catalogo.slug ? (
          <MenuGaleria
            categorias={safeCategorias}
            slug={catalogo.slug}
            countryCode={userCountry}
            colorFondoCategoria={colorFondoCategoria}
            colorTextoCategoria={colorTextoCategoria}
            colorBorderCategoria={colorBorderCategoria}
          />
        ) : (
          <div className="text-center text-red-400 py-10">
            Error: slug no disponible
          </div>
        )}
      </main>

      {/* FOOTER */}
      <MenuFooter
        instagram={catalogo.instagram}
        facebook={catalogo.facebook}
        tiktok={catalogo.tiktok}
        youtube={catalogo.youtube}
      />

      {/* CARRITO FLOTANTE */}
      {isMounted && cantidadTotal > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 p-4 rounded-full text-white shadow-2xl flex items-center justify-center gap-2 z-50 transition-transform active:scale-95 touch-manipulation"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          <span className="text-2xl">🛒</span>
          <span className="font-bold bg-white text-black text-xs px-2 py-0.5 rounded-full absolute -top-1 -right-1 shadow">
            {cantidadTotal}
          </span>
        </button>
      )}

      {isMounted && isCartOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-end z-[9999]">
          <div
            className="w-full max-w-md h-full p-6 flex flex-col justify-between shadow-2xl overflow-hidden"
            style={{
              backgroundColor: "var(--color-bg)",
              color: "var(--color-text)",
            }}
          >
            <div>
              <div className="flex justify-between items-center mb-6 border-b pb-4 border-white/10">
                <h2 className="text-xl font-black uppercase tracking-wider">
                  Tu Pedido
                </h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-xl opacity-70 hover:opacity-100 p-2"
                >
                  x
                </button>
              </div>

              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 scrollbar-hide">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5"
                  >
                    <div>
                      <p className="font-bold text-sm sm:text-base">
                        {item.nombre}
                      </p>
                      <div className="text-xs font-black text-[var(--color-price)]">
                        <Price amount={item.precio} countryCode={userCountry} />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-black/20 rounded-lg p-1 border border-white/10">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="w-8 h-8 flex items-center justify-center font-bold md:hover:bg-white/10 active:bg-white/20 rounded"
                      >
                        -
                      </button>
                      <span className="font-bold text-sm w-4 text-center">
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="w-8 h-8 flex items-center justify-center font-bold md:hover:bg-white/10 active:bg-white/20 rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4 border-white/10">
              <div className="flex justify-between items-center mb-4 px-1">
                <span className="text-sm font-bold uppercase opacity-60 tracking-wider">
                  Total estimado:
                </span>
                <div className="text-2xl font-black text-[var(--color-price)]">
                  <Price amount={total} countryCode={userCountry} />
                </div>
              </div>

              <button
                onClick={enviarPedidoWhatsApp}
                className="w-full h-14 rounded-xl font-black text-sm uppercase tracking-widest text-white flex justify-center items-center gap-2 transition-all md:hover:brightness-110 active:scale-[0.98] touch-manipulation"
                style={{ backgroundColor: "#25D366" }}
              >
                Enviar a WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
