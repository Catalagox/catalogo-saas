import Image from "next/image";
import Link from "next/link";
import { FaRocket } from "react-icons/fa";

const MOBILE_BENEFITS = [
  "Carga rápida optimizada para celulares",
  "Actualiza precios, productos y stock al instante",
  "Diseño moderno que genera confianza",
];

export default function ExperienciaMovilSection() {
  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        border-y
        border-gray-100
        bg-[#f8fafc]
        py-20

        sm:py-28
        lg:py-32
      "
    >
      <div
        className="
          mx-auto
          grid
          max-w-6xl
          grid-cols-1
          items-center
          gap-12
          px-4

          sm:px-6

          md:grid-cols-2

          lg:gap-20
        "
      >
        {/* =====================================================
            CONTENIDO DE TEXTO
        ====================================================== */}
        <div
          className="
            order-2
            text-center

            md:order-1
            md:text-left
          "
        >
          <span
            className="
              mb-5
              inline-flex
              items-center
              rounded-full
              border
              border-gray-200
              bg-[var(--marketing-bg-white)]
              px-4
              py-2
              text-xs
              font-bold
              uppercase
              tracking-widest
              text-[var(--marketing-primary)]
            "
          >
            Experiencia móvil perfecta
          </span>

          <h2
            className="
              mb-6
              text-3xl
              font-black
              leading-[1.08]
              tracking-tight
              text-[var(--marketing-text-dark)]

              sm:text-4xl
              lg:text-5xl
            "
          >
            Tu tienda online
            <br />

            <span className="text-[var(--marketing-primary)]">
              siempre accesible
            </span>
          </h2>

          <p
            className="
              mx-auto
              mb-8
              max-w-lg
              text-base
              leading-relaxed
              text-[#64748b]

              sm:text-lg

              md:mx-0
            "
          >
            Tus clientes compran desde cualquier navegador sin instalar
            aplicaciones. Comparte tu tienda por enlace, redes sociales o código
            QR.
          </p>

          {/* BENEFICIOS */}
          <ul
            className="
              mx-auto
              mb-10
              max-w-lg
              space-y-4
              text-left

              md:mx-0
            "
          >
            {MOBILE_BENEFITS.map((item) => (
              <li
                key={item}
                className="
                  flex
                  items-center
                  gap-3
                  text-[var(--marketing-text-dark)]
                "
              >
                <span
                  aria-hidden="true"
                  className="
                    flex
                    h-7
                    w-7
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[var(--marketing-primary)]
                    text-[var(--marketing-text-dark)]
                  "
                >
                  ✓
                </span>

                <span
                  className="
                    text-sm
                    font-medium

                    sm:text-base
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
                rounded-xl
                bg-[var(--marketing-primary)]
                px-8
                py-4
                text-center
                font-bold
                text-[var(--marketing-text-dark)]
                transition-all
                duration-300

                hover:-translate-y-1
                hover:bg-[var(--marketing-primary)]
              "
            >
              <span>Crear mi tienda ahora</span>

              <FaRocket
                aria-hidden="true"
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            </Link>
          </div>
        </div>

        {/* =====================================================
            IMAGEN DEL TELÉFONO
        ====================================================== */}
        <div
          className="
            relative
            order-1
            mb-8
            flex
            justify-center

            md:order-2
            md:mb-0
            md:justify-end
          "
        >
          {/* CÍRCULO DECORATIVO */}
          <div
            aria-hidden="true"
            className="
              absolute
              h-[280px]
              w-[280px]
              rounded-full
              border
              border-[var(--marketing-primary)]/20

              sm:h-[400px]
              sm:w-[400px]
            "
          />

          {/* MOCKUP */}
          <div
            className="
              relative
              z-10
              transform
              transition-transform
              duration-700

              hover:rotate-0

              md:rotate-2
            "
          >
            <Image
              src="/Imagen-telefono.png"
              alt="Tienda Online Catalagox en celular"
              width={380}
              height={760}
              sizes="
                (max-width: 640px) 250px,
                (max-width: 768px) 310px,
                360px
              "
              className="
                relative
                h-auto
                w-[250px]
                drop-shadow-[0_25px_45px_rgba(0,0,0,0.16)]

                sm:w-[310px]
                md:w-[360px]
              "
            />
          </div>
        </div>
      </div>
    </section>
  );
}