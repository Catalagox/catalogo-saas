import { redirect } from "next/navigation";
import OnboardingForm from "@/components/auth/OnboardingForm";
import { createClient } from "@/lib/supabase/server";
import { isCountryCode } from "@/lib/countries";

interface OnboardingPageProps {
  searchParams: Promise<{
    next?: string;
  }>;
}

function getSafeNext(value: string | undefined) {
  if (!value) return "/dashboard";

  if (!value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }

  return value;
}

export default async function OnboardingPage({
  searchParams,
}: OnboardingPageProps) {
  const params = await searchParams;
  const nextPath = getSafeNext(params.next);

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/auth?redirect=${encodeURIComponent(
        `/onboarding?next=${encodeURIComponent(nextPath)}`,
      )}`,
    );
  }

  const { data: catalogo } = await supabase
    .from("catalogos")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (catalogo) {
    redirect(nextPath);
  }

  const metadataCountry =
    typeof user.user_metadata?.pais_code === "string"
      ? user.user_metadata.pais_code.toUpperCase()
      : "";

  const initialCountryCode = isCountryCode(metadataCountry)
    ? metadataCountry
    : "";

  return (
    <section className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white via-gray-50 to-gray-200 px-4 py-10">
      <OnboardingForm
        initialCountryCode={initialCountryCode}
        nextPath={nextPath}
      />
    </section>
  );
}