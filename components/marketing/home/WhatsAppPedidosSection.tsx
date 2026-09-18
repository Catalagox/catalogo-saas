const WHATSAPP_BENEFITS = [
  "Detalle automático de productos y total del carrito",
  "Pedidos claros y fáciles de interpretar",
  "El cliente es tuyo: guarda su contacto para volver a venderle",
  "Comparte tu tienda fácilmente desde redes sociales",
];

export default function WhatsAppPedidosSection() {
  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        border-t
        border-gray-100
        bg-[var(--marketing-bg-white)]
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
          gap-14
          px-4

          sm:px-6

          md:grid-cols-2

          lg:gap-24
        "
      >
        {/* =====================================================
            COLUMNA IZQUIERDA
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
              mx-auto
              mb-5
              inline-flex
              w-fit
              items-center
              rounded-xl
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

              md:mx-0
            "
          >
            Cero comisiones por venta
          </span>

          <h3
            className="
              mb-6
              text-3xl
              font-black
              leading-[1.12]
              tracking-tight
              text-[var(--marketing-text-dark)]

              sm:text-4xl
              lg:text-5xl
            "
          >
            Tu tienda online.
            <br />

            <span className="text-[var(--marketing-primary)]">
              Tus clientes. Tus ventas.
            </span>
          </h3>

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
            Recibe los pedidos de tu tienda virtual directamente en WhatsApp.
            Mantén el control de tus ventas y construye una relación directa con
            tus clientes.
          </p>

          {/* MENSAJE DESTACADO */}
          <div
            className="
              mx-auto
              max-w-lg
              rounded-2xl
              border
              border-gray-200
              bg-[var(--marketing-bg-white)]
              p-5
              text-left

              sm:p-6

              md:mx-0
            "
          >
            <p
              className="
                text-sm
                leading-relaxed
                text-[#475569]

                sm:text-base
              "
            >
              <span className="font-bold text-[var(--marketing-primary)]">
                💡 Una tienda que vende:
              </span>{" "}
              tus clientes agregan productos al carrito, revisan su pedido y lo
              envían directamente a tu WhatsApp.
            </p>
          </div>
        </div>

        {/* =====================================================
            COLUMNA DERECHA
        ====================================================== */}
        <div
          className="
            order-1
            text-center

            md:order-2
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
            Ventas por WhatsApp
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
            Recibe pedidos
            <br />
            organizados en tu{" "}
            <span className="text-[var(--marketing-primary)]">
              WhatsApp
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
            Tus clientes arman su carrito en tu tienda online y reciben un
            proceso simple para enviarte el resumen detallado de su compra.
          </p>

          {/* LISTA DE BENEFICIOS */}
          <ul
            className="
              mx-auto
              mb-8
              max-w-lg
              space-y-4
              text-left

              md:mx-0
            "
          >
            {WHATSAPP_BENEFITS.map((item) => (
              <li
                key={item}
                className="
                  flex
                  items-start
                  gap-3
                  text-[var(--marketing-text-dark)]
                "
              >
                <span
                  aria-hidden="true"
                  className="
                    mt-0.5
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
                    leading-relaxed

                    sm:text-base
                  "
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}