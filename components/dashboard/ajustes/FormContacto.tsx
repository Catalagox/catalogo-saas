"use client";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
// Importamos tanto el Selector como el registro para sacar los prefijos telefónicos
import SelectorPaises, { countriesRegistry } from "@/lib/Countries";

interface FormContactoProps {
  paisCode: string;
  setPaisCode: (val: string) => void;
  whatsapp: string;
  setWhatsapp: (val: string) => void;
  instagram: string;
  setInstagram: (val: string) => void;
  facebook: string;
  setFacebook: (val: string) => void;
  tiktok: string;
  setTiktok: (val: string) => void;
  youtube: string;
  setYoutube: (val: string) => void;
  guardarContacto: () => Promise<void>;
}

export default function FormContacto({
  paisCode,
  setPaisCode,
  whatsapp,
  setWhatsapp,
  instagram,
  setInstagram,
  facebook,
  setFacebook,
  tiktok,
  setTiktok,
  youtube,
  setYoutube,
  guardarContacto,
}: FormContactoProps) {
  // Si paisCode no existe por alguna razón, usamos "PE" por defecto antes de aplicar toUpperCase()
  const currentCountryData =
    countriesRegistry[(paisCode || "PE").toUpperCase()] ||
    countriesRegistry["PE"];

  // Manejador cuando el usuario cambia el país desde el SELECT grande
  const handlePaisChange = (nuevoCodigo: string) => {
    setPaisCode(nuevoCodigo);

    // Buscamos el prefijo telefónico del nuevo país (ej: "52" para México)
    const datosNuevoPais = countriesRegistry[nuevoCodigo.toUpperCase()];
    if (datosNuevoPais) {
      // Le pre-configuramos el prefijo al input de WhatsApp de forma automática
      setWhatsapp(datosNuevoPais.phoneCode);
    }
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-6 space-y-5">
      <h2 className="text-xl font-semibold text-[var(--text-primary)]">
        Contacto y redes
      </h2>

      {/* SELECCIÓN DE PAÍS (CONTROLADOR PRINCIPAL) */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-[var(--text-primary)]">
          País de tu Negocio
        </p>
        <SelectorPaises value={paisCode} onChange={handlePaisChange} />
        <p className="text-xs text-[var(--text-secondary)]">
          Esto define la moneda oficial de tu catalógo digital:{" "}
          <span className="font-semibold text-[var(--text-primary)]">
            {currentCountryData.currency} ({currentCountryData.symbol})
          </span>
          .
        </p>
      </div>

      <hr className="border-[var(--border-card)] my-2" />

      {/* WHATSAPP */}
      <div className="space-y-2">
        <p className="text-sm text-[var(--text-secondary)]">WhatsApp</p>
        <PhoneInput
          // Usamos "pe" por defecto si paisCode es undefined o nulo
          country={(paisCode || "pe").toLowerCase()}
          value={whatsapp}
          onChange={(phone) => setWhatsapp(phone)}
          enableSearch
          disableSearchIcon
          inputStyle={{
            width: "100%",
            height: "44px",
            background: "var(--bg-tertiary)",
            border: "1px solid var(--border-card)",
            color: "var(--text-primary)",
            borderRadius: "10px",
            fontSize: "14px",
          }}
          buttonStyle={{
            background: "var(--bg-tertiary)",
            border: "1px solid var(--border-card)",
            borderRadius: "10px 0 0 10px",
          }}
          dropdownStyle={{
            background: "var(--bg-card)",
            color: "#000",
          }}
        />
        <p className="text-xs text-[var(--text-secondary)]">
          El código de área se ajusta solo al cambiar el país arriba.
        </p>
      </div>

      {/* INSTAGRAM */}
      <div className="space-y-2">
        <p className="text-sm text-[var(--text-secondary)]">Instagram</p>
        <input
          type="text"
          placeholder="https://instagram.com/tu-negocio"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-card)] text-[var(--text-primary)] rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[var(--color-primary)] placeholder:text-[var(--text-secondary)]"
        />
      </div>

      {/* FACEBOOK */}
      <div className="space-y-2">
        <p className="text-sm text-[var(--text-secondary)]">Facebook</p>
        <input
          type="text"
          placeholder="https://facebook.com/tu-negocio"
          value={facebook}
          onChange={(e) => setFacebook(e.target.value)}
          className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-card)] text-[var(--text-primary)] rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[var(--color-primary)] placeholder:text-[var(--text-secondary)]"
        />
      </div>

      {/* TIKTOK */}
      <div className="space-y-2">
        <p className="text-sm text-[var(--text-secondary)]">TikTok</p>
        <input
          type="text"
          placeholder="https://tiktok.com/@tu-negocio"
          value={tiktok}
          onChange={(e) => setTiktok(e.target.value)}
          className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-card)] text-[var(--text-primary)] rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[var(--color-primary)] placeholder:text-[var(--text-secondary)]"
        />
      </div>

      {/* YOUTUBE */}
      <div className="space-y-2">
        <p className="text-sm text-[var(--text-secondary)]">YouTube</p>
        <input
          type="text"
          placeholder="https://youtube.com/@tu-negocio"
          value={youtube}
          onChange={(e) => setYoutube(e.target.value)}
          className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-card)] text-[var(--text-primary)] rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[var(--color-primary)] placeholder:text-[var(--text-secondary)]"
        />
      </div>

      <button
        onClick={guardarContacto}
        className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-text-inverse)] px-5 py-2 rounded-lg font-semibold transition"
      >
        Guardar contacto
      </button>
    </div>
  );
}
