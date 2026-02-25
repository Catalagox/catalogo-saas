"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import GoogleButton from "@/components/ui/GoogleButton";
import { supabase } from "@/lib/supabaseClient";

export default function AuthPage() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔵 EMAIL AUTH
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    router.push("/dashboard");
  };

  // 🔴 GOOGLE AUTH
  const handleGoogleAuth = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200 px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-10 border border-gray-200">

        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            {isLogin ? "Bienvenido de nuevo" : "Crea tu cuenta"}
          </h1>
          <p className="text-gray-600 mt-2">
            {isLogin
              ? "Inicia sesión para acceder a tu panel"
              : "Regístrate para comenzar"}
          </p>
        </div>

        {/* GOOGLE BUTTON */}
        <GoogleButton onClick={handleGoogleAuth} />

        {/* SEPARATOR */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">o</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* FORM */}
        <form className="space-y-6" onSubmit={handleSubmit}>

          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium text-gray-800">
              Correo electrónico
            </label>
            <div className="mt-2 flex items-center border border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-black bg-white">
              <FaEnvelope className="text-gray-500 mr-3" />
              <input
                type="email"
                placeholder="tu@email.com"
                className="w-full outline-none text-gray-900 placeholder-gray-400 bg-transparent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm font-medium text-gray-800">
              Contraseña
            </label>
            <div className="mt-2 flex items-center border border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-black bg-white">
              <FaLock className="text-gray-500 mr-3" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full outline-none text-gray-900 placeholder-gray-400 bg-transparent"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-500 hover:text-black"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-black text-white font-semibold hover:bg-gray-900 transition disabled:opacity-50"
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

        {/* TOGGLE LOGIN / REGISTER */}
        <div className="text-center mt-8 text-sm text-gray-700">
          {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-semibold text-black hover:underline"
          >
            {isLogin ? "Crear cuenta" : "Iniciar sesión"}
          </button>
        </div>

      </div>
    </section>
  );
}