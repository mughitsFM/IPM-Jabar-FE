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

  if (subState === "menunggu_konfirmasi") {
    return (
      <form onSubmit={handleKonfirmasi} className="space-y-4">
        <p className="text-sm text-neutral-600">
          Kode dikirim ke email baru Anda ({emailBaru}), bukan email lama — ini untuk memastikan
          Anda benar-benar memiliki akses ke email tersebut.
        </p>
        <div>
          <label className="form-label" htmlFor="kode_otp">Kode Verifikasi</label>
          <input id="kode_otp" className="input-field" value={kode} onChange={(e) => setKode(e.target.value)} maxLength={6} required />
        </div>
        {error && <p className="form-error">{error}</p>}
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={handleBatal} disabled={isSubmitting}>Batal</Button>
          <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
            {isSubmitting ? "Memverifikasi..." : "Konfirmasi"}
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleMintaKode} className="space-y-4">
      <p className="text-sm text-neutral-500">
        Email saat ini: <span className="font-medium text-neutral-800">{currentEmail}</span>
      </p>
      <div>
        <label className="form-label" htmlFor="email_baru">Email Baru</label>
        <input id="email_baru" type="email" className="input-field" value={emailBaru} onChange={(e) => setEmailBaru(e.target.value)} required />
      </div>
      <div>
        <label className="form-label" htmlFor="password_saat_ini">Password Saat Ini</label>
        <input id="password_saat_ini" type="password" className="input-field" value={passwordSaatIni} onChange={(e) => setPasswordSaatIni(e.target.value)} required />
      </div>
      {error && <p className="form-error">{error}</p>}
      <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
        {isSubmitting ? "Mengirim..." : "Kirim Kode Verifikasi"}
      </Button>
    </form>
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