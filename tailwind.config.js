/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",        // Todas las páginas y layouts
    "./components/**/*.{js,ts,jsx,tsx}"  // Todos los componentes
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)", // Tu variable CSS
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["Arial", "Helvetica", "sans-serif"], // Fuente base
      },
    },
  },
  plugins: [],
};


