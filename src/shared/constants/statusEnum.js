// frontend/shared/constants/statusEnum.js (lengkap)
// ── Status Berita ──────────────────────────────────────────────────────────
export const STATUS_BERITA = {
  DRAFT:          "draft",
  TERJADWAL:      "terjadwal",
  DIPUBLIKASIKAN: "dipublikasikan",
};

export const STATUS_BERITA_LABELS = {
  [STATUS_BERITA.DRAFT]:          "Draft",
  [STATUS_BERITA.TERJADWAL]:      "Terjadwal",
  [STATUS_BERITA.DIPUBLIKASIKAN]: "Dipublikasikan",
};

export const STATUS_BERITA_COLORS = {
  [STATUS_BERITA.DRAFT]:          "bg-neutral-200 text-neutral-600",
  [STATUS_BERITA.TERJADWAL]:      "bg-brand-blue-500/10 text-brand-blue-500",
  [STATUS_BERITA.DIPUBLIKASIKAN]: "bg-brand-green-50 text-brand-green-500",
};

// ── Kategori Berita ────────────────────────────────────────────────────────
export const KATEGORI_BERITA = {
  KEGIATAN:    "kegiatan",
  UMUM:        "umum",
  SURAT_RESMI: "surat_resmi",
};

export const KATEGORI_BERITA_LABELS = {
  [KATEGORI_BERITA.KEGIATAN]:    "Informasi Kegiatan",
  [KATEGORI_BERITA.UMUM]:        "Informasi Umum",
  [KATEGORI_BERITA.SURAT_RESMI]: "Sebaran Surat Resmi",
};

// ── Status Program Kerja ───────────────────────────────────────────────────
export const STATUS_PROKER = {
  AKAN_DATANG: "akan_datang",
  BERLANGSUNG: "berlangsung",
  SELESAI:     "selesai",
};

export const STATUS_PROKER_LABELS = {
  [STATUS_PROKER.AKAN_DATANG]: "Akan Datang",
  [STATUS_PROKER.BERLANGSUNG]: "Berlangsung",
  [STATUS_PROKER.SELESAI]:     "Selesai",
};

export const STATUS_PROKER_COLORS = {
  [STATUS_PROKER.AKAN_DATANG]: "bg-brand-blue-500/10 text-brand-blue-500",
  [STATUS_PROKER.BERLANGSUNG]: "bg-brand-gold-50 text-brand-gold-600",
  [STATUS_PROKER.SELESAI]:     "bg-brand-green-50 text-brand-green-500",
};

// Warna solid untuk penanda titik (mis. dot kalender di beranda) — beda dari
// STATUS_PROKER_COLORS di atas yang untuk background pil/badge (soft/tint).
export const STATUS_PROKER_DOT_COLORS = {
  [STATUS_PROKER.AKAN_DATANG]: "bg-brand-blue-500",
  [STATUS_PROKER.BERLANGSUNG]: "bg-brand-gold-500",
  [STATUS_PROKER.SELESAI]:     "bg-brand-green-500",
};

// ── Bidang Program Kerja ─────────────────────────────────────────────────
// HARUS persis sama dengan BIDANG_CHOICES di backend/proker/serializers.py
export const BIDANG_PROKER = {
  ORGANISASI:           "organisasi",
  KADER:                "kader",
  KAJIAN_DAKWAH_ISLAMI: "kajian_dakwah_islami",
  PERKADERAN:           "perkaderan",
  HIKMAH:               "hikmah",
  IMMAWAN:              "immawan",
  IMMAWATI:             "immawati",
  MEDIA_KOMUNIKASI:     "media_komunikasi",
  LAINNYA:              "lainnya",
};

export const BIDANG_PROKER_LABELS = {
  [BIDANG_PROKER.ORGANISASI]:          "Organisasi",
  [BIDANG_PROKER.KADER]:                "Kader",
  [BIDANG_PROKER.KAJIAN_DAKWAH_ISLAMI]: "Kajian Dakwah Islami",
  [BIDANG_PROKER.PERKADERAN]:           "Perkaderan",
  [BIDANG_PROKER.HIKMAH]:               "Hikmah",
  [BIDANG_PROKER.IMMAWAN]:              "Immawan",
  [BIDANG_PROKER.IMMAWATI]:             "Immawati",
  [BIDANG_PROKER.MEDIA_KOMUNIKASI]:     "Media & Komunikasi",
  [BIDANG_PROKER.LAINNYA]:              "Lainnya",
};

