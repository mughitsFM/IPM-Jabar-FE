// frontend/features/artikel-pimpinan/services/artikelPimpinanService.js (lengkap)
import { apiClient } from "@/shared/lib/axiosClient";

function toFormData(payload) {
  const fd = new FormData();
  if (payload.judul !== undefined) fd.append("judul", payload.judul);
  if (payload.slug !== undefined) fd.append("slug", payload.slug);
  if (payload.konten !== undefined) fd.append("konten", payload.konten);
  if (payload.kategori !== undefined) fd.append("kategori", payload.kategori);
  if (payload.thumbnailFile) fd.append("thumbnail", payload.thumbnailFile);
  return fd;
}

/**
 * artikelPimpinanService — akses API alur Ajukan → Review Wilayah → Publish.
 */
export const artikelPimpinanService = {
  // ── Sisi Pimpinan ──────────────────────────────────────────────────────
  getList: (params) =>
    apiClient.get("/artikel-pimpinan/", { params }).then((r) => r.data),

  getById: (id) =>
    apiClient.get(`/artikel-pimpinan/${id}/`).then((r) => r.data),

  create: (payload) =>
    apiClient
      .post("/artikel-pimpinan/", toFormData(payload), {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data),

  update: (id, payload) =>
    apiClient
      .put(`/artikel-pimpinan/${id}/`, toFormData(payload), {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data),

  remove: (id) =>
    apiClient.delete(`/artikel-pimpinan/${id}/`).then((r) => r.data),

  ajukan: (id) =>
    apiClient.post(`/artikel-pimpinan/${id}/ajukan/`).then((r) => r.data),

  tarik: (id) =>
    apiClient.post(`/artikel-pimpinan/${id}/tarik/`).then((r) => r.data),

  // ── Sisi Wilayah/Admin ─────────────────────────────────────────────────
  getAdminList: (params) =>
    apiClient.get("/admin/artikel-pimpinan/", { params }).then((r) => r.data),

  getAdminDetail: (id) =>
    apiClient.get(`/admin/artikel-pimpinan/${id}/`).then((r) => r.data),

  setujui: (id) =>
    apiClient.post(`/admin/artikel-pimpinan/${id}/setujui/`).then((r) => r.data),

  revisi: (id, catatan) =>
    apiClient.post(`/admin/artikel-pimpinan/${id}/revisi/`, { catatan }).then((r) => r.data),

  tolak: (id, catatan) =>
    apiClient.post(`/admin/artikel-pimpinan/${id}/tolak/`, { catatan }).then((r) => r.data),
};
