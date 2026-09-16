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

const HERO_BENEFITS = [
  "Publica productos, precios y stock",
  "Recibe pedidos directamente en WhatsApp",
  "Sin comisiones por cada venta",
];

export default function Hero() {
  return (
    <section className="w-full bg-[var(--marketing-bg-white)]">
      {/* =========================================================
          HERO PRINCIPAL
          VERDE + BLANCO
          CURVA VERTICAL PROFESIONAL
          SIN DEGRADADOS
          ========================================================= */}
      <div className="relative w-full min-h-[1080px] sm:min-h-[1120px] md:min-h-[1040px] lg:min-h-[860px] overflow-hidden bg-[var(--marketing-bg-white)]">
        {/* =======================================================
            FORMA VERDE PRINCIPAL
            ======================================================= */}
        <div className="absolute inset-0 pointer-events-none">
          {/* DESKTOP */}
          <svg
            className="
              hidden
              md:block
              absolute
              inset-0
              w-full
              h-full
            "
            viewBox="0 0 1440 820"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="
    M 0 0
    H 1440
    V 820
    C 980 760 430 55 0 0
    Z
  "
              fill="var(--marketing-primary)"
            />
          </svg>

          {/* MOBILE */}
          <svg
            className="
              md:hidden
              absolute
              inset-0
              w-full
              h-full
            "
            viewBox="0 0 500 900"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="
                M 0 665
                C 95 610 195 605 285 642
                C 365 675 435 665 500 620
                V 900
                H 0
                Z
              "
              fill="var(--marketing-primary)"
            />
          </svg>
        </div>

        {/* =======================================================
            DECORACIÓN VERDE
            MUY SUTIL
            ======================================================= */}
        <div
          className="
            absolute
            inset-0
            pointer-events-none
            overflow-hidden
          "
        >
          {/* Círculo grande */}
          <div
            className="
              absolute
              hidden
              md:block
              right-[8%]
              top-[17%]
              w-28
              h-28
              lg:w-36
              lg:h-36
              rounded-full
              border
              border-[var(--marketing-bg-white)]/25
            "
          />

          {/* Círculo pequeño */}
          <div
            className="
              absolute
              hidden
              md:block
              right-[13%]
              top-[23%]
              w-12
              h-12
              lg:w-16
              lg:h-16
              rounded-full
              border
              border-[var(--marketing-bg-white)]/35
            "
          />

          {/* Cruz */}
          <span
            className="
              absolute
              hidden
              md:block
              right-[29%]
              top-[20%]
              text-[var(--marketing-bg-white)]
              text-4xl
              font-light
              opacity-60
            "
          >
            +
          </span>

          {/* Punto */}
          <span
            className="
              absolute
              hidden
              md:block
              right-[10%]
              top-[42%]
              w-2
              h-2
              rounded-full
              bg-[var(--marketing-bg-white)]
              opacity-70
            "
          />

          {/* Punto pequeño */}
          <span
            className="
              absolute
              hidden
              md:block
              right-[26%]
              top-[48%]
              w-1.5
              h-1.5
              rounded-full
              bg-[var(--marketing-bg-white)]
              opacity-60
            "
          />
        </div>

        {/* =======================================================
            CONTENIDO PRINCIPAL
            ======================================================= */}
        <div
          className="
            relative
            z-10
            min-h-[1080px]
            sm:min-h-[1120px]
            md:min-h-[1040px]
            lg:min-h-[860px]
            max-w-7xl
            mx-auto
            px-5
            sm:px-8
            lg:px-10
            flex
            items-start
            lg:items-center
            pt-28
            sm:pt-32
            lg:pt-24
          "
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="
              w-full
              max-w-2xl
              lg:max-w-[600px]
              text-center
              lg:text-left
              flex
              flex-col
              items-center
              lg:items-start
              pt-0
              pb-[440px]
              sm:pb-[500px]
              lg:pb-0
            "
          >
           

            {/* ===================================================
                TÍTULO
                =================================================== */}
            <motion.h1
              initial={{
                opacity: 0,
                y: 18,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.25,
                duration: 0.7,
              }}
              className="
                mt-0
                max-w-[620px]
                text-[var(--marketing-text-dark)]
                font-black
                tracking-[-0.035em]
                leading-[1.02]
                text-[2.65rem]
                sm:text-[3.4rem]
                md:text-[3.8rem]
                lg:text-[4rem]
                xl:text-[4.35rem]
              "
            >
              Crea tu tienda online
              <span className="block text-[var(--marketing-text-dark)]">y empieza a vender</span>
            </motion.h1>

            {/* ===================================================
                SUBTÍTULO
                =================================================== */}
            <motion.p
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.4,
                duration: 0.6,
              }}
              className="
                mt-6
                sm:mt-7
                max-w-xl
                text-base
                sm:text-lg
                lg:text-xl
                text-[var(--marketing-text-dark)]
                leading-relaxed
                font-medium
              "
            >
              Lanza una tienda profesional en minutos, muestra tus productos y
              convierte visitas en pedidos directamente por WhatsApp.
            </motion.p>

            <motion.ul
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.48, duration: 0.6 }}
              className="mt-6 w-full max-w-xl space-y-3 text-left"
            >
              {HERO_BENEFITS.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-center gap-3 text-sm sm:text-base font-semibold text-[#475569]"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--marketing-primary)] text-xs font-black text-[var(--marketing-text-dark)]">
                    ✓
                  </span>
                  {benefit}
                </li>
              ))}
            </motion.ul>

            {/* ===================================================
                BOTONES
                =================================================== */}
            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.55,
                duration: 0.6,
              }}
              className="
                mt-7
                sm:mt-9
                flex
                flex-col
                sm:flex-row
                items-center
                justify-center
                lg:justify-start
                gap-3
                sm:gap-4
                w-full
              "
            >
              {/* CTA PRINCIPAL */}
              <Link
                href="/auth"
                className="
                  group
                  inline-flex
                  items-center
                  justify-center
                  gap-3
                  w-full
                  sm:w-auto
                  min-w-[230px]
                  px-7
                  py-3.5
                  sm:px-8
                  sm:py-4
                  bg-[var(--marketing-primary)]
                  text-[var(--marketing-text-dark)]
                  rounded-xl
                  font-extrabold
                  text-sm
                  sm:text-base
                  transition-all
                  duration-300
                  hover:bg-[var(--marketing-primary)]
                  hover:-translate-y-1
                  hover:shadow-[0_12px_30px_color-mix(in_srgb,var(--marketing-primary)_22%,transparent)]
                  active:scale-95
                "
              >
                <span>Crear mi tienda gratis</span>

                <FaRocket
                  className="
                    text-base
                    sm:text-lg
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                />
              </Link>

              {/* DEMO */}
              <Link
                href="/prueba"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group
                  inline-flex
                  items-center
                  justify-center
                  gap-3
                  w-full
                  sm:w-auto
                  min-w-[150px]
                  px-7
                  py-3.5
                  sm:px-8
                  sm:py-4
                  bg-[var(--marketing-bg-white)]
                  text-[var(--marketing-text-dark)]
                  rounded-full
                  font-extrabold
                  text-sm
                  sm:text-base
                  border
                  border-gray-300
                  transition-all
                  duration-300
                  hover:border-[var(--marketing-primary)]
                  hover:text-[var(--marketing-primary)]
                  hover:-translate-y-1
                  active:scale-95
                "
              >
                <span>Ver tienda demo</span>

                <svg
                  className="
                    w-4
                    h-4
                    sm:w-5
                    sm:h-5
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
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
            </motion.div>

            {/* ===================================================
                CONFIANZA
                =================================================== */}
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 0.75,
                duration: 0.6,
              }}
              className="
                mt-6
                flex
                items-center
                justify-center
                lg:justify-start
                flex-wrap
                gap-x-3
                sm:gap-x-4
                gap-y-2
                text-[11px]
                sm:text-xs
                md:text-sm
                text-[var(--marketing-text-dark)]
                font-semibold
              "
            >
              <span>✓ 7 días gratis</span>

              <span className="text-gray-300">•</span>

              <span>✓ Sin tarjeta</span>

              <span className="text-gray-300">•</span>

              <span>✓ Sin comisiones</span>
            </motion.div>

            {/* ===================================================
                FRASE
                =================================================== */}
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 0.9,
                duration: 0.5,
              }}
              className="
                mt-7
                flex
                items-center
                gap-3
                text-[var(--marketing-text-dark)]
                font-bold
                text-xs
                sm:text-sm
              "
            ></motion.div>
          </motion.div>

          {/* DEMOSTRACIÓN VISUAL DE LA TIENDA */}
  



  {/* ILUSTRACIÓN PRINCIPAL */}
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{
    delay: 0.35,
    duration: 0.8,
    ease: [0.16, 1, 0.3, 1],
  }}
  className="
    absolute
    bottom-[-10px]
    left-1/2
    w-[290px]
    -translate-x-1/2

    sm:bottom-10
    sm:w-[480px]

    md:bottom-6
    md:w-[560px]

    lg:bottom-auto
    lg:left-auto
    lg:right-[-2%]
    lg:top-[54%]
    lg:w-[540px]
    lg:-translate-x-0
    lg:-translate-y-1/2

    xl:right-[-1%]
    xl:top-[49%]
    xl:w-[680px]

    2xl:right-[1%]
    2xl:w-[720px]
  "
