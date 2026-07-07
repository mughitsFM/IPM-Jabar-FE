// frontend/features/aspirasi/services/aspirasiService.js (lengkap)
import { apiClient } from "@/shared/lib/axiosClient";

/**
 * aspirasiService — akses API Aspirasi (Pimpinan → Wilayah).
 * Pengganti total pengaduanService.js lama (publik/anonim, kode unik).
 */
export const aspirasiService = {
  // ── Sisi Pimpinan ──────────────────────────────────────────────────────
  submit: (formData) =>
    apiClient
      .post("/aspirasi/", formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then((r) => r.data),

  getList: (params) =>
    apiClient.get("/aspirasi/", { params }).then((r) => r.data),

  getById: (id) =>
    apiClient.get(`/aspirasi/${id}/`).then((r) => r.data),

  // ── Sisi Wilayah/Admin ─────────────────────────────────────────────────
  getAdminList: (params) =>
    apiClient.get("/admin/aspirasi/", { params }).then((r) => r.data),

  getAdminDetail: (id) =>
    apiClient.get(`/admin/aspirasi/${id}/`).then((r) => r.data),

  updateStatus: (id, status) =>
    apiClient.patch(`/admin/aspirasi/${id}/status/`, { status }).then((r) => r.data),

  balas: (id, balasan) =>
    apiClient.post(`/admin/aspirasi/${id}/balas/`, { balasan }).then((r) => r.data),
};
