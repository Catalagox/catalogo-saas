import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad | catalagox",
  description:
    "Consulta la Política de Privacidad de catalagox y cómo protegemos los datos personales de tu tienda online.",
  keywords: [
    "política de privacidad",
    "protección de datos",
    "catalagox",
    "tienda online",
    "privacidad ecommerce",
  ],
  openGraph: {
    title: "Política de Privacidad | catalagox",
    description:
      "Protección de datos personales y políticas de privacidad para los usuarios de tiendas online en catalagox.",
    siteName: "catalagox",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Política de Privacidad | catalagox",
    description:
      "Conoce cómo protegemos la información personal y de tu tienda online en catalagox.",
  },
};

export default function PrivacidadPage() {
  return (
    <section className="min-h-screen bg-slate-50 text-slate-900 py-24 px-6 relative overflow-hidden">
      {/* Resplandor ambiental de fondo */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto bg-white border border-slate-200 p-8 md:p-12 rounded-3xl shadow-xl relative z-10">
        <div className="border-b border-slate-100 pb-6 mb-8">
          <div className="inline-flex items-center rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 px-3 py-1 text-xs font-bold uppercase tracking-wider mb-4">
            Protección de Datos
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            Política de Privacidad
          </h1>
          <p className="text-slate-500 text-sm mt-3 font-medium">
            En cumplimiento con la Ley 25.326 de Protección de Datos Personales de la República Argentina.
          </p>
        </div>

        <div className="space-y-8 text-slate-600 leading-relaxed font-normal">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-emerald-600">1.</span> Datos Recopilados
            </h2>
            <p className="mb-3">
              En <strong className="text-slate-900">catalagox</strong> recopilamos la información estrictamente necesaria para la creación, configuración y funcionamiento de tu <strong className="text-slate-900">tienda online</strong>:
            </p>
            <ul className="list-disc pl-6 space-y-2 marker:text-emerald-600">
              <li>Nombre, apellido y datos de contacto del titular de la tienda.</li>
              <li>Correo electrónico y credenciales de acceso.</li>
              <li>Información del comercio (nombre de la tienda, logo, catálogo de productos y precios).</li>
              <li>Número de teléfono/WhatsApp asignado para la recepción de pedidos.</li>
              <li>Datos de facturación y transacciones (procesados de forma segura mediante pasarelas externas).</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-emerald-600">2.</span> Finalidad del Tratamiento
            </h2>
            <p>
              Los datos recolectados se utilizan exclusivamente para habilitar y administrar tus cuentas en la plataforma, procesar las suscripciones activas de tu tienda online, brindar soporte técnico continuo y enviar notificaciones operativas relevantes sobre el servicio de <strong className="text-slate-900">catalagox</strong>.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-emerald-600">3.</span> Protección de la Información
            </h2>
            <p>
              Implementamos medidas de seguridad técnicas, administrativas y organizativas para salvaguardar la información personal y los datos del catálogo de tu tienda virtual contra accesos no autorizados, alteraciones, divulgaciones o destrucciones indebidas.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-emerald-600">4.</span> Derechos del Usuario (ARCO)
            </h2>
            <p>
              El titular de los datos personales tiene la facultad de ejercer los derechos de acceso, rectificación, actualización y supresión de sus datos en cualquier momento, enviando una solicitud formal a través de nuestros canales oficiales de contacto, conforme a lo establecido en la Ley 25.326.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-emerald-600">5.</span> Conservación y Eliminación
            </h2>
            <p>
              Los datos vinculados a tu tienda online se conservarán de manera segura mientras mantengas una cuenta activa en <strong className="text-slate-900">catalagox</strong> o hasta que solicites expresamente la baja del servicio y eliminación de tus registros.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}