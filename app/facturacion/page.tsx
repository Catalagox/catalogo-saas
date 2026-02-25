export default function FacturacionPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-8">
        
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          💳 Facturación y Suscripción
        </h1>

        {/* Estado del plan */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Tu Plan Actual
          </h2>

          <div className="bg-gray-100 p-6 rounded-xl flex justify-between items-center">
            <div>
              <p className="text-lg font-bold">Plan Profesional</p>
              <p className="text-gray-600 text-sm">
                Renovación automática el 30 de este mes
              </p>
            </div>

            <span className="px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-semibold">
              Activo
            </span>
          </div>
        </section>

        {/* Métodos de pago */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Método de Pago
          </h2>

          <div className="bg-gray-100 p-6 rounded-xl flex justify-between items-center">
            <div>
              <p className="font-semibold">Visa terminada en 4242</p>
              <p className="text-sm text-gray-600">
                Expira 12/27
              </p>
            </div>

            <button className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition">
              Cambiar
            </button>
          </div>
        </section>

        {/* Historial */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Historial de Facturación
          </h2>

          <div className="divide-y border rounded-xl">
            <div className="p-4 flex justify-between">
              <span>Febrero 2026</span>
              <span className="font-semibold">$29.00</span>
            </div>
            <div className="p-4 flex justify-between">
              <span>Enero 2026</span>
              <span className="font-semibold">$29.00</span>
            </div>
            <div className="p-4 flex justify-between">
              <span>Diciembre 2025</span>
              <span className="font-semibold">$29.00</span>
            </div>
          </div>
        </section>

        {/* Botones finales */}
        <div className="flex justify-between">
          <button className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition">
            Cancelar Suscripción
          </button>

          <button className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition">
            Actualizar Plan
          </button>
        </div>

      </div>
    </main>
  );
}