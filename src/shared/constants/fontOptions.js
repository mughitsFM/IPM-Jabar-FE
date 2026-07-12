/**
 * shared/constants/fontOptions.js
 *
 * Font display/body HARUS dipilih dari daftar ini (bukan input bebas),
 * karena perlu di-load dinamis lewat Google Fonts saat runtime — kalau
 * admin ketik nama font sembarang yang gak pernah di-load, teks bakal
 * fallback ke font sistem tanpa pemberitahuan.
 */

export const FONT_OPTIONS = [
  { value: "Lexend", label: "Lexend (default)" },
  { value: "Plus Jakarta Sans", label: "Plus Jakarta Sans (default)" },
  { value: "Inter", label: "Inter" },
  { value: "Poppins", label: "Poppins" },
  { value: "Nunito Sans", label: "Nunito Sans" },
  { value: "Work Sans", label: "Work Sans" },
  { value: "Manrope", label: "Manrope" },
  { value: "Sora", label: "Sora" },
];

/**
 * Bangun URL Google Fonts CSS2 API dari 1+ nama font.
 * Duplikat otomatis dihapus (kalau display & body sama).
 */
export function buildGoogleFontsUrl(families) {
  const unique = [...new Set(families.filter(Boolean))];
  const params = unique
    .map((f) => `family=${encodeURIComponent(f).replace(/%20/g, "+")}:wght@400;500;600;700`)
    .join("&");
  return `https://fonts.googleapis.com/css2?${params}&display=swap`;
}
