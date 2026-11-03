
import type { Metadata } from "next";
import Hero from "@/components/marketing/Hero";
import RedirectIfLoggedIn from "@/components/marketing/auth/RedirectIfLoggedIn";
import { createPageMetadata } from "@/components/marketing/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Crea tu Tienda Online Profesional | Catalagox",

  description:
    "Crea tu tienda online profesional en minutos. Publica tus productos, personaliza tu diseño, recibe pedidos por WhatsApp y vende por Internet con Catalagox.",

  path: "/",

  keywords: [
    "catalagox.com",
    "crear tienda online",
    "tienda online profesional",
    "vender online",
    "vender por internet",
    "crear tienda online gratis",
    "ecommerce",
    "e-commerce",
    "tienda virtual",
    "tienda online para emprendedores",
    "tienda online para pequeños negocios",
    "vender productos online",
    "menú QR",
    "pedidos por WhatsApp",
  ],

  image: "/og-image.png",

  imageAlt: "Catalagox - Crea tu Tienda Online Profesional",
});

export default function Home() {
  return (
    <>
      <RedirectIfLoggedIn />

      <main className="relative min-h-screen w-full overflow-hidden bg-white pb-0 mb-0">
        <Hero />
      </main>
    </>
  );
}

