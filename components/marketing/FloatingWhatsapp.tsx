"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useAnimationControls, PanInfo, AnimatePresence } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

export default function FloatingWhatsapp() {
  const controls = useAnimationControls();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Ciclo de animación: Abre por 3s -> Cierra por 25s
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    // Se abre al entrar a la página
    setIsExpanded(true);

    const runCycle = () => {
      // Mantiene abierto 3.5 segundos
      timeoutId = setTimeout(() => {
        setIsExpanded(false);

        // Se vuelve a abrir después de 25 segundos
        timeoutId = setTimeout(() => {
          setIsExpanded(true);
          runCycle();
        }, 25000);
      }, 3500);
    };

    runCycle();

    return () => clearTimeout(timeoutId);
  }, []);

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const buttonWidth = buttonRef.current?.offsetWidth || 60;
    const buttonHeight = buttonRef.current?.offsetHeight || 60;

    const currentX = info.point.x;
    const margin = 16;

    let targetX = 0;
    if (currentX < screenWidth / 2) {
      targetX = -(screenWidth - buttonWidth - margin * 2);
    } else {
      targetX = 0;
    }

    const minY = margin - (screenHeight - buttonHeight - 24);
    const maxY = margin;
    const clampedY = Math.min(Math.max(info.offset.y, minY), maxY);

    controls.start({
      x: targetX,
      y: clampedY,
      transition: { type: "spring", stiffness: 350, damping: 28 },
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
      className="fixed bottom-6 right-6 z-[100] touch-none cursor-grab active:cursor-grabbing select-none"
    >
      <a
        href="https://wa.me/5491176617374?text=Hola!%20Me%20gustar%C3%ADa%20que%20me%20ayudes%20a%20crear%20mi%20cat%C3%A1logo%20digital."
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center bg-[#25D366] text-white p-3.5 rounded-full shadow-[0_10px_25px_rgba(37,211,102,0.4)] hover:shadow-[0_15px_30px_rgba(37,211,102,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 group overflow-hidden"
        aria-label="Contactar por WhatsApp"
      >
        <FaWhatsapp className="text-2xl sm:text-3xl text-white animate-bounce flex-shrink-0" />

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.span
              initial={{ width: 0, opacity: 0, marginLeft: 0 }}
              animate={{ width: "auto", opacity: 1, marginLeft: 10 }}
              exit={{ width: 0, opacity: 0, marginLeft: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden whitespace-nowrap font-bold text-xs sm:text-sm text-slate-950 pr-1"
            >
              ¿Te ayudo a crearlo?
            </motion.span>
          )}
        </AnimatePresence>
      </a>
    </motion.div>
  );
}