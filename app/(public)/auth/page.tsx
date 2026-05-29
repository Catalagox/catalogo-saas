"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import GoogleButton from "@/components/marketing/ui/GoogleButton";
import { supabase } from "@/lib/supabaseClient";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 🔥 Ruta dinámica de retorno
  const redirect = searchParams.get("redirect") || "/dashboard";

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

      // 🔥 Si ya está logueado → vuelve a la ruta correcta
      router.push(redirect);
    };

    checkSession();
  }, [router, redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      // 🔥 LOGIN
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (!data.user) {
          throw new Error("No se pudo iniciar sesión.");
        }

        // 🔥 Redirección dinámica
        router.push(redirect);
      }

      // 🔥 REGISTRO
      else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            // 🔥 Confirmación por email vuelve a la ruta correcta
            emailRedirectTo: `${window.location.origin}${redirect}`,
          },
        });

        if (error) throw error;

        // 🔥 Si requiere confirmar email
        if (!data.session) {
          setSuccessMsg("Te enviamos un correo para confirmar tu cuenta.");
          return;
        }

        // 🔥 Registro instantáneo
        router.push(redirect);
      }
    } catch (error: any) {
      setErrorMsg(error.message || "Ocurrió un error. Inténtalo nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          // 🔥 Google vuelve a la ruta correcta
          redirectTo: `${window.location.origin}${redirect}`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      setErrorMsg(error.message || "Error al conectar con Google.");
    }
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
        {/* HEADER */}
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

        {/* GOOGLE */}
        <GoogleButton onClick={handleGoogleAuth} />

        {/* DIVIDER */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300"></div>

          <span className="px-4 text-sm text-gray-500">o</span>

          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* FREE TRIAL */}
        {!isLogin && (
          <div className="mb-5 bg-green-50 border border-green-200 rounded-xl p-3 text-center text-sm text-green-700">
            🎉 Prueba gratuita durante 7 días.
          </div>
        )}

        {/* ERROR */}
        {errorMsg && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3">
            {errorMsg}
          </div>
        )}

        {/* SUCCESS */}
        {successMsg && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl p-3">
            {successMsg}
          </div>
        )}

        {/* FORM */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* EMAIL */}
          <div className="input-light flex items-center rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500">
            <FaEnvelope className="mr-3 text-gray-400 shrink-0" />

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
          <div className="input-light flex items-center rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500">
            <FaLock className="mr-3 text-gray-400 shrink-0" />

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
              className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* SUBMIT */}
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

        {/* TOGGLE */}
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
