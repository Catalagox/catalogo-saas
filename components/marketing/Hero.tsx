"use client";
import {
  FaStore,
  FaUsers,
  FaGlobe,
  FaRocket,
  FaPalette,
  FaMobileAlt,
} from "react-icons/fa";
import Link from "next/link";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

export default function Hero() {
  return (
    <section className="w-full">
      {/* HERO */}
      <div className="relative w-full min-h-screen flex items-center px-4 sm:px-6 overflow-hidden">
        {/* Imagen de fondo con efecto de zoom sutil */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[2000ms] hover:scale-105"
          style={{
            backgroundImage:
              "url('/Gemini_Generated_Image_9oqc4l9oqc4l9oqc.png')",
          }}
        />

        {/* Overlay - Gradiente para mejorar la lectura del texto */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />

        {/* Contenido centrado y animado */}
        <div className="relative z-10 max-w-7xl mx-auto text-center py-20 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white leading-none tracking-tighter">
              <span className="text-[var(--color-primary)]">Catálogos</span>{" "}
              <br className="hidden md:block" />
              <span className="inline-block mt-2">Digitales & Menús QR</span>
            </h1>

            <p className="mt-8 text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-medium">
              Crea catálogos profesionales y menús digitales con código QR.
              Moderniza tu negocio y permite que tus clientes accedan a tu
              información desde cualquier celular con una experiencia premium.
            </p>

            {/* Contenedor del Botón - Optimizado para que no se desborden las letras */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href="/auth"
                className="
            relative inline-flex items-center justify-center gap-3 
            w-full max-w-[340px] sm:max-w-none sm:w-auto 
            px-8 sm:px-12 py-4 sm:py-5 
            bg-[var(--color-primary)] text-black rounded-2xl 
            font-black text-base sm:text-lg 
            hover:bg-white transition-all duration-300 
            shadow-[0_20px_40px_rgba(var(--color-primary-rgb),0.3)] 
            hover:-translate-y-1 active:scale-95
          "
              >
                <span className="text-center leading-tight">
                  ¡Empezar mi transformación!
                </span>
                <FaRocket className="animate-bounce flex-shrink-0 text-xl" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Decoración: Indicador de Scroll (Opcional) */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div className="w-[2px] h-10 bg-gradient-to-b from-[var(--color-primary)] to-transparent" />
        </div>
      </div>

      {/* BLOQUE PRO + MOCKUP */}
      <div className="w-full py-20 sm:py-32 bg-gradient-to-br from-[#041d14] via-[#06281c] to-black relative overflow-hidden">
        {/* DECORACIÓN AMBIENTAL */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[var(--color-primary)] opacity-[0.05] blur-[120px] rounded-full"></div>
          <div className="absolute top-20 right-10 w-64 h-64 border border-white/5 rounded-full scale-150"></div>
        </div>

        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
          {/* COLUMNA IZQUIERDA: CONTENIDO */}
          <div className="text-center md:text-left order-2 md:order-1">
            {/* Badge Superior */}
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-[var(--color-primary)] uppercase bg-[var(--color-primary)]/10 rounded-full border border-[var(--color-primary)]/20">
              Experiencia Contactless
            </span>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
              Tu menú en el{" "}
              <span className="text-[var(--color-primary)]">celular</span> de
              tus clientes
            </h2>

            <p className="text-gray-400 text-lg sm:text-xl mb-10 max-w-lg mx-auto md:mx-0 leading-relaxed">
              Tus clientes escanean el código QR y acceden automáticamente.
              <span className="text-white font-medium">
                {" "}
                Sin instalaciones, sin esperas y siempre actualizado.
              </span>
            </p>

            {/* LISTA DE BENEFICIOS CON ESTILO */}
            <ul className="space-y-5 mb-10">
              {[
                "Acceso instantáneo desde cualquier navegador",
                "Cambios de precios y platos al instante",
                "Interfaz intuitiva y optimizada para ventas",
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-4 text-gray-200 justify-center md:justify-start group"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center group-hover:bg-[var(--color-primary)] transition-colors">
                    <svg
                      className="w-4 h-4 text-[var(--color-primary)] group-hover:text-black"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  <span className="text-base sm:text-lg">{item}</span>
                </li>
              ))}
            </ul>

            {/* BOTÓN DE ACCIÓN (OPCIONAL) */}
            <div className="flex justify-center md:justify-start">
              <button className="px-8 py-4 bg-[var(--color-primary)] text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.4)] hover:-translate-y-1 transition-all duration-300">
                Empezar ahora
              </button>
            </div>
          </div>

          {/* COLUMNA DERECHA: MOCKUP */}
          <div className="relative flex justify-center md:justify-end order-1 md:order-2 mb-12 md:mb-0">
            {/* Resplandor dinámico */}
            <div className="absolute inset-0 bg-[var(--color-primary)] opacity-20 blur-[100px] animate-pulse"></div>

            {/* El Teléfono con inclinación sutil */}
            <div className="relative z-10 transform md:rotate-2 hover:rotate-0 transition-transform duration-700">
              <img
                src="/ChatGPT Image 17 abr 2026, 13_09_41.png"
                alt="Mockup Menú Digital"
                className="w-[280px] sm:w-[320px] md:w-[380px] drop-shadow-[0_35px_60px_rgba(0,0,0,0.6)]"
              />

              {/* Elemento flotante extra (opcional) */}
              <div className="absolute -bottom-6 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-2xl hidden sm:block animate-bounce-slow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-xl">
                    📱
                  </div>
                  <div>
                    <p className="text-white text-xs font-bold uppercase tracking-tighter">
                      Escaneo Exitoso
                    </p>
                    <p className="text-gray-400 text-[10px]">
                      Carga en menos de 1s
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="max-w-6xl mx-auto px-6">
        {/* SECCIÓN DE PRODUCTOS */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* OPCIÓN 1: CATÁLOGOS */}
          <div className="group relative p-8 sm:p-12 rounded-[2.5rem] bg-white border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)] transition-all duration-500 overflow-hidden flex flex-col">
            {/* Decoración de fondo sutil */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-[var(--color-primary)]/5 rounded-full group-hover:scale-150 transition-transform duration-700" />

            <div className="relative z-10 flex flex-col h-full">
              <div className="mb-8 inline-flex w-14 h-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-emerald-500 text-white shadow-lg shadow-[var(--color-primary)]/20">
                <FaPalette className="text-2xl" />
              </div>

              <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
                Catálogos <br />
                <span className="text-[var(--color-primary)]">
                  Digitales Pro
                </span>
              </h2>

              <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                Convierte tu stock en una vitrina de lujo. Ideal para marcas que
                quieren vender con imágenes que enamoran y procesos rápidos.
              </p>

              <ul className="space-y-4 mb-10">
                {[
                  "Enlaces directos a WhatsApp",
                  "Categorización inteligente",
                  "Galería de alta resolución",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 font-medium text-slate-700"
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs italic">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <button className="mt-auto w-fit px-6 py-3 bg-slate-900 text-white rounded-xl font-bold group-hover:bg-[var(--color-primary)] group-hover:text-black transition-colors duration-300">
                Saber más
              </button>
            </div>
          </div>

          {/* OPCIÓN 2: MENÚS QR (Variante en Oscuro para contraste) */}
          <div className="group relative p-8 sm:p-12 rounded-[2.5rem] bg-slate-900 shadow-2xl transition-all duration-500 flex flex-col overflow-hidden">
            {/* Brillo de fondo */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/10 blur-[80px] rounded-full" />

            <div className="relative z-10 flex flex-col h-full">
              <div className="mb-8 inline-flex w-14 h-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-[var(--color-primary)]">
                <FaMobileAlt className="text-2xl" />
              </div>

              <h2 className="text-3xl font-black text-white mb-4 tracking-tight">
                Menús con <br />
                <span className="text-[var(--color-primary)]">Código QR</span>
              </h2>

              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                La revolución del sector gastronómico. Escaneo veloz, sin
                contacto y con actualizaciones de precios al instante.
              </p>

              <ul className="space-y-4 mb-10">
                {[
                  "Higiene total garantizada",
                  "Ahorro masivo en impresión",
                  "Gestión de pedidos en mesa",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 font-medium text-slate-200"
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 text-[var(--color-primary)] flex items-center justify-center text-xs italic border border-white/10">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <button className="mt-auto w-fit px-6 py-3 bg-[var(--color-primary)] text-black rounded-xl font-bold hover:scale-105 transition-transform duration-300">
                Probar Demo
              </button>
            </div>
          </div>
        </div>
        {/* BENEFICIOS: ESTILO CLEAN & PREMIUM */}
        <div className="mt-32 py-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
              Diseñado para el{" "}
              <span className="text-[var(--color-primary)]">éxito</span> de tu
              negocio
            </h2>
            <p className="mt-4 text-slate-500 text-lg max-w-2xl mx-auto">
              Nos enfocamos en la simplicidad y la velocidad para que tú solo te
              preocupes de vender.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: FaRocket,
                title: "Fácil de Usar",
                desc: "Sin configuraciones complejas. Sube tus productos y lanza tu catálogo en minutos.",
                bg: "bg-blue-50/50",
              },
              {
                icon: FaPalette,
                title: "Diseño Profesional",
                desc: "Tus clientes verán una interfaz elegante y moderna que genera confianza inmediata.",
                bg: "bg-emerald-50/50",
              },
              {
                icon: FaMobileAlt,
                title: "100% Accesible",
                desc: "Optimizado para cualquier dispositivo. Sin apps, directo desde el navegador.",
                bg: "bg-orange-50/50",
              },
            ].map((benefit, i) => (
              <div
                key={i}
                className="group relative p-10 bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.06)] hover:-translate-y-3 transition-all duration-500 text-left"
              >
                {/* Círculo de color sutil al fondo */}
                <div
                  className={`absolute top-8 right-8 w-16 h-16 ${benefit.bg} rounded-full transition-transform duration-500 group-hover:scale-[3] opacity-50`}
                />

                <div className="relative z-10">
                  <div className="mb-8 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 text-white shadow-xl group-hover:bg-[var(--color-primary)] group-hover:text-black transition-colors duration-300">
                    <benefit.icon className="text-3xl" />
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">
                    {benefit.title}
                  </h3>

                  <p className="text-slate-500 leading-relaxed italic md:not-italic">
                    {benefit.desc}
                  </p>
                </div>

                {/* Línea decorativa inferior */}
                <div className="absolute bottom-0 left-10 right-10 h-[2px] bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>

        {/* SECCIÓN ESTADÍSTICAS ANIMADAS */}
        <div className="mt-32 relative group">
          {/* Fondo con gradiente y efecto de cristal oscuro */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#06281c] via-[#041d14] to-black rounded-[3rem] shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)] opacity-[0.03] blur-[100px]" />
          </div>

          <div className="relative p-12 sm:p-20 text-white text-center">
            {/* Contenedor de las Stats */}
            <div className="grid md:grid-cols-3 gap-16 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-white/5">
              {[
                {
                  Icon: FaStore,
                  end: 500,
                  suffix: "+",
                  label: "Negocios Activos",
                },
                {
                  Icon: FaUsers,
                  end: 10,
                  suffix: "K+",
                  label: "Clientes Felices",
                },
                { Icon: FaGlobe, end: 100, suffix: "%", label: "Digitalizado" },
              ].map((item, i) => {
                const { ref, inView } = useInView({
                  triggerOnce: true,
                  threshold: 0.5,
                });

                return (
                  <div
                    key={i}
                    ref={ref}
                    className="px-4 py-6 md:py-0 group/stat"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: i * 0.2 }}
                    >
                      <item.Icon className="text-3xl mx-auto mb-6 text-[var(--color-primary)] opacity-80 group-hover/stat:scale-110 transition-transform duration-300" />

                      <div className="text-5xl md:text-6xl font-black mb-3 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">
                        {inView ? (
                          <CountUp
                            end={item.end}
                            duration={2.5}
                            suffix={item.suffix}
                          />
                        ) : (
                          "0"
                        )}
                      </div>

                      <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">
                        {item.label}
                      </p>
                    </motion.div>
                  </div>
                );
              })}
            </div>

            {/* Botón con micro-animación optimizado para Responsive */}
            <motion.div
              className="mt-12 sm:mt-16 flex justify-center px-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <Link
                href="/auth"
                className="
      relative inline-flex items-center justify-center gap-3 
      w-full max-w-[340px] sm:max-w-none sm:w-auto 
      px-6 sm:px-10 py-4 sm:py-5 
      bg-[var(--color-primary)] text-black rounded-2xl 
      font-black text-sm sm:text-lg 
      hover:bg-white transition-all duration-300 
      shadow-[0_20px_40px_rgba(var(--color-primary-rgb),0.2)] 
      hover:shadow-[0_20px_40px_rgba(255,255,255,0.1)] 
      hover:-translate-y-1 active:scale-95
    "
              >
                {/* El texto ahora puede romper línea si el celular es muy pequeño, evitando el desborde */}
                <span className="text-center leading-tight">
                  ¡Empezar mi transformación!
                </span>

                {/* El cohete no se encoge (flex-shrink-0) */}
                <FaRocket className="animate-bounce flex-shrink-0 text-xl" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
