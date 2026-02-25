"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { FaBars, FaTimes, FaSignInAlt, FaUserPlus } from "react-icons/fa";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full border-b bg-white relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* LOGO gpV8-pqi3iW-EnG,   y!FuK4!6ppatW.4 */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/c.png"
            alt="CatalogX"
            width={50}
            height={50}
          />
          <span className="text-black font-bold text-lg">
            Catalogo Pro
          </span>
        </Link>

        {/* NAV DESKTOP */}
        <nav className="hidden md:flex gap-8 text-black font-medium">
          <Link href="/" className="hover:text-gray-600 transition">
            Inicio
          </Link>
          <Link href="/contacto" className="hover:text-gray-600 transition">
            Contacto
          </Link>
          <Link href="/precios" className="hover:text-gray-600 transition">
            Precios
          </Link>
        </nav>

        {/* BUTTONS DESKTOP */}
        <div className="hidden md:flex items-center gap-4">

          <Link
            href="/auth"
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium border border-black text-black hover:bg-black hover:text-white transition"
          >
            <FaSignInAlt />
            Login
          </Link>

          <Link
            href="/auth"
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium bg-black text-white hover:opacity-80 transition"
          >
            <FaUserPlus />
            Crear cuenta
          </Link>

        </div>

        {/* HAMBURGER */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FaBars className="text-black" />
        </button>
      </div>

      {/* OVERLAY */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 bg-black/40 transition-opacity duration-300 md:hidden ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* SIDE MENU */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* CLOSE BUTTON */}
        <div className="flex justify-end p-4">
          <button
            onClick={() => setMenuOpen(false)}
            className="text-2xl hover:opacity-60 transition"
          >
            <FaTimes className="text-black"/>
          </button>
        </div>

        {/* MENU CONTENT */}
        <div className="flex flex-col items-center gap-8 text-black font-medium mt-10">

          <Link href="/" onClick={() => setMenuOpen(false)}>
            Inicio
          </Link>

          <Link href="/contacto" onClick={() => setMenuOpen(false)}>
            Contacto
          </Link>

          <Link href="/precios" onClick={() => setMenuOpen(false)}>
            Precios
          </Link>

          <div className="flex flex-col gap-4 w-full px-6 pt-6">

            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-5 py-2 rounded-xl text-sm font-medium border border-black text-black hover:bg-black hover:text-white transition"
            >
              <FaSignInAlt />
              Login
            </Link>

            <Link
              href="/registro"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-5 py-2 rounded-xl text-sm font-medium bg-black text-white hover:opacity-80 transition"
            >
              <FaUserPlus />
              Crear cuenta
            </Link>

          </div>

        </div>
      </div>

    </header>
  );
}
