"use client";

import { useState } from "react";
import Link from "next/link";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import GoogleButton from "@/components/ui/GoogleButton";



export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4">

      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-10">

        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-black">
            Bienvenido de nuevo
          </h1>
          <p className="text-gray-500 mt-2">
            Inicia sesión para acceder a tu panel
          </p>
        </div>

        <GoogleButton />

        {/* SEPARATOR */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="px-4 text-sm text-gray-400">o</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* FORM */}
        <form className="space-y-6">

          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <div className="mt-2 flex items-center border rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-black">
              <FaEnvelope className="text-gray-400 mr-3" />
              <input
                type="email"
                placeholder="tu@email.com"
                className="w-full outline-none"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <div className="mt-2 flex items-center border rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-black">
              <FaLock className="text-gray-400 mr-3" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* FORGOT PASSWORD */}
          <div className="text-right text-sm">
            <Link href="#" className="text-gray-500 hover:text-black transition">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-black text-white font-semibold hover:opacity-90 transition"
          >
            Ingresar
          </button>

        </form>

        {/* FOOTER */}
        <div className="text-center mt-8 text-sm text-gray-600">
          ¿No tienes cuenta?{" "}
          <Link href="/registro" className="font-semibold text-black hover:underline">
            Crear cuenta
          </Link>
        </div>

      </div>

    </section>
  );
}
