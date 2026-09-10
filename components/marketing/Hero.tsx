"use client";
import {
  FaStore,
  FaUsers,
  FaGlobe,
  FaRocket,
  FaPalette,
  FaMobileAlt,
  FaShoppingBag,
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import FloatingWhatsapp from "@/components/marketing/FloatingWhatsapp";

export default function Hero() {
  return (
    <section className="w-full">
      {/* HERO PRINCIPAL: POSICIONAMIENTO TIENDA ONLINE */}
      <div className="relative w-full min-h-screen flex items-center px-4 sm:px-6 overflow-hidden bg-gradient-to-bl from-black via-[#021a10] to-black border-b border-white/5">
        {/* DECORACIÓN AMBIENTAL */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] -left-[10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[140px] rounded-full" />
          <div className="absolute bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[140px] rounded-full" />
          <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-96 h-96 border border-emerald-500/5 rounded-full scale-150" />
        </div>

        {/* Contenedor Principal */}
        <div className="relative z-10 max-w-7xl mx-auto text-center py-20 sm:py-24 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex flex-col items-center"
          >
            {/* Badge de Posicionamiento */}
            <span className="inline-block px-4 py-1.5 mb-6 text-xs sm:text-sm font-bold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 rounded-full border border-emerald-500/20">
              Plataforma de E-Commerce Fácil y Rápida
            </span>

            {/* Título Principal Reorientado */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.2] sm:leading-[1.15] tracking-tight max-w-5xl mx-auto text-center px-2 mb-6">
              Crea tu <span className="text-emerald-400 font-black">Tienda Online</span>{" "}
              profesional y vende por Internet
            </h1>

            {/* Subtítulo Ajustado */}
            <p className="text-base sm:text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-medium">
              Publica tus productos, activa tu carrito de compras y recibe pedidos
              organizados por WhatsApp. Todo con tu propio{" "}
              <span className="text-white font-semibold">catálogo digital</span> y{" "}
              <span className="text-white font-semibold">código QR</span>.
            </p>

            {/* Botones de Acción */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4">
              <Link
                href="/auth"
                className="group relative inline-flex items-center justify-center gap-3 w-full max-w-[340px] sm:max-w-none sm:w-auto px-8 sm:px-12 py-4 sm:py-5 bg-emerald-500 text-black rounded-2xl font-black text-base sm:text-xl overflow-hidden transition-all duration-300 shadow-[0_10px_30px_rgba(16,185,129,0.2)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.4)] hover:-translate-y-1 active:scale-95"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                <span className="relative z-10 text-slate-950 text-center leading-tight">
                  ¡Crear mi tienda gratis!
                </span>
                <FaRocket className="animate-bounce flex-shrink-0 text-xl text-slate-950 relative z-10" />
              </Link>

              <Link
                href="/prueba"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-3 w-full max-w-[340px] sm:max-w-none sm:w-auto px-8 sm:px-12 py-4 sm:py-5 bg-white/5 text-white rounded-2xl font-black text-base sm:text-xl border border-white/10 backdrop-blur-md overflow-hidden transition-all duration-300 hover:bg-white/10 hover:border-emerald-500/30 hover:-translate-y-1 active:scale-95"
              >
                <span className="relative z-10 text-center leading-tight">
                  Ver demo
                </span>
                <svg
                  className="w-5 h-5 text-emerald-400 transition-transform duration-300 group-hover:translate-x-1 relative z-10"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>

            <p className="mt-6 text-xs sm:text-sm text-gray-400/80 font-medium tracking-wide flex items-center justify-center gap-2 flex-wrap">
              <span>Prueba 7 días gratis</span>
              <span className="text-emerald-500/50">•</span>
              <span>Sin tarjeta de crédito</span>
              <span className="text-emerald-500/50">•</span>
              <span>Sin comisiones por venta</span>
            </p>
          </motion.div>
        </div>

        {/* Indicador de Scroll */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <div className="w-[1px] h-10 bg-gradient-to-b from-emerald-500 to-transparent" />
        </div>
      </div>

      {/* SECCIÓN WHATSAPP & PEDIDOS */}
      <div className="w-full py-16 sm:py-28 bg-gradient-to-bl from-black via-[#021a10] to-black relative overflow-hidden border-t border-b border-white/5">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[140px] rounded-full" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
          {/* Columna Izquierda */}
          <div className="text-center md:text-left order-2 md:order-1 flex flex-col justify-center">
            <span className="inline-block w-fit px-4 py-1.5 mb-4 text-xs font-bold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 rounded-full border border-emerald-500/20 mx-auto md:mx-0">
              Cero Comisiones por Venta
            </span>

            <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white mb-6 leading-[1.15] tracking-tight">
              Tu tienda online sin intermediarios ni comisiones.
            </h3>

            <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-8 max-w-lg mx-auto md:mx-0">
              Recibe los pedidos de tu tienda virtual directamente en tu chat de
              atención. Construye tu lista de clientes y mantén el control total de tus ventas sin ceder márgenes a terceros.
            </p>

            <div className="p-5 sm:p-6 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 backdrop-blur-sm max-w-lg mx-auto md:mx-0 text-left">
              <p className="text-xs sm:text-sm text-gray-300 font-mono leading-relaxed">
                <span className="text-emerald-400 font-bold">
                  💡 Ventaja E-Commerce:
                </span>{" "}
                Tener un carrito de compras directo en tu tienda online optimiza el checkout y eleva la tasa de conversión respecto a listas estáticas.
              </p>
            </div>
          </div>

          {/* Columna Derecha */}
          <div className="text-center md:text-left order-1 md:order-2">
            <span className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 rounded-full border border-emerald-500/20">
              Ventas por WhatsApp
            </span>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
              Recibe pedidos organizados en tu{" "}
              <span className="text-emerald-400">WhatsApp</span>
            </h2>

            <p className="text-gray-400 text-base sm:text-xl mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed">
              Tus clientes arman su carrito en tu tienda online y te envían un mensaje estructurado con el resumen detallado de su compra.
            </p>

            <ul className="space-y-4 mb-8 text-left max-w-lg mx-auto md:mx-0">
              {[
                "Detalle automático de productos y total del carrito",
                "Cero errores de interpretación de pedidos",
                "El cliente es tuyo: guarda su contacto para volver a venderle",
                "Integrable con catálogo digital y menú QR",
              ].map((item, index) => (
                <li key={index} className="flex items-start sm:items-center gap-3 text-gray-200 group">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center mt-0.5 sm:mt-0">
                    <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-sm sm:text-base font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* BLOQUE DE CARACTERÍSTICAS Y MOCKUP */}
      <div className="w-full py-16 sm:py-28 bg-gradient-to-br from-[#041d14] via-[#06281c] to-black relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
          {/* Texto */}
          <div className="text-center md:text-left order-2 md:order-1">
            <span className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 rounded-full border border-emerald-500/20">
              Experiencia Móvil Perfecta
            </span>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
              Tu tienda online siempre accesible
            </h2>

            <p className="text-gray-400 text-base sm:text-xl mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed">
              Tus clientes compran desde cualquier navegador sin instalar aplicaciones. Puedes compartir tu tienda por enlace o mediante código QR.
            </p>

            <ul className="space-y-4 mb-10 text-left max-w-lg mx-auto md:mx-0">
              {[
                "Carga ultra rápida optimizada para celulares",
                "Actualiza precios, productos y stock al instante",
                "Diseño moderno que genera confianza inmediata",
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-gray-200">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-sm sm:text-base font-medium">{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex justify-center md:justify-start">
              <Link
                href="/auth"
                className="px-8 py-4 bg-emerald-400 text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(52,211,153,0.4)] hover:-translate-y-1 transition-all duration-300 text-center"
              >
                Crear mi tienda ahora
              </Link>
            </div>
          </div>

          {/* Mockup */}
          <div className="relative flex justify-center md:justify-end order-1 md:order-2 mb-8 md:mb-0">
            <div className="absolute inset-0 bg-emerald-500 opacity-15 blur-[100px] animate-pulse" />
            <div className="relative z-10 transform md:rotate-2 hover:rotate-0 transition-transform duration-700">
              <Image
                src="/ChatGPT Image 17 abr 2026, 13_09_41.png"
                alt="Tienda Online Catalagox en Celular"
                width={380}
                height={760}
                priority
                className="w-[260px] sm:w-[320px] md:w-[380px] h-auto drop-shadow-[0_35px_60px_rgba(0,0,0,0.6)]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* TARJETAS DE SOLUCIÓN: TIENDA ONLINE / MÓDULOS COMPLEMENTARIOS */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mt-20 sm:mt-28 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Opción 1: Tienda Online & Catálogo */}
          <div className="group relative p-8 sm:p-12 rounded-[2.5rem] bg-white border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)] transition-all duration-500 overflow-hidden flex flex-col">
            <div className="relative z-10 flex flex-col h-full">
              <div className="mb-6 inline-flex w-14 h-14 items-center justify-center rounded-2xl bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20">
                <FaShoppingBag className="text-2xl" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4 tracking-tight">
                Tienda Online & <br />
                <span className="text-emerald-600">Catálogo Digital</span>
              </h2>

              <p className="text-slate-600 text-base sm:text-lg mb-6 leading-relaxed">
                Muestra todo tu catálogo de productos con fotos, categorías, descripciones y precios actualizados en tiempo real.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  "Carrito de compra interactivo",
                  "Enlace único para redes sociales y bio",
                  "Categorización ilimitada de productos",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-medium text-slate-700 text-sm sm:text-base">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/auth"
                className="mt-auto w-full sm:w-fit px-6 py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-emerald-500 hover:text-black transition-colors duration-300 text-center"
              >
                Crear Tienda
              </Link>
            </div>
          </div>

          {/* Opción 2: Menú QR para Gastronomía y Locales */}
          <div className="group relative p-8 sm:p-12 rounded-[2.5rem] bg-slate-900 shadow-2xl transition-all duration-500 flex flex-col overflow-hidden">
            <div className="relative z-10 flex flex-col h-full">
              <div className="mb-6 inline-flex w-14 h-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-emerald-400">
                <FaMobileAlt className="text-2xl" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white mb-4 tracking-tight">
                Menú QR para <br />
                <span className="text-emerald-400">Locales y Mesas</span>
              </h2>

              <p className="text-slate-400 text-base sm:text-lg mb-6 leading-relaxed">
                La solución ideal para locales gastronómicos o tiendas físicas. Escaneo instantáneo desde la mesa o vitrina.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  "Acceso inmediato sin descargar apps",
                  "Ahorro directo en impresión de cartas",
                  "Pedidos directo al mostrador o WhatsApp",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-medium text-slate-200 text-sm sm:text-base">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/10 text-emerald-400 flex items-center justify-center text-xs font-bold border border-white/10">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/prueba"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto w-full sm:w-fit px-6 py-3.5 bg-emerald-400 text-black rounded-xl font-bold hover:scale-105 transition-transform duration-300 block text-center"
              >
                Ver Demo en Video
              </Link>
            </div>
          </div>
        </div>

        {/* BENEFICIOS DEL SISTEMA */}
        <div className="mt-20 sm:mt-28 py-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Diseñado para hacer crecer tu <span className="text-emerald-600">tienda online</span>
            </h2>
            <p className="mt-4 text-slate-500 text-base sm:text-lg max-w-2xl mx-auto">
              Simplicidad, velocidad y todas las herramientas de venta en un solo lugar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: FaRocket,
                title: "Creación Instantánea",
                desc: "Publica tus productos y ten tu tienda online lista en cuestión de minutos.",
                bg: "bg-blue-50/50",
              },
              {
                icon: FaPalette,
                title: "Personalización Total",
                desc: "Añade tu logo, adapta tus colores y comparte una imagen profesional a tu marca.",
                bg: "bg-emerald-50/50",
              },
              {
                icon: FaMobileAlt,
                title: "100% Responsivo",
                desc: "Tus clientes disfrutan de una experiencia fluida desde cualquier smartphone.",
                bg: "bg-orange-50/50",
              },
            ].map((benefit, i) => (
              <div
                key={i}
                className="group relative p-8 sm:p-10 bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-300 text-left"
              >
                <div className={`absolute top-8 right-8 w-16 h-16 ${benefit.bg} rounded-full transition-transform duration-500 group-hover:scale-[2.5] opacity-50`} />
                <div className="relative z-10">
                  <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-900 text-white shadow-xl group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors duration-300">
                    <benefit.icon className="text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                    {benefit.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ESTADÍSTICAS ANIMADAS */}
        <div className="mt-20 sm:mt-28 mb-16 relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#06281c] via-[#041d14] to-black rounded-[2.5rem] sm:rounded-[3rem] shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 opacity-[0.03] blur-[100px]" />
          </div>

          <div className="relative p-8 sm:p-16 text-white text-center">
            <div className="grid md:grid-cols-3 gap-10 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
              {[
                {
                  Icon: FaStore,
                  end: 500,
                  suffix: "+",
                  label: "Tiendas Creadas",
                },
                {
                  Icon: FaUsers,
                  end: 10,
                  suffix: "K+",
                  label: "Clientes Felices",
                },
                { Icon: FaGlobe, end: 100, suffix: "%", label: "Optimizado" },
              ].map((item, i) => {
                const { ref, inView } = useInView({
                  triggerOnce: true,
                  threshold: 0.5,
                });

                return (
                  <div key={i} ref={ref} className="px-4 py-4 md:py-0">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: i * 0.2 }}
                    >
                      <item.Icon className="text-3xl mx-auto mb-4 text-emerald-400 opacity-80" />
                      <div className="text-4xl sm:text-6xl font-black mb-2 tracking-tight text-white">
                        {inView ? (
                          <CountUp end={item.end} duration={2.5} suffix={item.suffix} />
                        ) : (
                          "0"
                        )}
                      </div>
                      <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                        {item.label}
                      </p>
                    </motion.div>
                  </div>
                );
              })}
            </div>

            <motion.div
              className="mt-10 sm:mt-12 flex justify-center px-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <Link
                href="/auth"
                className="relative inline-flex items-center justify-center gap-3 w-full max-w-[340px] sm:max-w-none sm:w-auto px-6 sm:px-10 py-4 bg-emerald-500 text-black rounded-2xl font-black text-sm sm:text-lg hover:bg-white transition-all duration-300 shadow-[0_10px_30px_rgba(16,185,129,0.2)] hover:-translate-y-1 active:scale-95"
              >
                <span className="text-center leading-tight">
                  ¡Crear mi tienda online gratis!
                </span>
                <FaRocket className="animate-bounce flex-shrink-0 text-xl" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      <FloatingWhatsapp />
    </section>
  );
}