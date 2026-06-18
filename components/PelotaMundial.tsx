"use client";

export default function PelotaMundial() {
  return (
    <>
      <div className="pelota-mundial fixed top-10 left-[-120px] z-[9999]">
        <div className="relative w-16 h-16 md:w-20 md:h-20">
          <img
            src="/Pelota-Mundial-2026.png"
            alt="Pelota Mundial 2026"
            width={80}
            height={80}
            className="pelota"
          />
        </div>
      </div>

      <style jsx>{`
        /* La animación completa dura 30 segundos */
        .pelota-mundial {
          animation: recorrer 30s linear infinite;
        }

        /* La pelota gira constantemente */
        .pelota {
          animation: girar 3s linear infinite;
        }

        @keyframes recorrer {
          /* Oculta la pelota los primeros segundos */
          0% {
            transform: translateX(-120px) translateY(0px) rotate(0deg);
            opacity: 0;
          }

          /* Aparece */
          5% {
            opacity: 1;
          }

          /* Rebotes */
          10% {
            transform: translateX(20vw) translateY(-20px) rotate(360deg);
          }

          15% {
            transform: translateX(35vw) translateY(0px) rotate(720deg);
          }

          20% {
            transform: translateX(55vw) translateY(-15px) rotate(1080deg);
          }

          25% {
            transform: translateX(75vw) translateY(0px) rotate(1440deg);
          }

          30% {
            transform: translateX(calc(100vw + 120px)) translateY(-10px)
              rotate(1800deg);
            opacity: 1;
          }

          /* Permanece escondida hasta completar los 30 segundos */
          31% {
            opacity: 0;
          }

          100% {
            transform: translateX(calc(100vw + 120px)) translateY(-10px)
              rotate(1800deg);
            opacity: 0;
          }
        }

        @keyframes girar {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}
