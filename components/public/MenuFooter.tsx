import { FaInstagram, FaFacebookF, FaTiktok, FaYoutube } from "react-icons/fa";

interface MenuFooterProps {
  instagram?: string | null;
  facebook?: string | null;
  tiktok?: string | null;
  youtube?: string | null;
}

export default function MenuFooter({
  instagram,
  facebook,
  tiktok,
  youtube,
}: MenuFooterProps) {
  const currentYear = new Date().getFullYear();

  // 🔥 VALIDAR LINKS
  const isValidUrl = (url?: string | null) => {
    if (!url) return false;

    return url.startsWith("http://") || url.startsWith("https://");
  };

  const redes = [
    {
      href: instagram,
      icon: <FaInstagram size={18} />,
    },

    {
      href: facebook,
      icon: <FaFacebookF size={16} />,
    },

    {
      href: tiktok,
      icon: <FaTiktok size={16} />,
    },

    {
      href: youtube,
      icon: <FaYoutube size={18} />,
    },
  ].filter((red) => isValidUrl(red.href));

  return (
   <footer
  className="mt-0 pt-10 pb-12"
  style={{
    backgroundColor: "#000000",
  }}
>
      <div className="max-w-3xl mx-auto px-6 flex flex-col items-center">
        {/* TÍTULO */}
        {redes.length > 0 && (
          <>
            <p className="text-sm font-semibold tracking-wide text-white mb-5">
              Sígueme
            </p>

            {/* REDES */}
            <div className="flex items-center gap-4">
              {redes.map((red, index) => (
                <a
                  key={index}
                  href={red.href || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    w-11
                    h-11
                    rounded-full
                    border
                    border-white/10
                    flex
                    items-center
                    justify-center
                    text-white
                    bg-white/5
                    hover:bg-white/10
                    hover:scale-110
                    transition-all
                  "
                >
                  {red.icon}
                </a>
              ))}
            </div>
          </>
        )}

        {/* COPYRIGHT */}
        <p className="text-[11px] mt-8 text-white/50 text-center">
          © {currentYear} Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
