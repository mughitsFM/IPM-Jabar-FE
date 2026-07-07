// frontend/features/surat-menyurat/services/suratService.js (lengkap)
import { apiClient } from "@/shared/lib/axiosClient";

/**
 * suratService — akses API Surat-Menyurat. SATU service dipakai kedua sisi
 * (Pimpinan & Admin/Superadmin) karena backend juga satu urls.py per
 * 06-surat-menyurat.md §2 — role-aware di server, bukan di endpoint path.
 */
export const suratService = {
  getDirektori: () =>
    apiClient.get("/surat/direktori/").then((r) => r.data),

  getMasuk: (params) =>
    apiClient.get("/surat/masuk/", { params }).then((r) => r.data),

  getKeluar: (params) =>
    apiClient.get("/surat/keluar/", { params }).then((r) => r.data),

  getDetail: (id) =>
    apiClient.get(`/surat/${id}/`).then((r) => r.data),

  tandaiDibaca: (id) =>
    apiClient.post(`/surat/${id}/baca/`).then((r) => r.data),

  kirim: (payload) => {
    const fd = new FormData();
    fd.append("nomor_surat", payload.nomor_surat);
    fd.append("perihal", payload.perihal);
    if (payload.isi_ringkas) fd.append("isi_ringkas", payload.isi_ringkas);
    fd.append("tipe_penerima", payload.tipe_penerima);
    if (payload.penerima_uid) fd.append("penerima_uid", payload.penerima_uid);
    if (payload.balasan_dari_surat_id) fd.append("balasan_dari_surat_id", payload.balasan_dari_surat_id);
    fd.append("lampiran", payload.lampiranFile);

    return apiClient
      .post("/surat/", fd, { headers: { "Content-Type": "multipart/form-data" } })
      .then((r) => r.data);
  },
};
