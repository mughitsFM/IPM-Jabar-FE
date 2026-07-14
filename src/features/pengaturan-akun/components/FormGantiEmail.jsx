import { useState } from "react";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { auth } from "@/shared/lib/firebaseClient";
import Button from "@/shared/components/ui/Button";

/**
 * FormGantiEmail — ganti email generik, reuse penuh alur OTP `keamanan_akun`
 * (file 03 §3.4 / file 08 §1.3). Dua sub-state: belum_minta_kode → menunggu_konfirmasi.
 *
 * Props:
 * - currentEmail
 * - mintaKodeFn(emailBaru)
 * - konfirmasiKodeFn(kode)
 * - onSuccess()
 */
export default function FormGantiEmail({ currentEmail, mintaKodeFn, konfirmasiKodeFn, onSuccess }) {
  const [subState, setSubState] = useState("belum_minta_kode");
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
      await mintaKodeFn(emailBaru);
      setSubState("menunggu_konfirmasi");
    } catch (err) {
      setError(mapError(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleKonfirmasi(e) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await konfirmasiKodeFn(kode);
      onSuccess?.();
    } catch (err) {
      setError(err?.response?.data?.message ?? "Gagal mengonfirmasi kode. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleBatal() {
    setSubState("belum_minta_kode");
    setKode("");
    setError(null);
  }

  const langkahAktif = subState === "menunggu_konfirmasi" ? 2 : 1;

  return (
    <div className="space-y-5">
      <ol className="flex items-center gap-2 text-xs font-medium text-neutral-400">
        <StepBadge nomor={1} aktif={langkahAktif === 1} selesai={langkahAktif > 1} label="Email baru" />
        <span className="h-px flex-1 bg-neutral-200" />
        <StepBadge nomor={2} aktif={langkahAktif === 2} selesai={false} label="Verifikasi" />
      </ol>

      {subState === "menunggu_konfirmasi" ? (
        <form onSubmit={handleKonfirmasi} className="space-y-4">
          <p className="text-sm text-neutral-600 rounded-lg bg-neutral-50 border border-neutral-200 px-3 py-2.5">
            Kode dikirim ke email baru Anda (<span className="font-medium text-neutral-800">{emailBaru}</span>),
            bukan email lama — ini untuk memastikan Anda benar-benar memiliki akses ke email tersebut.
          </p>
          <div>
            <label className="form-label" htmlFor="kode_otp">Kode Verifikasi</label>
            <input
              id="kode_otp"
              className="input-field text-center tracking-[0.5em] font-medium"
              value={kode}
              onChange={(e) => setKode(e.target.value)}
              maxLength={6}
              inputMode="numeric"
              required
            />
          </div>
          {error && <p className="form-error">{error}</p>}
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={handleBatal} disabled={isSubmitting} className="flex-1">
              Batal
            </Button>
            <Button type="submit" loading={isSubmitting} disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Memverifikasi..." : "Konfirmasi"}
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleMintaKode} className="space-y-4">
          <p className="text-sm text-neutral-500">
            Email saat ini: <span className="font-medium text-neutral-800">{currentEmail}</span>
          </p>
          <div>
            <label className="form-label" htmlFor="email_baru">Email Baru</label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-400">
                <IconMail className="h-4 w-4" />
              </span>
              <input
                id="email_baru"
                type="email"
                className="input-field pl-9"
                value={emailBaru}
                onChange={(e) => setEmailBaru(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="form-label" htmlFor="password_saat_ini">Password Saat Ini</label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-400">
                <IconLock className="h-4 w-4" />
              </span>
              <input
                id="password_saat_ini"
                type="password"
                className="input-field pl-9"
                value={passwordSaatIni}
                onChange={(e) => setPasswordSaatIni(e.target.value)}
                required
              />
            </div>
          </div>
          {error && <p className="form-error">{error}</p>}
          <Button type="submit" loading={isSubmitting} disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? "Mengirim..." : "Kirim Kode Verifikasi"}
          </Button>
        </form>
      )}
    </div>
  );
}

function StepBadge({ nomor, aktif, selesai, label }) {
  return (
    <li className="flex items-center gap-2">
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] transition-colors ${
          selesai
            ? "bg-brand-green-600 text-white"
            : aktif
            ? "bg-brand-green-50 text-brand-green-700 border border-brand-green-300"
            : "bg-neutral-100 text-neutral-400"
        }`}
      >
        {selesai ? <IconCheck className="h-3 w-3" /> : nomor}
      </span>
      <span className={aktif || selesai ? "text-neutral-700" : ""}>{label}</span>
    </li>
  );
}

function mapError(err) {
  const code = err?.code;
  const map = {
    "auth/wrong-password":     "Password salah.",
    "auth/invalid-credential": "Password salah.",
    "auth/too-many-requests":  "Terlalu banyak percobaan. Coba lagi nanti.",
  };
  if (code && map[code]) return map[code];
  return err?.response?.data?.message ?? "Gagal mengirim kode verifikasi. Coba lagi.";
}

function IconMail({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6 8.5-6" />
    </svg>
  );
}

function IconLock({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="4.5" y="10.5" width="15" height="9.5" rx="2" />
      <path d="M7.5 10.5V7a4.5 4.5 0 0 1 9 0v3.5" />
    </svg>
  );
}

function IconCheck({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}