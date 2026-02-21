export default function PreciosPage() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-24 px-6">
      <div className="max-w-6xl mx-auto text-center">

        {/* TITULO */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-black mb-6">
          Planes y Precios
        </h1>

        <p className="text-gray-600 text-lg mb-16">
          Elige el plan ideal para hacer crecer tu negocio digital.
        </p>

        {/* PLANES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* PLAN BASICO */}
          <div className="bg-white p-10 rounded-3xl shadow-lg border hover:shadow-2xl transition duration-300">
            <h3 className="text-2xl font-bold text-black mb-4">
              Básico
            </h3>

            <p className="text-5xl font-extrabold text-black mb-6">
              $3<span className="text-lg font-medium text-gray-500"> / mes</span>
            </p>

            <ul className="space-y-4 text-gray-600 mb-10">
              <li>✔ 1 Catálogo</li>
              <li>✔ 50 Productos</li>
              <li>✔ Enlace Compartible</li>
            </ul>

            <button className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:opacity-90 transition">
              Elegir Plan
            </button>
          </div>

          {/* PLAN PRO DESTACADO */}
          <div className="relative bg-black text-white p-10 rounded-3xl shadow-2xl scale-105">

            {/* Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-xs font-bold px-4 py-1 rounded-full">
              MÁS POPULAR
            </div>

            <h3 className="text-2xl font-bold mb-4">
              Pro
            </h3>

            <p className="text-5xl font-extrabold mb-6">
              $19<span className="text-lg font-medium text-gray-300"> / mes</span>
            </p>

            <ul className="space-y-4 mb-10 text-gray-200">
              <li>✔ Catálogos Ilimitados</li>
              <li>✔ Productos Ilimitados</li>
              <li>✔ QR Personalizado</li>
              <li>✔ Soporte Prioritario</li>
            </ul>

            <button className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:opacity-90 transition">
              Elegir Plan
            </button>
          </div>

          {/* PLAN EMPRESA */}
          <div className="bg-white p-10 rounded-3xl shadow-lg border hover:shadow-2xl transition duration-300">
            <h3 className="text-2xl font-bold text-black mb-4">
              Empresa
            </h3>

            <p className="text-5xl font-extrabold text-black mb-6">
              $39<span className="text-lg font-medium text-gray-500"> / mes</span>
            </p>

            <ul className="space-y-4 text-gray-600 mb-10">
              <li>✔ Todo lo del plan Pro</li>
              <li>✔ Múltiples Usuarios</li>
              <li>✔ Dominio Personalizado</li>
            </ul>

            <button className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:opacity-90 transition">
              Contactar
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
