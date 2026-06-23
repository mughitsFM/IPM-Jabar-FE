import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { firebaseAuthService } from "../services/firebaseAuthService";

/**
 * useAuth — hook untuk aksi login/logout dari komponen form.
 * State auth global (user, loading) ada di AuthProvider/useAuthContext — bukan di sini.
 */
export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState(null);
  const navigate = useNavigate();

  const login = async ({ email, password }) => {
    setIsLoading(true);
    setError(null);
    try {
      await firebaseAuthService.login(email, password);
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      // Terjemahkan kode error Firebase ke pesan Indonesia
      const msg = mapFirebaseError(err.code);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}

function mapFirebaseError(code) {
  const map = {
    "auth/user-not-found":      "Akun tidak ditemukan.",
    "auth/wrong-password":      "Password salah.",
    "auth/invalid-email":       "Format email tidak valid.",
    "auth/invalid-credential":  "Email atau password salah.",
    "auth/too-many-requests":   "Terlalu banyak percobaan. Coba lagi nanti.",
    "auth/user-disabled":       "Akun ini dinonaktifkan.",
    "auth/network-request-failed": "Tidak ada koneksi internet.",
  };
  return map[code] ?? "Terjadi kesalahan. Silakan coba lagi.";
}
