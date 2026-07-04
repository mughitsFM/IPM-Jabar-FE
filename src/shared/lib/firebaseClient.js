import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";

/**
 * Konfigurasi Firebase — nilai diambil dari environment variables Vite.
 * Vite otomatis memuat .env.development saat `npm run dev`
 * dan .env.production saat `npm run build`.
 */
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

// Inisialisasi Firebase App (satu instance untuk seluruh aplikasi)
const firebaseApp = initializeApp(firebaseConfig);

// Export Firebase Auth instance
export const auth = getAuth(firebaseApp);

// ── Firebase Auth Emulator (development) ───────────────────────────────────
// Diaktifkan lewat VITE_USE_FIREBASE_EMULATOR=true di .env.development.
// WAJIB dipanggil sebelum signIn/signOut pertama kali dipakai di aplikasi,
// makanya diletakkan di sini (module ini di-import paling awal oleh
// firebaseAuthService & axiosClient).
if (import.meta.env.VITE_USE_FIREBASE_EMULATOR === "true") {
  const host = import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_HOST || "127.0.0.1:9099";
  connectAuthEmulator(auth, `http://${host}`, { disableWarnings: true });
  // eslint-disable-next-line no-console
  console.info(`🔧 Firebase Auth Emulator aktif: http://${host}`);
}

export default firebaseApp;
