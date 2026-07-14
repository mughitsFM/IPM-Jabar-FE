const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "image/jpeg",
  "image/png",
];

const ALLOWED_EXTENSIONS = ["pdf", "docx", "jpg", "jpeg", "png"];

const BYTES_PER_MB = 1024 * 1024;

const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * BYTES_PER_MB;

/**
 * Validasi file lampiran pengaduan.
 */
export function validateLampiran(file) {
  if (!file) return { valid: true, error: null };

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    const ext = ALLOWED_EXTENSIONS.join(", ").toUpperCase();
    return { valid: false, error: `Format file tidak didukung. Gunakan: ${ext}` };
  }

  if (file.size > MAX_SIZE_BYTES) {
    return { valid: false, error: `Ukuran file maksimal ${MAX_SIZE_MB} MB` };
  }

  return { valid: true, error: null };
}

/**
 * Validasi file gambar (thumbnail berita / foto profil).
 * Ukuran TIDAK dibatasi — gambar akan dikompres & diresize otomatis
 * ke WebP oleh Cloudinary saat upload, jadi ukuran asli tidak relevan.
 */
export function validateGambar(file) {
  if (!file) return { valid: true, error: null };

  const allowedImageMime = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedImageMime.includes(file.type)) {
    return { valid: false, error: "Gunakan format gambar JPG, PNG, atau WebP" };
  }

  return { valid: true, error: null };
}

/** Ukuran file ke string yang mudah dibaca, misal "1.2 MB" */
export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < BYTES_PER_MB) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / BYTES_PER_MB).toFixed(1)} MB`;
}

/**
 * Validasi lampiran surat resmi — PDF-only, maksimal 10 MB.
 */
export function validateLampiranPDF(file) {
  if (!file) {
    return { valid: false, error: "Silakan pilih file terlebih dahulu." };
  }
  if (file.type !== "application/pdf") {
    return { valid: false, error: "Lampiran surat harus berupa file PDF." };
  }
  if (file.size > MAX_SIZE_BYTES) {
    const sizeMb = (file.size / BYTES_PER_MB).toFixed(2);
    return {
      valid: false,
      error: `Ukuran file melebihi batas maksimal ${MAX_SIZE_MB} MB (ukuran saat ini: ${sizeMb} MB).`,
    };
  }
  return { valid: true, error: null };
}