import { Metadata } from 'next';
import RifasLandingUI from '@/components/rifas/RifasLandingUI';

export const metadata: Metadata = {
  title: 'Catalagox Rifas | Crea y Vende Talonarios Digitales en Minutos',
  description: 'La plataforma líder para organizar sorteos profesionales online. Gestiona números ocupados en tiempo real y recibe pagos directos sin complicaciones.',
  keywords: ['rifas online', 'talonarios digitales', 'crear rifas', 'sorteos en linea', 'catalagox'],
  openGraph: {
    title: 'Catalagox Rifas | Plataforma de Sorteos Digitales',
    description: 'Organiza sorteos profesionales y gestiona tus boletos en tiempo real.',
    url: 'https://catalagox.com/rifas',
    siteName: 'Catalagox',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Catalagox Rifas | Sorteos Digitales',
    description: 'Crea tu rifa online en minutos con gestión en tiempo real.',
  },
};

export default function Page() {
  return <RifasLandingUI />;
}