import { apiClient } from "@/shared/lib/axiosClient";

function toFormData(payload) {
  const fd = new FormData();
  const { thumbnailFile, ...fields } = payload;

  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
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
};