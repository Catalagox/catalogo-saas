import Header from "@/components/marketing/layout/Header";
import Footer from "@/components/marketing/layout/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
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
  );
}