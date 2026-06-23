/**
 * Mengubah string menjadi slug URL-friendly.
 * Mendukung karakter Indonesia (é, ñ, dll.) via normalisasi Unicode.
 *
 * Contoh: "Berita Terkini PW IPM Jabar" → "berita-terkini-pw-ipm-jabar"
 */
export function slugify(text) {
  return text
    .toString()
    .normalize("NFKD")                          // pisahkan karakter + diakritik
    .replace(/[\u0300-\u036f]/g, "")            // hapus diakritik
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")              // hapus karakter selain huruf/angka/spasi/tanda-hubung
    .replace(/\s+/g, "-")                       // spasi → tanda-hubung
    .replace(/-+/g, "-")                        // hindari tanda-hubung ganda
    .replace(/^-+|-+$/g, "");                   // trim tanda-hubung di awal/akhir
}
