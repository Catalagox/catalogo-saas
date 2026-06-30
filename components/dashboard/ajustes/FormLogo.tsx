"use client";

interface FormLogoProps {
  logo: string;
  subiendoLogo: boolean;
  subirLogo: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export default function FormLogo({ logo, subiendoLogo, subirLogo }: FormLogoProps) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-6 space-y-5">
      <h2 className="text-xl font-semibold text-[var(--text-primary)]">
        Logo del restaurante
      </h2>

      {logo ? (
        <div className="flex justify-center">
          <img
            src={logo}
            alt="Logo"
            className="w-28 h-28 rounded-full object-cover border border-white/10"
          />
        </div>
      ) : (
        <div className="w-28 h-28 mx-auto rounded-full border border-dashed border-[var(--border-card)] flex items-center justify-center text-sm text-[var(--text-secondary)]">
          Sin logo
        </div>
      )}

      <label className="flex items-center justify-center w-full h-12 rounded-xl cursor-pointer font-semibold transition bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white">
        {subiendoLogo ? "Subiendo..." : "Subir logo"}
        <input
          type="file"
          accept="image/*"
          onChange={subirLogo}
          className="hidden"
        />
      </label>
    </div>
  );
}