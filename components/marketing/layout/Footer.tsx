import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa6";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      Icon: FaFacebookF,
      href: "https://www.facebook.com/profile.php?id=61571006050029",
      label: "Facebook",
    },
    {
      Icon: FaInstagram,
      href: "https://www.instagram.com/catalago.x/",
      label: "Instagram",
    },
    {
      Icon: FaTiktok,
      href: "https://www.tiktok.com/@catalagox",
      label: "TikTok",
    },
    {
      Icon: FaYoutube,
      href: "https://www.youtube.com/@Catalagox",
      label: "YouTube",
    },
  ];

  return (
    <footer className="bg-black text-white mt-0 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        {/* CONTENIDO PRINCIPAL */}
        <div className="py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* REDES SOCIALES */}
          <div className="space-y-2 flex flex-col items-center lg:items-start">
            <h2 className="font-bold mb-6 text-lg text-white text-center lg:text-left">
              Síguenos
            </h2>

            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative bg-white/5 p-4 rounded-2xl transition-all duration-300 hover:-translate-y-2"
                  aria-label={social.label}
                >
                  {/* Icono con color verde por defecto */}
                  <social.Icon
                    size={20}
                    className="text-emerald-500 transition-colors duration-300 group-hover:text-black z-10 relative"
                  />

                  {/* Fondo verde expandible en Hover */}
                  <div className="absolute inset-0 bg-emerald-500 rounded-2xl scale-0 group-hover:scale-100 transition-transform duration-300 z-0" />
                </a>
              ))}
            </div>
          </div>

          {/* PRODUCTO */}
          <div className="text-center lg:text-left">
            <h3 className="font-bold mb-6 text-lg text-white">Producto</h3>
            <ul className="space-y-4 text-gray-400 text-sm font-medium">
              <li>
                <Link
                  href="/#features"
                  className="hover:text-emerald-500 transition-colors"
                >
                  Catálogos Digitales
                </Link>
              </li>
              <li>
                <Link
                  href="/#features"
                  className="hover:text-emerald-500 transition-colors"
                >
                  Menús con QR
                </Link>
              </li>
              <li>
                <Link
                  href="/suscripcion"
                  className="hover:text-emerald-500 transition-colors"
                >
                  Planes y Precios
                </Link>
              </li>
              <li>
                <a
                  href="https://catalagox.com/rifas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-500 transition-colors"
                >
                  Rifas
                </a>
              </li>
            </ul>
          </div>

          {/* EMPRESA */}
          <div className="text-center lg:text-left">
            <h3 className="font-bold mb-6 text-lg text-white">Empresa</h3>
            <ul className="space-y-4 text-gray-400 text-sm font-medium">
              <li>
                <Link
                  href="/sobre-nosotros"
                  className="hover:text-emerald-500 transition-colors"
                >
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="hover:text-emerald-500 transition-colors"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* LEGAL */}
          <div className="text-center lg:text-left">
            <h3 className="font-bold mb-6 text-lg text-white">Legal</h3>
            <ul className="space-y-4 text-gray-400 text-sm font-medium">
              <li>
                <Link
                  href="/terminos"
                  className="hover:text-emerald-500 transition-colors"
                >
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link
                  href="/privacidad"
                  className="hover:text-emerald-500 transition-colors"
                >
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="border-t border-white/5 py-8 text-center">
          <p className="text-gray-500 text-xs tracking-widest uppercase font-bold">
            © {currentYear}{" "}
            <span className="text-white">
              Catalago<span className="text-emerald-500">X</span>
            </span>
            . Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}