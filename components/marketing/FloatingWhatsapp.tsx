"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  PanInfo,
  useAnimationControls,
} from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

const WHATSAPP_URL =
  "https://wa.me/5491176617374?text=Hola!%20Me%20gustar%C3%ADa%20que%20me%20ayudes%20a%20crear%20mi%20tienda%20online%20en%20Catalagox.";

export default function FloatingWhatsapp() {
  const controls = useAnimationControls();
  const buttonRef = useRef<HTMLDivElement>(null);

  const [isExpanded, setIsExpanded] = useState(false);

  // Se abre durante 3.5 segundos y vuelve a abrirse cada 25 segundos.
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    setIsExpanded(true);

    const runCycle = () => {
      timeoutId = setTimeout(() => {
        setIsExpanded(false);

        timeoutId = setTimeout(() => {
          setIsExpanded(true);
          runCycle();
        }, 25_000);
      }, 3_500);
    };

    runCycle();

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const buttonWidth = buttonRef.current?.offsetWidth ?? 60;
    const buttonHeight = buttonRef.current?.offsetHeight ?? 60;

    const margin = 16;
    const currentX = info.point.x;

    // Coloca el botón en el borde más cercano.
    const targetX =
      currentX < screenWidth / 2
        ? -(screenWidth - buttonWidth - margin * 2)
        : 0;

    // Evita que el botón salga verticalmente de la pantalla.
    const minY = margin - (screenHeight - buttonHeight - 24);
    const maxY = margin;

    const clampedY = Math.min(
      Math.max(info.offset.y, minY),
      maxY
    );

    controls.start({
      x: targetX,
      y: clampedY,
      transition: {
        type: "spring",
        stiffness: 350,
        damping: 28,
      },
    });
  };

  return (
    <motion.div
      ref={buttonRef}
      drag
      dragMomentum={false}
      dragElastic={0.05}
      animate={controls}
      onDragEnd={handleDragEnd}
      className="
        fixed
        bottom-6
        right-6
        z-[100]
        touch-none
        select-none
        cursor-grab
        active:cursor-grabbing
        will-change-transform
      "
    >
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="
          group
          flex
          items-center
          justify-center
          overflow-hidden
          rounded-full
          bg-[var(--marketing-primary)]
          p-3.5
          text-[var(--marketing-text-dark)]
          shadow-[0_10px_25px_color-mix(in_srgb,var(--marketing-primary)_40%,transparent)]
          transition-all
          duration-300
          hover:scale-105
          hover:shadow-[0_15px_30px_color-mix(in_srgb,var(--marketing-primary)_60%,transparent)]
          active:scale-95
        "
      >
        <FaWhatsapp
          aria-hidden="true"
          className="
            shrink-0
            text-2xl
            text-[var(--marketing-text-dark)]
            sm:text-3xl
          "
        />

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.span
              initial={{
                width: 0,
                opacity: 0,
                marginLeft: 0,
              }}
              animate={{
                width: "auto",
                opacity: 1,
                marginLeft: 10,
              }}
              exit={{
                width: 0,
                opacity: 0,
                marginLeft: 0,
              }}
              transition={{
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="
                overflow-hidden
                whitespace-nowrap
                pr-1
                text-xs
                font-semibold
                text-[var(--marketing-text-dark)]
                sm:text-sm
              "
            >
              ¿Te ayudo a crear tu tienda?
            </motion.span>
          )}
        </AnimatePresence>
      </a>
    </motion.div>
  );
}