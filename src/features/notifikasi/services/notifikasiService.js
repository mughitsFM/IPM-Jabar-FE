import { apiClient } from "@/shared/lib/axiosClient";

export const notifikasiService = {
  list: (params) => apiClient.get("/notifikasi/", { params }).then((r) => r.data),
  jumlahBelumDibaca: () => apiClient.get("/notifikasi/jumlah-belum-dibaca/").then((r) => r.data),
  tandaiDibaca: (id) => apiClient.post(`/notifikasi/${id}/baca/`).then((r) => r.data),
  tandaiSemua: () => apiClient.post("/notifikasi/baca-semua/").then((r) => r.data),
};