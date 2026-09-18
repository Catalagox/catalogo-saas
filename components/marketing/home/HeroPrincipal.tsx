"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaRocket } from "react-icons/fa";

const HERO_BENEFITS = [
  "Publica productos, precios y stock",
  "Recibe pedidos directamente en WhatsApp",
  "Sin comisiones por cada venta",
];

export default function HeroPrincipal() {
  return (
    <div className="relative min-h-[1080px] w-full overflow-hidden bg-[var(--marketing-bg-white)] sm:min-h-[1120px] md:min-h-[1040px] lg:min-h-[860px]">
      {/* =======================================================
          FORMAS VERDES
      ======================================================= */}
      <div className="pointer-events-none absolute inset-0">
        {/* ESCRITORIO Y TABLET */}
        <svg
          className="absolute inset-0 hidden h-full w-full md:block"
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

        {/* MÓVIL */}
        <svg
          className="absolute inset-0 h-full w-full md:hidden"
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
      ======================================================= */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* CÍRCULO GRANDE */}
        <div
          className="
            absolute
            right-[8%]
            top-[17%]
            hidden
            h-28
            w-28
            rounded-full
            border
            border-[var(--marketing-bg-white)]/25
            md:block
            lg:h-36
            lg:w-36
          "
        />

        {/* CÍRCULO PEQUEÑO */}
        <div
          className="
            absolute
            right-[13%]
            top-[23%]
            hidden
            h-12
            w-12
            rounded-full
            border
            border-[var(--marketing-bg-white)]/35
            md:block
            lg:h-16
            lg:w-16
          "
        />

        {/* CRUZ */}
        <span
          className="
            absolute
            right-[29%]
            top-[20%]
            hidden
            text-4xl
            font-light
            text-[var(--marketing-bg-white)]
            opacity-60
            md:block
          "
        >
          +
        </span>

        {/* PUNTO GRANDE */}
        <span
          className="
            absolute
            right-[10%]
            top-[42%]
            hidden
            h-2
            w-2
            rounded-full
            bg-[var(--marketing-bg-white)]
            opacity-70
            md:block
          "
        />

        {/* PUNTO PEQUEÑO */}
        <span
          className="
            absolute
            right-[26%]
            top-[48%]
            hidden
            h-1.5
            w-1.5
            rounded-full
            bg-[var(--marketing-bg-white)]
            opacity-60
            md:block
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
          mx-auto
          flex
          min-h-[1080px]
          max-w-7xl
          items-start
          px-5
          pt-28

          sm:min-h-[1120px]
          sm:px-8
          sm:pt-32

          md:min-h-[1040px]

          lg:min-h-[860px]
          lg:items-center
          lg:px-10
          lg:pt-24
        "
      >
        {/* =====================================================
            CONTENIDO DE TEXTO
        ====================================================== */}
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
            mx-auto
            flex
            w-full
            max-w-2xl
            flex-col
            items-stretch
            pb-[440px]
            pt-0
            text-left

            sm:pb-[500px]

            md:mx-0

            lg:max-w-[600px]
            lg:pb-0
          "
        >
          {/* TÍTULO */}
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
              m-0
              w-full
              text-left
              text-[2.45rem]
              font-black
              leading-[1.02]
              tracking-[-0.035em]
              text-[var(--marketing-text-dark)]

              sm:text-[3.4rem]
              md:text-[3.8rem]
              lg:text-[4rem]
              xl:text-[4.35rem]
            "
          >
            <span className="block">Crea tu tienda online</span>
            <span className="block">y empieza a vender</span>
          </motion.h1>

          {/* SUBTÍTULO */}
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
              w-full
              text-left
              text-base
              font-medium
              leading-relaxed
              text-[var(--marketing-text-dark)]

              sm:mt-7
              sm:text-lg

              lg:text-xl
            "
          >
            Lanza una tienda profesional en minutos, muestra tus productos y
            convierte visitas en pedidos directamente por WhatsApp.
          </motion.p>

          {/* BENEFICIOS */}
          <motion.ul
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.48,
              duration: 0.6,
            }}
            className="mt-6 w-full space-y-3 text-left"
          >
            {HERO_BENEFITS.map((benefit) => (
              <li
                key={benefit}
                className="
                  flex
                  items-center
                  gap-3
                  text-sm
                  font-semibold
                  text-[#475569]

                  sm:text-base
                "
              >
                <span
                  aria-hidden="true"
                  className="
                    flex
                    h-6
                    w-6
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[var(--marketing-primary)]
                    text-xs
                    font-black
                    text-[var(--marketing-text-dark)]
                  "
                >
                  ✓
                </span>

                <span>{benefit}</span>
              </li>
            ))}
          </motion.ul>

          {/* ===================================================
              BOTONES
          ==================================================== */}
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
              flex
              w-full
              flex-col
              items-stretch
              justify-start
              gap-3

              sm:mt-9
              sm:flex-row
              sm:items-center
              sm:gap-4
            "
          >
            {/* CTA PRINCIPAL */}
            <Link
              href="/auth"
              className="
                group
                inline-flex
                w-full
                min-w-[230px]
                items-center
                justify-center
                gap-3
                rounded-xl
                bg-[var(--marketing-primary)]
                px-7
                py-3.5
                text-sm
                font-extrabold
                text-[var(--marketing-text-dark)]
                transition-all
                duration-300

                hover:-translate-y-1
                hover:bg-[var(--marketing-primary)]
                hover:shadow-[0_12px_30px_color-mix(in_srgb,var(--marketing-primary)_22%,transparent)]

                active:scale-95

                sm:w-auto
                sm:px-8
                sm:py-4
                sm:text-base
              "
            >
              <span>Crear mi tienda gratis</span>

              <FaRocket
                aria-hidden="true"
                className="
                  text-base
                  transition-transform
                  duration-300
                  group-hover:translate-x-1

                  sm:text-lg
                "
              />
            </Link>

            {/* BOTÓN DEMO */}
            <Link
              href="/prueba"
              target="_blank"
              rel="noopener noreferrer"
              className="
                group
                inline-flex
                w-full
                min-w-[150px]
                items-center
                justify-center
                gap-3
                rounded-full
                border
                border-gray-300
                bg-[var(--marketing-bg-white)]
                px-7
                py-3.5
                text-sm
                font-extrabold
                text-[var(--marketing-text-dark)]
                transition-all
                duration-300

                hover:-translate-y-1
                hover:border-[var(--marketing-nav-hover)]
                hover:text-[var(--marketing-nav-hover)]

                active:scale-95

                sm:w-auto
                sm:px-8
                sm:py-4
                sm:text-base
              "
            >
              <span>Ver tienda demo</span>

              <svg
                aria-hidden="true"
                className="
                  h-4
                  w-4
                  transition-transform
                  duration-300
                  group-hover:translate-x-1

                  sm:h-5
                  sm:w-5
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
          ==================================================== */}
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
              w-full
              flex-wrap
              items-center
              justify-start
              gap-x-3
              gap-y-2
              text-left
              text-[11px]
              font-semibold
              text-[var(--marketing-text-dark)]

              sm:gap-x-4
              sm:text-xs

              md:text-sm
            "
          >
            <span>✓ 7 días gratis</span>

            <span aria-hidden="true" className="text-gray-300">
              •
            </span>

            <span>✓ Sin tarjeta</span>

            <span aria-hidden="true" className="text-gray-300">
              •
            </span>

            <span>✓ Sin comisiones</span>
          </motion.div>
        </motion.div>

        {/* =====================================================
            ILUSTRACIÓN PRINCIPAL
        ====================================================== */}
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
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
            lg:translate-x-0
            lg:-translate-y-1/2

            xl:right-[-1%]
            xl:top-[49%]
            xl:w-[680px]

            2xl:right-[1%]
            2xl:w-[720px]
          "
        >
          {/* SOMBRA INFERIOR */}
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

          {/* PUNTOS DECORATIVOS */}
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
              alt="Mujer mostrando una tienda online desde su teléfono"
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

          {/* BASE INFERIOR */}
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
    </div>
  );
}