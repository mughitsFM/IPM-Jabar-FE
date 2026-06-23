import { apiClient } from "@/shared/lib/axiosClient";

/**
 * beritaService — satu-satunya pintu komunikasi ke Django API untuk modul berita.
 * Komponen & hook TIDAK boleh import apiClient langsung.
 */
export const beritaService = {
  /** Daftar berita terpublikasi (publik) */
  getList: (params) =>
    apiClient.get("/berita", { params }).then((r) => r.data),

  /** Detail berita berdasarkan slug (publik) */
  getBySlug: (slug) =>
    apiClient.get(`/berita/${slug}`).then((r) => r.data),

  /** Buat berita baru (admin) */
  create: (payload) =>
    apiClient.post("/admin/berita", payload).then((r) => r.data),

  /** Update berita (admin) */
  update: (id, payload) =>
    apiClient.put(`/admin/berita/${id}`, payload).then((r) => r.data),

  /** Hapus berita (admin) */
  remove: (id) =>
    apiClient.delete(`/admin/berita/${id}`),

  /**
   * Upload thumbnail (admin) — kirim sebagai FormData.
   * Django mengembalikan { thumbnail_url } setelah upload ke Firebase Storage.
   */
  uploadThumbnail: (file) => {
    const fd = new FormData();
    fd.append("file", file);
    return apiClient
      .post("/admin/berita/upload-thumbnail", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },
};
