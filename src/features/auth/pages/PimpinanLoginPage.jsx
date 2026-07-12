import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import AuthShell from "../components/AuthShell";
import { useAuthContext } from "@/app/providers/AuthProvider";
import { ROLES } from "@/shared/constants/roles";
import { useDesainGlobal } from "@/shared/hooks/useDesainPublic";

export default function PimpinanLoginPage() {
  const { user, loading, sessionError } = useAuthContext();
  const navigate = useNavigate();
  const { global } = useDesainGlobal();
  const logoUrl = global?.logo_url;

  // Jika sudah login SEBAGAI PIMPINAN, langsung redirect ke dashboard pimpinan.
  // Kalau yang login ternyata akun Wilayah (editor/super_admin), JANGAN
  // dipaksa masuk ke area Pimpinan — biarkan halaman ini menampilkan pesan.
  useEffect(() => {
    if (!loading && user?.role === ROLES.PIMPINAN) {
      navigate("/pimpinan/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  const loggedInAsWrongRole = !loading && user && user.role !== ROLES.PIMPINAN;

  return (
    <AuthShell
      eyebrow="Panel Pimpinan"
      orgName="PW IPM Jawa Barat"
      logoUrl={logoUrl}
      panelTitle="Suarakan cabang dan rantingmu."
      panelDescription="Kirim surat, laporkan program kerja, dan sampaikan aspirasi langsung ke Pimpinan Wilayah — kapan saja, di mana saja."
      formTitle={loggedInAsWrongRole ? "Khusus Akun Pimpinan" : "Masuk ke Panel Pimpinan"}
      formSubtitle={loggedInAsWrongRole ? undefined : "Selamat datang kembali, Pimpinan."}
      footer={
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-brand-green-600 font-medium transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Kembali ke halaman utama
        </Link>
      }
    >
      {/* Pesan sesi gagal, mis. akun baru saja dinonaktifkan admin */}
      {sessionError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 mb-5 px-4 py-3 bg-red-50 border border-state-error/25 rounded-lg text-sm text-state-error animate-fade-in-down"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 mt-0.5" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <span>{sessionError}</span>
        </div>
      )}

      {loggedInAsWrongRole ? (
        <div className="text-center lg:text-left space-y-4 rounded-card border border-neutral-200 bg-neutral-50 px-5 py-6">
          <p className="text-sm text-neutral-600 leading-relaxed">
            Halaman ini khusus untuk akun Pimpinan. Akun yang sedang login saat ini
            bukan akun Pimpinan.
          </p>
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-1.5 text-brand-green-600 hover:text-brand-green-700 font-semibold text-sm"
          >
            Masuk sebagai Admin
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      ) : (
        <LoginForm
          redirectTo="/pimpinan/dashboard"
          emailPlaceholder="gunakan email yang didaftarkan admin wilayah"
        />
      )}
    </AuthShell>
  );
}
