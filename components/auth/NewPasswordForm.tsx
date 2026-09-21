"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { supabase } from "@/lib/supabaseClient";

export default function NewPasswordForm() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (loading) return;

    setErrorMsg("");
    setSuccessMsg("");

    if (password.length < 8) {
      setErrorMsg(
        "La contraseña debe tener al menos 8 caracteres.",
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;

      setSuccessMsg(
        "Tu contraseña fue actualizada correctamente.",
      );

      setPassword("");
      setConfirmPassword("");

      window.setTimeout(() => {
        router.replace(
          "/onboarding?next=%2Fdashboard",
        );
        router.refresh();
      }, 1200);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo actualizar la contraseña.";

      if (
        message.toLowerCase().includes("same password")
      ) {
        setErrorMsg(
          "La nueva contraseña debe ser diferente de la anterior.",
        );
      } else {
        setErrorMsg(message);
      }

      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl sm:p-8 md:p-10">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
          <FaLock size={22} />
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900">
          Crea una contraseña nueva
        </h1>

        <p className="mt-3 text-gray-500">
          Usa una contraseña segura de al menos 8 caracteres.
        </p>
      </div>

      {errorMsg && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600"
        >
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div
          role="status"
          className="mb-5 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700"
        >
          {successMsg}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-gray-700">
            Contraseña nueva
          </span>

          <div className="flex items-center rounded-xl border border-gray-300 bg-white px-4 py-3 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500">
            <FaLock className="mr-3 shrink-0 text-gray-400" />

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
              minLength={8}
              disabled={loading || Boolean(successMsg)}
              className="w-full bg-transparent text-gray-900 outline-none placeholder:text-gray-400"
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword((current) => !current)
              }
              disabled={loading || Boolean(successMsg)}
              aria-label={
                showPassword
                  ? "Ocultar contraseña"
                  : "Mostrar contraseña"
              }
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-gray-700">
            Confirmar contraseña
          </span>

          <div className="flex items-center rounded-xl border border-gray-300 bg-white px-4 py-3 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500">
            <FaLock className="mr-3 shrink-0 text-gray-400" />

            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              placeholder="Repite la contraseña"
              autoComplete="new-password"
              minLength={8}
              disabled={loading || Boolean(successMsg)}
              className="w-full bg-transparent text-gray-900 outline-none placeholder:text-gray-400"
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  (current) => !current,
                )
              }
              disabled={loading || Boolean(successMsg)}
              aria-label={
                showConfirmPassword
                  ? "Ocultar confirmación"
                  : "Mostrar confirmación"
              }
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
            </button>
          </div>

          {confirmPassword &&
            password !== confirmPassword && (
              <p className="mt-2 text-xs font-medium text-red-600">
                Las contraseñas todavía no coinciden.
              </p>
            )}
        </label>

        <button
          type="submit"
          disabled={loading || Boolean(successMsg)}
          className="w-full rounded-xl bg-[#16A34A] py-3 font-semibold text-white transition hover:bg-[#15803D] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Actualizando..."
            : successMsg
              ? "Contraseña actualizada"
              : "Guardar contraseña nueva"}
        </button>
      </form>
    </div>
  );
}