import { apiClient } from "@/shared/lib/axiosClient";

function toFormData(payload) {
  const fd = new FormData();
  const { thumbnailFile, ...fields } = payload;

  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
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

export const beritaService = {
  getList: (params) =>
    apiClient.get("/berita/", { params }).then((r) => r.data),

  // BARU — dipakai AdminBeritaPage.jsx (bukan getList di atas). Endpoint
  // ini mengembalikan SEMUA status (draft/terjadwal/dipublikasikan) dan
  // field LENGKAP termasuk 'konten', beda dari getList() yang hanya untuk
  // publik (status dipublikasikan saja, tanpa 'konten'). Lihat catatan bug
  // di useBeritaList.js untuk kronologinya.
  getAdminList: (params) =>
    apiClient.get("/admin/berita/", { params }).then((r) => r.data),

  getBySlug: (slug) =>
    apiClient.get(`/berita/${slug}/`).then((r) => r.data),

  create: (payload) =>
    apiClient
      .post("/admin/berita/", toFormData(payload), {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data),

  update: (id, payload) =>
    apiClient
      .put(`/admin/berita/${id}/`, toFormData(payload), {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data),

  remove: (id) =>
    apiClient.delete(`/admin/berita/${id}/`),

  uploadContentImage: (file) => {
    const fd = new FormData();
    fd.append("image", file);
    return apiClient
      .post("/admin/berita/upload-gambar/", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },

  searchAdmin: ({ q, ids, excludeId } = {}) => {
    const params = {};
    if (q) params.q = q;
    if (ids?.length) params.ids = ids.join(",");
    if (excludeId) params.exclude_id = excludeId;
    return apiClient.get("/admin/berita/cari/", { params }).then((r) => r.data);
  },

  checkSlug: (slug, excludeId) =>
    apiClient
      .get("/admin/berita/cek-slug/", { params: { slug, exclude_id: excludeId || undefined } })
      .then((r) => r.data),
};