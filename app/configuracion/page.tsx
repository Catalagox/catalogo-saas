export default function ConfiguracionPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8">
        
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          ⚙️ Configuración del Sistema
        </h1>

        {/* Sección Perfil */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Información del Negocio
          </h2>

          <div className="grid gap-4">
            <input
              type="text"
              placeholder="Nombre del negocio"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />

            <input
              type="email"
              placeholder="Correo de contacto"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />

            <input
              type="text"
              placeholder="Número de WhatsApp"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </section>

        {/* Sección Apariencia */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Apariencia
          </h2>

          <div className="flex gap-4">
            <button className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition">
              Tema Oscuro
            </button>

            <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition">
              Tema Claro
            </button>
          </div>
        </section>

        {/* Sección Seguridad */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Seguridad
          </h2>

          <button className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition">
            Cambiar contraseña
          </button>
        </section>

        {/* Botón Guardar */}
        <div className="flex justify-end">
          <button className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition font-semibold">
            Guardar Cambios
          </button>
        </div>

      </div>
    </main>
  );
}