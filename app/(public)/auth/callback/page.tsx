"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/auth");
        return;
      }

      const user = session.user;

      const { data: subscription } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      const now = new Date();

      const hasAccess =
        subscription &&
        subscription.status === "active" &&
        subscription.current_period_end &&
        new Date(subscription.current_period_end) > now;

      router.push(hasAccess ? "/dashboard" : "/suscripcion");
    };

    handleAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Iniciando sesión...
    </div>
  );
}