
import Image from "next/image";
import Link from "next/link";
import {
  FaRocket,
  FaCheckCircle,
  FaGlobe,
  FaStore,
  FaQrcode,
  FaShoppingCart,
  FaBriefcase,
  FaUtensils,
} from "react-icons/fa";

const BENEFICIOS = [
  "Sin necesidad de programar",
  "Diseño profesional y personalizable",
  "Ideal para diferentes tipos de negocios",
];

function IconoFlotante({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`
        pointer-events-none absolute z-20
        flex items-center justify-center
        rounded-full
        border border-white/40
        bg-white/15
        text-white
        shadow-[0_8px_30px_rgba(0,0,0,0.14)]
        backdrop-blur-md
        ${className}
      `}
    >
      <span className="text-2xl sm:text-3xl">
        {children}
      </span>
    </div>
  );
}

export default function HeroPaginaWeb() {
  return (
    <section className="relative isolate overflow-hidden bg-white lg:bg-[#1db954]">

      {/* FONDO Y CURVA PARA ORDENADOR */}
      <div className="pointer-events-none absolute inset-0 -z-10 hidden lg:block">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1440 760"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M0 0H420C460 115 530 170 650 240C790 320 755 430 660 520C575 600 635 690 800 760H0V0Z"
            fill="white"
          />
        </svg>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div
        className="
          relative mx-auto grid
          max-w-[1440px]
          grid-cols-1
          items-center
          gap-8
          px-5
          pt-28
          pb-12
          sm:px-8
          sm:pt-32
          lg:min-h-[760px]
          lg:grid-cols-2
          lg:gap-4
          lg:px-16
          lg:py-24
        "
      >

        {/* TEXTO */}
        <div className="relative z-20 mx-auto w-full max-w-[620px] lg:mx-0">

          <h1
            className="
              text-4xl font-black
              leading-[1.08] tracking-tight
              text-[#111827]
              sm:text-5xl
              md:text-6xl
              lg:text-[4.2rem]
            "
          >
            Crea la página web de tu negocio
            <span className="mt-2 block text-[#111827]">
              y destaca en Internet
            </span>
          </h1>

          <p
            className="
              mt-6 max-w-[540px]
              text-base leading-7 text-gray-600
              sm:mt-7 sm:text-lg sm:leading-8
            "
          >
            Crea una página web profesional sin necesidad de programar.
            Presenta tus servicios, muestra lo que haces y permite que
            tus clientes conozcan tu negocio desde cualquier lugar.
          </p>

          {/* BENEFICIOS */}
          <div className="mt-7 flex flex-col gap-4">
            {BENEFICIOS.map((beneficio) => (
              <div
                key={beneficio}
                className="
                  flex items-center gap-3
                  text-sm font-semibold text-gray-800
                  sm:text-base
                "
              >
                <FaCheckCircle
                  className="shrink-0 text-[#1db954]"
                  aria-hidden="true"
                />
                {beneficio}
              </div>
            ))}
          </div>

          {/* BOTONES */}
          <div
            className="
              mt-8 flex flex-col items-center gap-3
              sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center
            "
          >
            <Link
              href="/auth"
              className="
                group inline-flex w-full sm:w-auto
                items-center justify-center gap-3
                rounded-xl bg-[#1db954]
                px-7 py-4
                text-base font-extrabold text-white
                shadow-lg shadow-green-700/20
                transition-all duration-300
                hover:-translate-y-1 hover:bg-[#159447]
                hover:shadow-xl active:scale-95
              "
            >
              Crear mi página web
              <FaRocket
                className="transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>

            <Link
              href="/prueba"
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex w-full sm:w-auto
                items-center justify-center gap-2
                rounded-xl border-2 border-black
                bg-black px-7 py-4
                text-base font-bold text-white
                transition-all duration-300
                hover:-translate-y-1 hover:bg-gray-800
                hover:shadow-lg active:scale-95
              "
            >
              Ver ejemplo
            </Link>
          </div>

          <p className="mt-5 text-center text-sm text-gray-500 sm:text-left">
            Diseña. Publica. Comparte.
          </p>
        </div>

        {/* IMAGEN E ICONOS PARA ORDENADOR */}
        <div
          className="
            relative z-10 mx-auto hidden w-full
            max-w-[650px]
            items-center justify-center
            lg:flex lg:min-h-[620px]
          "
        >

          {/* LUZ DE FONDO */}
          <div
            className="
              absolute left-[15%] top-[15%]
              h-[65%] w-[75%]
              rounded-full bg-white/10 blur-3xl
            "
          />

          {/* ICONOS FLOTANTES */}
          <IconoFlotante className="left-[1%] top-[25%] h-[76px] w-[76px] rotate-[-8deg]">
            <FaGlobe />
          </IconoFlotante>

          <IconoFlotante className="right-[3%] top-[18%] h-[82px] w-[82px] rotate-[7deg]">
            <FaQrcode />
          </IconoFlotante>

          <IconoFlotante className="left-[0%] bottom-[24%] h-[78px] w-[78px] rotate-[6deg]">
            <FaShoppingCart />
          </IconoFlotante>

          <IconoFlotante className="right-[1%] bottom-[22%] h-[76px] w-[76px] rotate-[-7deg]">
            <FaStore />
          </IconoFlotante>

          <IconoFlotante className="left-[25%] top-[5%] h-[64px] w-[64px] rotate-[-5deg]">
            <FaBriefcase />
          </IconoFlotante>

          <IconoFlotante className="right-[24%] bottom-[7%] h-[66px] w-[66px] rotate-[6deg]">
            <FaUtensils />
          </IconoFlotante>

          {/* IMAGEN DE CARLOS */}
          <div className="relative z-10 w-full max-w-[570px]">
            <Image
              src="/Carlos.png"
              alt="Emprendedor utilizando Catalagox"
              width={700}
              height={700}
              priority
              sizes="(max-width: 1024px) 0px, 50vw"
              className="h-auto w-full object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* IMAGEN PARA MÓVIL */}
      <div className="relative mt-8 overflow-hidden bg-white lg:hidden">

        {/* CURVA VERDE */}
        <div className="absolute inset-0">
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 480 520"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="
                M0 115
                C85 35 155 25 230 75
                C315 135 385 110 480 30
                L480 520
                L0 520
                Z
              "
              fill="#1db954"
            />
          </svg>
        </div>

        {/* ICONOS PARA MÓVIL */}
        <IconoFlotante className="left-[5%] top-[31%] h-14 w-14 rotate-[-8deg] sm:left-[8%] sm:h-16 sm:w-16">
          <FaGlobe />
        </IconoFlotante>

        <IconoFlotante className="right-[5%] top-[25%] h-14 w-14 rotate-[8deg] sm:right-[9%] sm:h-16 sm:w-16">
          <FaQrcode />
        </IconoFlotante>

        <IconoFlotante className="left-[8%] bottom-[14%] h-14 w-14 rotate-[7deg] sm:left-[13%] sm:h-16 sm:w-16">
          <FaShoppingCart />
        </IconoFlotante>

        <IconoFlotante className="right-[7%] bottom-[17%] h-14 w-14 rotate-[-7deg] sm:right-[12%] sm:h-16 sm:w-16">
          <FaStore />
        </IconoFlotante>

        {/* IMAGEN DE CARLOS */}
        <div
          className="
            relative z-10 mx-auto
            flex min-h-[390px]
            w-full max-w-[480px]
            items-end justify-center
            px-3 pt-16
            sm:min-h-[470px]
          "
        >
          <Image
            src="/Carlos.png"
            alt="Emprendedor utilizando Catalagox"
            width={700}
            height={700}
            priority
            sizes="(max-width: 640px) 100vw, 480px"
            className="
              h-auto w-full max-w-[420px]
              object-contain drop-shadow-2xl
            "
          />
        </div>
      </div>

      {/* ESPACIO BLANCO INFERIOR EN MÓVIL */}
      <div className="h-12 bg-white lg:hidden" />
    </section>
  );
}
