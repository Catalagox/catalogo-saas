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
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      router.push("/dashboard");
    };

    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (!data.user) {
          throw new Error("No se pudo iniciar sesión.");
        }

        router.push("/dashboard");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        if (!data.session) {
          setSuccessMsg("Te enviamos un correo para confirmar tu cuenta.");
          return;
        }

        router.push("/dashboard");
      }
    } catch (error: any) {
      setErrorMsg(error.message || "Ocurrió un error. Inténtalo nuevamente.");
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

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrorMsg("");
    setSuccessMsg("");
  };

  return (
    <section
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gradient-to-b
        from-white
        via-gray-50
        to-gray-200
        px-4
      "
    >
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-8 md:p-10 border border-gray-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            {isLogin ? "Bienvenido de nuevo" : "Crea tu cuenta"}
          </h1>

          <p className="mt-2 text-gray-500">
            {isLogin
              ? "Accede a tu catálogo digital"
              : "Empieza tu prueba gratuita de 7 días"}
          </p>
        </div>

        <GoogleButton onClick={handleGoogleAuth} />

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">o</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {!isLogin && (
          <div className="mb-5 bg-green-50 border border-green-200 rounded-xl p-3 text-center text-sm text-green-700">
            🎉 Prueba gratuita durante 7 días.
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl p-3">
            {successMsg}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* EMAIL */}
          <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 bg-white focus-within:ring-2 focus-within:ring-green-500">
            <FaEnvelope className="mr-3 text-gray-500 shrink-0" />

            <input
              type="email"
              placeholder="tu@email.com"
              className="
                w-full
                bg-transparent
                outline-none
                text-gray-900
                placeholder:text-gray-400
              "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 bg-white focus-within:ring-2 focus-within:ring-green-500">
            <FaLock className="mr-3 text-gray-500 shrink-0" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              className="
                w-full
                bg-transparent
                outline-none
                text-gray-900
                placeholder:text-gray-400
              "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              py-3
              rounded-xl
              bg-[#16A34A]
              hover:bg-[#15803D]
              text-white
              font-semibold
              transition
              disabled:opacity-50
            "
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

        <div className="text-center mt-6 text-sm text-gray-600">
          {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}

          <button
            onClick={toggleMode}
            className="ml-1 font-semibold text-green-600 hover:text-green-700"
          >
            {isLogin ? "Crear cuenta" : "Iniciar sesión"}
          </button>
        </div>
      </div>
    </section>
  );
}
