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

// Tailwind class warna badge sesuai design system BAB 2.2
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

// ── Status Pengaduan ───────────────────────────────────────────────────────
export const STATUS_PENGADUAN = {
  DITERIMA: "diterima",
  DIPROSES: "diproses",
  SELESAI:  "selesai",
};

export const STATUS_PENGADUAN_LABELS = {
  [STATUS_PENGADUAN.DITERIMA]: "Diterima",
  [STATUS_PENGADUAN.DIPROSES]: "Diproses",
  [STATUS_PENGADUAN.SELESAI]:  "Selesai",
};

export const STATUS_PENGADUAN_COLORS = {
  [STATUS_PENGADUAN.DITERIMA]: "bg-brand-blue-500/10 text-brand-blue-500",
  [STATUS_PENGADUAN.DIPROSES]: "bg-brand-gold-50 text-brand-gold-600",
  [STATUS_PENGADUAN.SELESAI]:  "bg-brand-green-50 text-brand-green-500",
};
