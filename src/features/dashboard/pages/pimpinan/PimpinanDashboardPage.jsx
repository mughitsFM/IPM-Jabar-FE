{/* frontend/features/dashboard/pages/pimpinan/PimpinanDashboardPage.jsx (baru, lengkap) */}
import { Link } from "react-router-dom";
import PimpinanLayout from "@/shared/components/layout/PimpinanLayout";
import StatCard from "@/shared/components/ui/StatCard";
import ArtikelStatusBadge from "@/features/artikel-pimpinan/components/ArtikelStatusBadge";
import { useAuthContext } from "@/app/providers/AuthProvider";
import { usePimpinanDashboardSummary } from "../../hooks/usePimpinanDashboardSummary";
import { formatShort } from "@/shared/utils/formatDate";

// --- Ikon (gaya sama seperti yang dipakai di AdminDashboardPage.jsx) ---
const IconArtikelDraft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);
const IconArtikelDiajukan = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.769 59.769 0 0121.485 12 59.768 59.768 0 013.27 20.876L5.999 12zm0 0h7.5" />
  </svg>
);
const IconSurat = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);
const IconAspirasi = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

// --- Komponen list lokal (tidak diekstrak — dipakai di halaman ini saja) ---

function DaftarArtikelTerbaru({ items }) {
  return (
    <div className="bg-white rounded-card border border-neutral-200 min-w-0">
      <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
        <h3 className="font-display font-bold text-neutral-900">Artikel Terbaru</h3>
        <Link to="/pimpinan/artikel" className="group inline-flex items-center gap-1 text-xs text-brand-green-600 hover:text-brand-green-700 font-semibold">
          Lihat Semua
          <span className="transition-transform duration-150 group-hover:translate-x-0.5">→</span>
        </Link>
      </div>
      <ul className="divide-y divide-neutral-100">
        {(!items || items.length === 0) && (
          <li className="px-5 py-10 text-sm text-neutral-400 text-center">Belum ada artikel yang ditulis.</li>
        )}
        {items?.map((a) => (
          <li key={a.id} className="flex items-center gap-3 px-5 py-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 truncate">{a.judul}</p>
              <p className="text-xs text-neutral-400 mt-0.5">{formatShort(a.updated_at)}</p>
            </div>
            <ArtikelStatusBadge status={a.status} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function DaftarSuratTerbaru({ items, currentUid }) {
  return (
    <div className="bg-white rounded-card border border-neutral-200 min-w-0">
      <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
        <h3 className="font-display font-bold text-neutral-900">Surat Masuk Terbaru</h3>
        <Link to="/pimpinan/surat" className="group inline-flex items-center gap-1 text-xs text-brand-green-600 hover:text-brand-green-700 font-semibold">
          Lihat Semua
          <span className="transition-transform duration-150 group-hover:translate-x-0.5">→</span>
        </Link>
      </div>
      <ul className="divide-y divide-neutral-100">
        {(!items || items.length === 0) && (
          <li className="px-5 py-10 text-sm text-neutral-400 text-center">Belum ada surat masuk.</li>
        )}
        {items?.map((s) => {
          const belumDibaca = !s.dibaca_oleh?.includes(currentUid);
          return (
            <li key={s.id}>
              <Link to={`/pimpinan/surat/${s.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-neutral-50 transition-colors">
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${belumDibaca ? "bg-brand-gold-500" : "bg-neutral-200"}`}
                  aria-hidden="true"
                />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm truncate ${belumDibaca ? "font-semibold text-neutral-900" : "font-medium text-neutral-600"}`}>
                    {s.perihal}
                  </p>
                  <p className="text-xs text-neutral-400 truncate">{s.pengirim_label} · {formatShort(s.created_at)}</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function PimpinanDashboardPage() {
  const { user } = useAuthContext();
  const { data } = usePimpinanDashboardSummary();
  const s = data?.data?.summary;

  const jam = new Date().getHours();
  const sapaan =
    jam < 11 ? "Selamat pagi" :
    jam < 15 ? "Selamat siang" :
    jam < 18 ? "Selamat sore" :
    "Selamat malam";

  return (
    <PimpinanLayout title="Dashboard">
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-display font-bold text-neutral-900 text-xl sm:text-2xl">
            {sapaan}, {user?.nama?.split(" ")[0]} 👋
          </h2>
          <p className="text-sm text-neutral-500 mt-1.5">{user?.label_lengkap}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        <StatCard
          label="Artikel Draft" value={s?.total_artikel_draft} color="neutral"
          linkTo="/pimpinan/artikel" icon={<IconArtikelDraft />}
        />
        <StatCard
          label="Artikel Diajukan" value={s?.total_artikel_diajukan} color="blue"
          linkTo="/pimpinan/artikel" icon={<IconArtikelDiajukan />}
        />
        <StatCard
          label="Surat Belum Dibaca" value={s?.total_surat_masuk_belum_dibaca} color="gold"
          linkTo="/pimpinan/surat" icon={<IconSurat />}
        />
        <StatCard
          label="Aspirasi Menunggu" value={s?.total_aspirasi_menunggu_balasan} color="green"
          linkTo="/pimpinan/aspirasi" icon={<IconAspirasi />}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DaftarArtikelTerbaru items={data?.data?.artikel_terbaru} />
        <DaftarSuratTerbaru items={data?.data?.surat_masuk_terbaru} currentUid={user?.uid} />
      </div>

      <div className="mt-6 p-5 bg-gradient-to-br from-neutral-50 to-white border border-neutral-200 rounded-card">
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">Aksi Cepat</p>
        <div className="flex flex-wrap gap-3">
          <Link to="/pimpinan/artikel/baru" className="btn-primary text-sm py-2">+ Tulis Artikel</Link>
          <Link to="/pimpinan/surat" className="btn-outline text-sm py-2">+ Tulis Surat</Link>
          <Link to="/pimpinan/aspirasi" className="btn-outline text-sm py-2">Kirim Aspirasi</Link>
        </div>
      </div>
    </PimpinanLayout>
  );
}