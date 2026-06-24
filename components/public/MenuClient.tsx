"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import MenuHeader from "@/components/public/MenuHeader";
import MenuFooter from "@/components/public/MenuFooter";
import MenuLista from "@/components/public/MenuLista";
import MenuGaleria from "@/components/public/MenuGaleria";
import { useCart } from "@/context/CartContext"; 

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

  // 🎨 COLORES
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

  // 📱 CONTACTO
  whatsapp?: string;

  // 🌎 REDES
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
}

interface MenuClientProps {
  catalogo: Catalogo | null;
  categorias: Categoria[];
}

export default function MenuClient({ catalogo, categorias }: MenuClientProps) {
  const [categoriaActiva, setCategoriaActiva] = useState<string | null>(null);
  
  // 🔥 ESTADOS PARA EL EFECTO AUTOMÁTICO TIPO MERCADO LIBRE
  const [showCategories, setShowCategories] = useState(true);
  const lastScrollY = useRef(0);

  // Evitar tracking duplicado
  const categoriasVisitadas = useRef<Set<string>>(new Set());

  // 🛍️ EXTRAEMOS LAS FUNCIONES INCLUYENDO CLEARCART
  const { items, increaseQuantity, decreaseQuantity, total, cantidadTotal, clearCart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // EVITAR ERRORES DE HIDRATACIÓN CON LOCALSTORAGE
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!catalogo) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        Cargando menú...
      </div>
    );
  }

  const safeCategorias = categorias ?? [];
  const viewMode = catalogo.estilo_menu ?? "lista";

  const colorFondo = catalogo.color_fondo ?? "#fefefe";
  const colorHeader = catalogo.color_header ?? "#2c2c2c";
  const colorTextHeader = catalogo.color_text_header ?? "#ffffff";       
  const colorBorderHeader = catalogo.color_border_header ?? "rgba(255,255,255,0.1)"; 
  const colorFooter = catalogo.color_footer ?? "#111827";
  const colorTexto = catalogo.color_texto ?? "#ffffff";
  const colorPrecio = catalogo.color_precio ?? "#22c55e";
  const colorHamburguesa = catalogo.color_hamburguesa ?? "#ffffff";
  const colorTarjeta = catalogo.color_tarjeta ?? "#ffffff10";
  const colorCategoria = catalogo.color_categoria ?? "#eae9e9";
  const colorPrimario = catalogo.color_primario ?? "#f97316";
  const colorLupa = catalogo.color_lupa ?? "#ffffff";

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

  // 🔥 FUNCIÓN ACTUALIZADA: ENVÍA EL PEDIDO, LIMPIA EL CARRITO Y CIERRA EL INTERFAZ
  const enviarPedidoWhatsApp = () => {
    if (items.length === 0 || !catalogo.whatsapp) return;

    let mensaje = `*¡Hola! Me gustaría realizar el siguiente pedido en ${catalogo.nombre}:*\n\n`;
    
    items.forEach((item) => {
      const subtotal = item.precio * item.cantidad;
      mensaje += `• ${item.cantidad}x *${item.nombre}* - $${item.precio.toLocaleString()} (Subtotal: $${subtotal.toLocaleString()})\n`;
    });

    mensaje += `\n*Total a pagar: $${total.toLocaleString()}*`;
    mensaje += `\n\n_Pedido enviado desde el catálogo web._`;

    const numeroFormateado = catalogo.whatsapp.replace(/[^0-9]/g, "");
    const whatsappUrl = `https://wa.me/${numeroFormateado}?text=${encodeURIComponent(mensaje)}`;

    window.open(whatsappUrl, "_blank");

    // ✨ Acción de reinicio post-compra
    clearCart();
    setIsCartOpen(false);
  };

  // DETECTAR SCROLL: CAMBIO DE CATEGORÍA ACTIVA + EFECTO OCULTAR/MOSTRAR
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 150) {
        setShowCategories(false);
      } else {
        setShowCategories(true);
      }
      lastScrollY.current = currentScrollY;

      let current: string | null = null;
      safeCategorias.forEach((categoria) => {
        const element = document.getElementById(`categoria-${categoria.id}`);
        if (element) {
          const rect = element.getBoundingClientRect();
          const offsetCheck = showCategories ? 160 : 90;
          if (rect.top <= offsetCheck && rect.bottom >= offsetCheck) {
            current = categoria.id;
          }
        }
      });

      if (current && current !== categoriaActiva) {
        setCategoriaActiva(current);
        trackCategoria(current);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [safeCategorias, categoriaActiva, showCategories]);

  return (
    <div
      className="min-h-screen w-full flex flex-col bg-[var(--color-bg)] transition-colors duration-300 relative"
      style={theme}
    >
      {/* HEADER PRINCIPAL */}
      <MenuHeader catalogo={catalogo} categorias={safeCategorias} />

      {/* SUB-BARRA DE CATEGORÍAS */}
      {safeCategorias.length > 0 && (
        <div
          className={`sticky z-40 w-full border-b border-white/10 bg-[var(--color-bg)] transition-all duration-300 ease-in-out ${
            showCategories 
              ? "top-20 opacity-100 translate-y-0" 
              : "top-0 md:top-20 opacity-0 -translate-y-full pointer-events-none"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="overflow-x-auto whitespace-nowrap py-3 flex gap-3 scrollbar-hide">
              {safeCategorias.map((categoria) => {
                const isActive = categoriaActiva === categoria.id;

                return (
                  <button
                    key={categoria.id}
                    onClick={() => {
                      setCategoriaActiva(categoria.id);
                      trackCategoria(categoria.id);

                      const element = document.getElementById(
                        `categoria-${categoria.id}`,
                      );

                      if (element) {
                        const yOffset = showCategories ? -150 : -90;
                        const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
                        window.scrollTo({ top: y, behavior: "smooth" });
                      }
                    }}
                    className={`px-5 py-2.5 rounded-2xl text-sm font-bold tracking-wide transition-all duration-300 border flex-shrink-0 shadow-sm ${
                      isActive
                        ? `bg-[var(--color-primary)] text-white border-[var(--color-primary)] scale-105 shadow-lg`
                        : `bg-[var(--color-card)] hover:bg-white/10 text-[var(--color-categoria)] border-[var(--color-categoria)]/20`
                    }`}
                  >
                    {categoria.nombre}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 🛍️ MAIN */}
      <main className="max-w-7xl mx-auto w-full px-0 sm:px-6 lg:px-8 pt-8 pb-0 mb-0 flex-grow">
        {viewMode === "lista" ? (
          <MenuLista categorias={safeCategorias} />
        ) : catalogo.slug ? (
          <MenuGaleria categorias={safeCategorias} slug={catalogo.slug} />
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

      {/* ========================================================= */}
      {/* 🛒 RENDERIZADO VISUAL DEL CARRITO FLOTANTE Y MODAL        */}
      {/* ========================================================= */}
      {isMounted && cantidadTotal > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 p-4 rounded-full text-white shadow-2xl flex items-center justify-center gap-2 z-50 transition-transform active:scale-95"
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
            style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
          >
            <div>
              <div className="flex justify-between items-center mb-6 border-b pb-4 border-white/10">
                <h2 className="text-xl font-black uppercase tracking-wider">Tu Pedido</h2>
                <button onClick={() => setIsCartOpen(false)} className="text-xl opacity-70 hover:opacity-100">✕</button>
              </div>

              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 scrollbar-hide">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                    <div>
                      <p className="font-bold text-sm sm:text-base">{item.nombre}</p>
                      <p className="text-xs font-black text-[var(--color-price)]">
                        ${item.precio.toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-black/20 rounded-lg p-1 border border-white/10">
                      <button onClick={() => decreaseQuantity(item.id)} className="w-8 h-8 flex items-center justify-center font-bold hover:bg-white/10 rounded">-</button>
                      <span className="font-bold text-sm w-4 text-center">{item.cantidad}</span>
                      <button onClick={() => increaseQuantity(item.id)} className="w-8 h-8 flex items-center justify-center font-bold hover:bg-white/10 rounded">+</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4 border-white/10">
              <div className="flex justify-between items-center mb-4 px-1">
                <span className="text-sm font-bold uppercase opacity-60 tracking-wider">Total estimado:</span>
                <span className="text-2xl font-black text-[var(--color-price)]">
                  ${total.toLocaleString()}
                </span>
              </div>
              
              <button
                onClick={enviarPedidoWhatsApp}
                className="w-full h-14 rounded-xl font-black text-sm uppercase tracking-widest text-white flex justify-center items-center gap-2 transition-all hover:brightness-110 active:scale-[0.99]"
                style={{ backgroundColor: "#25D366" }}
              >
                💬 Enviar a WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}