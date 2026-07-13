import { useState } from "react";

/**
 * [PERUBAHAN] Sebelumnya step ini langsung memanggil Firebase client SDK
 * (reauthenticateWithCredential + updatePassword). Itu tidak sinkron dengan
 * backend: PimpinanOnboardingLengkapiProfilView mengganti password lewat
 * Admin SDK (firebase_auth.update_user) dalam SATU PATCH bersama
 * nama/level/nama_wilayah/email (lihat services.py::lengkapi_profil_onboarding),
 * dan endpoint itu hanya mengizinkan proses ini sekali seumur akun. Kalau
 * password diganti duluan lewat client SDK, submit gabungan berikutnya bisa
 * gagal/tidak konsisten (mis. password_sementara di Firestore tidak ikut
 * terhapus). Karena itu di sini kita HANYA menyimpan password baru di state
 * (dikirim nanti bersama data lain saat submit gabungan di StepEmail) — tidak
 * ada reauth manual, karena user sudah terautentikasi via token Firebase yang
 * sedang aktif (sama seperti kontrak OnboardingLengkapiProfilSerializer yang
 * tidak meminta password lama).
 */
export default function StepPassword({ onNext }) {
  const [passwordBaru, setPasswordBaru] = useState("");
  const [konfirmasi, setKonfirmasi] = useState("");
  const [error, setError] = useState(null);

  function validate() {
    if (passwordBaru.length < 8) return "Password baru minimal 8 karakter.";
    if (passwordBaru !== konfirmasi) return "Konfirmasi password tidak sama.";
    return null;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    onNext(passwordBaru);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-2">
        <h2 className="font-display text-lg font-semibold text-neutral-900">Ganti Password</h2>
        <p className="text-sm text-neutral-500">
          Wajib diganti dari password sementara yang diberikan Admin.
        </p>
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

      <p className="text-xs text-neutral-400">
        Password baru ini akan disimpan bersama data lain di langkah berikutnya.
      </p>

      <button type="submit" className="btn-primary w-full">
        Lanjut
      </button>
    </form>
  );
}