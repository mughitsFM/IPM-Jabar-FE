import {
  signInWithEmailAndPassword,
  signOut,
  onIdTokenChanged,
} from "firebase/auth";
import { auth } from "@/shared/lib/firebaseClient";

/**
 * firebaseAuthService — satu-satunya lapisan yang berinteraksi dengan Firebase Auth Client SDK.
 * Komponen dan hook tidak boleh import firebase/auth langsung.
 */
export const firebaseAuthService = {
  /**
   * Login dengan email & password.
   * @returns {Promise<UserCredential>}
   */
  login: (email, password) =>
    signInWithEmailAndPassword(auth, email, password),

  /** Logout admin/pimpinan */
  logout: () => signOut(auth),

  /**
   * Subscribe perubahan token/user.
   * Dipanggil di AuthProvider — mengembalikan unsubscribe function.
   * Terpanggil saat: init, login, logout, dan token di-refresh (~1 jam).
   */
  subscribe: (callback) => onIdTokenChanged(auth, callback),

  /**
   * Ambil Firebase user saat ini secara sinkron (bisa null bila belum login).
   * BARU — dipakai AuthProvider.refreshSession() untuk memuat ulang sesi
   * secara manual (mis. setelah update foto/nama profil sendiri) tanpa perlu
   * menunggu event onIdTokenChanged. Lihat 02-login-dan-layout-pimpinan.md §8.
   */
  getCurrentUser: () => auth.currentUser,
};