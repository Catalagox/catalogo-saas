"use client";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

export default function FloatingWhatsapp() {
  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.1}
      className="fixed bottom-6 right-6 z-[100] touch-none cursor-grab active:cursor-grabbing select-none"
    >
      <a
        href="https://wa.me/5491176617374?text=Hola!%20Me%20gustar%C3%ADa%20que%20me%20ayudes%20a%20crear%20mi%20cat%C3%A1logo%20digital."
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-[0_10px_25px_rgba(37,211,102,0.4)] hover:shadow-[0_15px_30px_rgba(37,211,102,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 group"
        aria-label="Contactar por WhatsApp"
      >
        {/* Ícono de WhatsApp */}
        <FaWhatsapp className="text-2xl sm:text-3xl text-white animate-bounce flex-shrink-0" />

        {/* Único texto */}
        <span className="font-bold text-xs sm:text-sm text-slate-950 pr-1 whitespace-nowrap">
          ¿Te ayudo a crearlo?
        </span>
      </a>
    </motion.div>
  );
}