
import {
  FaGlobe,
  FaMobileAlt,
  FaStore,
  FaWhatsapp,
} from "react-icons/fa";

const BENEFICIOS = [
  {
    icon: FaGlobe,
    titulo: "Tu negocio en Internet",
    descripcion:
      "Ten un espacio propio en Internet donde tus clientes puedan conocer tu negocio y todo lo que ofreces.",
    color: "from-green-100 to-emerald-50",
    iconColor: "text-green-600",
    decoration: "bg-green-500",
  },
  {
    icon: FaMobileAlt,
    titulo: "Adaptada a móviles",
    descripcion:
      "Tu página se adapta a móviles, tablets y ordenadores para que tus clientes puedan visitarla desde cualquier dispositivo.",
    color: "from-emerald-100 to-teal-50",
    iconColor: "text-emerald-600",
    decoration: "bg-emerald-500",
  },
  {
    icon: FaStore,
    titulo: "Muestra lo que ofreces",
    descripcion:
      "Presenta tus productos, servicios, catálogos o menús digitales de una forma organizada y profesional.",
    color: "from-lime-100 to-green-50",
    iconColor: "text-green-700",
    decoration: "bg-lime-500",
  },
  {
    icon: FaWhatsapp,
    titulo: "Conecta con tus clientes",
    descripcion:
      "Facilita que las personas conozcan tu negocio y puedan ponerse en contacto contigo por WhatsApp.",
    color: "from-green-100 to-teal-50",
    iconColor: "text-green-600",
    decoration: "bg-teal-500",
  },
];

export default function BeneficiosPaginaWeb() {
  return (
    <section
      className="
        relative isolate overflow-hidden
        bg-gradient-to-br from-[#f2fbf5] via-white to-[#f0faf3]
        px-5 py-20
        sm:px-8 sm:py-24
        lg:px-16 lg:py-28
      "
    >
      {/* DECORACIÓN SUAVE DE FONDO */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="
            absolute -left-40 -top-40
            h-96 w-96 rounded-full
            bg-green-200/25 blur-3xl
          "
        />

        <div
          className="
            absolute -right-40 top-[35%]
            h-[420px] w-[420px] rounded-full
            bg-emerald-200/20 blur-3xl
          "
        />

        <div
          className="
            absolute bottom-[-100px] left-[35%]
            h-72 w-72 rounded-full
            bg-lime-100/30 blur-3xl
          "
        />
      </div>

      <div className="relative mx-auto max-w-[1200px]">

        {/* ENCABEZADO ALINEADO A LA IZQUIERDA */}
        <div className="mb-12 max-w-[760px] sm:mb-16">
          <h2
            className="
              text-3xl font-black
              leading-[1.15]
              tracking-tight
              text-[#111827]
              sm:text-4xl
              lg:text-5xl
            "
          >
            Mucho más que tener presencia en Internet
          </h2>

          <p
            className="
              mt-5 max-w-[680px]
              text-base leading-8
              text-gray-600
              sm:text-lg
            "
          >
            Una página web profesional te ayuda a mostrar lo que haces,
            transmitir confianza y facilitar que tus clientes encuentren
            tu negocio.
          </p>
        </div>

        {/* TARJETAS DE BENEFICIOS */}
        <div
          className="
            grid grid-cols-1 gap-5
            sm:grid-cols-2
            lg:grid-cols-4
            lg:gap-6
          "
        >
          {BENEFICIOS.map((beneficio) => {
            const Icon = beneficio.icon;

            return (
              <article
                key={beneficio.titulo}
                className="
                  group relative isolate overflow-hidden
                  flex min-h-[290px] flex-col
                  rounded-[24px]
                  border border-green-100/80
                  bg-white/95
                  p-7
                  shadow-[0_8px_30px_rgba(20,83,45,0.06)]
                  transition-all duration-300
                  hover:-translate-y-2
                  hover:border-green-200
                  hover:shadow-[0_18px_40px_rgba(20,83,45,0.12)]
                "
              >
                {/* BRILLO DECORATIVO */}
                <div
                  className={`
                    pointer-events-none absolute
                    -right-12 -top-12
                    h-36 w-36 rounded-full
                    ${beneficio.decoration}
                    opacity-[0.06]
                    blur-2xl
                    transition-all duration-500
                    group-hover:scale-150
                    group-hover:opacity-[0.12]
                  `}
                />

                {/* ICONO */}
                <div
                  className={`
                    relative mb-7
                    flex h-[68px] w-[68px]
                    items-center justify-center
                    rounded-[20px]
                    bg-gradient-to-br ${beneficio.color}
                    ${beneficio.iconColor}
                    shadow-sm
                    transition-all duration-300
                    group-hover:scale-110
                    group-hover:rotate-[-5deg]
                  `}
                >
                  <Icon
                    className="text-[29px]"
                    aria-hidden="true"
                  />
                </div>

                {/* TÍTULO */}
                <h3
                  className="
                    relative mb-3
                    text-xl font-extrabold
                    leading-snug
                    text-[#111827]
                  "
                >
                  {beneficio.titulo}
                </h3>

                {/* DESCRIPCIÓN */}
                <p
                  className="
                    relative
                    text-[15px]
                    leading-7
                    text-gray-600
                  "
                >
                  {beneficio.descripcion}
                </p>

                {/* DETALLE INFERIOR */}
                <div
                  className={`
                    absolute bottom-0 left-0
                    h-[3px] w-0
                    ${beneficio.decoration}
                    transition-all duration-500
                    group-hover:w-full
                  `}
                />
              </article>
            );
          })}
        </div>

        {/* CIERRE */}
        <div
          className="
            mt-14
            rounded-2xl
            border border-green-100
            bg-white/70
            px-6 py-7
            shadow-sm
            sm:mt-16 sm:px-9
          "
        >
          <p
            className="
              text-lg font-bold
              leading-relaxed
              text-[#111827]
              sm:text-xl
            "
          >
            Tu negocio tiene mucho que mostrar.
            <span className="text-[#16a34a]">
              {" "}Haz que Internet lo conozca.
            </span>
          </p>
        </div>

      </div>
    </section>
  );
}