// ── Level Pimpinan (dari 01-model-role-pimpinan.md §9 — REFERENSI, mungkin
//    sudah ditambahkan sebelumnya saat implementasi file 01; disertakan lagi
//    di sini untuk KELENGKAPAN karena dipakai lintas file 05/06/09, mis.
//    PenerimaPicker di surat-menyurat. Jangan duplikasi bila sudah ada). ────
export const LEVEL_PIMPINAN = { DAERAH: "daerah", CABANG: "cabang", RANTING: "ranting" };
export const LEVEL_PIMPINAN_LABELS = {
  [LEVEL_PIMPINAN.DAERAH]:  "Pimpinan Daerah",
  [LEVEL_PIMPINAN.CABANG]:  "Pimpinan Cabang",
  [LEVEL_PIMPINAN.RANTING]: "Pimpinan Ranting",
};
export const LEVEL_PIMPINAN_PREFIX = { daerah: "PD", cabang: "PC", ranting: "PR" };
export function composeLabelPimpinan(level, namaWilayah) {
  return `${LEVEL_PIMPINAN_PREFIX[level]} IPM ${namaWilayah}`;
}

// ── Status Artikel Pimpinan (baru — lihat 05-artikel-pimpinan.md) ──────────
// Alur: draft → diajukan → disetujui (auto-publish ke `berita`)
//                       └→ revisi / ditolak → (edit) → diajukan lagi
export const STATUS_ARTIKEL_PIMPINAN = {
  DRAFT:     "draft",
  DIAJUKAN:  "diajukan",
  REVISI:    "revisi",
  DITOLAK:   "ditolak",
  DISETUJUI: "disetujui",
};

export const STATUS_ARTIKEL_PIMPINAN_LABELS = {
  [STATUS_ARTIKEL_PIMPINAN.DRAFT]:     "Draft",
  [STATUS_ARTIKEL_PIMPINAN.DIAJUKAN]:  "Diajukan",
  [STATUS_ARTIKEL_PIMPINAN.REVISI]:    "Perlu Revisi",
  [STATUS_ARTIKEL_PIMPINAN.DITOLAK]:   "Ditolak",
  [STATUS_ARTIKEL_PIMPINAN.DISETUJUI]: "Disetujui & Terbit",
};

export const STATUS_ARTIKEL_PIMPINAN_COLORS = {
  [STATUS_ARTIKEL_PIMPINAN.DRAFT]:     "bg-neutral-200 text-neutral-600",
  [STATUS_ARTIKEL_PIMPINAN.DIAJUKAN]:  "bg-brand-blue-500/10 text-brand-blue-500",
  [STATUS_ARTIKEL_PIMPINAN.REVISI]:    "bg-brand-gold-50 text-brand-gold-600",
  [STATUS_ARTIKEL_PIMPINAN.DITOLAK]:   "bg-brand-red-500/10 text-brand-red-500",
  [STATUS_ARTIKEL_PIMPINAN.DISETUJUI]: "bg-brand-green-50 text-brand-green-500",
};

// ── Status Aspirasi (baru — PENGGANTI TOTAL STATUS_PENGADUAN, lihat
//    09-aspirasi-revamp.md §3.5) ────────────────────────────────────────────
export const STATUS_ASPIRASI = {
  TERKIRIM: "terkirim",
  DIPROSES: "diproses",
  DIBALAS:  "dibalas",
};

export const STATUS_ASPIRASI_LABELS = {
  [STATUS_ASPIRASI.TERKIRIM]: "Terkirim",
  [STATUS_ASPIRASI.DIPROSES]: "Diproses",
  [STATUS_ASPIRASI.DIBALAS]:  "Sudah Dibalas",
};

export const STATUS_ASPIRASI_COLORS = {
  [STATUS_ASPIRASI.TERKIRIM]: "bg-brand-blue-500/10 text-brand-blue-500",
  [STATUS_ASPIRASI.DIPROSES]: "bg-brand-gold-50 text-brand-gold-600",
  [STATUS_ASPIRASI.DIBALAS]:  "bg-brand-green-50 text-brand-green-500",
};