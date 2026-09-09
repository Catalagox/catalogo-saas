import type { Metadata } from "next";
import Hero from "@/components/marketing/Hero";
import RedirectIfLoggedIn from "@/components/marketing/auth/RedirectIfLoggedIn";

const siteUrl = "https://catalagox.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Crea tu Tienda Online Profesional | Catalagox",
  description:
    "Crea tu tienda online profesional en minutos. Publica tus productos, personaliza tu diseño, recibe pedidos por WhatsApp y vende por Internet con Catalagox.",
  keywords: [
    "Catalagox",
    "catalagox.com",
    "tienda online",
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
    "catálogo digital",
    "menú QR",
    "pedidos por WhatsApp",
  ],
  authors: [{ name: "Catalagox" }],
  creator: "Catalagox",
  publisher: "Catalagox",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: siteUrl,
    title: "Crea tu Tienda Online Profesional | Catalagox",
    description:
      "Crea tu tienda online en minutos. Vende por Internet, gestiona tus productos, activa tu carrito de compras y recibe pedidos directo en tu WhatsApp.",
    siteName: "Catalagox",
    images: [
      {
        url: "/og image.png",
        width: 1200,
        height: 630,
        alt: "Catalagox - Crea tu Tienda Online Profesional",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crea tu Tienda Online Profesional | Catalagox",
    description:
      "Crea tu tienda online en minutos. Vende por Internet, publica tus productos y recibe pedidos directamente en tu WhatsApp.",
    images: ["/og image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon 96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: "/apple touch icon.png",
  },
  manifest: "/site.webmanifest",
};

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