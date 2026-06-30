"use client";

interface FormPasswordProps {
  password: string;
  setPassword: (val: string) => void;
  cambiarPassword: () => Promise<void>;
}

export default function FormPassword({
  password,
  setPassword,
  cambiarPassword,
}: FormPasswordProps) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-6 space-y-4">
      <h2 className="text-xl font-semibold text-[var(--text-primary)]">
        Cambiar contraseña
      </h2>

      <input
        type="password"
        placeholder="Nueva contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-card)] text-[var(--text-primary)] rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[var(--color-primary)] placeholder:text-[var(--text-secondary)]"
      />

      <button
        onClick={cambiarPassword}
        className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-text-inverse)] px-5 py-2 rounded-lg font-semibold transition"
      >
        Actualizar contraseña
      </button>
    </div>
  );
}