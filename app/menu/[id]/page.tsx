import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Props = {
  params: { id: string };
};

export default async function MenuPage({ params }: Props) {
  const { data, error } = await supabase
    .from("catalogos")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !data) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-6">
          {data.nombre}
        </h1>

        <p className="text-center text-gray-600">
          Aquí irá el contenido del menú dinámico.
        </p>
      </div>
    </main>
  );
}