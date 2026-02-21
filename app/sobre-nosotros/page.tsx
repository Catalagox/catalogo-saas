export default function SobreNosotrosPage() {
  return (
    <section className="min-h-screen bg-gray-50 py-24 px-6">
      <div className="max-w-6xl mx-auto">

        {/* TITULO */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-extrabold text-black mb-6">
            Sobre Nosotros
          </h1>

          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            Estamos construyendo la nueva generación de herramientas digitales
            para negocios en Latinoamérica, con una visión global.
          </p>
        </div>

        {/* BLOQUE PRINCIPAL */}
        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* TEXTO */}
          <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
            <p>
              CatalogPro nació con la convicción de que cualquier negocio,
              sin importar su tamaño, debe tener acceso a herramientas digitales
              modernas, simples y accesibles.
            </p>

            <p>
              En una región como Latinoamérica, donde millones de pequeños
              y medianos emprendimientos impulsan la economía,
              creemos que la digitalización no debe ser un lujo,
              sino una oportunidad real al alcance de todos.
            </p>

            <p>
              Nuestra plataforma permite crear catálogos digitales profesionales
              en minutos, optimizados para dispositivos móviles,
              listos para compartir mediante enlaces o códigos QR.
            </p>

            <p>
              Estamos comprometidos con desarrollar tecnología intuitiva,
              escalable y pensada para competir a nivel internacional.
            </p>
          </div>

          {/* TARJETA DESTACADA */}
          <div className="bg-white p-12 rounded-3xl shadow-2xl space-y-10">

            <div>
              <h3 className="text-2xl font-bold text-black mb-4">
                Nuestra Misión
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Democratizar el acceso a herramientas digitales
                para que los negocios de Latinoamérica puedan
                crecer, vender más y competir en el mercado global.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-black mb-4">
                Nuestra Visión
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Convertirnos en la plataforma líder de catálogos digitales
                en la región y expandir nuestra tecnología al mundo,
                impulsando la transformación digital de miles de empresas.
              </p>
            </div>

          </div>

        </div>

        {/* BLOQUE FINAL */}
        <div className="text-center mt-24 max-w-3xl mx-auto">
          <p className="text-gray-700 text-lg leading-relaxed">
            Creemos en el talento latinoamericano, en la innovación constante
            y en el poder de la tecnología para transformar negocios.
            Estamos apenas comenzando.
          </p>
        </div>

      </div>
    </section>
  );
}

