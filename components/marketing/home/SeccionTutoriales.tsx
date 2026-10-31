
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaYoutube,
  FaPlay,
  FaCheckCircle,
  FaExternalLinkAlt,
} from "react-icons/fa";

const VIDEO_URL = "https://www.youtube.com/watch?v=nDPlQmF-tu0";

const MINIATURA =
  "https://img.youtube.com/vi/nDPlQmF-tu0/hqdefault.jpg";

const CANAL_URL = "https://www.youtube.com/@Catalagox";

const TUTORIALES = [
  "Crear tu cuenta y configurar tu tienda",
  "Subir tus primeros productos",
  "Personalizar el diseño de tu tienda",
  "Organizar categorías y configurar tu negocio",
];

export default function SeccionTutoriales() {
  return (
    <section className="relative w-full overflow-hidden bg-[var(--marketing-bg-white)] px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

          {/* CONTENIDO DE TEXTO */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-start"
          >
            {/* TÍTULO */}
            <h2 className="
              max-w-xl
              text-3xl
              font-black
              leading-tight
              tracking-tight
              text-[var(--marketing-text-dark)]
              sm:text-4xl
              lg:text-5xl
            ">
              Aprende a crear tu tienda online
              <span className="block text-[var(--marketing-primary)]">
                paso a paso.
              </span>
            </h2>

            {/* DESCRIPCIÓN */}
            <p className="
              mt-6
              max-w-xl
              text-base
              leading-relaxed
              text-gray-500
              sm:text-lg
            ">
              ¿No sabes por dónde empezar? En nuestro canal de
              YouTube encontrarás tutoriales que te enseñarán
              cómo crear, personalizar y configurar tu tienda
              con Catalagox.
            </p>

            {/* LISTA DE TUTORIALES */}
            <ul className="mt-8 space-y-4">
              {TUTORIALES.map((tutorial) => (
                <li
                  key={tutorial}
                  className="flex items-center gap-3 text-sm font-semibold text-[var(--marketing-text-dark)] sm:text-base"
                >
                  <FaCheckCircle
                    className="shrink-0 text-[var(--marketing-primary)]"
                  />
                  {tutorial}
                </li>
              ))}
            </ul>

            {/* BOTÓN PARA VISITAR EL CANAL */}
            <Link
              href={CANAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="
                group
                mt-9
                inline-flex
                items-center
                justify-center
                gap-3
                rounded-xl
                bg-[#E62117]
                px-7
                py-4
                text-sm
                font-extrabold
                text-white
                shadow-lg
                shadow-red-500/15
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-[#CC1810]
                hover:shadow-xl
                active:scale-95
                sm:text-base
              "
            >
              <FaYoutube className="text-xl" />
              Ver todos los tutoriales
              <FaExternalLinkAlt className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <p className="mt-4 text-xs font-medium text-gray-400">
              Aprende a tu ritmo, desde cualquier dispositivo.
            </p>
          </motion.div>

          {/* PANEL VISUAL DE YOUTUBE */}
          <motion.div
            initial={{ opacity: 0, x: 35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="relative mx-auto w-full max-w-xl"
          >
            <div className="
              relative
              overflow-hidden
              rounded-3xl
              bg-[#101828]
              p-5
              shadow-2xl
              shadow-black/10
              sm:p-8
            ">

              {/* DECORACIÓN */}
              <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-green-500/20 blur-3xl" />

              <div className="relative z-10">

                {/* CABECERA */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-green-400">
                      Canal oficial
                    </p>

                    <h3 className="mt-1 text-xl font-black text-white sm:text-2xl">
                      Catalagox
                    </h3>
                  </div>

                  <FaYoutube className="text-4xl text-[#FF3333]" />
                </div>

                {/* MINIATURA REAL DEL VIDEO */}
                <Link
                  href={VIDEO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Ver tutorial: Cómo subir tu primer producto a Catalagox"
                  className="
                    group
                    relative
                    mt-7
                    block
                    aspect-video
                    overflow-hidden
                    rounded-2xl
                    border
                    border-white/10
                    bg-[#1C2938]
                  "
                >
                  {/* IMAGEN DE YOUTUBE */}
                  <div
                    className="
                      absolute
                      inset-0
                      bg-cover
                      bg-center
                      transition-transform
                      duration-500
                      group-hover:scale-105
                    "
                    style={{
                      backgroundImage: `url("${MINIATURA}")`,
                    }}
                  />

                  {/* CAPA OSCURA */}
                  <div className="
                    absolute
                    inset-0
                    bg-black/10
                    transition-colors
                    duration-300
                    group-hover:bg-black/30
                  " />

                  {/* BOTÓN PLAY */}
                  <div className="
                    absolute
                    inset-0
                    flex
                    items-center
                    justify-center
                  ">
                    <div className="
                      flex
                      h-16
                      w-20
                      items-center
                      justify-center
                      rounded-2xl
                      bg-[#E62117]
                      shadow-xl
                      shadow-black/30
                      transition-all
                      duration-300
                      group-hover:scale-110
                      group-hover:bg-red-600
                      sm:h-20
                      sm:w-24
                    ">
                      <FaPlay className="ml-1 text-2xl text-white sm:text-3xl" />
                    </div>
                  </div>

                  {/* ETIQUETA VIDEO */}
                  <div className="
                    absolute
                    bottom-3
                    left-3
                    rounded-lg
                    bg-black/80
                    px-3
                    py-1.5
                    text-xs
                    font-bold
                    text-white
                  ">
                    VER TUTORIAL
                  </div>
                </Link>

                {/* PIE DEL PANEL */}
                <div className="mt-6 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-white">
                      Cómo subir tu primer producto
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Tutorial paso a paso de Catalagox.
                    </p>
                  </div>

                  <FaYoutube className="shrink-0 text-3xl text-[#FF3333]" />
                </div>

              </div>
            </div>

            {/* ELEMENTO DECORATIVO */}
            <div className="
              absolute
              -bottom-4
              -left-4
              -z-10
              h-28
              w-28
              rounded-3xl
              bg-[var(--marketing-primary)]
              opacity-30
              blur-2xl
            " />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
