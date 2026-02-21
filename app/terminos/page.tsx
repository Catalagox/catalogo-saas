export default function TerminosPage() {
  return (
    <section className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-2xl shadow-md">

        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-black">
          Términos y Condiciones
        </h1>

        <p className="text-gray-600 mb-6">
          Última actualización: 13 de febrero de 2026
        </p>

        <h2 className="text-xl text-black font-semibold mt-8 mb-4">1. Información del Servicio</h2>
        <p className="text-gray-700 mb-4">
          CatalogPro es una plataforma digital que permite a negocios crear y gestionar
          catálogos digitales accesibles mediante enlace o código QR.
          El servicio opera desde la República Argentina.
        </p>

        <h2 className="text-xl text-black font-semibold mt-8 mb-4">2. Aceptación de los términos</h2>
        <p className="text-gray-700 mb-4">
          Al registrarse o utilizar la plataforma, el usuario acepta los presentes
          Términos y Condiciones.
        </p>

        <h2 className="text-xl text-black font-semibold mt-8 mb-4">3. Uso del servicio</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>Proporcionar información veraz y actualizada.</li>
          <li>No utilizar el servicio para actividades ilícitas.</li>
          <li>No publicar contenido ofensivo o que infrinja derechos de terceros.</li>
          <li>Ser responsable del contenido publicado en su catálogo.</li>
        </ul>

        <h2 className="text-xl text-black font-semibold mt-8 mb-4">4. Planes y pagos</h2>
        <p className="text-gray-700 mb-4">
          Los planes pueden ser mensuales o anuales. Los precios están expresados en
          dólares estadounidenses (USD). El usuario puede cancelar su suscripción
          en cualquier momento. No se realizan reembolsos por períodos ya facturados,
          salvo disposición legal en contrario.
        </p>

        <h2 className="text-xl text-black font-semibold mt-8 mb-4">5. Propiedad intelectual</h2>
        <p className="text-gray-700 mb-4">
          El software, diseño y estructura de CatalogPro son propiedad del titular
          y están protegidos por la legislación vigente.
        </p>

        <h2 className="text-xl text-black font-semibold mt-8 mb-4">6. Limitación de responsabilidad</h2>
        <p className="text-gray-700 mb-4">
          CatalogPro no será responsable por pérdidas económicas derivadas del uso
          del servicio ni por errores en la información publicada por los usuarios.
        </p>

        <h2 className="text-xl text-black font-semibold mt-8 mb-4">7. Modificaciones</h2>
        <p className="text-gray-700">
          Nos reservamos el derecho de modificar estos términos en cualquier momento.
        </p>

      </div>
    </section>
  );
}
