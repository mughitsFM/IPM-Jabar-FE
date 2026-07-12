// frontend/features/artikel-pimpinan/services/artikelPimpinanService.js (lengkap)
import { apiClient } from "@/shared/lib/axiosClient";

function toFormData(payload) {
  const fd = new FormData();
  const { thumbnailFile, ...fields } = payload;

  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      // 'tags' dikirim sebagai string JSON — sama seperti beritaService,
      // diparse balik di backend (_normalize_list_fields di views.py).
      fd.append(key, JSON.stringify(value));
      return;
    }

    if (value !== "") {
      fd.append(key, value);
    }
  });

  if (thumbnailFile) {
    fd.append("thumbnail", thumbnailFile);
  }

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

  uploadContentImage: (file) => {
    const fd = new FormData();
    fd.append("image", file);
    return apiClient
      .post("/artikel-pimpinan/upload-gambar/", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },

  checkSlug: (slug) =>
    apiClient.get("/artikel-pimpinan/cek-slug/", { params: { slug } }).then((r) => r.data),

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