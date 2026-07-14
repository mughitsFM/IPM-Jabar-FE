import { apiClient } from "@/shared/lib/axiosClient";

export const notifikasiService = {
  list: (params) => apiClient.get("/notifikasi/", { params }).then((r) => r.data),
  jumlahBelumDibaca: () => apiClient.get("/notifikasi/jumlah-belum-dibaca/").then((r) => r.data),
  tandaiDibaca: (id) => apiClient.post(`/notifikasi/${id}/baca/`).then((r) => r.data),
  tandaiSemua: () => apiClient.post("/notifikasi/baca-semua/").then((r) => r.data),
  // items: [{ tipe: "surat_masuk", entity_id: "..." }, ...] — dipanggil saat
  // user membuka entitas terkait langsung (modal/detail/list), TANPA lewat
  // dropdown notifikasi. Lihat notifikasi/views.py::NotifikasiTandaiEntitasView.
  tandaiEntitas: (items) =>
    apiClient.post("/notifikasi/tandai-entitas/", { items }).then((r) => r.data),
};