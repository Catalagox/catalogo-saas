"use client";

import { Suspense, useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
} from "react-icons/fa";
import GoogleButton from "@/components/marketing/ui/GoogleButton";
import { supabase } from "@/lib/supabaseClient";

type AuthMode = "login" | "register" | "recovery" | "verify";

function getSafeRedirect(value: string | null) {
  if (!value) return "/dashboard";

  if (!value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }

  return value;
}

function getOnboardingPath(next: string) {
  return `/onboarding?next=${encodeURIComponent(next)}`;
}

function translateAuthError(message: string) {
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes("invalid login credentials")) {
    return "El correo o la contraseña son incorrectos.";
  }

  if (normalizedMessage.includes("email not confirmed")) {
    return "Debes confirmar tu correo antes de iniciar sesión.";
  }

  if (normalizedMessage.includes("user already registered")) {
    return "Ya existe una cuenta registrada con este correo.";
  }

  if (
    normalizedMessage.includes("password should be") ||
    normalizedMessage.includes("password must be")
  ) {
    return "La contraseña no cumple los requisitos de seguridad.";
  }

  if (normalizedMessage.includes("token has expired") || normalizedMessage.includes("otp_expired")) {
    return "El código venció o ya fue utilizado. Solicita uno nuevo.";
  }

  if (normalizedMessage.includes("invalid token") || normalizedMessage.includes("otp")) {
    return "El código no es válido. Revisa los números o solicita uno nuevo.";
  }

  if (normalizedMessage.includes("rate limit")) {
    return "Has realizado demasiados intentos. Espera unos minutos.";
  }

  if (normalizedMessage.includes("unable to validate email")) {
    return "El correo electrónico no es válido.";
  }

  return message || "Ocurrió un error. Inténtalo nuevamente.";
}

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirect = useMemo(
    () => getSafeRedirect(searchParams.get("redirect")),
    [searchParams],
  );

  const [mode, setMode] = useState<AuthMode>("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const isLogin = mode === "login";
  const isRegister = mode === "register";
  const isRecovery = mode === "recovery";
  const isVerify = mode === "verify";

  useEffect(() => {
    if (!isVerify || resendCooldown <= 0) return;
    const timer = window.setTimeout(() => setResendCooldown((v) => Math.max(0, v - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [isVerify, resendCooldown]);

  /*
   * Muestra los errores enviados por /auth/callback.
   * Por ejemplo: enlace vencido, cancelación de Google
   * o código de autenticación inválido.
   */
  useEffect(() => {
    const callbackError = searchParams.get("error");

    if (!callbackError) return;

    setMode("login");
    setErrorMsg(callbackError);
    setSuccessMsg("");
  }, [searchParams]);

  const resolveAuthenticatedDestination = async (userId: string) => {
    const { data: catalogo, error } = await supabase
      .from("catalogos")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!catalogo) {
      return getOnboardingPath(redirect);
    }

    return redirect;
  };

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!active || !user) return;

        const destination = await resolveAuthenticatedDestination(user.id);

        if (active) {
          router.replace(destination);
          router.refresh();
        }
      } catch (error) {
        console.error("Error verificando la sesión:", error);
      } finally {
        if (active) {
          setCheckingSession(false);
        }
      }
    };

    checkSession();

    return () => {
      active = false;
    };
  }, [redirect, router]);

  const clearMessages = () => {
    setErrorMsg("");
    setSuccessMsg("");
  };

  const changeMode = (newMode: AuthMode) => {
    setMode(newMode);
    clearMessages();

    setPassword("");
    setConfirmPassword("");
    setOtp("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleLogin = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error) throw error;

    if (!data.user) {
      throw new Error("No se pudo iniciar sesión.");
    }

    const destination = await resolveAuthenticatedDestination(data.user.id);

    router.replace(destination);
    router.refresh();
  };

  const handleRegister = async () => {
    if (password.length < 8) {
      throw new Error("La contraseña debe tener al menos 8 caracteres.");
    }

    if (password !== confirmPassword) {
      throw new Error("Las contraseñas no coinciden.");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const onboardingPath = getOnboardingPath(redirect);

    const callbackUrl = new URL("/auth/callback", "https://www.catalagox.com");

    callbackUrl.searchParams.set("next", onboardingPath);

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        emailRedirectTo: callbackUrl.toString(),
        data: {
          registration_method: "email",
        },
      },
    });

    if (error) throw error;

    if (!data.user) {
      throw new Error("No se pudo crear la cuenta.");
    }

    /*
     * Supabase puede devolver un usuario sin identidades cuando
     * intentan registrar nuevamente un correo que ya existe.
     */
    if (
      Array.isArray(data.user.identities) &&
      data.user.identities.length === 0
    ) {
      setMode("login");
      setSuccessMsg("");
      setErrorMsg(
        "Este correo ya está registrado. Inicia sesión o recupera tu contraseña.",
      );

      setPassword("");
      setConfirmPassword("");
      return;
    }

    if (!data.session) {
      setMode("verify");
      setOtp("");
      setResendCooldown(60);
      setSuccessMsg("Te enviamos un código de 6 dígitos. Revisa tu correo.");
      setPassword("");
      setConfirmPassword("");
      return;
    }

    router.replace(onboardingPath);
    router.refresh();
  };

  const handleVerify = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^\d{6}$/.test(otp)) {
      throw new Error("Introduce los 6 dígitos del código.");
    }

    const { data, error } = await supabase.auth.verifyOtp({
      email: normalizedEmail,
      token: otp,
      type: "signup",
    });
    if (error) throw error;
    if (!data.user || !data.session) {
      throw new Error("El correo se verificó, pero no se pudo iniciar sesión. Intenta ingresar.");
    }

    const destination = await resolveAuthenticatedDestination(data.user.id);
    router.replace(destination);
    router.refresh();
  };

  const handleResendCode = async () => {
    if (loading || resendCooldown > 0) return;
    setLoading(true);
    clearMessages();
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email.trim().toLowerCase(),
      });
      if (error) throw error;
      setOtp("");
      setResendCooldown(60);
      setSuccessMsg("Si la cuenta está pendiente de confirmación, recibirás un nuevo código.");
    } catch (error: unknown) {
      setErrorMsg(translateAuthError(error instanceof Error ? error.message : "No se pudo reenviar el código."));
    } finally {
      setLoading(false);
    }
  };

  const handleRecovery = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    const callbackUrl = new URL("/auth/callback", "https://www.catalagox.com");

    callbackUrl.searchParams.set("next", "/auth/nueva-password");

    const { error } = await supabase.auth.resetPasswordForEmail(
      normalizedEmail,
      {
        redirectTo: callbackUrl.toString(),
      },
    );

    if (error) throw error;

    setSuccessMsg(
      "Si existe una cuenta con ese correo, recibirás un enlace para cambiar tu contraseña.",
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    clearMessages();

    try {
      if (isLogin) {
        await handleLogin();
        return;
      }

      if (isRegister) {
        await handleRegister();
        return;
      }

      if (isVerify) {
        await handleVerify();
        return;
      }

      await handleRecovery();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Ocurrió un error. Inténtalo nuevamente.";

      setErrorMsg(translateAuthError(message));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    clearMessages();

    try {
      const onboardingPath = getOnboardingPath(redirect);

      const callbackUrl = new URL(
        "/auth/callback",
        "https://www.catalagox.com",
      );

      callbackUrl.searchParams.set("next", onboardingPath);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl.toString(),
        },
      });

      if (error) throw error;
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Error al conectar con Google.";

      setErrorMsg(translateAuthError(message));
    }
  };

  if (checkingSession) {
    return (
      <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-2xl">
        <p className="animate-pulse font-medium text-gray-500">
          Verificando tu sesión...
        </p>
      </div>
    );
  }

  const title = isVerify
    ? "Verifica tu correo"
    : isLogin
    ? "Bienvenido de nuevo"
    : isRegister
      ? "Crea tu cuenta"
      : "Recupera tu contraseña";

  const description = isVerify
    ? `Enviamos un código de 6 dígitos a ${email.trim().toLowerCase()}`
    : isLogin
    ? "Accede al panel de tu tienda online"
    : isRegister
      ? "Crea tu cuenta y comienza a construir tu presencia en Internet"
      : "Te enviaremos un enlace para crear una contraseña nueva";

  return (
    <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl sm:p-8 md:p-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900">{title}</h1>

        <p className="mt-2 text-gray-500">{description}</p>
      </div>

      {!isRecovery && !isVerify && (
        <>
          <GoogleButton onClick={handleGoogleAuth} disabled={loading} />

          <div className="my-6 flex items-center">
            <div className="h-px flex-1 bg-gray-300" />
            <span className="px-4 text-sm text-gray-500">o</span>
            <div className="h-px flex-1 bg-gray-300" />
          </div>
        </>
      )}

      {errorMsg && (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600"
        >
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div
          role="status"
          className="mb-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700"
        >
          {successMsg}
        </div>
      )}

      {isVerify ? (
        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold text-gray-700" htmlFor="verification-code">
            Código de verificación
          </label>
          <input
            id="verification-code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            maxLength={6}
            value={otp}
            onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="000000"
            aria-label="Código de verificación de seis dígitos"
            disabled={loading}
            required
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-4 text-center text-3xl font-bold tracking-[0.35em] text-gray-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500"
          />
          <p className="text-center text-xs text-gray-500">
            Puedes pegar los seis números juntos. No compartas este código.
          </p>
          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full rounded-xl bg-[#16A34A] py-3 font-semibold text-white transition hover:bg-[#15803D] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Verificando..." : "Verificar correo y continuar"}
          </button>
          <div className="text-center text-sm">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={loading || resendCooldown > 0}
              className="font-semibold text-green-600 hover:text-green-700 disabled:cursor-not-allowed disabled:text-gray-400"
            >
              {resendCooldown > 0 ? `Reenviar código en ${resendCooldown}s` : "Reenviar código"}
            </button>
          </div>
          <button
            type="button"
            onClick={() => changeMode("login")}
            disabled={loading}
            className="w-full text-center text-sm font-semibold text-gray-600 hover:text-gray-900"
          >
            Volver a iniciar sesión
          </button>
        </form>
      ) : (
      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-gray-700">
            Correo electrónico
          </span>

          <div className="input-light flex items-center rounded-xl px-4 py-3 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500">
            <FaEnvelope className="mr-3 shrink-0 text-gray-400" />

            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="tu@email.com"
              className="w-full bg-transparent text-gray-900 outline-none placeholder:text-gray-400"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={loading}
              required
            />
          </div>
        </label>

        {!isRecovery && !isVerify && (
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-gray-700">
              Contraseña
            </span>

            <div className="input-light flex items-center rounded-xl px-4 py-3 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500">
              <FaLock className="mr-3 shrink-0 text-gray-400" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                placeholder={
                  isRegister ? "Mínimo 8 caracteres" : "Escribe tu contraseña"
                }
                className="w-full bg-transparent text-gray-900 outline-none placeholder:text-gray-400"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={loading}
                minLength={8}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                disabled={loading}
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
                className="ml-2 text-gray-400 transition-colors hover:text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </label>
        )}

        {isRegister && (
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-gray-700">
              Confirmar contraseña
            </span>

            <div className="input-light flex items-center rounded-xl px-4 py-3 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500">
              <FaLock className="mr-3 shrink-0 text-gray-400" />

              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                autoComplete="new-password"
                placeholder="Repite tu contraseña"
                className="w-full bg-transparent text-gray-900 outline-none placeholder:text-gray-400"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                disabled={loading}
                minLength={8}
                required
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((current) => !current)}
                disabled={loading}
                aria-label={
                  showConfirmPassword
                    ? "Ocultar confirmación"
                    : "Mostrar confirmación"
                }
                className="ml-2 text-gray-400 transition-colors hover:text-gray-600"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {confirmPassword && password !== confirmPassword && (
              <p className="mt-2 text-xs font-medium text-red-600">
                Las contraseñas todavía no coinciden.
              </p>
            )}
          </label>
        )}

        {isLogin && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => changeMode("recovery")}
              disabled={loading}
              className="text-sm font-semibold text-green-600 hover:text-green-700 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#16A34A] py-3 font-semibold text-white transition hover:bg-[#15803D] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? isLogin
              ? "Ingresando..."
              : isRegister
                ? "Creando cuenta..."
                : "Enviando enlace..."
            : isLogin
              ? "Ingresar"
              : isRegister
                ? "Crear cuenta"
                : "Enviar enlace de recuperación"}
        </button>
      </form>
      )}

      {isVerify ? null : isRecovery ? (
        <div className="mt-6 text-center text-sm">
          <button
            type="button"
            onClick={() => changeMode("login")}
            className="font-semibold text-green-600 hover:text-green-700"
          >
            Volver a iniciar sesión
          </button>
        </div>
      ) : (
        <div className="mt-6 text-center text-sm text-gray-600">
          {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}

          <button
            type="button"
            onClick={() => changeMode(isLogin ? "register" : "login")}
            disabled={loading}
            className="ml-1 font-semibold text-green-600 hover:text-green-700"
          >
            {isLogin ? "Crear cuenta" : "Iniciar sesión"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function AuthPage() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white via-gray-50 to-gray-200 px-4 py-10">
      <Suspense
        fallback={
          <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-2xl">
            <p className="animate-pulse font-medium text-gray-500">
              Cargando el sistema de acceso...
            </p>
          </div>
        }
      >
        <AuthForm />
      </Suspense>
    </section>
  );
}
