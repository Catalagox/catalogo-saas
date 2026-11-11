
import type { Metadata } from "next";
import HeroPaginaWeb from "@/components/marketing/crear-pagina-web/HeroPaginaWeb";
import { createPageMetadata } from "@/components/marketing/seo/metadata";
import BeneficiosPaginaWeb from "@/components/marketing/crear-pagina-web/BeneficiosPaginaWeb";

export const metadata: Metadata = createPageMetadata({
  title: "Crea tu Página Web para tu Negocio | Catalagox",

  description:
    "Crea tu propia página web sin programar. Presenta tu negocio, muestra tus servicios y comparte tus datos de contacto con Catalagox.",

  path: "/crear-pagina-web",

  keywords: [
    "crear página web",
    "crear página web para negocio",
    "página web para empresas",
    "página web profesional",
    "crear sitio web",
    "páginas web para emprendedores",
    "página web para servicios",
  ],

  image: "/og-image.png",

  imageAlt: "Catalagox - Crea páginas web para negocios",
});

export default function CrearPaginaWeb() {
  return (
    <main className="min-h-screen w-full overflow-hidden">
      <HeroPaginaWeb />
      <BeneficiosPaginaWeb />
    </main>
  );
}
