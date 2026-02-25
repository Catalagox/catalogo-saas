import QRGenerator from "@/components/qr/QRGenerator";

export default function QRPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-6">
        Generador de QRs de Catálogos
      </h1>

      <QRGenerator />
    </main>
  );
}