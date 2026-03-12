import type { Metadata } from "next";
import { FaWhatsapp, FaEnvelope } from "react-icons/fa";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contáctanos para crear tu catálogo digital o menú QR. Soporte y asesoramiento para negocios en Argentina y Latinoamérica.",
};

export default function ContactoPage() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-20 px-4 sm:px-6 lg:px-8 flex items-center">
      <div className="max-w-6xl mx-auto w-full">

        {/* GRID PRINCIPAL */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* COLUMNA TEXTO */}
          <div className="text-center lg:text-left space-y-8">

            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-black leading-tight">
                Hablemos.
              </h1>

              <p className="mt-6 text-gray-600 text-lg sm:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Estamos listos para ayudarte a impulsar tu negocio en
                Latinoamérica y el mundo. Escríbenos por el medio que
                prefieras y nuestro equipo te responderá rápidamente.
              </p>
            </div>

            <div className="hidden lg:block text-sm text-gray-500">
              Respondemos generalmente dentro de 24 a 48 horas hábiles.
            </div>
          </div>

          {/* COLUMNA CARD */}
          <div className="relative">

            {/* Efecto fondo decorativo */}
            <div className="absolute -inset-1 bg-gradient-to-r from-black to-gray-600 rounded-3xl blur opacity-10"></div>

            <div className="relative bg-white rounded-3xl shadow-2xl p-8 sm:p-12 space-y-6">

              {/* EMAIL */}
              <a
                href="mailto:gealoox@gmail.com?subject=Consulta%20desde%20la%20web&body=Hola,%20quiero%20más%20información%20sobre%20sus%20servicios."
                className="group flex items-center justify-center gap-4 w-full border border-black text-black py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:bg-black hover:text-white"
              >
                <FaEnvelope className="text-xl transition-transform group-hover:scale-110" />
                Enviar Email
              </a>

              {/* WHATSAPP */}
              <a
                href="https://wa.me/5491122744966?text=Hola,%20quiero%20más%20información%20sobre%20sus%20servicios."
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-4 w-full bg-green-600 text-white py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:bg-green-700 hover:scale-[1.02]"
              >
                <FaWhatsapp className="text-xl transition-transform group-hover:scale-110" />
                Contactar por WhatsApp
              </a>

              {/* INFO MOBILE */}
              <div className="lg:hidden pt-4 border-t text-center text-gray-500 text-sm">
                Respondemos dentro de 24 a 48 horas hábiles.
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
