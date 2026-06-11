import type { Metadata } from "next";
import Hero from "@/components/marketing/Hero";
import RedirectIfLoggedIn from "@/components/marketing/auth/RedirectIfLoggedIn";

export const metadata: Metadata = {
  title: "Menú QR y Catálogo Digital para Negocios",
  description:
    "Crea tu menú QR o catálogo digital profesional en minutos. 7 días gratis. Ideal para restaurantes, tiendas y emprendedores en Argentina.",
  keywords: [
    "menú QR",
    "menú QR Argentina",
    "catálogo digital",
    "crear menú QR",
    "catálogo online para negocios",
  ],
};

export default function Home() {
  return (
    <>
      <RedirectIfLoggedIn />

      {/* Agregamos relative y overflow-hidden para que los círculos de colores 
        que se muevan de fondo no generen scroll horizontal.
      */}
      <main className="relative min-h-screen w-full overflow-hidden bg-white">
        <Hero />
      </main>
    </>
  );
}