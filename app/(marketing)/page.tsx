import type { Metadata } from "next";
import Hero from "@/components/marketing/Hero";
import RedirectIfLoggedIn from "@/components/marketing/auth/RedirectIfLoggedIn";
import PelotaMundial from "@/components/PelotaMundial";

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
      <PelotaMundial />

      <main className="relative min-h-screen w-full overflow-hidden bg-white pb-0 mb-0">
        <Hero />
      </main>
    </>
  );
}
