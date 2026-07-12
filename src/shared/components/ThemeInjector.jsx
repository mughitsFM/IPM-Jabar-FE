import { useEffect } from "react";
import { useDesainGlobal } from "@/shared/hooks/useDesainPublic";
import { buildBrandColorVars } from "@/shared/utils/colorShades";
import { buildGoogleFontsUrl } from "@/shared/constants/fontOptions";

const FONT_LINK_ID = "desain-dynamic-font-link";

/**
 * ThemeInjector — komponen tanpa tampilan (return null), dipasang SEKALI
 * di PublicLayout. Tugasnya:
 *
 * 1. Set CSS custom properties warna brand di :root berdasarkan config
 *    (--color-brand-green-*, --color-brand-gold-*) — dipakai tailwind.config.js
 *    lewat var(--color-brand-green-500, #fallback), jadi class Tailwind yang
 *    sudah ada di seluruh kode (bg-brand-green-500, dst) otomatis ikut
 *    berubah tanpa perlu diedit satu-satu.
 * 2. Inject <link> Google Fonts dinamis sesuai font_display/font_body yang
 *    dipilih admin, lalu set --font-display/--font-body.
 *
 * Kalau config belum ke-load (masih fetching / API gagal), tidak melakukan
 * apa-apa — tailwind.config.js & index.css sudah punya fallback hex/font
 * default, jadi situs tetap tampil normal seperti sebelum fitur ini ada.
 */
export default function ThemeInjector() {
  const { global } = useDesainGlobal();

  useEffect(() => {
    if (!global?.warna_primer || !global?.warna_aksen) return;

    const vars = buildBrandColorVars({
      warnaPrimer: global.warna_primer,
      warnaAksen: global.warna_aksen,
    });
    for (const [key, value] of Object.entries(vars)) {
      document.documentElement.style.setProperty(key, value);
    }
  }, [global?.warna_primer, global?.warna_aksen]);

  useEffect(() => {
    if (!global?.font_display || !global?.font_body) return;

    let link = document.getElementById(FONT_LINK_ID);
    if (!link) {
      link = document.createElement("link");
      link.id = FONT_LINK_ID;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    link.href = buildGoogleFontsUrl([global.font_display, global.font_body]);

    document.documentElement.style.setProperty("--font-display", global.font_display);
    document.documentElement.style.setProperty("--font-body", global.font_body);
  }, [global?.font_display, global?.font_body]);

  return null;
}
