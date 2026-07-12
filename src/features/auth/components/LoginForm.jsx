import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Button from "@/shared/components/ui/Button";

/**
 * LoginForm — dipakai ulang apa adanya oleh AdminLoginPage & PimpinanLoginPage.
 * Kontrak props & hook TIDAK berubah dari versi sebelumnya — hanya tampilan.
 *
 * @param {string} [redirectTo]        - diteruskan ke useAuth(), lihat hook untuk default.
 * @param {string} [emailPlaceholder]  - placeholder input email; PimpinanLoginPage memakai
 *                                        teks keterangan ("gunakan email yang didaftarkan admin wilayah")
 *                                        alih-alih contoh alamat email.
 */
export default function LoginForm({ redirectTo, emailPlaceholder = "admin@ipmjabar.or.id" }) {
  const { login, isLoading, error } = useAuth({ redirectTo });
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);

  // Beberapa pemanggil (mis. PimpinanLoginPage) mengirim teks instruksi, bukan
  // contoh alamat email — teks seperti itu kepanjangan untuk ditaruh di dalam
  // placeholder (jadi kepotong). Kalau bukan format email, tampilkan sebagai
  // keterangan kecil di bawah label, dan pakai placeholder contoh yang singkat.
  const looksLikeEmail = /^\S+@\S+$/.test(emailPlaceholder);
  const emailHint = looksLikeEmail ? null : emailPlaceholder;
  const emailInputPlaceholder = looksLikeEmail ? emailPlaceholder : "nama@email.com";

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    login(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Error */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 px-4 py-3 bg-red-50 border border-state-error/25 rounded-lg text-sm text-state-error animate-fade-in-down"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 mt-0.5" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Email */}
      <div>
        <label htmlFor="email" className="form-label">Email</label>
        {emailHint && (
          <p className="text-xs text-neutral-500 -mt-1 mb-2">{emailHint}</p>
        )}
        <div className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0-.414.336-.75.75-.75h18c.414 0 .75.336.75.75v10.5a.75.75 0 01-.75.75H3a.75.75 0 01-.75-.75V6.75z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.5l9.117 6.211a1.5 1.5 0 001.666 0L22.5 7.5" />
            </svg>
          </span>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder={emailInputPlaceholder}
            className="input-field pl-11"
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="password" className="form-label mb-0">Password</label>
        </div>
        <div className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </span>
          <input
            id="password"
            name="password"
            type={showPass ? "text" : "password"}
            autoComplete="current-password"
            required
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="input-field pl-11 pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPass((p) => !p)}
            aria-label={showPass ? "Sembunyikan password" : "Tampilkan password"}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            {showPass ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Submit */}
      <Button type="submit" loading={isLoading} className="w-full justify-center mt-2">
        Masuk
      </Button>
    </form>
  );
}
