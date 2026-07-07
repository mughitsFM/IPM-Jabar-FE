import { apiClient } from "@/shared/lib/axiosClient";

export const onboardingService = {
  updateProfil: (formData) =>
    apiClient.patch("/pimpinan/profil/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  mintaKodeUbahEmail: (emailBaru) =>
    apiClient.post("/pimpinan/akun/email/minta-kode/", { email_baru: emailBaru }),
  konfirmasiKodeUbahEmail: (kode) =>
    apiClient.post("/pimpinan/akun/email/konfirmasi-kode/", { kode }),
  selesaikanOnboarding: () => apiClient.post("/pimpinan/onboarding/selesai/"),
};
