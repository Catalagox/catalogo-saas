import type { Metadata } from "next";
import Link from "next/link";
import { FaRocket, FaEye, FaStore } from "react-icons/fa6";

export const metadata: Metadata = {
  title: "Sobre Nosotros | Crea tu Tienda Online con CatalagoX",
  description:
    "Conoce la historia, misión y visión de CatalagoX, la plataforma líder para crear tiendas online profesionales, vender por Internet y recibir pedidos por WhatsApp.",
  keywords: [
    "tienda online",
    "crear tienda online",
    "ecommerce latinoamerica",
    "vender por internet",
    "CatalagoX",
    "tienda virtual",
    "catalogo digital",
  ],
  openGraph: {
    title: "Sobre Nosotros | CatalagoX - Tu Tienda Online Profesional",
    description:
      "Impulsamos la transformación digital de emprendedores y negocios en Latinoamérica con herramientas simples y potentes para vender online.",
    siteName: "CatalagoX",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sobre Nosotros | CatalagoX",
    description:
      "Crea tu tienda online fácil, rápida y profesional con CatalagoX.",
  },
};

export default function SobreNosotrosPage() {
  return (
    <section className="min-h-screen bg-slate-50 text-slate-900 py-24 px-6 relative overflow-hidden">
      {/* Resplandor ambiental de fondo en tonos verdes claros */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* ENCABEZADO */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-6">
            <FaStore className="text-emerald-600" /> Ecosistema E-Commerce
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
            Sobre <span className="text-emerald-600">Nosotros</span>
          </h1>

          <p className="text-slate-600 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed font-medium">
            Estamos construyendo la nueva generación de herramientas de e-commerce
            para que negocios y emprendedores en Latinoamérica vendan por Internet sin complicaciones.
          </p>
        </div>

        {/* BLOQUE PRINCIPAL */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* HISTORIA / HISTORIAL DE LA MARCA */}
          <div className="space-y-6 text-slate-600 leading-relaxed text-base sm:text-lg">
            <p>
              <strong className="text-slate-900">Catalagox</strong> nació con la convicción de que cualquier negocio,
              sin importar su tamaño, debe tener la posibilidad de crear su propia
              <strong className="text-slate-900"> tienda online profesional</strong> de manera simple, rápida y accesible.
            </p>

            <p>
              En una región donde millones de emprendimientos impulsan la economía,
              creemos que la digitalización y el comercio electrónico no deben ser un lujo técnico ni costoso,
              sino una oportunidad real al alcance de todos.
            </p>

            <p>
              Nuestra plataforma permite a los comercios subir sus productos, personalizar su marca,
              gestionar su catálogo virtual y recibir pedidos directamente en WhatsApp o través de su carrito de compras.
            </p>

            <p>
              Estamos comprometidos con desarrollar tecnología intuitiva, escalable y pensada para
              impulsar las ventas reales de nuestros clientes.
            </p>
          </div>

          {/* TARJETA MISIÓN Y VISIÓN */}
          <div className="bg-white border border-slate-200 p-8 sm:p-10 rounded-3xl shadow-xl space-y-8">
            {/* MISIÓN */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
                  <FaRocket size={20} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Nuestra Misión
                </h2>
              </div>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Democratizar el acceso al e-commerce para que cualquier comercio o emprendedor en Latinoamérica pueda crear su tienda online, independizar sus ventas y crecer por Internet.
              </p>
            </div>

            <hr className="border-slate-100" />

            {/* VISIÓN */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
                  <FaEye size={20} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Nuestra Visión
                </h2>
              </div>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Convertirnos en la plataforma preferida de creación de tiendas virtuales en la región, impulsando a miles de marcas a digitalizarse con un sistema ágil, moderno y conectado.
              </p>
            </div>
          </div>
        </div>

        {/* CALL TO ACTION FINAL */}
        <div className="text-center mt-24 max-w-3xl mx-auto space-y-8">
          <p className="text-slate-600 text-lg leading-relaxed font-medium">
            Creemos en el talento latinoamericano, en la innovación constante
            y en el poder de la tecnología para transformar negocios.
            Estamos apenas comenzando.
          </p>

          <div>
            <Link
              href="/auth"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/25 transition-all active:scale-95"
            >
              Crear mi tienda online gratis
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}