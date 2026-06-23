import { apiClient } from "@/shared/lib/axiosClient";

/**
 * profilService — akses API modul profil kepengurusan.
 * Struktur data: Jabatan memiliki banyak Anggota.
 */
export const profilService = {
  /** Daftar semua jabatan beserta anggota (publik) */
  getAll: () =>
    apiClient.get("/profil").then((r) => r.data),

  /** Satu jabatan berdasarkan ID (admin) */
  getById: (id) =>
    apiClient.get(`/admin/profil/${id}`).then((r) => r.data),

  // ── Jabatan ─────────────────────────────────────────────────────────────
  createJabatan: (payload) =>
    apiClient.post("/admin/profil/jabatan", payload).then((r) => r.data),

  updateJabatan: (id, payload) =>
    apiClient.put(`/admin/profil/jabatan/${id}`, payload).then((r) => r.data),

  deleteJabatan: (id) =>
    apiClient.delete(`/admin/profil/jabatan/${id}`),

  // ── Anggota ─────────────────────────────────────────────────────────────
  createAnggota: (payload) =>
    apiClient.post("/admin/profil/anggota", payload).then((r) => r.data),

  updateAnggota: (id, payload) =>
    apiClient.put(`/admin/profil/anggota/${id}`, payload).then((r) => r.data),

  deleteAnggota: (id) =>
    apiClient.delete(`/admin/profil/anggota/${id}`),

  /** Upload foto anggota — mengembalikan { foto_url } */
  uploadFoto: (file) => {
    const fd = new FormData();
    fd.append("file", file);
    return apiClient
      .post("/admin/profil/upload-foto", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },
};
