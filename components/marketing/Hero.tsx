import { FaStore, FaUsers, FaGlobe, FaRocket, FaPalette, FaMobileAlt } from "react-icons/fa";
import Link from "next/link";


export default function Hero() {
  return (
    <section className="w-full bg-gradient-to-b from-white  py-24 px-6">
      <div className="max-w-6xl mx-auto">

        {/* HERO */}
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-black leading-tight">
            Catálogos Digitales y <br className="hidden md:block" />
            Menús QR para tu Negocio
          </h1>

          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Crea catálogos profesionales y menús digitales con código QR.
            Moderniza tu negocio y permite que tus clientes accedan a tu
            información desde cualquier celular.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
           <Link
  href="/auth"
  className="px-8 py-3 rounded-xl bg-black text-white font-medium hover:opacity-80 transition inline-block"
>
  Comenzar Gratis
</Link>

            <button className="px-8 py-3 rounded-xl border border-black text-black font-medium hover:bg-black hover:text-white transition">
              Ver Demo
            </button>
          </div>
        </div>

       {/* MOCKUP */}
<div className="mt-20 flex justify-center">
  <div className="relative w-72 h-[500px] bg-black rounded-[40px] p-4 shadow-2xl">
    
    {/* Pantalla */}
    <div className="w-full h-full bg-white rounded-[30px] p-6 text-black flex flex-col">
      
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold">Menú Digital</h3>
        <p className="text-xs text-gray-500">
          Escanea el QR y ordena fácilmente
        </p>
      </div>

      {/* Productos */}
      <div className="space-y-5 text-sm flex-1">

        <div className="flex justify-between items-start border-b pb-2">
          <div>
            <p className="font-medium">Pizza Margarita Clásica</p>
            <p className="text-xs text-gray-500">Tomate, mozzarella y albahaca fresca</p>
          </div>
          <span className="font-bold text-red-500">$12.99</span>
        </div>

        <div className="flex justify-between items-start border-b pb-2">
          <div>
            <p className="font-medium">Hamburguesa BBQ Especial</p>
            <p className="text-xs text-gray-500">Carne premium, queso cheddar y salsa BBQ</p>
          </div>
          <span className="font-bold text-red-500">$10.50</span>
        </div>

        <div className="flex justify-between items-start border-b pb-2">
          <div>
            <p className="font-medium">Ensalada César Gourmet</p>
            <p className="text-xs text-gray-500">Pollo a la parrilla y aderezo casero</p>
          </div>
          <span className="font-bold text-red-500">$8.75</span>
        </div>

        <div className="flex justify-between items-start">
          <div>
            <p className="font-medium">Pasta Alfredo</p>
            <p className="text-xs text-gray-500">Salsa cremosa con queso parmesano</p>
          </div>
          <span className="font-bold text-red-500">$11.40</span>
        </div>

      </div>

    </div>
  </div>
</div>


        {/* SECCIÓN CATALOGOS Y MENÚS */}
        <div className="mt-28 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">


          {/* CATALOGOS */}
<div className="text-center md:text-left max-w-xl mx-auto md:mx-0">
  
  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-6 leading-tight">
    Catálogos Digitales
  </h2>

  <p className="text-gray-600 text-base sm:text-lg mb-8 leading-relaxed">
    Muestra tus productos con imágenes, precios y descripciones
    en un catálogo online moderno y fácil de compartir.
  </p>

  <ul className="space-y-4 text-gray-700 text-base sm:text-lg">
    <li className="flex items-center gap-3 justify-center md:justify-start">
      <span className="text-black">✔</span>
      Enlaces personalizados
    </li>

    <li className="flex items-center gap-3 justify-center md:justify-start">
      <span className="text-black">✔</span>
      Ideal para tiendas y emprendedores
    </li>

    <li className="flex items-center gap-3 justify-center md:justify-start">
      <span className="text-black">✔</span>
      Actualización en tiempo real
    </li>
  </ul>

</div>


       {/* MENÚ QR */}
<div className="text-center md:text-left max-w-xl mx-auto md:mx-0">

  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-6 leading-tight">
    Menús con Código QR
  </h2>

  <p className="text-gray-600 text-base sm:text-lg mb-8 leading-relaxed">
    Perfecto para restaurantes, bares y cafeterías.
    Tus clientes escanean el código QR y acceden al menú
    digital sin necesidad de cartas físicas.
  </p>

  <ul className="space-y-4 text-gray-700 text-base sm:text-lg">
    <li className="flex items-center gap-3 justify-center md:justify-start">
      <span className="text-black">✔</span>
      Más higiene
    </li>

    <li className="flex items-center gap-3 justify-center md:justify-start">
      <span className="text-black">✔</span>
      Ahorro en impresión
    </li>

    <li className="flex items-center gap-3 justify-center md:justify-start">
      <span className="text-black">✔</span>
      Cambios instantáneos
    </li>
  </ul>

</div>
        </div>

        {/* BENEFICIOS */}
<div className="mt-28">

  {/* TÍTULO DE SECCIÓN */}
  <div className="text-center mb-16">
    <h2 className="text-3xl md:text-4xl font-bold text-black">
      ¿Por qué elegir nuestra plataforma?
    </h2>
    <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
      Todo lo que necesitas para digitalizar tu catálogo o menú QR
      de manera simple y profesional.
    </p>
  </div>

  {/* TARJETAS */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">

  {/* CARD 1 */}
  <div className="group relative p-8 bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">

    {/* Icono */}
    <div className="mb-6 inline-flex p-4 rounded-2xl bg-black group-hover:bg-black group-hover:text-white transition-all duration-300">
      <FaRocket className="text-2xl text-white" />
    </div>

    <h3 className="text-xl md:text-2xl font-bold text-black mb-4">
      Fácil de Usar
    </h3>

    <p className="text-gray-600 leading-relaxed">
      Plataforma intuitiva diseñada para que cualquier negocio
      pueda crear y administrar su catálogo o menú digital
      sin conocimientos técnicos.
    </p>

  </div>

  {/* CARD 2 */}
  <div className="group relative p-8 bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">

    <div className="mb-6 inline-flex p-4 rounded-2xl bg-black group-hover:bg-black group-hover:text-white transition-all duration-300">
      <FaPalette className="text-2xl text-white" />
    </div>

    <h3 className="text-xl md:text-2xl font-bold text-black mb-4">
      Diseño Profesional
    </h3>

    <p className="text-gray-600 leading-relaxed">
      Interfaz moderna y atractiva que eleva la presencia
      digital de tu negocio y transmite confianza a tus clientes.
    </p>

  </div>

  {/* CARD 3 */}
  <div className="group relative p-8 bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">

    <div className="mb-6 inline-flex p-4 rounded-2xl bg-black group-hover:bg-black group-hover:text-white transition-all duration-300">
      <FaMobileAlt className="text-2xl text-white" />
    </div>

    <h3 className="text-xl md:text-2xl font-bold text-black mb-4">
      Accesible en Todo Dispositivo
    </h3>

    <p className="text-gray-600 leading-relaxed">
      Compatible con celulares, tablets y computadoras,
      sin necesidad de instalar aplicaciones adicionales.
    </p>

  </div>

</div>


</div>


      {/* ESTADÍSTICAS */}
<div className="mt-28 relative">

  {/* Fondo con efecto */}
  <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black rounded-3xl"></div>

  <div className="relative bg-black/90 backdrop-blur rounded-3xl p-10 sm:p-14 text-white">

    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">

      {/* ITEM 1 */}
      <div className="group space-y-4">
        <div className="flex justify-center">
          <div className="bg-white/10 p-4 rounded-2xl group-hover:scale-110 transition duration-300">
            <FaStore className="text-3xl text-white" />
          </div>
        </div>

        <div className="text-4xl sm:text-5xl font-extrabold">
          +500
        </div>

        <p className="text-gray-300 text-lg">
          Negocios Activos
        </p>
      </div>

      {/* ITEM 2 */}
      <div className="group space-y-4">
        <div className="flex justify-center">
          <div className="bg-white/10 p-4 rounded-2xl group-hover:scale-110 transition duration-300">
            <FaUsers className="text-3xl text-white" />
          </div>
        </div>

        <div className="text-4xl sm:text-5xl font-extrabold">
          +10K
        </div>

        <p className="text-gray-300 text-lg">
          Clientes Alcanzados
        </p>
      </div>

      {/* ITEM 3 */}
      <div className="group space-y-4">
        <div className="flex justify-center">
          <div className="bg-white/10 p-4 rounded-2xl group-hover:scale-110 transition duration-300">
            <FaGlobe className="text-3xl text-white" />
          </div>
        </div>

        <div className="text-4xl sm:text-5xl font-extrabold">
          100%
        </div>

        <p className="text-gray-300 text-lg">
          Digital
        </p>
      </div>

    </div>

 {/* BOTÓN */}
<div className="flex justify-center mt-14 px-4">
  <Link
    href="/auth"
    className="
      w-full sm:w-auto
      text-center
      px-6 sm:px-10
      py-4
      rounded-2xl
      bg-white
      text-black
      font-semibold
      text-base sm:text-lg
      hover:scale-105
      hover:shadow-xl
      transition-all
      duration-300
    "
  >
    Crear mi Catálogo o Menú QR
  </Link>
</div>

  </div>
</div>


      </div>
    </section>
  );
}

