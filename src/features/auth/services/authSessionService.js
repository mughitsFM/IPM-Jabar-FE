import { apiClient } from "@/shared/lib/axiosClient";

/**
 * authSessionService — dipanggil AuthProvider tepat setelah Firebase
 * mengonfirmasi login/refresh token, untuk mengambil data yang tidak ada di
 * custom claims (status_aktif, dan field profil khusus tiap role).
 */
export const authSessionService = {
  /** POST /api/auth/session/ — dipakai role super_admin & editor */
  adminSession: () => apiClient.post("/auth/session/"),

  /** POST /api/pimpinan/session/ — dipakai role pimpinan (lihat 01-model-role-pimpinan.md §8.1) */
  pimpinanSession: () => apiClient.post("/pimpinan/session/"),
};