import { apiClient } from "@/shared/lib/axiosClient";

export const profilService = {
  /** Struktur kepengurusan (jabatan berisi anggota di dalamnya) */
  getAll: () =>
    apiClient.get("/profil/").then((r) => r.data),

  // ── Jabatan ────────────────────────────────────────────────
  createJabatan: (payload) =>
    apiClient.post("/admin/profil/jabatan/", payload).then((r) => r.data),
  updateJabatan: (id, payload) =>
    apiClient.put(`/admin/profil/jabatan/${id}/`, payload).then((r) => r.data),
  deleteJabatan: (id) =>
    apiClient.delete(`/admin/profil/jabatan/${id}/`),

  // ── Anggota (JSON biasa — foto sudah jadi URL sebelum submit) ─
  getAnggotaById: (id) =>
    apiClient.get(`/admin/profil/anggota/${id}/`).then((r) => r.data),
  createAnggota: (payload) =>
    apiClient.post("/admin/profil/anggota/", payload).then((r) => r.data),
  updateAnggota: (id, payload) =>
    apiClient.put(`/admin/profil/anggota/${id}/`, payload).then((r) => r.data),
  deleteAnggota: (id) =>
    apiClient.delete(`/admin/profil/anggota/${id}/`),

  // ── Upload foto — dipanggil terpisah saat file dipilih ────────
  uploadFoto: (file) => {
    const fd = new FormData();
    fd.append("file", file);
    return apiClient
      .post("/admin/profil/upload-foto/", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },
};