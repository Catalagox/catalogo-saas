import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://catalagox.com"),

  title: {
    default: "Catalagox | Crea tu pagina web, Catálogo Digital y Menú QR",
    template: "%s | Catalagox",
  },

  description:
    "Crea tu pagina web, catálogos digitales y menús QR para tu negocio en minutos. Diseño profesional, fácil de usar y 7 días gratis. Ideal para restaurantes, tiendas y emprendedores en el mundo.",

  keywords: [
    "crear catálogo digital",
    "crear pagina web para negocios",
    "crear menú QR",
    "crear pagina web",
    "crear catálogo online",
    "crear catálogo para negocios",
    "crear menú digital restaurante",
    "crear menú QR Argentina",
    "crear catálogos digitales Argentina",
  ],

  authors: [{ name: "Catalagox" }],
  creator: "Catalagox",
  publisher: "Catalagox",

  openGraph: {
    title: "Catalagox | Crea tu pagina web, Catálogo Digital y Menú QR",
    description:
      "Crea tu pagina web, catálogo digital o menú QR profesional en minutos. 7 días gratis.",
    url: "https://catalagox.com",
    siteName: "Catalagox",
    locale: "es_AR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Catalagox | Paginas web, Catálogos Digitales y Menús QR",
    description:
      "Crea tu pagina web, catálogo digital o menú QR profesional para tu negocio.",
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],

    shortcut: "/favicon.ico",

    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        {/* 🔥 GOOGLE ANALYTICS */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-181DBYJ8QZ"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];

            function gtag(){
              dataLayer.push(arguments);
            }

            window.gtag = gtag;

            gtag('js', new Date());

            gtag('config', 'G-181DBYJ8QZ', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>

      <body className={inter.className}>{children}</body>
    </html>
  );
}
