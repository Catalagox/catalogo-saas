import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";


const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://catalagox.com"),

  title: {
    default: "CatalogoX | Crea tu Catálogo Digital y Menú QR",
    template: "%s | CatalogoX",
  },

  description:
    "Crea catálogos digitales y menús QR para tu negocio en minutos. Diseño profesional, fácil de usar y 7 días gratis. Ideal para restaurantes, tiendas y emprendedores en Argentina.",

  keywords: [
    "catálogo digital",
    "menú QR",
    "crear menú QR",
    "catálogo online",
    "catálogo para negocios",
    "menú digital restaurante",
    "menú QR Argentina",
    "catálogos digitales Argentina",
  ],

  authors: [{ name: "CatalogoX" }],
  creator: "CatalogoX",
  publisher: "CatalogoX",

  openGraph: {
    title: "CatalogoX | Crea tu Catálogo Digital y Menú QR",
    description:
      "Crea tu catálogo digital o menú QR profesional en minutos. 7 días gratis.",
    url: "https://catalagox.com",
    siteName: "CatalogoX",
    locale: "es_AR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "CatalogoX | Catálogos Digitales y Menús QR",
    description:
      "Crea tu catálogo digital o menú QR profesional para tu negocio.",
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        
        {children}
        
      </body>
    </html>
  );
}