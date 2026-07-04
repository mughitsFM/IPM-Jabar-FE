import { apiClient } from "@/shared/lib/axiosClient";

/**
 * penggunaService — manajemen akun admin.
 * Hanya dapat diakses oleh super_admin (proteksi di BE dan FE).
 */
export const penggunaService = {
  /** Daftar semua akun admin */
  getList: () =>
    apiClient.get("/admin/pengguna/").then((r) => r.data),

  /**
   * Buat akun admin baru.
   * Django akan membuat user di Firebase Auth via Admin SDK,
   * lalu menyimpan record di Firestore dengan custom claim role.
   */
  create: (payload) =>
    apiClient.post("/admin/pengguna/", payload).then((r) => r.data),

  /** Update data admin (nama, role) */
  update: (id, payload) =>
    apiClient.put(`/admin/pengguna/${id}/`, payload).then((r) => r.data),

  /**
   * Nonaktifkan / aktifkan akun (toggle disabled di Firebase Auth).
   * Payload: { is_active: boolean }
   */
  toggleActive: (id, isActive) =>
    apiClient.patch(`/admin/pengguna/${id}/status/`, { is_active: isActive }).then((r) => r.data),

  /** Hapus akun admin (super_admin only) */
  remove: (id) =>
    apiClient.delete(`/admin/pengguna/${id}/`),
};
