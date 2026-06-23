import { createContext, useContext, useEffect, useState } from "react";
import { firebaseAuthService } from "@/features/auth/services/firebaseAuthService";

const AuthContext = createContext(null);

/**
 * AuthProvider — membungkus seluruh aplikasi dengan context autentikasi.
 * State `user` berisi: { uid, email, role }
 * State `loading` = true saat pertama kali memeriksa status login Firebase.
 */
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onIdTokenChanged terpanggil saat:
    // 1. Pertama kali load (init)
    // 2. Login / logout
    // 3. Token Firebase di-refresh otomatis (setiap ~1 jam)
    const unsubscribe = firebaseAuthService.subscribe(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const tokenResult = await firebaseUser.getIdTokenResult();
          setUser({
            uid:   firebaseUser.uid,
            email: firebaseUser.email,
            nama:  firebaseUser.displayName ?? firebaseUser.email,
            role:  tokenResult.claims.role ?? "editor",
          });
        } catch {
          // Jika gagal baca token (misal revoked), anggap tidak login
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe; // cleanup listener saat unmount
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
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
