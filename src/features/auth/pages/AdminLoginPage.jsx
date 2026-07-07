import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { useAuthContext } from "@/app/providers/AuthProvider";

export default function AdminLoginPage() {
  const { user, loading } = useAuthContext();
  const navigate = useNavigate();

  // Jika sudah login, langsung redirect ke dashboard
  useEffect(() => {
    if (!loading && user) navigate("/admin/dashboard", { replace: true });
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center px-4 py-12">
      {/* Card login */}
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 rounded-full bg-brand-green-500 flex items-center justify-center text-white font-display font-bold text-xl mb-4">
            IPM
          </div>
          <h1 className="font-display font-bold text-neutral-900 text-2xl">Panel Admin</h1>
          <p className="text-sm text-neutral-600 mt-1">PW IPM Jawa Barat</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-card shadow-sm border border-neutral-200 p-6">
          <LoginForm redirectTo="/admin/dashboard" />
        </div>

        {/* Kembali ke publik */}
        <p className="text-center text-sm text-neutral-500 mt-6">
          <a href="/" className="text-brand-green-500 hover:text-brand-green-600 font-semibold">
            ← Kembali ke halaman utama
          </a>
        </p>
      </div>
    </div>
  );
}