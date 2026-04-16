import { FaStore, FaUsers, FaGlobe, FaRocket, FaPalette, FaMobileAlt } from "react-icons/fa";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="w-full">

      {/* HERO FULL WIDTH */}
      <div className="relative w-full py-32 px-6 overflow-hidden">

        {/* Imagen de fondo */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/Gemini_Generated_Image_9oqc4l9oqc4l9oqc.png')" }}
        ></div>

        {/* Overlay mejorado */}
        <div className="absolute inset-0 bg-black/70"></div>

        {/* Contenido */}
        <div className="relative z-10 max-w-6xl mx-auto text-center">

          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            <span className="text-[var(--color-primary)]">
              Catálogos Digitales
            </span>{" "}
            y <br className="hidden md:block" />
            Menús QR para tu Negocio
          </h1>

          <p className="mt-6 text-lg md:text-xl text-[var(--color-text-inverse)]/80 max-w-2xl mx-auto">
            Crea catálogos profesionales y menús digitales con código QR.
            Moderniza tu negocio y permite que tus clientes accedan a tu
            información desde cualquier celular.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth"
              className="px-8 py-3 rounded-xl bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-hover)] transition"
            >
              Comenzar Gratis
            </Link>
          </div>

        </div>
      </div>

      {/* CONTENIDO NORMAL */}
      <div className="max-w-6xl mx-auto px-6">

        {/* MOCKUP */}
        <div className="mt-20 flex justify-center">
          <div className="relative w-72 h-[500px] bg-black rounded-[40px] p-4 shadow-2xl">

            <div className="w-full h-full bg-white rounded-[30px] p-6 text-[var(--color-text)] flex flex-col">

              <div className="mb-6">
                <h3 className="text-lg font-bold">Menú Digital</h3>
                <p className="text-xs text-[var(--color-text-light)]">
                  Escanea el QR y ordena fácilmente
                </p>
              </div>

              <div className="space-y-5 text-sm flex-1">

                {[ 
                  { name: "Pizza Margarita Clásica", desc: "Tomate, mozzarella y albahaca fresca", price: "$12.99" },
                  { name: "Hamburguesa BBQ Especial", desc: "Carne premium, queso cheddar y salsa BBQ", price: "$10.50" },
                  { name: "Ensalada César Gourmet", desc: "Pollo a la parrilla y aderezo casero", price: "$8.75" },
                  { name: "Pasta Alfredo", desc: "Salsa cremosa con queso parmesano", price: "$11.40" }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-start border-b border-[var(--color-border)] pb-2">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-[var(--color-text-light)]">{item.desc}</p>
                    </div>
                    <span className="font-bold text-[var(--color-primary)]">{item.price}</span>
                  </div>
                ))}

              </div>

            </div>
          </div>
        </div>

        {/* SECCIÓN */}
        <div className="mt-28 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

          <div>
            <h2 className="text-3xl font-bold text-[var(--color-text)] mb-6">
              Catálogos Digitales
            </h2>

            <p className="text-[var(--color-text-light)] mb-8">
              Muestra tus productos con imágenes, precios y descripciones
              en un catálogo moderno y fácil de compartir.
            </p>

            <ul className="space-y-4 text-[var(--color-text)]">
              <li className="flex gap-2"><span className="text-[var(--color-primary)]">✔</span> Enlaces personalizados</li>
              <li className="flex gap-2"><span className="text-[var(--color-primary)]">✔</span> Ideal para tiendas</li>
              <li className="flex gap-2"><span className="text-[var(--color-primary)]">✔</span> Actualización en tiempo real</li>
            </ul>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-[var(--color-text)] mb-6">
              Menús con Código QR
            </h2>

            <p className="text-[var(--color-text-light)] mb-8">
              Tus clientes escanean el QR y acceden al menú sin contacto.
            </p>

            <ul className="space-y-4 text-[var(--color-text)]">
              <li className="flex gap-2"><span className="text-[var(--color-primary)]">✔</span> Más higiene</li>
              <li className="flex gap-2"><span className="text-[var(--color-primary)]">✔</span> Ahorro en impresión</li>
              <li className="flex gap-2"><span className="text-[var(--color-primary)]">✔</span> Cambios instantáneos</li>
            </ul>
          </div>

        </div>

        {/* BENEFICIOS */}
        <div className="mt-28 text-center">
          <h2 className="text-4xl font-bold text-[var(--color-text)] mb-16">
            ¿Por qué elegirnos?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            {[FaRocket, FaPalette, FaMobileAlt].map((Icon, i) => (
              <div key={i} className="p-8 bg-white border border-[var(--color-border)] rounded-3xl shadow-sm hover:shadow-xl transition">
                <Icon className="text-3xl text-[var(--color-primary)] mb-4 mx-auto" />
                <h3 className="text-xl font-bold text-[var(--color-text)]">
                  {["Fácil de Usar", "Diseño Profesional", "Accesible"][i]}
                </h3>
              </div>
            ))}

          </div>
        </div>

        {/* ESTADÍSTICAS */}
        <div className="mt-28 relative">

          <div className="absolute inset-0 bg-[var(--color-primary-dark)] rounded-3xl"></div>

          <div className="relative p-12 text-white rounded-3xl text-center">

            <div className="grid md:grid-cols-3 gap-12">

              {[FaStore, FaUsers, FaGlobe].map((Icon, i) => (
                <div key={i}>
                  <Icon className="text-3xl mx-auto mb-4 text-[var(--color-primary)]" />
                  <div className="text-4xl font-bold">
                    {["+500", "+10K", "100%"][i]}
                  </div>
                  <p className="text-gray-300">
                    {["Negocios Activos", "Clientes", "Digital"][i]}
                  </p>
                </div>
              ))}

            </div>

            <div className="mt-10">
              <Link
                href="/auth"
                className="px-10 py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-xl font-semibold transition"
              >
                Crear mi Catálogo
              </Link>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}