import { apiClient } from "@/shared/lib/axiosClient";

export const desainAdminService = {
  getAll: () => apiClient.get("/admin/desain/").then((r) => r.data),

  updateGlobal: (payload) =>
    apiClient.put("/admin/desain/global/", payload).then((r) => r.data),

  updateSection: (section, payload) =>
    apiClient.put(`/admin/desain/${section}/`, payload).then((r) => r.data),

  uploadGambar: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient
      .post("/admin/desain/upload-gambar/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },

  // ── Riwayat / Rollback ──────────────────────────────────────────────────
  getRiwayat: (scope) =>
    apiClient.get("/admin/desain/riwayat/", { params: scope ? { scope } : {} }).then((r) => r.data),

  rollback: (riwayatId) =>
    apiClient.post(`/admin/desain/riwayat/${riwayatId}/rollback/`).then((r) => r.data),
};
