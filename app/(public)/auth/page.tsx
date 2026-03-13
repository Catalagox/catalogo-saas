"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import GoogleButton from "@/components/marketing/ui/GoogleButton";
import { supabase } from "@/lib/supabaseClient";

export default function AuthPage() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔐 Si ya tiene sesión → validar suscripción
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      const { data: subscription } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      const now = new Date();

      const hasAccess =
        subscription &&
        subscription.status === "active" &&
        subscription.current_period_end &&
        new Date(subscription.current_period_end) > now;

      //router.push(hasAccess ? "/dashboard" : "/suscripcion");
      router.push("/dashboard");
    };

    checkSession();
  }, [router]);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // 🔑 LOGIN
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        const user = data.user;
        if (!user) return;

        /*const { data: subscription } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle(); 

        const now = new Date();

        const hasAccess =
          subscription &&
          subscription.status === "active" &&
          subscription.current_period_end &&
          new Date(subscription.current_period_end) > now; */

       // router.push(hasAccess ? "/dashboard" : "/suscripcion");
       router.push("/dashboard");
      } else {
        // 🆕 REGISTRO
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        // Si usas confirmación por email
        if (!data.session) {
          alert("Revisa tu correo para confirmar tu cuenta.");
          return;
        }

        // Usuario nuevo siempre va a pagar
       // router.push("/suscripcion");
       router.push("/dashboard");
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200 px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-10 border border-gray-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            {isLogin ? "Bienvenido de nuevo" : "Crea tu cuenta"}
          </h1>
        </div>

        <GoogleButton onClick={handleGoogleAuth} />

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">o</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <div className="mt-2 flex items-center border rounded-xl px-4 py-3">
              <FaEnvelope className="mr-3 text-gray-500" />
              <input
                type="email"
                placeholder="tu@email.com"
                className="w-full outline-none bg-transparent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <div className="mt-2 flex items-center border rounded-xl px-4 py-3">
              <FaLock className="mr-3 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                className="w-full outline-none bg-transparent"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-black text-white font-semibold disabled:opacity-50"
          >
            {loading
              ? isLogin
                ? "Ingresando..."
                : "Creando cuenta..."
              : isLogin
              ? "Ingresar"
              : "Crear cuenta"}
          </button>
        </form>

        <div className="text-center mt-6 text-sm">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-semibold"
          >
            {isLogin ? "Crear cuenta" : "Iniciar sesión"}
          </button>
        </div>
      </div>
    </section>
  );
}