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

  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Catalagox",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        {/* GOOGLE ANALYTICS */}
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

        {/* TIKTOK PIXEL - CATALAGOX */}
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject = t;
              var ttq = w[t] = w[t] || [];
              ttq.methods = [
                "page", "track", "identify", "instances", "debug", "on",
                "off", "once", "ready", "alias", "group", "enableCookie",
                "disableCookie", "holdConsent", "revokeConsent",
                "grantConsent"
              ];
              ttq.setAndDefer = function (t, e) {
                t[e] = function () {
                  t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
                };
              };
              for (var i = 0; i < ttq.methods.length; i++) {
                ttq.setAndDefer(ttq, ttq.methods[i]);
              }
              ttq.instance = function (t) {
                for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++) {
                  ttq.setAndDefer(e, ttq.methods[n]);
                }
                return e;
              };
              ttq.load = function (e, n) {
                var r = "https://analytics.tiktok.com/i18n/pixel/events.js";
                ttq._i = ttq._i || {};
                ttq._i[e] = [];
                ttq._i[e]._u = r;
                ttq._t = ttq._t || {};
                ttq._t[e] = +new Date();
                ttq._o = ttq._o || {};
                ttq._o[e] = n || {};
                var s = document.createElement("script");
                s.type = "text/javascript";
                s.async = true;
                s.src = r + "?sdkid=" + e + "&lib=" + t;
                var a = document.getElementsByTagName("script")[0];
                a.parentNode.insertBefore(s, a);
              };

              ttq.load('DBCCN9BC77U4SEFNFA50');
              ttq.page();
            }(window, document, 'ttq');
          `}
        </Script>
      </head>

      <body className={inter.className}>{children}</body>
    </html>
  );
}
