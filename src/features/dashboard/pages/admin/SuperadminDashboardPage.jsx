{/* frontend/features/dashboard/pages/admin/SuperadminDashboardPage.jsx (baru, lengkap) */}
import AdminLayout from "@/shared/components/layout/AdminLayout";
import { useDashboardSummarySuperadmin } from "../../hooks/useDashboardSummary";
import { useAuthContext } from "@/app/providers/AuthProvider";
import StatCard from "@/shared/components/ui/StatCard";
import { Link } from "react-router-dom";

export default function SuperadminDashboardPage() {
  const { user } = useAuthContext();

  // Berbeda dari AdminDashboardPage: ini ringkasan TATA KELOLA AKUN
  // (admin & pimpinan), bukan ringkasan konten operasional. Endpoint
  // terpisah: GET /api/admin/dashboard/summary-superadmin/ (file 12 §5.1).
  const { data: summary } = useDashboardSummarySuperadmin();

  const totalAdmin            = summary?.data?.total_admin;
  const totalPimpinanAktif    = summary?.data?.total_pimpinan_aktif;
  const totalPimpinanNonaktif = summary?.data?.total_pimpinan_nonaktif;

  const jam = new Date().getHours();
  const sapaan =
    jam < 11 ? "Selamat pagi" :
    jam < 15 ? "Selamat siang" :
    jam < 18 ? "Selamat sore" :
    "Selamat malam";

  return (
    <AdminLayout title="Dashboard Superadmin">
      <div className="mb-8">
        <h2 className="font-display font-bold text-neutral-900 text-xl sm:text-2xl">
          {sapaan}, {user?.nama?.split(" ")[0] ?? "Superadmin"} 👋
        </h2>
        <p className="text-sm text-neutral-500 mt-1.5">
          Ini ringkasan tata kelola akun Admin dan Pimpinan di seluruh sistem.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        <StatCard
          label="Total Admin" value={totalAdmin} color="blue" linkTo="/admin/pengguna"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
        />
        <StatCard
          label="Pimpinan Aktif" value={totalPimpinanAktif} color="green" linkTo="/admin/manajemen-pimpinan"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
        />
        <StatCard
          label="Pimpinan Nonaktif" value={totalPimpinanNonaktif} color="red" linkTo="/admin/manajemen-pimpinan"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 105.636 5.636a9 9 0 0012.728 12.728zM9.879 9.879l4.242 4.242M9.879 14.121l4.242-4.242" /></svg>}
        />
      </div>

      <div className="mt-6 p-5 bg-gradient-to-br from-neutral-50 to-white border border-neutral-200 rounded-card">
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">Aksi Cepat</p>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/pengguna" className="btn-primary text-sm py-2">+ Tambah Akun Admin</Link>
          <Link to="/admin/manajemen-pimpinan" className="btn-outline text-sm py-2">+ Tambah Akun Pimpinan</Link>
        </div>
      </div>
    </AdminLayout>
  );
}