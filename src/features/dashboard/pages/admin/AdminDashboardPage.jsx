import AdminLayout from "@/shared/components/layout/AdminLayout";
import { useBeritaList } from "@/features/berita/hooks/useBeritaList";
import { usePengaduanList } from "@/features/pengaduan/hooks/usePengaduan";
import { useProkerList } from "@/features/proker/hooks/useProker";
import { useAuthContext } from "@/app/providers/AuthProvider";
import Badge from "@/shared/components/ui/Badge";
import { formatShort } from "@/shared/utils/formatDate";
import {
  STATUS_BERITA_LABELS, STATUS_BERITA_COLORS,
  STATUS_PENGADUAN_LABELS, STATUS_PENGADUAN_COLORS,
  STATUS_PROKER_LABELS, STATUS_PROKER_COLORS,
} from "@/shared/constants/statusEnum";
import { Link } from "react-router-dom";

// Komponen kartu statistik
function StatCard({ label, value, icon, color = "green", linkTo }) {
  const colorMap = {
    green: "bg-brand-green-50 text-brand-green-500",
    blue:  "bg-brand-blue-500/10 text-brand-blue-500",
    gold:  "bg-brand-gold-50 text-brand-gold-600",
    red:   "bg-brand-red-500/10 text-brand-red-500",
  };

  const card = (
    <div className="bg-white rounded-card border border-neutral-200 p-5 flex items-center gap-4 hover:shadow-md transition-shadow duration-200">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colorMap[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-display font-bold text-neutral-900">{value ?? "—"}</p>
        <p className="text-sm text-neutral-500">{label}</p>
      </div>
    </div>
  );

  return linkTo ? <Link to={linkTo}>{card}</Link> : card;
}

export default function AdminDashboardPage() {
  const { user } = useAuthContext();

  // Fetch ringkasan data — cukup 1 item, yang dibutuhkan hanya meta.total_count
  const { data: beritaData }   = useBeritaList({ page: 1, per_page: 1, all_status: true });
  const { data: pengaduanData } = usePengaduanList({ page: 1, per_page: 1 });
  const { data: prokerData }   = useProkerList({ page: 1, per_page: 1 });

  // Fetch ringkasan terbaru untuk aktivitas terakhir
  const { data: beritaTerbaru }     = useBeritaList({ page: 1, per_page: 5, all_status: true });
  const { data: pengaduanTerbaru }  = usePengaduanList({ page: 1, per_page: 5 });

  const totalBerita    = beritaData?.meta?.total_count;
  const totalPengaduan = pengaduanData?.meta?.total_count;
  const totalProker    = prokerData?.meta?.total_count ?? prokerData?.data?.length;

  const jam = new Date().getHours();
  const sapaan =
    jam < 11 ? "Selamat pagi" :
    jam < 15 ? "Selamat siang" :
    jam < 18 ? "Selamat sore" :
    "Selamat malam";

  return (
    <AdminLayout title="Dashboard">
      {/* Sapaan */}
      <div className="mb-8">
        <h2 className="font-display font-bold text-neutral-900 text-xl">
          {sapaan}, {user?.nama?.split(" ")[0] ?? "Admin"} 👋
        </h2>
        <p className="text-sm text-neutral-500 mt-1">
          Ini ringkasan kondisi website PW IPM Jawa Barat hari ini.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        <StatCard
          label="Total Berita"
          value={totalBerita}
          color="green"
          linkTo="/admin/berita"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          }
        />
        <StatCard
          label="Program Kerja"
          value={totalProker}
          color="blue"
          linkTo="/admin/proker"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
        <StatCard
          label="Pengaduan Masuk"
          value={totalPengaduan}
          color="gold"
          linkTo="/admin/pengaduan"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />
        <StatCard
          label="Kepengurusan"
          value="Aktif"
          color="green"
          linkTo="/admin/profil"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
      </div>

      {/* Aktivitas terbaru */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Berita terbaru */}
        <div className="bg-white rounded-card border border-neutral-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
            <h3 className="font-display font-bold text-neutral-900">Berita Terbaru</h3>
            <Link to="/admin/berita" className="text-xs text-brand-blue-500 hover:text-brand-blue-600 font-semibold">
              Lihat Semua →
            </Link>
          </div>
          <ul className="divide-y divide-neutral-100">
            {beritaTerbaru?.results?.length === 0 && (
              <li className="px-5 py-6 text-sm text-neutral-400 text-center">Belum ada berita.</li>
            )}
            {beritaTerbaru?.results?.map((b) => (
              <li key={b.id} className="flex items-center gap-3 px-5 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">{b.judul}</p>
                  <p className="text-xs text-neutral-400">{b.published_at ? formatShort(b.published_at) : "Draft"}</p>
                </div>
                <Badge
                  label={STATUS_BERITA_LABELS[b.status] ?? b.status}
                  colorClass={STATUS_BERITA_COLORS[b.status]}
                />
              </li>
            ))}
          </ul>
        </div>

        {/* Pengaduan terbaru */}
        <div className="bg-white rounded-card border border-neutral-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
            <h3 className="font-display font-bold text-neutral-900">Pengaduan Terbaru</h3>
            <Link to="/admin/pengaduan" className="text-xs text-brand-blue-500 hover:text-brand-blue-600 font-semibold">
              Lihat Semua →
            </Link>
          </div>
          <ul className="divide-y divide-neutral-100">
            {pengaduanTerbaru?.results?.length === 0 && (
              <li className="px-5 py-6 text-sm text-neutral-400 text-center">Belum ada pengaduan.</li>
            )}
            {pengaduanTerbaru?.results?.map((p) => (
              <li key={p.id} className="flex items-center gap-3 px-5 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">{p.nama}</p>
                  <p className="text-xs text-neutral-400 capitalize">{p.jenis?.replace("_", " ")} · {formatShort(p.created_at)}</p>
                </div>
                <Badge
                  label={STATUS_PENGADUAN_LABELS[p.status] ?? p.status}
                  colorClass={STATUS_PENGADUAN_COLORS[p.status]}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Shortcut aksi cepat */}
      <div className="mt-6 p-4 bg-neutral-50 border border-neutral-200 rounded-card">
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">Aksi Cepat</p>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/berita" className="btn-primary text-sm py-2">+ Tulis Berita</Link>
          <Link to="/admin/proker" className="btn-outline text-sm py-2">+ Tambah Proker</Link>
          <Link to="/admin/pengaduan" className="btn-outline text-sm py-2">Lihat Pengaduan</Link>
        </div>
      </div>
    </AdminLayout>
  );
}
