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

  /** Logout admin */
  logout: () => signOut(auth),

  /**
   * Subscribe perubahan token/user.
   * Dipanggil di AuthProvider — mengembalikan unsubscribe function.
   * Terpanggil saat: init, login, logout, dan token di-refresh (~1 jam).
   */
  subscribe: (callback) => onIdTokenChanged(auth, callback),
};
