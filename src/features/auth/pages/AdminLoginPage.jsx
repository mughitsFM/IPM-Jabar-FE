import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import AuthShell from "../components/AuthShell";
import { useDesainGlobal } from "@/shared/hooks/useDesainPublic";
import { useAuthContext } from "@/app/providers/AuthProvider";

export default function AdminLoginPage() {
  const { user, loading } = useAuthContext();
  const navigate = useNavigate();
  const { global } = useDesainGlobal();
  const logoUrl = global?.logo_url;

  // Jika sudah login, langsung redirect ke dashboard
  useEffect(() => {
    if (!loading && user) navigate("/admin/dashboard", { replace: true });
  }, [user, loading, navigate]);

  return (
    <AuthShell
      eyebrow="Panel Admin"
      orgName="PW IPM Jawa Barat"
      logoUrl={logoUrl}
      panelTitle="Kelola satu wilayah, satu kendali penuh."
      panelDescription="Berita, surat-menyurat, program kerja, dan data pimpinan wilayah — semuanya terpusat di satu panel admin."
      formTitle="Masuk ke Panel Admin"
      formSubtitle="Gunakan akun admin wilayah Anda untuk melanjutkan."
      footer={
        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-brand-green-600 font-medium transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Kembali ke halaman utama
        </a>
      }
    >
      <LoginForm redirectTo="/admin/dashboard" />
    </AuthShell>
  );
}
