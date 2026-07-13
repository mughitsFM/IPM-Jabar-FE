{/* frontend/features/dashboard/pages/admin/AdminDashboardPage.jsx (lengkap) */}
import AdminLayout from "@/shared/components/layout/AdminLayout";
import { useBeritaList } from "@/features/berita/hooks/useBeritaList";
import { useAspirasiAdminList } from "@/features/aspirasi/hooks/useAspirasi";
import { useDashboardSummary } from "../../hooks/useDashboardSummary";
import { useAuthContext } from "@/app/providers/AuthProvider";
import Badge from "@/shared/components/ui/Badge";
import { formatShort } from "@/shared/utils/formatDate";
import StatCard from "@/shared/components/ui/StatCard";
import {
  STATUS_BERITA_LABELS, STATUS_BERITA_COLORS,
  STATUS_ASPIRASI_LABELS, STATUS_ASPIRASI_COLORS,
} from "@/shared/constants/statusEnum";
import { Link } from "react-router-dom";

export default function AdminDashboardPage() {
  const { user } = useAuthContext();

  // Angka ringkasan diambil langsung dari endpoint summary yang sudah ada
  // di BE (GET /api/admin/dashboard/summary/), bukan lagi dihitung manual
  // di FE lewat 4x fetch list terpisah.
  const { data: summary } = useDashboardSummary();

  // Aktivitas terbaru tetap fetch daftar (perlu item-nya, bukan cuma total)
  const { data: beritaTerbaru }   = useBeritaList({ page: 1, limit: 5 });
  const { data: aspirasiTerbaru } = useAspirasiAdminList({ page: 1, limit: 5 });

  const totalBerita    = summary?.data?.total_berita_published;
  const totalProker    = summary?.data?.total_proker_aktif;
  const totalAspirasi  = summary?.data?.total_aspirasi_masuk;

  const jam = new Date().getHours();
  const sapaan =
    jam < 11 ? "Selamat pagi" :
    jam < 15 ? "Selamat siang" :
    jam < 18 ? "Selamat sore" :
    "Selamat malam";

  return (
    <AdminLayout title="Dashboard">
      <div className="mb-8">
        <h2 className="font-display font-bold text-neutral-900 text-xl sm:text-2xl">
          {sapaan}, {user?.nama?.split(" ")[0] ?? "Admin"} 👋
        </h2>
        <p className="text-sm text-neutral-500 mt-1.5">
          Ini ringkasan kondisi website PW IPM Jawa Barat hari ini.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        <StatCard
          label="Total Berita" value={totalBerita} color="green" linkTo="/admin/berita"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>}
        />
        <StatCard
          label="Program Kerja" value={totalProker} color="blue" linkTo="/admin/proker"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
        />
        <StatCard
          label="Aspirasi Masuk" value={totalAspirasi} color="gold" linkTo="/admin/aspirasi"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
        />
        <StatCard
          label="Kepengurusan" value="Aktif" color="green" linkTo="/admin/profil"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-card border border-neutral-200 min-w-0">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
            <h3 className="font-display font-bold text-neutral-900">Berita Terbaru</h3>
            <Link to="/admin/berita" className="group inline-flex items-center gap-1 text-xs text-brand-blue-500 hover:text-brand-blue-600 font-semibold">
              Lihat Semua
              <span className="transition-transform duration-150 group-hover:translate-x-0.5">→</span>
            </Link>
          </div>
          <ul className="divide-y divide-neutral-100">
            {beritaTerbaru?.data?.results?.length === 0 && (
              <li className="px-5 py-10 text-sm text-neutral-400 text-center">Belum ada berita.</li>
            )}
            {beritaTerbaru?.data?.results?.map((b) => (
              <li key={b.id} className="flex items-center gap-3 px-5 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">{b.judul}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">{b.published_at ? formatShort(b.published_at) : "Draft"}</p>
                </div>
                <Badge label={STATUS_BERITA_LABELS[b.status] ?? b.status} colorClass={STATUS_BERITA_COLORS[b.status]} />
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-card border border-neutral-200 min-w-0">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
            <h3 className="font-display font-bold text-neutral-900">Aspirasi Terbaru</h3>
            <Link to="/admin/aspirasi" className="group inline-flex items-center gap-1 text-xs text-brand-blue-500 hover:text-brand-blue-600 font-semibold">
              Lihat Semua
              <span className="transition-transform duration-150 group-hover:translate-x-0.5">→</span>
            </Link>
          </div>
          <ul className="divide-y divide-neutral-100">
            {aspirasiTerbaru?.data?.results?.length === 0 && (
              <li className="px-5 py-10 text-sm text-neutral-400 text-center">Belum ada aspirasi.</li>
            )}
            {aspirasiTerbaru?.data?.results?.map((a) => (
              <li key={a.id} className="flex items-center gap-3 px-5 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">{a.pimpinan_label}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">{a.perihal} · {formatShort(a.created_at)}</p>
                </div>
                <Badge label={STATUS_ASPIRASI_LABELS[a.status] ?? a.status} colorClass={STATUS_ASPIRASI_COLORS[a.status]} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 p-5 bg-gradient-to-br from-neutral-50 to-white border border-neutral-200 rounded-card">
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">Aksi Cepat</p>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/berita" className="btn-primary text-sm py-2">+ Tulis Berita</Link>
          <Link to="/admin/proker" className="btn-outline text-sm py-2">+ Tambah Proker</Link>
          <Link to="/admin/aspirasi" className="btn-outline text-sm py-2">Lihat Aspirasi</Link>
        </div>
      </div>
    </AdminLayout>
  );
}