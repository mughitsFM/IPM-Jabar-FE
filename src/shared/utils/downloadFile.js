/**
 * downloadFile — util unduh Blob terautentikasi.
 *
 * Dipakai khusus untuk endpoint yang butuh header `Authorization: Bearer
 * <token>` (mis. /api/arsip/surat/unduh-zip/, /rekap-excel/), yang TIDAK bisa
 * diunduh lewat <a href> polos seperti `lampiran_url` (Cloudinary, publicly
 * readable). Response axios untuk endpoint ini harus diminta dengan
 * `{ responseType: "blob" }`.
 */
export function downloadBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}