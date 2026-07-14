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
  const [lihatLama, setLihatLama] = useState(false);
  const [lihatBaru, setLihatBaru] = useState(false);
  const [lihatKonfirmasi, setLihatKonfirmasi] = useState(false);

  const syaratPanjang = passwordBaru.length >= 8;
  const syaratBeda = passwordBaru.length > 0 && passwordBaru !== passwordLama;
  const syaratCocok = konfirmasiBaru.length > 0 && passwordBaru === konfirmasiBaru;

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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="form-label" htmlFor="password_lama">Password Saat Ini</label>
        <PasswordInput
          id="password_lama"
          value={passwordLama}
          onChange={setPasswordLama}
          visible={lihatLama}
          onToggleVisible={() => setLihatLama((v) => !v)}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="form-label" htmlFor="password_baru">Password Baru</label>
          <PasswordInput
            id="password_baru"
            value={passwordBaru}
            onChange={setPasswordBaru}
            visible={lihatBaru}
            onToggleVisible={() => setLihatBaru((v) => !v)}
            required
            minLength={8}
          />
        </div>
        <div>
          <label className="form-label" htmlFor="konfirmasi_password_baru">Konfirmasi Password Baru</label>
          <PasswordInput
            id="konfirmasi_password_baru"
            value={konfirmasiBaru}
            onChange={setKonfirmasiBaru}
            visible={lihatKonfirmasi}
            onToggleVisible={() => setLihatKonfirmasi((v) => !v)}
            required
            minLength={8}
          />
        </div>
      </div>

      {passwordBaru.length > 0 && (
        <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
          <SyaratItem terpenuhi={syaratPanjang} label="Minimal 8 karakter" />
          <SyaratItem terpenuhi={syaratBeda} label="Berbeda dari password lama" />
          <SyaratItem terpenuhi={syaratCocok} label="Konfirmasi cocok" />
        </ul>
      )}

      {error && <p className="form-error">{error}</p>}

      <Button type="submit" loading={isSubmitting} disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? "Menyimpan..." : "Ubah Password"}
      </Button>
    </form>
  );
}

function PasswordInput({ id, value, onChange, visible, onToggleVisible, required, minLength }) {
  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        className="input-field pr-10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        minLength={minLength}
        autoComplete="off"
      />
      <button
        type="button"
        onClick={onToggleVisible}
        tabIndex={-1}
        className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-neutral-400 hover:text-neutral-600 transition-colors"
        aria-label={visible ? "Sembunyikan password" : "Tampilkan password"}
      >
        {visible ? <IconEyeOff className="h-4 w-4" /> : <IconEye className="h-4 w-4" />}
      </button>
    </div>
  );
}

function SyaratItem({ terpenuhi, label }) {
  return (
    <li className={`flex items-center gap-1.5 transition-colors ${terpenuhi ? "text-brand-green-600" : "text-neutral-400"}`}>
      {terpenuhi ? <IconCheck className="h-3.5 w-3.5" /> : <IconDot className="h-3.5 w-3.5" />}
      {label}
    </li>
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

function IconEye({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconEyeOff({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 3l18 18" />
      <path d="M10.6 5.2A9.6 9.6 0 0 1 12 5c6 0 9.5 7 9.5 7a15.6 15.6 0 0 1-3.4 4.3M6.7 6.7C4 8.5 2.5 12 2.5 12a13.4 13.4 0 0 0 4.4 4.9A9.7 9.7 0 0 0 12 19c1 0 1.9-.1 2.8-.4" />
      <path d="M9.5 9.8a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}

function IconCheck({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function IconDot({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <circle cx="12" cy="12" r="3.5" />
    </svg>
  );
}