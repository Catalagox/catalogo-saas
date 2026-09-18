import { FaMobileAlt, FaPalette, FaRocket } from "react-icons/fa";

const BENEFITS = [
  {
    Icon: FaRocket,
    title: "Creación rápida",
    description:
      "Publica tus productos y ten tu tienda online lista en cuestión de minutos.",
  },
  {
    Icon: FaPalette,
    title: "Personalización total",
    description:
      "Añade tu logo, adapta tus colores y crea una imagen profesional para tu marca.",
  },
  {
    Icon: FaMobileAlt,
    title: "100% responsivo",
    description:
      "Tus clientes disfrutan de una experiencia fluida desde cualquier smartphone.",
  },
];

export default function BeneficiosSection() {
  return (
    <section
      className="
        w-full
        border-y
        border-gray-100
        bg-[#f8fafc]
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
        {/* =====================================================
            ENCABEZADO
        ====================================================== */}
        <div
          className="
            mb-12
            text-center

            sm:mb-16
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
            Diseñado para emprendedores
          </span>

          <h2
            className="
              text-3xl
              font-black
              tracking-tight
              text-[var(--marketing-text-dark)]

              sm:text-4xl
              lg:text-5xl
            "
          >
            Todo lo necesario para hacer crecer tu{" "}
            <span className="text-[var(--marketing-primary)]">
              tienda online
            </span>
          </h2>

          <p
            className="
              mx-auto
              mt-5
              max-w-2xl
              text-base
              text-[#64748b]

              sm:text-lg
            "
          >
            Simplicidad, velocidad y herramientas de venta en un solo lugar.
          </p>
        </div>

        {/* =====================================================
            TARJETAS DE BENEFICIOS
        ====================================================== */}
        <div
          className="
            grid
            grid-cols-1
            gap-8

            md:grid-cols-3
          "
        >
          {BENEFITS.map(({ Icon, title, description }) => (
            <article
              key={title}
              className="
                group
                relative
                rounded-[2rem]
                border
                border-gray-200
                bg-[var(--marketing-bg-white)]
                p-8
                text-left
                shadow-[0_4px_20px_rgba(15,23,42,0.04)]
                transition-all
                duration-300

                hover:-translate-y-2
                hover:shadow-[0_20px_45px_rgba(15,23,42,0.08)]

                sm:p-10
              "
            >
              {/* ICONO */}
              <div
                className="
                  mb-7
                  inline-flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[var(--marketing-text-dark)]
                  text-[var(--marketing-bg-white)]
                  transition-colors
                  duration-300

                  group-hover:bg-[var(--marketing-primary)]
                  group-hover:text-[var(--marketing-text-dark)]
                "
              >
                <Icon aria-hidden="true" className="text-2xl" />
              </div>

              {/* TÍTULO */}
              <h3
                className="
                  mb-3
                  text-xl
                  font-bold
                  tracking-tight
                  text-[var(--marketing-text-dark)]
                "
              >
                {title}
              </h3>

              {/* DESCRIPCIÓN */}
              <p
                className="
                  text-sm
                  leading-relaxed
                  text-[#64748b]

                  sm:text-base
                "
              >
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}