>
  {/* Sombra inferior */}
  <div
    className="
      absolute
      bottom-0
      left-1/2
      h-10
      w-[55%]
      -translate-x-1/2
      rounded-full
      bg-black/20
      blur-2xl

      md:h-12
      md:w-[48%]

      xl:h-16
      xl:w-[42%]
    "
  />

  {/* Puntos decorativos */}
  <div
    className="
      absolute
      bottom-[10%]
      left-[15%]
      hidden
      h-16
      w-16
      opacity-25

      md:block

      xl:left-[18%]
      xl:h-24
      xl:w-24
      xl:opacity-30
    "
    style={{
      backgroundImage:
        "radial-gradient(color-mix(in srgb, var(--marketing-bg-white) 90%, transparent) 2px, transparent 2px)",
      backgroundSize: "14px 14px",
    }}
  />

  
  
  {/* MUJER COMO ELEMENTO PRINCIPAL */}
  <div
    className="
      relative
      z-20
      mx-auto
      w-[245px]
      translate-y-8

      sm:w-[260px]
      sm:translate-y-14

      md:w-[285px]
      md:translate-y-14

      lg:w-[305px]
      lg:translate-y-10

      xl:w-[380px]
      xl:translate-y-0

      2xl:w-[410px]
    "
  >
    <Image
      src="/Yelimar4.png"
      alt="Yelimar Mejia Pulido"
      width={720}
      height={1440}
      priority
      sizes="
        (max-width: 640px) 245px,
        (max-width: 768px) 260px,
        (max-width: 1024px) 285px,
        (max-width: 1280px) 305px,
        (max-width: 1536px) 380px,
        410px
      "
      className="
        h-auto
        w-full
        drop-shadow-[0_22px_26px_rgba(0,0,0,0.23)]

        xl:drop-shadow-[0_26px_30px_rgba(0,0,0,0.25)]
      "
    />
  </div>

  {/* Base inferior */}
  <div
    className="
      absolute
      bottom-0
      left-1/2
      z-10
      h-2
      w-[38%]
      -translate-x-1/2
      rounded-full
      bg-[var(--marketing-bg-white)]/20
      blur-sm

      md:h-3
      xl:w-[35%]
    "
  />
