/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          // ── green & gold: dijadikan CSS variable (fallback = nilai lama) ──
          // Nilai runtime di-set oleh ThemeInjector (lihat shared/components/
          // ThemeInjector.jsx) dari config Manajemen Desain. Nama class di
          // seluruh kode (bg-brand-green-500, dst) TIDAK berubah — cuma
          // sumber nilainya yang jadi dinamis. Lihat 13-manajemen-desain.md §4.
          //
          // PENTING: CSS variable-nya disimpan sebagai komponen RGB "R G B"
          // (BUKAN "#RRGGBB"), lalu dibungkus rgb(var(--x) / <alpha-value>)
          // di sini. Placeholder <alpha-value> inilah yang bikin Tailwind
          // tetap bisa menyuntik angka opacity (mis. bg-brand-green-500/20)
          // walau nilai warnanya dinamis — Tailwind tidak bisa mem-parsing
          // komponen RGB dari hex yang disembunyikan di dalam var(...).
          // colorShades.js (buildBrandColorVars) WAJIB men-set CSS variable
          // ini dalam format "R G B", bukan "#RRGGBB".
          green: {
            50:  "rgb(var(--color-brand-green-50, 234 246 238) / <alpha-value>)",
            300: "rgb(var(--color-brand-green-300, 127 201 152) / <alpha-value>)",
            500: "rgb(var(--color-brand-green-500, 27 122 61) / <alpha-value>)",
            600: "rgb(var(--color-brand-green-600, 21 99 48) / <alpha-value>)",
            900: "rgb(var(--color-brand-green-900, 11 51 26) / <alpha-value>)",
          },
          gold: {
            50:  "rgb(var(--color-brand-gold-50, 255 248 230) / <alpha-value>)",
            300: "rgb(var(--color-brand-gold-300, 255 209 92) / <alpha-value>)",
            500: "rgb(var(--color-brand-gold-500, 232 168 0) / <alpha-value>)",
            600: "rgb(var(--color-brand-gold-600, 201 143 0) / <alpha-value>)",
          },
          // blue & red SENGAJA TETAP FIXED — warna semantik (link/info & error
          // state), bukan identitas brand, supaya maknanya tetap konsisten
          // walau admin ganti warna utama situs. Karena statis (bukan CSS
          // variable), hex biasa aman dan modifier /NN tetap jalan normal.
          blue: {
            500: "#1E5AA8",
            600: "#164581",
          },
          red: {
            500: "#C8102E",
          },
        },
        state: {
          error:   "#DC2626",
          success: "#15803D",
        },
        neutral: {
          50:  "#F8FAF8",
          200: "#E2E5E1",
          400: "#9CA3AF",
          600: "#4B5563",
          900: "#14241A",
        },
      },
      fontFamily: {
        // Sama seperti warna — nilai runtime di-set ThemeInjector lewat
        // --font-display/--font-body, fallback ke font lama.
        display: ["var(--font-display, Lexend)", "sans-serif"],
        body:    ["var(--font-body, Plus Jakarta Sans)", "sans-serif"],
      },
      borderRadius: {
        card: "1rem",
      },
      minHeight: {
        touch: "44px",
      },
      minWidth: {
        touch: "44px",
      },
    },
  },
  plugins: [],
};