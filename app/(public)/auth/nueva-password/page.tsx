import { redirect } from "next/navigation";
import NewPasswordForm from "@/components/auth/NewPasswordForm";
import { createClient } from "@/lib/supabase/server";

export default async function NewPasswordPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      "/auth?error=El enlace de recuperación expiró o no es válido.",
    );
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white via-gray-50 to-gray-200 px-4 py-10">
      <NewPasswordForm />
    </section>
  );
}