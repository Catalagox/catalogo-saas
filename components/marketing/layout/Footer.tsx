import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa6";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-32">
      <div className="max-w-7xl mx-auto px-6">

        {/* CONTENIDO PRINCIPAL */}
        <div className="py-16 grid grid-cols-1 lg:grid-cols-4 gap-12 text-center">

          {/* REDES */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">SÍGUEME</h2>

            <div className="flex justify-center gap-4">
              <a
                href="https://www.facebook.com/profile.php?id=61571006050029"
                className="bg-white/5 p-3 rounded-full hover:scale-110 hover:bg-white hover:text-black transition-all duration-300"
                aria-label="Facebook"
              >
                <FaFacebookF size={18} />
              </a>

              <a
                href="https://www.instagram.com/catalago.x/"
                className="bg-white/5 p-3 rounded-full hover:scale-110 hover:bg-white hover:text-black transition-all duration-300"
                aria-label="Instagram"
              >
                <FaInstagram size={18} />
              </a>

              <a
                href="https://www.tiktok.com/@catalagox"
                className="bg-white/5 p-3 rounded-full hover:scale-110 hover:bg-white hover:text-black transition-all duration-300"
                aria-label="TikTok"
              >
                <FaTiktok size={18} />
              </a>
            </div>
          </div>

          {/* PRODUCTO */}
          <div className="text-center lg:text-left">
            <h3 className="font-semibold mb-5 text-lg">Producto</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="hover:text-white transition cursor-pointer">Catálogos Digitales</li>
              <li className="hover:text-white transition cursor-pointer">Menús con QR</li>
              <Link href="/planes" className="hover:text-white transition cursor-pointer">Planes y Precios</Link>
            </ul>
          </div>

         {/* EMPRESA */}
<div className="text-center lg:text-left">
  <h3 className="font-semibold mb-5 text-lg">Empresa</h3>

  <ul className="space-y-3 text-gray-400 text-sm">

    <li>
      <Link
        href="/sobre-nosotros"
        className="hover:text-white transition duration-300"
      >
        Sobre Nosotros
      </Link>
    </li>

    <li>
      <Link
        href="/contacto"
        className="hover:text-white transition duration-300"
      >
        Contacto
      </Link>
    </li>

  </ul>
</div>


        {/* LEGAL */}
<div className="text-center lg:text-left">
  <h3 className="font-semibold mb-5 text-lg">Legal</h3>

  <ul className="space-y-3 text-gray-400 text-sm">
    
    <li>
      <Link
        href="/terminos"
        className="relative inline-block transition duration-300 hover:text-white"
      >
        Términos y Condiciones
        <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
      </Link>
    </li>

    <li>
      <Link
        href="/privacidad"
        className="relative inline-block transition duration-300 hover:text-white"
      >
        Política de Privacidad
        <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-white transition-all duration-300"></span>
      </Link>
    </li>

  </ul>
</div>


        </div>

        {/* COPYRIGHT */}
        <div className="border-t border-gray-800 py-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} CatalogX. Todos los derechos reservados.
        </div>

      </div>
    </footer>
  );
}
