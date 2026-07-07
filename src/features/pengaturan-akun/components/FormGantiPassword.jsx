import { useState } from "react";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { auth } from "@/shared/lib/firebaseClient";
import Button from "@/shared/components/ui/Button";

/**
 * FormGantiPassword — ganti password murni via Firebase Client SDK
 * (reauth + updatePassword), identik §3.3 file 03, generik untuk semua role.
 *
 * Props:
 * - onSuccess()
 * - konfirmasiGantiPassword() : optional, best-effort call ke backend (§1.4 file 08)
 */
export default function FormGantiPassword({ onSuccess, konfirmasiGantiPassword }) {
  const [passwordLama, setPasswordLama] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
  const [konfirmasiBaru, setKonfirmasiBaru] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (passwordBaru.length < 8) {
      setError("Password baru minimal 8 karakter.");
      return;
    }
    if (passwordBaru === passwordLama) {
      setError("Password baru tidak boleh sama dengan password lama.");
      return;
    }
    if (passwordBaru !== konfirmasiBaru) {
      setError("Konfirmasi password baru tidak cocok.");
      return;
    }

    setIsSubmitting(true);
    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, passwordLama);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, passwordBaru);

      if (konfirmasiGantiPassword) {
        await konfirmasiGantiPassword();
      }

      setPasswordLama("");
      setPasswordBaru("");
      setKonfirmasiBaru("");
      onSuccess?.();
    } catch (err) {
      setError(mapFirebaseError(err.code));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="form-label" htmlFor="password_lama">Password Saat Ini</label>
        <input id="password_lama" type="password" className="input-field" value={passwordLama} onChange={(e) => setPasswordLama(e.target.value)} required />
      </div>
      <div>
        <label className="form-label" htmlFor="password_baru">Password Baru</label>
        <input id="password_baru" type="password" className="input-field" value={passwordBaru} onChange={(e) => setPasswordBaru(e.target.value)} required minLength={8} />
      </div>
      <div>
        <label className="form-label" htmlFor="konfirmasi_password_baru">Konfirmasi Password Baru</label>
        <input id="konfirmasi_password_baru" type="password" className="input-field" value={konfirmasiBaru} onChange={(e) => setKonfirmasiBaru(e.target.value)} required minLength={8} />
      </div>
      {error && <p className="form-error">{error}</p>}
      <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
        {isSubmitting ? "Menyimpan..." : "Ubah Password"}
      </Button>
    </form>
  );
}

function mapFirebaseError(code) {
  const map = {
    "auth/wrong-password":         "Password saat ini salah.",
    "auth/invalid-credential":     "Password saat ini salah.",
    "auth/weak-password":          "Password baru terlalu lemah (minimal 8 karakter).",
    "auth/requires-recent-login":  "Sesi login Anda sudah lama. Silakan logout lalu login kembali sebelum mengubah password.",
    "auth/too-many-requests":      "Terlalu banyak percobaan. Coba lagi nanti.",
    "auth/network-request-failed": "Tidak ada koneksi internet.",
  };
  return map[code] ?? "Gagal mengubah password. Coba lagi.";
}