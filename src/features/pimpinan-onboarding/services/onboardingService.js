import { apiClient } from "@/shared/lib/axiosClient";

// [ASUMSI] File ini tidak diupload sebelumnya sehingga direkonstruksi dari
// pola pemakaian di StepProfil.jsx (updateProfil) dan StepEmail.jsx versi
// lama (mintaKodeUbahEmail/konfirmasiKodeUbahEmail) + kontrak endpoint di
// self_urls.py & serializers.py. Method-method lama SENGAJA dipertahankan
// (dianggap masih dipakai fitur "Ubah Email" di Pengaturan Akun pasca-
// onboarding) — kalau file asli Anda berbeda, mohon bagikan supaya bisa
// digabung dengan tepat, jangan sampai method lain ikut hilang.
export const onboardingService = {
  // PATCH /api/pimpinan/profil/ — self-service, dipakai StepProfil (no_hp/foto)
  // dan juga halaman Pengaturan Akun pasca-onboarding.
  updateProfil: (formData) =>
    apiClient
      .patch("/pimpinan/profil/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data),

  // PATCH /api/pimpinan/onboarding/lengkapi-profil/ — SEKALI seumur akun,
  // dipanggil dari StepEmail (lewat OnboardingPage) berisi
  // nama+level+nama_wilayah+email+password sekaligus. Lihat
  // PimpinanOnboardingLengkapiProfilView & OnboardingLengkapiProfilSerializer.
  lengkapiProfil: (payload) =>
    apiClient.patch("/pimpinan/onboarding/lengkapi-profil/", payload).then((r) => r.data),

  // POST /api/pimpinan/onboarding/selesai/ — dipanggil dari useOnboarding
  // hook (StepTur), ditinggalkan seperti semula, disertakan di sini untuk
  // kelengkapan referensi saja (hook mungkin memanggilnya langsung).
  selesaikanOnboarding: () => apiClient.post("/pimpinan/onboarding/selesai/").then((r) => r.data),

  // Dipertahankan untuk fitur "Ubah Email" di Pengaturan Akun (PASCA
  // onboarding, ketika email sudah asli & OTP bisa benar-benar diterima) —
  // TIDAK lagi dipakai oleh StepEmail versi onboarding baru.
  mintaKodeUbahEmail: (emailBaru) =>
    apiClient.post("/keamanan-akun/email/minta-kode/", { email_baru: emailBaru }).then((r) => r.data),

  konfirmasiKodeUbahEmail: (kode) =>
    apiClient.post("/keamanan-akun/email/konfirmasi/", { kode }).then((r) => r.data),
};