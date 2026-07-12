/**
 * shared/utils/colorShades.js
 *
 * Admin cuma pilih 2 warna dasar (Primer, Aksen) — shade turunan
 * (terang/gelap) dihitung otomatis di sini. Dipakai DUA tempat dengan
 * logika yang sama (DRY):
 *  - Live preview di form admin (Manajemen Desain)
 *  - ThemeInjector di sisi publik, saat set CSS custom properties
 *
 * Lihat 13-manajemen-desain.md §4.
 */

// ── Konversi hex <-> HSL ────────────────────────────────────────────────

function hexToHsl(hex) {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h, s, l) {
  const hh = ((h % 360) + 360) % 360 / 360;
  const ss = Math.min(Math.max(s, 0), 100) / 100;
  const ll = Math.min(Math.max(l, 0), 100) / 100;

  if (ss === 0) {
    const v = Math.round(ll * 255);
    const hx = v.toString(16).padStart(2, "0");
    return `#${hx}${hx}${hx}`;
  }

  const q = ll < 0.5 ? ll * (1 + ss) : ll + ss - ll * ss;
  const p = 2 * ll - q;

  const hueToRgb = (t) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };

  const r = Math.round(hueToRgb(hh + 1 / 3) * 255);
  const g = Math.round(hueToRgb(hh) * 255);
  const b = Math.round(hueToRgb(hh - 1 / 3) * 255);

  const toHex = (v) => v.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// ── Konversi hex -> "R G B" ──────────────────────────────────────────────
// Dipakai buat nilai CSS variable, karena tailwind.config.js sekarang
// membungkus brand-green-*/brand-gold-* dengan rgb(var(--x) / <alpha-value>).
// Tailwind butuh komponen RGB polos (bukan "#RRGGBB") supaya modifier
// opacity (mis. bg-brand-green-500/20) tetap bisa disuntikkan walau
// warnanya dinamis lewat CSS variable.

function hexToRgbString(hex) {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `${r} ${g} ${b}`;
}

// ── Generate shade dari 1 base hex (dianggap sebagai shade "500") ───────
// Tetap return hex — dipakai juga di form admin (swatch, input[type=color],
// contrastRatio, dst) yang butuh format hex, bukan cuma buat CSS variable.

export function generateShades(baseHex) {
  const { h, s, l } = hexToHsl(baseHex);

  return {
    50: hslToHex(h, Math.max(s * 0.45, 8), 95),
    300: hslToHex(h, s, Math.min(l + (95 - l) * 0.5, 88)),
    500: baseHex,
    600: hslToHex(h, s, Math.max(l * 0.82, 10)),
    900: hslToHex(h, Math.min(s + 5, 100), Math.max(l * 0.35, 6)),
  };
}

/**
 * Hitung semua CSS variable yang perlu di-set di :root, dari 2 warna
 * dasar yang dipilih admin.
 *
 * PENTING: nilai yang di-return dalam format "R G B" (komponen RGB
 * dipisah spasi, tanpa tanda "#"), BUKAN hex string — ini wajib supaya
 * cocok dengan rgb(var(--x) / <alpha-value>) di tailwind.config.js.
 *
 * Return: { "--color-brand-green-50": "234 246 238", ... }
 */
export function buildBrandColorVars({ warnaPrimer, warnaAksen }) {
  const green = generateShades(warnaPrimer);
  const gold = generateShades(warnaAksen);

  const vars = {};
  for (const tier of [50, 300, 500, 600, 900]) {
    vars[`--color-brand-green-${tier}`] = hexToRgbString(green[tier]);
  }
  for (const tier of [50, 300, 500, 600]) {
    vars[`--color-brand-gold-${tier}`] = hexToRgbString(gold[tier]);
  }
  return vars;
}

// ── Cek kontras ringan (bantuan visual di form admin, tidak blocking) ───
// Rumus relative luminance WCAG — dipakai buat kasih peringatan halus kalau
// admin pilih warna yang bakal susah dibaca (mis. teks putih di atas
// warna sangat terang).

function relativeLuminance(hex) {
  const clean = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(clean.substring(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(hexA, hexB) {
  const lA = relativeLuminance(hexA);
  const lB = relativeLuminance(hexB);
  const lighter = Math.max(lA, lB);
  const darker = Math.min(lA, lB);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * true kalau warna ini bakal susah dibaca dengan teks putih di atasnya
 * (dipakai buat tombol/hero yang teksnya putih). Ambang 3.0 dipilih longgar
 * — cuma buat warning halus, bukan validasi keras.
 */
export function isLowContrastWithWhite(hex) {
  return contrastRatio(hex, "#FFFFFF") < 3.0;
} 