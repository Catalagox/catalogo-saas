import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones | Catalagox",
  description:
    "Consulta los términos y condiciones de uso de Catalagox, la plataforma para crear tiendas online, catálogos virtuales y gestionar ventas por WhatsApp.",
  keywords: [
    "términos y condiciones",
    "tienda online",
    "Catalagox",
    "condiciones de uso",
    "tienda virtual",
  ],
  openGraph: {
    title: "Términos y Condiciones | Catalagox",
    description:
      "Términos y condiciones de uso del servicio de creación de tiendas online Catalagox.",
    siteName: "Catalagox",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Términos y Condiciones | Catalagox",
    description:
      "Consulta los términos y condiciones de uso de la plataforma Catalagox.",
  },
};

export default function TerminosPage() {
  return (
    <section className="min-h-screen bg-slate-50 text-slate-900 py-24 px-6 relative overflow-hidden">
      {/* Resplandor ambiental sutil de fondo */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto bg-white border border-slate-200 p-8 md:p-12 rounded-3xl shadow-xl relative z-10">
        <div className="border-b border-slate-100 pb-6 mb-8">
          <div className="inline-flex items-center rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 px-3 py-1 text-xs font-bold uppercase tracking-wider mb-4">
            Aviso Legal
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            Términos y Condiciones
          </h1>
          <p className="text-slate-500 text-sm mt-3 font-medium">
            Última actualización: 13 de febrero de 2026
          </p>
        </div>

        <div className="space-y-8 text-slate-600 leading-relaxed font-normal">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-emerald-600">1.</span> Información del Servicio
            </h2>
            <p>
              <strong className="text-slate-900">Catalagox</strong> es una plataforma digital que permite a comercios y emprendedores crear, gestionar y personalizar sus propias <strong className="text-slate-900">tiendas online</strong> y catálogos virtuales accesibles mediante enlace web o código QR, optimizados para la recepción de pedidos por WhatsApp. El servicio opera globalmente desde la República Argentina.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-emerald-600">2.</span> Aceptación de los Términos
            </h2>
            <p>
              Al registrarse, acceder o utilizar la plataforma, el usuario acepta de manera plena y sin reservas los presentes Términos y Condiciones.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-emerald-600">3.</span> Uso del Servicio
            </h2>
            <ul className="list-disc pl-6 space-y-2 marker:text-emerald-600">
              <li>Proporcionar información veraz, exacta y actualizada durante el registro y configuración de la tienda.</li>
              <li>No utilizar la plataforma para comercializar productos o servicios de carácter ilícito, ilegal o prohibido.</li>
              <li>No publicar contenido ofensivo, fraudulento o que infrinja derechos de propiedad intelectual de terceros.</li>
              <li>Asumir total responsabilidad por los productos, precios, promociones y contenido ofertado dentro de su tienda online.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-emerald-600">4.</span> Planes y Pagos
            </h2>
            <p>
              Los planes de suscripción pueden ser de modalidad mensual o anual. Todos los precios están expresados en dólares estadounidenses (USD) o su equivalente en moneda local según el procesador de pagos. El usuario puede cancelar su suscripción en cualquier momento. No se realizan reembolsos por períodos ya facturados, salvo disposición legal o regulación aplicable.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-emerald-600">5.</span> Propiedad Intelectual
            </h2>
            <p>
              El código fuente, diseño, marca, marcas registradas, logotipos y arquitectura del sistema de <strong className="text-slate-900">Catalagox</strong> son propiedad exclusiva del titular del servicio y están protegidos por las leyes de propiedad intelectual vigentes.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-emerald-600">6.</span> Limitación de Responsabilidad
            </h2>
            <p>
              Catalagox actúa como un facilitador tecnológico. No participamos ni nos hacemos responsables por las transacciones comerciales, pagos externos, entregas, envíos ni reclamos de garantía efectuados entre el usuario vendedor y los compradores finales de sus tiendas online.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-emerald-600">7.</span> Modificaciones
            </h2>
            <p>
              Nos reservamos el derecho de actualizar o modificar estos términos en cualquier momento para adaptarlos a novedades legislativas o mejoras del servicio. Notificaremos los cambios significativos a través de nuestros canales oficiales.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}