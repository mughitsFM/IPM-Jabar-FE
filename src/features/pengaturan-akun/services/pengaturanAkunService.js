import { apiClient } from "@/shared/lib/axiosClient";

function buatService(prefix) {  // prefix: "pimpinan" | "admin"
  const profilPath = prefix === "pimpinan" ? "/pimpinan/profil/" : "/auth/profil/";
  return {
    getProfil:   ()   => apiClient.get(profilPath),
    updateProfil:(fd) => apiClient.patch(profilPath, fd, { headers: { "Content-Type": "multipart/form-data" } }),
    mintaKodeEmail:      (emailBaru) => apiClient.post(`/${prefix}/akun/email/minta-kode/`, { email_baru: emailBaru }),
    konfirmasiKodeEmail: (kode)      => apiClient.post(`/${prefix}/akun/email/konfirmasi-kode/`, { kode }),
    konfirmasiGantiPassword: () => apiClient.post(`/${prefix}/akun/password/konfirmasi/`).catch(() => {}), // best-effort
  };
}

export const pengaturanAkunServicePimpinan = buatService("pimpinan");
export const pengaturanAkunServiceAdmin    = buatService("admin");