import Header from "@/components/marketing/layout/Header";
import Footer from "@/components/marketing/layout/Footer";
import Script from "next/script";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Carga del script global de Google (gtag.js) */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-181DBYJ8QZ"
        strategy="afterInteractive"
      />
      <Script id="google-gtag" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-181DBYJ8QZ');
        `}
      </Script>

      <div
        className="
          flex 
          flex-col 
          min-h-screen 
          bg-gradient-to-br 
          from-white 
          via-gray-50 
          to-gray-100
        "
      >
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}