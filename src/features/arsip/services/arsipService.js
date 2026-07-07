import { apiClient } from "@/shared/lib/axiosClient";
import { downloadBlob } from "@/shared/utils/downloadFile";

/**
 * Karena request memakai `responseType: "blob"`, kalau backend membalas
 * error (mis. 404 "Tidak ada surat pada rentang yang dipilih.") body-nya
 * tetap diterima axios sebagai Blob, bukan JSON ter-parse — harus dibaca
 * manual supaya pesan errornya bisa ditampilkan ke pengguna, bukan cuma
 * "Request failed with status code 404" generik.
 */
async function parseBlobErrorMessage(error, fallback) {
  const blob = error?.response?.data;
  if (blob instanceof Blob) {
    try {
      const text = await blob.text();
      const parsed = JSON.parse(text);
      if (parsed?.message) return parsed.message;
    } catch {
      // bukan JSON valid, pakai fallback di bawah
    }
  }
  return fallback;
}

export const arsipService = {
  unduhZipSurat: async (params) => {
    try {
      const res = await apiClient.get("/arsip/surat/unduh-zip/", { params, responseType: "blob" });
      downloadBlob(res.data, "arsip-surat.zip");
    } catch (error) {
      throw new Error(await parseBlobErrorMessage(error, "Gagal mengunduh arsip ZIP. Coba lagi."));
    }
  },
  unduhRekapExcel: async (params) => {
    try {
      const res = await apiClient.get("/arsip/surat/rekap-excel/", { params, responseType: "blob" });
      downloadBlob(res.data, "rekap-surat.xlsx");
    } catch (error) {
      throw new Error(await parseBlobErrorMessage(error, "Gagal mengunduh rekap Excel. Coba lagi."));
    }
  },
};