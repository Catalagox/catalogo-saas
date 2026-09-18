import FloatingWhatsapp from "@/components/marketing/FloatingWhatsapp";
import BeneficiosSection from "@/components/marketing/home/BeneficiosSection";
import EstadisticasSection from "@/components/marketing/home/EstadisticasSection";
import ExperienciaMovilSection from "@/components/marketing/home/ExperienciaMovilSection";
import HeroPrincipal from "@/components/marketing/home/HeroPrincipal";
import SolucionesSection from "@/components/marketing/home/SolucionesSection";
import WhatsAppPedidosSection from "@/components/marketing/home/WhatsAppPedidosSection";

export default function Hero() {
  return (
    <main className="w-full bg-[var(--marketing-bg-white)]">
      {/* PORTADA PRINCIPAL */}
      <HeroPrincipal />

      {/* PEDIDOS Y VENTAS POR WHATSAPP */}
      <WhatsAppPedidosSection />

      {/* EXPERIENCIA DESDE DISPOSITIVOS MÓVILES */}
      <ExperienciaMovilSection />

      {/* TARJETAS DE SOLUCIONES */}
      <SolucionesSection />

      {/* BENEFICIOS DE LA PLATAFORMA */}
      <BeneficiosSection />

      {/* ESTADÍSTICAS Y LLAMADA A LA ACCIÓN */}
      <EstadisticasSection />

      {/* BOTÓN FLOTANTE DE WHATSAPP */}
      <FloatingWhatsapp />
    </main>
  );
}