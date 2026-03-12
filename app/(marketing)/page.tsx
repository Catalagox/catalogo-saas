import type { Metadata } from "next";
import Hero from "@/components/marketing/Hero";

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
    <main className="
  min-h-screen 
  flex 
  items-center 
  justify-center 
  bg-gradient-to-b 
  from-white 
  via-gray-50 
  to-gray-200
">
      <Hero />
    </main>
  );
}
