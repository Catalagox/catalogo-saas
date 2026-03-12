import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description:
    "Consulta la Política de Privacidad de CatalogoX y cómo protegemos los datos personales conforme a la Ley 25.326 de Argentina.",
};

export default function PrivacidadPage() {
  return (
    <section className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-2xl shadow-md">

        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-black">
          Política de Privacidad
        </h1>

        <p className="text-gray-600 mb-6">
          En cumplimiento con la Ley 25.326 de Protección de Datos Personales
          de la República Argentina.
        </p>

        <h2 className="text-xl text-black font-semibold mt-8 mb-4">1. Datos recopilados</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>Nombre y apellido.</li>
          <li>Correo electrónico.</li>
          <li>Información del negocio.</li>
          <li>Datos de facturación.</li>
          <li>Datos de pago procesados por terceros.</li>
        </ul>

        <h2 className="text-xl text-black font-semibold mt-8 mb-4">2. Finalidad</h2>
        <p className="text-gray-700 mb-4">
          Los datos se utilizan para crear y administrar cuentas, procesar pagos,
          brindar soporte y enviar comunicaciones relacionadas con el servicio.
        </p>

        <h2 className="text-xl text-black font-semibold mt-8 mb-4">3. Protección de datos</h2>
        <p className="text-gray-700 mb-4">
          Implementamos medidas técnicas y organizativas para proteger la
          información personal contra accesos no autorizados.
        </p>

        <h2 className="text-xl text-black font-semibold mt-8 mb-4">4. Derechos del usuario</h2>
        <p className="text-gray-700 mb-4">
          El titular de los datos puede ejercer el derecho de acceso,
          rectificación y supresión conforme a la Ley 25.326.
        </p>

        <h2 className="text-xl text-black font-semibold mt-8 mb-4">5. Conservación</h2>
        <p className="text-gray-700">
          Los datos se conservarán mientras exista relación contractual
          o hasta que el usuario solicite su eliminación.
        </p>

      </div>
    </section>
  );
}
