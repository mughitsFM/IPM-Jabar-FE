import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { useAuthContext } from "@/app/providers/AuthProvider";
import { ROLES } from "@/shared/constants/roles";

export default function PimpinanLoginPage() {
  const { user, loading, sessionError } = useAuthContext();
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center px-4 py-12">
      {/* Card login */}
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 rounded-full bg-brand-green-500 flex items-center justify-center text-white font-display font-bold text-xl mb-4">
            IPM
          </div>
          <h1 className="font-display font-bold text-neutral-900 text-2xl">Panel Pimpinan</h1>
          <p className="text-sm text-neutral-600 mt-1">PW IPM Jawa Barat</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-card shadow-sm border border-neutral-200 p-6">
          {/* Pesan sesi gagal, mis. akun baru saja dinonaktifkan admin */}
          {sessionError && (
            <div
              role="alert"
              className="mb-5 px-4 py-3 bg-red-50 border border-state-error/30 rounded-lg text-sm text-state-error"
            >
              {sessionError}
            </div>
          )}

          {loggedInAsWrongRole ? (
            <div className="text-center space-y-3">
              <p className="text-sm text-neutral-600">
                Halaman ini khusus akun Pimpinan. Akun yang sedang login bukan akun Pimpinan.
              </p>
              <Link
                to="/admin/login"
                className="inline-block text-brand-green-500 hover:text-brand-green-600 font-semibold text-sm"
              >
                Masuk sebagai Admin →
              </Link>
            </div>
          ) : (
            <LoginForm
              redirectTo="/pimpinan/dashboard"
              emailPlaceholder="gunakan email yang didaftarkan admin wilayah"
            />
          )}
        </div>

        {/* Kembali ke publik */}
        <p className="text-center text-sm text-neutral-500 mt-6">
          <Link to="/" className="text-brand-green-500 hover:text-brand-green-600 font-semibold">
            ← Kembali ke halaman utama
          </Link>
        </p>
      </div>
    </div>
  );
}