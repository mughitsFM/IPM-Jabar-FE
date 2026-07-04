import { apiClient } from "@/shared/lib/axiosClient";

/**
 * pengaduanService — akses API modul pengaduan / penerusan surat.
 */
export const pengaduanService = {
  /**
   * Kirim pengaduan baru (publik, no auth).
   * Dikirim sebagai FormData karena ada lampiran opsional.
   */
  submit: (payload) => {
    const fd = new FormData();
    fd.append("email",         payload.email);
    fd.append("asal_pimpinan", payload.asal_pimpinan);
    fd.append("perihal",       payload.perihal);
    fd.append("isi",           payload.isi);
    if (payload.lampiran) fd.append("lampiran", payload.lampiran);
    return apiClient
      .post("/pengaduan/", fd, { headers: { "Content-Type": "multipart/form-data" } })
      .then((r) => r.data);
  },

  /** Cek status pengaduan via kode unik (publik) */
  checkStatus: (kode) =>
    apiClient.get(`/pengaduan/status/${kode}/`).then((r) => r.data),

  // ── Admin ────────────────────────────────────────────────────────────────
  /** Daftar semua pengaduan (admin) */
  getList: (params) =>
    apiClient.get("/admin/pengaduan/", { params }).then((r) => r.data),

  /** Detail satu pengaduan (admin) */
  getById: (id) =>
    apiClient.get(`/admin/pengaduan/${id}/`).then((r) => r.data),

  /** Update status pengaduan (admin) */
  updateStatus: (id, status) =>
    apiClient.patch(`/admin/pengaduan/${id}/status/`, { status }).then((r) => r.data),
};