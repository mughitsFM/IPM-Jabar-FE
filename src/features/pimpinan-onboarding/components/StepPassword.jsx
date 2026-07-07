import { useState } from "react";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";

import { auth } from "@/shared/lib/firebaseClient";

const ERROR_MESSAGES = {
  "auth/wrong-password": "Password lama salah.",
  "auth/weak-password": "Password baru terlalu lemah (minimal 8 karakter).",
  "auth/requires-recent-login":
    "Sesi login sudah lama. Silakan logout dan login kembali, lalu ulangi langkah ini.",
};

export default function StepPassword({ onNext }) {
  const [passwordLama, setPasswordLama] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
  const [konfirmasi, setKonfirmasi] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate() {
    if (passwordBaru.length < 8) return "Password baru minimal 8 karakter.";
    if (passwordBaru === passwordLama) return "Password baru tidak boleh sama dengan password lama.";
    if (passwordBaru !== konfirmasi) return "Konfirmasi password tidak sama.";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, passwordLama);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, passwordBaru);
      onNext();
    } catch (err) {
      setError(ERROR_MESSAGES[err?.code] ?? "Gagal mengganti password. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-2">
        <h2 className="font-display text-lg font-semibold text-neutral-900">Ganti Password</h2>
        <p className="text-sm text-neutral-500">
          Wajib diganti dari password sementara yang dikirim lewat email.
        </p>
      </div>

      <div>
        <label className="form-label" htmlFor="password_lama">
          Password Sementara (dari email)
        </label>
        <input
          id="password_lama"
          type="password"
          className="input-field"
          value={passwordLama}
          onChange={(e) => setPasswordLama(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="form-label" htmlFor="password_baru">
          Password Baru
        </label>
        <input
          id="password_baru"
          type="password"
          className="input-field"
          value={passwordBaru}
          onChange={(e) => setPasswordBaru(e.target.value)}
          required
          minLength={8}
        />
      </div>

      <div>
        <label className="form-label" htmlFor="konfirmasi_password">
          Konfirmasi Password Baru
        </label>
        <input
          id="konfirmasi_password"
          type="password"
          className="input-field"
          value={konfirmasi}
          onChange={(e) => setKonfirmasi(e.target.value)}
          required
          minLength={8}
        />
      </div>

      {error && <p className="form-error">{error}</p>}

      <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
        {isSubmitting ? "Memproses..." : "Ganti Password & Lanjut"}
      </button>
    </form>
  );
}
