import { useState } from "react";

/**
 * [PERUBAHAN] Sebelumnya step ini pakai alur OTP (mintaKodeUbahEmail /
 * konfirmasiKodeUbahEmail) yang mengirim kode ke EMAIL BARU untuk verifikasi
 * kepemilikan. Itu cocok untuk ganti email di "Pengaturan Akun" SETELAH
 * onboarding (email lama sudah asli & terpakai) — tapi tidak cocok di sini:
 * email saat ini masih placeholder hasil generate admin
 * (mis. pimpinan-xxxx@akun.ipmjabar.or.id), dan email pengganti biasanya
 * justru yang BELUM diverifikasi kepemilikannya lewat kode OTP apa pun,
 * karena tidak ada mekanisme kirim OTP di titik ini.
 *
 * Sesuai kontrak backend (PimpinanOnboardingLengkapiProfilView /
 * OnboardingLengkapiProfilSerializer), email di sini dikirim LANGSUNG tanpa
 * OTP, digabung SEKALIGUS dengan nama/level/nama_wilayah (dari
 * StepIdentitasPimpinan) dan password baru (dari StepPassword) dalam SATU
 * PATCH — lihat onSubmit yang dipanggil dari OnboardingPage.
 *
 * "Gunakan Email Saat Ini" BUKAN tombol lewati langkah — submit gabungan
 * tetap wajib terjadi (supaya level/nama_wilayah/password ikut tersimpan),
 * hanya saja email yang dikirim adalah email yang sedang aktif (tidak diubah).
 */
export default function StepEmail({ currentEmail, onSubmit, isSubmitting, error }) {
  const [emailBaru, setEmailBaru] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(emailBaru.trim() || null);
  }

  function handleGunakanEmailSaatIni() {
    onSubmit(null);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-2">
        <h2 className="font-display text-lg font-semibold text-neutral-900">Perbarui Email</h2>
        <p className="text-sm text-neutral-500">
          Email saat ini: <span className="font-medium text-neutral-700">{currentEmail}</span>.
          Boleh diganti sekarang atau tetap dipakai — bisa diubah lagi nanti lewat Pengaturan Akun.
        </p>
      </div>

      <div>
        <label className="form-label" htmlFor="email_baru">
          Email Baru (opsional)
        </label>
        <input
          id="email_baru"
          type="email"
          className="input-field"
          value={emailBaru}
          onChange={(e) => setEmailBaru(e.target.value)}
          placeholder={currentEmail}
        />
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={handleGunakanEmailSaatIni}
          className="btn-outline flex-1"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Menyimpan..." : "Gunakan Email Saat Ini"}
        </button>
        <button type="submit" className="btn-primary flex-1" disabled={isSubmitting}>
          {isSubmitting ? "Menyimpan..." : "Simpan & Lanjut"}
        </button>
      </div>
    </form>
  );
}