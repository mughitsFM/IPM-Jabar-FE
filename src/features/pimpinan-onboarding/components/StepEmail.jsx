import { useState } from "react";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

import { useAuthContext } from "@/app/providers/AuthProvider";
import { auth } from "@/shared/lib/firebaseClient";

import { onboardingService } from "../services/onboardingService";

export default function StepEmail({ onNext, onSkip }) {
  const { refreshSession } = useAuthContext();
  const [subState, setSubState] = useState("belum_minta_kode"); // | "menunggu_konfirmasi"
  const [emailBaru, setEmailBaru] = useState("");
  const [passwordSaatIni, setPasswordSaatIni] = useState("");
  const [kode, setKode] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleMintaKode(e) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, passwordSaatIni);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await onboardingService.mintaKodeUbahEmail(emailBaru);
      setSubState("menunggu_konfirmasi");
    } catch (err) {
      if (err?.code === "auth/wrong-password") {
        setError("Password saat ini salah.");
      } else {
        setError(err?.response?.data?.message ?? "Gagal mengirim kode verifikasi. Coba lagi.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleKonfirmasi(e) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await onboardingService.konfirmasiKodeUbahEmail(kode);
      await refreshSession();
      onNext();
    } catch (err) {
      setError(err?.response?.data?.message ?? "Kode verifikasi tidak valid.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-2">
        <h2 className="font-display text-lg font-semibold text-neutral-900">Perbarui Email</h2>
        <p className="text-sm text-neutral-500">Opsional — boleh dilakukan nanti lewat Pengaturan Akun.</p>
      </div>

      {subState === "belum_minta_kode" && (
        <form onSubmit={handleMintaKode} className="space-y-4">
          <div>
            <label className="form-label" htmlFor="email_baru">
              Email Baru
            </label>
            <input
              id="email_baru"
              type="email"
              className="input-field"
              value={emailBaru}
              onChange={(e) => setEmailBaru(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="form-label" htmlFor="password_saat_ini">
              Password Saat Ini
            </label>
            <input
              id="password_saat_ini"
              type="password"
              className="input-field"
              value={passwordSaatIni}
              onChange={(e) => setPasswordSaatIni(e.target.value)}
              required
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onSkip} className="btn-outline flex-1" disabled={isSubmitting}>
              Lewati
            </button>
            <button type="submit" className="btn-primary flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Mengirim..." : "Kirim Kode"}
            </button>
          </div>
        </form>
      )}

      {subState === "menunggu_konfirmasi" && (
        <form onSubmit={handleKonfirmasi} className="space-y-4">
          <p className="text-sm text-neutral-600">
            Kode dikirim ke email baru Anda, bukan email lama — ini untuk memastikan Anda benar-benar
            memiliki akses ke email tersebut.
          </p>
          <div>
            <label className="form-label" htmlFor="kode_otp">
              Kode Verifikasi
            </label>
            <input
              id="kode_otp"
              inputMode="numeric"
              maxLength={6}
              className="input-field tracking-widest text-center"
              value={kode}
              onChange={(e) => setKode(e.target.value)}
              required
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onSkip} className="btn-outline flex-1" disabled={isSubmitting}>
              Lewati
            </button>
            <button type="submit" className="btn-primary flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Memverifikasi..." : "Konfirmasi"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
