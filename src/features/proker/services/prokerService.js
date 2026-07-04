import { apiClient } from "@/shared/lib/axiosClient";

/**
 * prokerService — akses API modul program kerja (proker/timeline).
 */
export const prokerService = {
  /** Daftar semua proker (publik) */
  getList: (params) =>
    apiClient.get("/proker/", { params }).then((r) => r.data),

  /** Satu proker berdasarkan ID */
  getById: (id) =>
    apiClient.get(`/proker/${id}/`).then((r) => r.data),

  /** Buat proker baru (admin) */
  create: (payload) =>
    apiClient.post("/admin/proker/", payload).then((r) => r.data),

  /** Update proker (admin) */
  update: (id, payload) =>
    apiClient.put(`/admin/proker/${id}/`, payload).then((r) => r.data),

  /** Update status saja (admin) */
  updateStatus: (id, status) =>
    apiClient.patch(`/admin/proker/${id}/status/`, { status }).then((r) => r.data),

  /** Hapus proker (admin) */
  remove: (id) =>
    apiClient.delete(`/admin/proker/${id}/`),
};
