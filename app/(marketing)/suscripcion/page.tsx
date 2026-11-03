
import type { Metadata } from "next";
import { createPageMetadata } from "@/components/marketing/seo/metadata";
import SuscripcionClient from "@/components/marketing/suscripcion/SuscripcionClient";

export const metadata: Metadata = createPageMetadata({
  title: "Planes y Precios | Catalagox",

  description:
    "Conoce los planes Basic y Pro de Catalagox. Crea tu tienda online, publica hasta 300 productos y recibe pedidos de tus clientes por WhatsApp.",

  path: "/suscripcion",

  keywords: [
    "planes Catalagox",
    "precios Catalagox",
    "planes de tienda online",
    "precio tienda online",
    "plan Basic",
    "plan Pro",
    "plataforma ecommerce",
    "tienda virtual para emprendedores",
  ],
});

export default function SuscripcionPage() {
  return <SuscripcionClient />;
}
