import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { firebaseAuthService } from "@/features/auth/services/firebaseAuthService";
import { authSessionService } from "@/features/auth/services/authSessionService";

const AuthContext = createContext(null);

/**
 * AuthProvider — membungkus seluruh aplikasi dengan context autentikasi.
 *
 * Setelah token Firebase ter-decode, provider melakukan SATU panggilan
 * tambahan ke backend (endpoint "session") sesuai role, untuk mengambil data
 * yang tidak ada di custom claims (status_aktif, dan khusus pimpinan:
 * nama_wilayah, label_lengkap, foto_profil_url, first_login_done).
 *
 * Bentuk `user` di context:
 * - role "pimpinan":
 *   { uid, email, role: "pimpinan", level, nama, nama_wilayah, label_lengkap,
 *     foto_profil_url, status_aktif, first_login_done }
 * - role "super_admin" | "editor":
 *   { uid, email, role, level: null, ...field dari endpoint /auth/session/ }
 *
 * `sessionError` dikonsumsi halaman login untuk menampilkan pesan seperti
 * "akun dinonaktifkan" ketika panggilan session gagal (403/404).
 *
 * `refreshSession()` dipakai file 03 & 08 setelah mutasi profil MILIK SENDIRI
 * berhasil (mis. ganti foto/nama) supaya data di context langsung sinkron
 * tanpa perlu logout/login ulang.
 */
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionError, setSessionError] = useState(null);

  const loadSession = useCallback(async (firebaseUser) => {
    setSessionError(null);

    if (!firebaseUser) {
      setUser(null);
      return;
    }

    try {
      const tokenResult = await firebaseUser.getIdTokenResult();
      const role  = tokenResult.claims.role ?? null;
      const level = tokenResult.claims.level ?? null;

      const baseUser = { uid: firebaseUser.uid, email: firebaseUser.email, role, level };

      if (role === "pimpinan") {
        const res = await authSessionService.pimpinanSession(); // POST /api/pimpinan/session/
        setUser({ ...baseUser, ...res.data.data }); // nama, nama_wilayah, label_lengkap, foto_profil_url, status_aktif, first_login_done
      } else if (role === "super_admin" || role === "editor") {
        const res = await authSessionService.adminSession();    // POST /api/auth/session/
        setUser({ ...baseUser, ...res.data.data });
      } else {
        setUser(null);
      }
    } catch (err) {
      // 403 (akun dinonaktifkan) atau profil tidak ditemukan → logout paksa
      setSessionError(err?.response?.data?.message ?? "Sesi tidak valid.");
      await firebaseAuthService.logout();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    // onIdTokenChanged terpanggil saat:
    // 1. Pertama kali load (init)
    // 2. Login / logout
    // 3. Token Firebase di-refresh otomatis (setiap ~1 jam)
    const unsubscribe = firebaseAuthService.subscribe(async (firebaseUser) => {
      await loadSession(firebaseUser);
      setLoading(false);
    });

    return unsubscribe; // cleanup listener saat unmount
  }, [loadSession]);

  const refreshSession = useCallback(async () => {
    const currentFirebaseUser = firebaseAuthService.getCurrentUser();
    await loadSession(currentFirebaseUser);
  }, [loadSession]);

  return (
    <AuthContext.Provider value={{ user, loading, sessionError, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Hook untuk mengakses auth context di mana saja */
export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext harus dipakai di dalam AuthProvider");
  return ctx;
};