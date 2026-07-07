const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "image/jpeg",
  "image/png",
];

const ALLOWED_EXTENSIONS = ["pdf", "docx", "jpg", "jpeg", "png"];
const MAX_SIZE_SURAT_MB = 10;
const MAX_SIZE_SURAT_BYTES = MAX_SIZE_SURAT_MB * 1024 * 1024;
const MAX_SIZE_BYTES = 1024 * 1024;

/**
 * Validasi file lampiran pengaduan.
 * @param {File} file
 * @returns {{ valid: boolean, error: string | null }}
 */
export function validateLampiran(file) {
  if (!file) return { valid: true, error: null };

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    const ext = ALLOWED_EXTENSIONS.join(", ").toUpperCase();
    return { valid: false, error: `Format file tidak didukung. Gunakan: ${ext}` };
  }

  if (file.size > MAX_SIZE_BYTES) {
    return { valid: false, error: "Ukuran file maksimal 5 MB" };
  }

  return { valid: true, error: null };
}

/**
 * Validasi file gambar (thumbnail berita / foto profil).
 */
export function validateGambar(file) {
  if (!file) return { valid: true, error: null };

  const allowedImageMime = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedImageMime.includes(file.type)) {
    return { valid: false, error: "Gunakan format gambar JPG, PNG, atau WebP" };
  }

  if (file.size > MAX_SIZE_BYTES) {
    return { valid: false, error: "Ukuran gambar maksimal 5 MB" };
  }

  return { valid: true, error: null };
}

/** Ukuran file ke string yang mudah dibaca, misal "1.2 MB" */
export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Validasi lampiran surat resmi — PDF-only, maksimal 10 MB.
 * @param {File} file
 * @returns {{ valid: boolean, error: string|null }}
 */
export function validateLampiranPDF(file) {
  if (!file) {
    return { valid: false, error: "Silakan pilih file terlebih dahulu." };
  }
  if (file.type !== "application/pdf") {
    return { valid: false, error: "Lampiran surat harus berupa file PDF." };
  }
  if (file.size > MAX_SIZE_SURAT_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `Ukuran file melebihi batas maksimal ${MAX_SIZE_SURAT_MB} MB (ukuran saat ini: ${sizeMb} MB).`,
    };
  }
  return { valid: true, error: null };
}