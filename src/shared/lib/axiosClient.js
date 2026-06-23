import axios from "axios";
import { auth } from "./firebaseClient";

/**
 * axiosClient (apiClient) — instance axios tunggal yang dipakai SEMUA service.
 *
 * Interceptor request: menyisipkan Firebase ID Token ke header Authorization
 * secara otomatis sebelum setiap request dikirim.
 *
 * Interceptor response: jika server mengembalikan 401, logout otomatis
 * (token kedaluwarsa / dicabut).
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15_000, // 15 detik timeout
  headers: {
    "Content-Type": "application/json",
    Accept:         "application/json",
  },
});

// ── Request Interceptor ────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  async (config) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      // getIdToken(false) = pakai token cache, refresh otomatis jika kedaluwarsa
      const token = await currentUser.getIdToken(false);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ───────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token invalid / expired: logout paksa
      await auth.signOut();
    }
    return Promise.reject(error);
  }
);
