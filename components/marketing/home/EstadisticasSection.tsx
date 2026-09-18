"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import type { IconType } from "react-icons";
import { FaGlobe, FaRocket, FaStore, FaUsers } from "react-icons/fa";

/* =========================================================
   TIPOS
========================================================= */

interface StatisticItemProps {
  Icon: IconType;
  end: number;
  suffix: string;
  label: string;
  index: number;
}

/* =========================================================
   DATOS DE LAS ESTADÍSTICAS
========================================================= */

const STATISTICS = [
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
];

/* =========================================================
   ESTADÍSTICA INDIVIDUAL
========================================================= */

function StatisticItem({
  Icon,
  end,
  suffix,
  label,
  index,
}: StatisticItemProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  return (
    <div ref={ref} className="px-4 py-6 md:py-4">
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
            : {
                opacity: 0,
                y: 20,
              }
        }
        transition={{
          duration: 0.6,
          delay: index * 0.2,
        }}
      >
        {/* ICONO */}
        <Icon
          aria-hidden="true"
          className="
            mx-auto
            mb-4
            text-3xl
            text-[var(--marketing-text-dark)]
          "
        />

        {/* NÚMERO */}
        <div
          className="
            mb-2
            text-4xl
            font-black
            tracking-tight
            text-[var(--marketing-text-dark)]

            sm:text-5xl
          "
        >
          {inView ? (
            <CountUp end={end} duration={2.5} suffix={suffix} />
          ) : (
            "0"
          )}
        </div>

        {/* DESCRIPCIÓN */}
        <p
          className="
            text-xs
            font-bold
            uppercase
            tracking-widest
            text-[var(--marketing-text-dark)]
          "
        >
          {label}
        </p>
      </motion.div>
    </div>
  );
}

/* =========================================================
   SECCIÓN PRINCIPAL
========================================================= */

export default function EstadisticasSection() {
  return (
    <section
      className="
        w-full
        bg-[var(--marketing-bg-white)]
        py-20

        sm:py-28
      "
    >
      <div
        className="
          mx-auto
          max-w-6xl
          px-4

          sm:px-6
        "
      >
        <div
          className="
            relative
            overflow-hidden
            rounded-[2rem]
            bg-[var(--marketing-primary)]

            sm:rounded-[3rem]
          "
        >
          <div
            className="
              relative
              p-8
              text-center
              text-[var(--marketing-text-dark)]

              sm:p-14
              lg:p-16
            "
          >
            {/* =================================================
                ENCABEZADO
            ================================================== */}
            <div
              className="
                mx-auto
                mb-12
                max-w-2xl
              "
            >
              <h2
                className="
                  text-3xl
                  font-black
                  tracking-tight

                  sm:text-4xl
                  lg:text-5xl
                "
              >
                Una plataforma creada para vender
              </h2>

              <p
                className="
                  mt-4
                  text-base
                  text-[var(--marketing-text-dark)]/85

                  sm:text-lg
                "
              >
                Crea tu tienda, muestra tus productos y empieza a recibir
                pedidos por Internet.
              </p>
            </div>

            {/* =================================================
                ESTADÍSTICAS
            ================================================== */}
            <div
              className="
                grid
                grid-cols-1
                gap-8

                md:grid-cols-3
                md:gap-4
              "
            >
              {STATISTICS.map((item, index) => (
                <StatisticItem
                  key={item.label}
                  Icon={item.Icon}
                  end={item.end}
                  suffix={item.suffix}
                  label={item.label}
                  index={index}
                />
              ))}
            </div>

            {/* =================================================
                BOTÓN FINAL
            ================================================== */}
            <motion.div
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
              className="
                mt-12
                flex
                justify-center
                px-4
              "
            >
              <Link
                href="/auth"
                className="
                  group
                  relative
                  inline-flex
                  w-full
                  max-w-[340px]
                  items-center
                  justify-center
                  gap-3
                  rounded-2xl
                  bg-[var(--marketing-bg-white)]
                  px-7
                  py-4
                  text-sm
                  font-black
                  text-[var(--marketing-text-dark)]
                  shadow-[0_10px_30px_rgba(0,0,0,0.15)]
                  transition-all
                  duration-300

                  hover:-translate-y-1
                  hover:bg-[var(--marketing-text-dark)]
                  hover:text-[var(--marketing-bg-white)]

                  active:scale-95

                  sm:w-auto
                  sm:max-w-none
                  sm:px-10
                  sm:text-lg
                "
              >
                <span className="text-center leading-tight">
                  ¡Crear mi tienda online gratis!
                </span>

                <FaRocket
                  aria-hidden="true"
                  className="
                    shrink-0
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
    </section>
  );
}