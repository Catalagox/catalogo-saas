import Link from "next/link";
import { FaMobileAlt, FaShoppingBag } from "react-icons/fa";

const ONLINE_STORE_FEATURES = [
  "Carrito de compra interactivo",
  "Enlace único para redes sociales",
  "Categorías y productos organizados",
];

const PHYSICAL_STORE_FEATURES = [
  "Acceso inmediato sin descargar apps",
  "Ahorro en impresión de cartas",
  "Pedidos directo a WhatsApp",
];

export default function SolucionesSection() {
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
        {/* =====================================================
            ENCABEZADO
        ====================================================== */}
        <div
          className="
            mx-auto
            mb-12
            max-w-3xl
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
              border-[var(--marketing-primary)]
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
            Todo lo que necesitas para vender
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
            Una plataforma para{" "}
            <span className="text-[var(--marketing-primary)]">
              hacer crecer tu negocio
            </span>
          </h2>

          <p
            className="
              mx-auto
              mt-5
              max-w-2xl
              text-base
              leading-relaxed
              text-[#64748b]

              sm:text-lg
            "
          >
            Crea una presencia profesional en Internet y dale a tus clientes una
            forma sencilla de descubrir y comprar tus productos.
          </p>
        </div>

        {/* =====================================================
            TARJETAS
        ====================================================== */}
        <div
          className="
            grid
            grid-cols-1
            gap-8

            md:grid-cols-2
          "
        >
          {/* ===================================================
              TIENDA ONLINE
          ==================================================== */}
          <article
            className="
              group
              relative
              flex
              flex-col
              rounded-[2rem]
              border
              border-gray-200
              bg-[var(--marketing-bg-white)]
              p-8
              shadow-[0_10px_40px_rgba(15,23,42,0.05)]
              transition-all
              duration-500

              hover:-translate-y-1
              hover:shadow-[0_20px_50px_rgba(15,23,42,0.09)]

              sm:p-10
            "
          >
            {/* ICONO */}
            <div
              className="
                mb-7
                inline-flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-[var(--marketing-primary)]
                text-[var(--marketing-text-dark)]
              "
            >
              <FaShoppingBag aria-hidden="true" className="text-2xl" />
            </div>

            {/* TÍTULO */}
            <h3
              className="
                mb-4
                text-2xl
                font-black
                tracking-tight
                text-[var(--marketing-text-dark)]

                sm:text-3xl
              "
            >
              Tu Tienda Online
              <br />

              <span className="text-[var(--marketing-primary)]">
                lista para vender
              </span>
            </h3>

            {/* DESCRIPCIÓN */}
            <p
              className="
                mb-6
                text-base
                leading-relaxed
                text-[#64748b]

                sm:text-lg
              "
            >
              Muestra tus productos con fotos, categorías, descripciones,
              precios y stock actualizado.
            </p>

            {/* CARACTERÍSTICAS */}
            <ul className="mb-8 space-y-3">
              {ONLINE_STORE_FEATURES.map((item) => (
                <li
                  key={item}
                  className="
                    flex
                    items-center
                    gap-3
                    text-sm
                    font-medium
                    text-[var(--marketing-text-dark)]

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
                      font-bold
                      text-[var(--marketing-text-dark)]
                    "
                  >
                    ✓
                  </span>

                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* BOTÓN */}
            <Link
              href="/auth"
              className="
                mt-auto
                w-full
                rounded-xl
                bg-[var(--marketing-text-dark)]
                px-7
                py-3.5
                text-center
                font-bold
                text-[var(--marketing-bg-white)]
                transition-colors
                duration-300

                hover:bg-[var(--marketing-primary)]
                hover:text-[var(--marketing-text-dark)]

                sm:w-fit
              "
            >
              Crear mi tienda
            </Link>
          </article>

          {/* ===================================================
              LOCAL FÍSICO
          ==================================================== */}
          <article
            className="
              group
              relative
              flex
              flex-col
              overflow-hidden
              rounded-[2rem]
              border
              border-[var(--marketing-primary)]
              bg-[var(--marketing-primary)]
              p-8
              shadow-[0_20px_50px_color-mix(in_srgb,var(--marketing-primary)_18%,transparent)]
              transition-all
              duration-500

              hover:-translate-y-1

              sm:p-10
            "
          >
            {/* ICONO */}
            <div
              className="
                mb-7
                inline-flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-[var(--marketing-bg-white)]
                text-[var(--marketing-primary)]
              "
            >
              <FaMobileAlt aria-hidden="true" className="text-2xl" />
            </div>

            {/* TÍTULO */}
            <h3
              className="
                mb-4
                text-2xl
                font-black
                tracking-tight
                text-[var(--marketing-text-dark)]

                sm:text-3xl
              "
            >
              También funciona
              <br />

              <span className="text-[var(--marketing-text-dark)]">
                para tu local físico
              </span>
            </h3>

            {/* DESCRIPCIÓN */}
            <p
              className="
                mb-6
                text-base
                leading-relaxed
                text-[var(--marketing-text-dark)]/90

                sm:text-lg
              "
            >
              Comparte tus productos mediante código QR y permite que tus
              clientes accedan rápidamente desde su celular.
            </p>

            {/* CARACTERÍSTICAS */}
            <ul className="mb-8 space-y-3">
              {PHYSICAL_STORE_FEATURES.map((item) => (
                <li
                  key={item}
                  className="
                    flex
                    items-center
                    gap-3
                    text-sm
                    font-medium
                    text-[var(--marketing-text-dark)]

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
                      bg-[var(--marketing-bg-white)]
                      text-xs
                      font-bold
                      text-[var(--marketing-primary)]
                    "
                  >
                    ✓
                  </span>

                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* BOTÓN */}
            <Link
              href="/prueba"
              target="_blank"
              rel="noopener noreferrer"
              className="
                mt-auto
                w-full
                rounded-xl
                bg-[var(--marketing-bg-white)]
                px-7
                py-3.5
                text-center
                font-bold
                text-[var(--marketing-text-dark)]
                transition-all
                duration-300

                hover:bg-[var(--marketing-text-dark)]
                hover:text-[var(--marketing-bg-white)]

                sm:w-fit
              "
            >
              Ver demo
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}