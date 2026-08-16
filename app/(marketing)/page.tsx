import type { Metadata } from "next";
import Hero from "@/components/marketing/Hero";
import RedirectIfLoggedIn from "@/components/marketing/auth/RedirectIfLoggedIn";

const siteUrl = "https://catalogox.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Catalogox | Menú QR y Catálogo Digital para WhatsApp",
  description:
    "Crea tu menú QR o catálogo digital profesional en minutos. Recibe pedidos por WhatsApp sin comisiones. Probalo 7 días gratis. Ideal para gastronómicos y tiendas.",
  keywords: [
    "Catalogox",
    "catalogox.com",
    "menú QR",
    "catálogo digital WhatsApp",
    "crear menú QR gratis",
    "catálogo online para negocios",
    "menú digital para restaurantes",
    "pedidos por WhatsApp sin comisión",
  ],
  authors: [{ name: "Catalogox" }],
  creator: "Catalogox",
  publisher: "Catalogox",
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
    title: "Catalogox | Menú QR y Catálogo Digital para WhatsApp",
    description:
      "Vende más sin comisiones. Crea tu catálogo online o menú QR en minutos y recibe pedidos directo en tu WhatsApp.",
    siteName: "Catalogox",
    images: [
      {
        url: "/og image.png",
        width: 1200,
        height: 630,
        alt: "Catalogox - Tu Catálogo Digital en WhatsApp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Catalogox | Menú QR y Catálogo Digital para WhatsApp",
    description:
      "Vende más sin comisiones. Crea tu catálogo online en minutos y recibe pedidos directo en tu WhatsApp.",
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