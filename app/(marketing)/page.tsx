import type { Metadata } from "next";
import Hero from "@/components/marketing/Hero";
import RedirectIfLoggedIn from "@/components/marketing/auth/RedirectIfLoggedIn";
import { createPageMetadata } from "@/components/marketing/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Crea tu Tienda Online Fácilmente | Catalagox",

  description:
    "Crea una tienda online profesional sin programar. Publica tus productos, personaliza tu catálogo y recibe pedidos por WhatsApp con Catalagox.",

  path: "/",

  keywords: [
    "crear tienda online",
    "tienda online profesional",
    "crear tienda virtual",
    "vender online",
    "vender por internet",
    "tienda online para emprendedores",
    "tienda online para pequeños negocios",
    "vender productos online",
    "pedidos por WhatsApp",
  ],

  image: "/og-image.png",

  imageAlt: "Catalagox - Plataforma para crear tiendas online",
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