</motion.div>


        </div>

        {/* =======================================================
            INDICADOR INFERIOR
            ======================================================= */}
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 1.1,
            duration: 0.5,
          }}
          className="
            absolute
            bottom-5
            left-1/2
            -translate-x-1/2
            flex
            items-center
            gap-2
            text-[#64748b]
            text-[9px]
            sm:text-[10px]
            uppercase
            tracking-[0.25em]
            font-bold
            whitespace-nowrap
          "
        ></motion.div>
      </div>

      {/* =========================================================
          SECCIÓN WHATSAPP & PEDIDOS
          ========================================================= */}
      <div
        className="
          w-full
          py-20
          sm:py-28
          lg:py-32
          bg-[var(--marketing-bg-white)]
          relative
          overflow-hidden
          border-t
          border-gray-100
        "
      >
        <div
          className="
            max-w-6xl
            mx-auto
            px-4
            sm:px-6
            grid
            grid-cols-1
            md:grid-cols-2
            gap-14
            lg:gap-24
            items-center
          "
        >
          {/* COLUMNA IZQUIERDA */}
          <div
            className="
              text-center
              md:text-left
              order-2
              md:order-1
            "
          >
            <span
              className="
                inline-flex
                items-center
                w-fit
                px-4
                py-2
                mb-5
                text-xs
                font-bold
                tracking-widest
                text-[var(--marketing-primary)]
                uppercase
                bg-[var(--marketing-bg-white)]
                  rounded-xl
                border
                border-[var(--marketing-primary)]
                mx-auto
                md:mx-0
              "
            >
              Cero comisiones por venta
            </span>

            <h3
              className="
                text-3xl
                sm:text-4xl
                lg:text-5xl
                font-black
                text-[var(--marketing-text-dark)]
                mb-6
                leading-[1.12]
                tracking-tight
              "
            >
              Tu tienda online.
              <br />
              <span className="text-[var(--marketing-primary)]">Tus clientes. Tus ventas.</span>
            </h3>

            <p
              className="
                text-[#64748b]
                text-base
                sm:text-lg
                leading-relaxed
                mb-8
                max-w-lg
                mx-auto
                md:mx-0
              "
            >
              Recibe los pedidos de tu tienda virtual directamente en WhatsApp.
              Mantén el control de tus ventas y construye una relación directa
              con tus clientes.
            </p>

            {/* DESTACADO */}
            <div
              className="
                p-5
                sm:p-6
                rounded-2xl
                bg-[var(--marketing-bg-white)]
                border
                border-gray-200
                max-w-lg
                mx-auto
                md:mx-0
                text-left
              "
            >
              <p
                className="
                  text-sm
                  sm:text-base
                  text-[#475569]
                  leading-relaxed
                "
              >
                <span className="text-[var(--marketing-primary)] font-bold">
                  💡 Una tienda que vende:
                </span>{" "}
                tus clientes agregan productos al carrito, revisan su pedido y
                lo envían directamente a tu WhatsApp.
              </p>
            </div>
          </div>

          {/* COLUMNA DERECHA */}
          <div
            className="
              text-center
              md:text-left
              order-1
              md:order-2
            "
          >
            <span
              className="
                inline-flex
                items-center
                px-4
                py-2
                mb-5
                text-xs
                font-bold
                tracking-widest
                text-[var(--marketing-primary)]
                uppercase
                bg-[var(--marketing-bg-white)]
                rounded-full
                border
                border-[var(--marketing-primary)]
              "
            >
              Ventas por WhatsApp
            </span>

            <h2
              className="
                text-3xl
                sm:text-4xl
                lg:text-5xl
                font-black
                text-[var(--marketing-text-dark)]
                mb-6
                leading-[1.08]
                tracking-tight
              "
            >
              Recibe pedidos
              <br />
              organizados en tu <span className="text-[var(--marketing-primary)]">WhatsApp</span>
            </h2>

            <p
              className="
                text-[#64748b]
                text-base
                sm:text-lg
                mb-8
                max-w-lg
                mx-auto
                md:mx-0
                leading-relaxed
              "
            >
              Tus clientes arman su carrito en tu tienda online y reciben un
              proceso simple para enviarte el resumen detallado de su compra.
            </p>

            {/* LISTA */}
            <ul
              className="
                space-y-4
                mb-8
                text-left
                max-w-lg
                mx-auto
                md:mx-0
              "
            >
              {[
                "Detalle automático de productos y total del carrito",
                "Pedidos claros y fáciles de interpretar",
                "El cliente es tuyo: guarda su contacto para volver a venderle",
                "Comparte tu tienda fácilmente desde redes sociales",
              ].map((item, index) => (
                <li
                  key={index}
                  className="
                    flex
                    items-start
                    gap-3
                    text-[var(--marketing-text-dark)]
                  "
                >
                  <span
                    className="
                      flex-shrink-0
                      w-7
                      h-7
                      rounded-full
                      bg-[var(--marketing-primary)]
                      text-[var(--marketing-text-dark)]
                      flex
                      items-center
                      justify-center
                      mt-0.5
                    "
                  >
                    ✓
                  </span>

                  <span
                    className="
                      text-sm
                      sm:text-base
                      font-medium
                      leading-relaxed
                    "
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* =========================================================
          EXPERIENCIA MÓVIL
          ========================================================= */}
      <div
        className="
          w-full
          py-20
          sm:py-28
          lg:py-32
          bg-[#f8fafc]
          relative
          overflow-hidden
          border-y
          border-gray-100
        "
      >
        <div
          className="
            max-w-6xl
            mx-auto
            px-4
            sm:px-6
            grid
            grid-cols-1
            md:grid-cols-2
            gap-12
            lg:gap-20
            items-center
          "
        >
          {/* TEXTO */}
          <div
            className="
              text-center
              md:text-left
              order-2
              md:order-1
            "
          >
            <span
              className="
                inline-flex
                items-center
                px-4
                py-2
                mb-5
                text-xs
                font-bold
                tracking-widest
                text-[var(--marketing-primary)]
                uppercase
                bg-[var(--marketing-bg-white)]
                rounded-full
                border
                border-gray-200
              "
            >
              Experiencia móvil perfecta
            </span>

            <h2
              className="
                text-3xl
                sm:text-4xl
                lg:text-5xl
                font-black
                text-[var(--marketing-text-dark)]
                mb-6
                leading-[1.08]
                tracking-tight
              "
            >
              Tu tienda online
              <br />
              <span className="text-[var(--marketing-primary)]">siempre accesible</span>
            </h2>

            <p
              className="
                text-[#64748b]
                text-base
                sm:text-lg
                mb-8
                max-w-lg
                mx-auto
                md:mx-0
                leading-relaxed
              "
            >
              Tus clientes compran desde cualquier navegador sin instalar
              aplicaciones. Comparte tu tienda por enlace, redes sociales o
              código QR.
            </p>

            {/* BENEFICIOS */}
            <ul
              className="
                space-y-4
                mb-10
                text-left
                max-w-lg
                mx-auto
                md:mx-0
              "
            >
              {[
                "Carga rápida optimizada para celulares",
                "Actualiza precios, productos y stock al instante",
                "Diseño moderno que genera confianza",
              ].map((item, index) => (
                <li
                  key={index}
                  className="
                    flex
                    items-center
                    gap-3
                    text-[var(--marketing-text-dark)]
                  "
                >
                  <span
                    className="
                      flex-shrink-0
                      w-7
                      h-7
                      rounded-full
                      bg-[var(--marketing-primary)]
                      text-[var(--marketing-text-dark)]
                      flex
                      items-center
                      justify-center
                    "
                  >
                    ✓
                  </span>

                  <span
                    className="
                      text-sm
                      sm:text-base
                      font-medium
                    "
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            {/* BOTÓN */}
            <div className="flex justify-center md:justify-start">
              <Link
                href="/auth"
                className="
                  group
                  inline-flex
                  items-center
                  justify-center
                  gap-3
                  px-8
                  py-4
                  bg-[var(--marketing-primary)]
                  text-[var(--marketing-text-dark)]
                  font-bold
                  rounded-xl
                  hover:bg-[var(--marketing-primary)]
                  hover:-translate-y-1
                  transition-all
                  duration-300
                  text-center
                "
              >
                Crear mi tienda ahora
                <FaRocket
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                />
              </Link>
            </div>
          </div>

          {/* MOCKUP */}
          <div
            className="
              relative
              flex
              justify-center
              md:justify-end
              order-1
              md:order-2
              mb-8
              md:mb-0
            "
          >
            <div
              className="
                absolute
                w-[280px]
                h-[280px]
                sm:w-[400px]
                sm:h-[400px]
                rounded-full
                border
                border-[var(--marketing-primary)]/20
              "
            />

            <div
              className="
                relative
                z-10
                transform
                md:rotate-2
                hover:rotate-0
                transition-transform
                duration-700
              "
            >
              <Image
                src="/Imagen-telefono.png"
                alt="Tienda Online Catalagox en Celular"
                width={380}
                height={760}
                priority
                className="
                  relative
                  w-[250px]
                  sm:w-[310px]
                  md:w-[360px]
                  h-auto
                  drop-shadow-[0_25px_45px_rgba(0,0,0,0.16)]
                "
              />
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          TARJETAS DE SOLUCIÓN
          ========================================================= */}
      <div
        className="
          w-full
          bg-[var(--marketing-bg-white)]
          py-20
          sm:py-28
        "
      >
        <div
          className="
            max-w-6xl
            mx-auto
            px-4
            sm:px-6
          "
        >
          {/* ENCABEZADO */}
          <div
            className="
              text-center
              max-w-3xl
              mx-auto
              mb-12
              sm:mb-16
            "
          >
            <span
              className="
                inline-flex
                items-center
                px-4
                py-2
                mb-5
                text-xs
                font-bold
                tracking-widest
                text-[var(--marketing-primary)]
                uppercase
                bg-[var(--marketing-bg-white)]
                rounded-full
                border
                border-[var(--marketing-primary)]
              "
            >
              Todo lo que necesitas para vender
            </span>

            <h2
              className="
                text-3xl
                sm:text-4xl
                lg:text-5xl
                font-black
                text-[var(--marketing-text-dark)]
                tracking-tight
              "
            >
              Una plataforma para{" "}
              <span className="text-[var(--marketing-primary)]">hacer crecer tu negocio</span>
            </h2>

            <p
              className="
                mt-5
                text-[#64748b]
                text-base
                sm:text-lg
                max-w-2xl
                mx-auto
                leading-relaxed
              "
            >
              Crea una presencia profesional en Internet y dale a tus clientes
              una forma sencilla de descubrir y comprar tus productos.
            </p>
          </div>

          {/* TARJETAS */}
          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-8
            "
          >
            {/* TIENDA ONLINE */}
            <div
              className="
                group
                relative
                p-8
                sm:p-10
                rounded-[2rem]
                bg-[var(--marketing-bg-white)]
                border
                border-gray-200
                shadow-[0_10px_40px_rgba(15,23,42,0.05)]
                hover:shadow-[0_20px_50px_rgba(15,23,42,0.09)]
                hover:-translate-y-1
                transition-all
                duration-500
                flex
                flex-col
              "
            >
              <div
                className="
                  mb-7
                  inline-flex
                  w-16
                  h-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[var(--marketing-primary)]
                  text-[var(--marketing-text-dark)]
                "
              >
                <FaShoppingBag className="text-2xl" />
              </div>

              <h2
                className="
                  text-2xl
                  sm:text-3xl
                  font-black
                  text-[var(--marketing-text-dark)]
                  mb-4
                  tracking-tight
                "
              >
                Tu Tienda Online
                <br />
                <span className="text-[var(--marketing-primary)]">lista para vender</span>
              </h2>

              <p
                className="
                  text-[#64748b]
                  text-base
                  sm:text-lg
                  mb-6
                  leading-relaxed
                "
              >
                Muestra tus productos con fotos, categorías, descripciones,
                precios y stock actualizado.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  "Carrito de compra interactivo",
                  "Enlace único para redes sociales",
                  "Categorías y productos organizados",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="
                      flex
                      items-center
                      gap-3
                      font-medium
                      text-[var(--marketing-text-dark)]
                      text-sm
                      sm:text-base
                    "
                  >
                    <span
                      className="
                        flex-shrink-0
                        w-6
                        h-6
                        rounded-full
                        bg-[var(--marketing-primary)]
                        text-[var(--marketing-text-dark)]
                        flex
                        items-center
                        justify-center
                        text-xs
                        font-bold
                      "
                    >
                      ✓
                    </span>

                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/auth"
                className="
                  mt-auto
                  w-full
                  sm:w-fit
                  px-7
                  py-3.5
                  bg-[var(--marketing-text-dark)]
                  text-[var(--marketing-text-dark)]
                  rounded-xl
                  font-bold
                  hover:bg-[var(--marketing-primary)]
                  hover:text-[var(--marketing-text-dark)]
                  transition-colors
                  duration-300
                  text-center
                "
              >
                Crear mi tienda
              </Link>
            </div>

            {/* LOCAL FÍSICO */}
            <div
              className="
                group
                relative
                p-8
                sm:p-10
                rounded-[2rem]
                bg-[var(--marketing-primary)]
                border
                border-[var(--marketing-primary)]
                shadow-[0_20px_50px_color-mix(in_srgb,var(--marketing-primary)_18%,transparent)]
                hover:-translate-y-1
                transition-all
                duration-500
                flex
                flex-col
                overflow-hidden
              "
            >
              <div
                className="
                  mb-7
                  inline-flex
                  w-16
                  h-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[var(--marketing-bg-white)]
                  text-[var(--marketing-primary)]
                "
              >
                <FaMobileAlt className="text-2xl" />
              </div>

              <h2
                className="
                  text-2xl
                  sm:text-3xl
                  font-black
                  text-[var(--marketing-text-dark)]
                  mb-4
                  tracking-tight
                "
              >
                También funciona
                <br />
                <span className="text-[var(--marketing-text-dark)]">para tu local físico</span>
              </h2>

              <p
                className="
                  text-[var(--marketing-text-dark)]/90
                  text-base
                  sm:text-lg
                  mb-6
                  leading-relaxed
                "
              >
                Comparte tus productos mediante código QR y permite que tus
                clientes accedan rápidamente desde su celular.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  "Acceso inmediato sin descargar apps",
                  "Ahorro en impresión de cartas",
                  "Pedidos directo a WhatsApp",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="
                      flex
                      items-center
                      gap-3
                      font-medium
                      text-[var(--marketing-text-dark)]
                      text-sm
                      sm:text-base
                    "
                  >
                    <span
                      className="
                        flex-shrink-0
                        w-6
                        h-6
                        rounded-full
                        bg-[var(--marketing-bg-white)]
                        text-[var(--marketing-primary)]
                        flex
                        items-center
                        justify-center
                        text-xs
                        font-bold
                      "
                    >
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
                className="
                  mt-auto
                  w-full
                  sm:w-fit
                  px-7
                  py-3.5
                  bg-[var(--marketing-bg-white)]
                  text-[var(--marketing-text-dark)]
                  rounded-xl
                  font-bold
                  hover:bg-[var(--marketing-text-dark)]
                  hover:text-[var(--marketing-bg-white)]
                  transition-all
                  duration-300
                  text-center
                "
              >
                Ver demo
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          BENEFICIOS
          ========================================================= */}
      <div
        className="
          w-full
          bg-[#f8fafc]
          py-20
          sm:py-28
          border-y
          border-gray-100
        "
      >
        <div
          className="
            max-w-6xl
            mx-auto
            px-4
            sm:px-6
          "
        >
          <div
            className="
              text-center
              mb-12
              sm:mb-16
            "
          >
            <span
              className="
                inline-flex
                items-center
                px-4
                py-2
                mb-5
                text-xs
                font-bold
                tracking-widest
                text-[var(--marketing-primary)]
                uppercase
                bg-[var(--marketing-bg-white)]
                rounded-full
                border
                border-gray-200
              "
            >
              Diseñado para emprendedores
            </span>

            <h2
              className="
                text-3xl
                sm:text-4xl
                lg:text-5xl
                font-black
                text-[var(--marketing-text-dark)]
                tracking-tight
              "
            >
              Todo lo necesario para hacer crecer tu{" "}
              <span className="text-[var(--marketing-primary)]">tienda online</span>
            </h2>

            <p
              className="
                mt-5
                text-[#64748b]
                text-base
                sm:text-lg
                max-w-2xl
                mx-auto
              "
            >
              Simplicidad, velocidad y herramientas de venta en un solo lugar.
            </p>
          </div>

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-3
              gap-8
            "
          >
            {[
              {
                icon: FaRocket,
                title: "Creación rápida",
                desc: "Publica tus productos y ten tu tienda online lista en cuestión de minutos.",
              },
              {
                icon: FaPalette,
                title: "Personalización total",
                desc: "Añade tu logo, adapta tus colores y crea una imagen profesional para tu marca.",
              },
              {
                icon: FaMobileAlt,
                title: "100% responsivo",
                desc: "Tus clientes disfrutan de una experiencia fluida desde cualquier smartphone.",
              },
            ].map((benefit, i) => (
              <div
                key={i}
                className="
                  group
                  relative
                  p-8
                  sm:p-10
                  bg-[var(--marketing-bg-white)]
                  rounded-[2rem]
                  border
                  border-gray-200
                  shadow-[0_4px_20px_rgba(15,23,42,0.04)]
                  hover:shadow-[0_20px_45px_rgba(15,23,42,0.08)]
                  hover:-translate-y-2
                  transition-all
                  duration-300
                  text-left
                "
              >
                <div
                  className="
                    mb-7
                    inline-flex
                    items-center
                    justify-center
                    w-14
                    h-14
                    rounded-2xl
                    bg-[var(--marketing-text-dark)]
                    text-[var(--marketing-bg-white)]
                    group-hover:bg-[var(--marketing-primary)]
                    group-hover:text-[var(--marketing-text-dark)]
                    transition-colors
                    duration-300
                  "
                >
                  <benefit.icon className="text-2xl" />
                </div>

                <h3
                  className="
                    text-xl
                    font-bold
                    text-[var(--marketing-text-dark)]
                    mb-3
                    tracking-tight
                  "
                >
                  {benefit.title}
                </h3>

                <p
                  className="
                    text-[#64748b]
                    text-sm
                    sm:text-base
                    leading-relaxed
                  "
                >
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================
          ESTADÍSTICAS
          SIN DEGRADADO
          ========================================================= */}
      <div
        className="
          w-full
          bg-[var(--marketing-bg-white)]
          py-20
          sm:py-28
        "
      >
        <div
          className="
            max-w-6xl
            mx-auto
            px-4
            sm:px-6
          "
        >
          <div
            className="
              relative
              bg-[var(--marketing-primary)]
              rounded-[2rem]
              sm:rounded-[3rem]
              overflow-hidden
            "
          >
            {/* DECORACIÓN SIMPLE */}
            <div
              className="
                absolute
                top-8
                left-8
                w-20
                h-20
                rounded-full
                border
                border-[var(--marketing-bg-white)]/20
              "
            />

            <div
              className="
                absolute
                bottom-8
                right-8
                w-28
                h-28
                rounded-full
                border
                border-[var(--marketing-bg-white)]/20
              "
            />

            <div
              className="
                relative
                p-8
                sm:p-14
                lg:p-16
                text-[var(--marketing-text-dark)]
                text-center
              "
            >
              <div
                className="
                  max-w-2xl
                  mx-auto
                  mb-12
                "
              >
                <span
                  className="
                    inline-flex
                    items-center
                    px-4
                    py-2
                    mb-5
                    text-xs
                    font-bold
                    tracking-widest
                    text-[var(--marketing-text-dark)]
                    uppercase
                    bg-[var(--marketing-bg-white)]/10
                    rounded-full
                    border
                    border-[var(--marketing-bg-white)]/20
                  "
                >
                  CatalagoX
                </span>

                <h2
                  className="
                    text-3xl
                    sm:text-4xl
                    lg:text-5xl
                    font-black
                    tracking-tight
                  "
                >
                  Una plataforma creada para vender
                </h2>

                <p
                  className="
                    mt-4
                    text-[var(--marketing-text-dark)]/85
                    text-base
                    sm:text-lg
                  "
                >
                  Crea tu tienda, muestra tus productos y empieza a recibir
                  pedidos por Internet.
                </p>
              </div>

              {/* ESTADÍSTICAS */}
              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-3
                  gap-8
                  md:gap-4
                "
              >
                {[
                  {
                    Icon: FaStore,
                    end: 500,
                    suffix: "+",
                    label: "Tiendas creadas",
                  },
                  {
                    Icon: FaUsers,
                    end: 10,
                    suffix: "K+",
                    label: "Clientes felices",
                  },
                  {
                    Icon: FaGlobe,
                    end: 100,
                    suffix: "%",
                    label: "Optimizado",
                  },
                ].map((item, i) => {
                  const { ref, inView } = useInView({
                    triggerOnce: true,
                    threshold: 0.5,
                  });

                  return (
                    <div
                      key={i}
                      ref={ref}
                      className="
                        px-4
                        py-6
                        md:py-4
                      "
                    >
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 20,
                        }}
                        animate={
                          inView
                            ? {
                                opacity: 1,
                                y: 0,
                              }
                            : {}
                        }
                        transition={{
                          duration: 0.6,
                          delay: i * 0.2,
                        }}
                      >
                        <item.Icon
                          className="
                            text-3xl
                            mx-auto
                            mb-4
                            text-[var(--marketing-text-dark)]
                          "
                        />

                        <div
                          className="
                            text-4xl
                            sm:text-5xl
                            font-black
                            mb-2
                            tracking-tight
                            text-[var(--marketing-text-dark)]
                          "
                        >
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

                        <p
                          className="
                            text-[var(--marketing-text-dark)]
                            font-bold
                            uppercase
                            tracking-widest
                            text-xs
                          "
                        >
                          {item.label}
                        </p>
                      </motion.div>
                    </div>
                  );
                })}
              </div>

              {/* CTA FINAL */}
              <motion.div
                className="
                  mt-12
                  flex
                  justify-center
                  px-4
                "
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.8,
                  duration: 0.5,
                }}
              >
                <Link
                  href="/auth"
                  className="
                    group
                    relative
                    inline-flex
                    items-center
                    justify-center
                    gap-3
                    w-full
                    max-w-[340px]
                    sm:max-w-none
                    sm:w-auto
                    px-7
                    sm:px-10
                    py-4
                    bg-[var(--marketing-bg-white)]
                    text-[var(--marketing-text-dark)]
                    rounded-2xl
                    font-black
                    text-sm
                    sm:text-lg
                    hover:bg-[var(--marketing-text-dark)]
                    hover:text-[var(--marketing-bg-white)]
                    transition-all
                    duration-300
                    shadow-[0_10px_30px_rgba(0,0,0,0.15)]
                    hover:-translate-y-1
                    active:scale-95
                  "
                >
                  <span className="text-center leading-tight">
                    ¡Crear mi tienda online gratis!
                  </span>

                  <FaRocket
                    className="
                      flex-shrink-0
                      text-xl
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          WHATSAPP FLOTANTE
          ========================================================= */}
      <FloatingWhatsapp />
    </section>
  );
}