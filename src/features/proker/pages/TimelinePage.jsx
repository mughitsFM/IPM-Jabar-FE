// frontend/features/proker/pages/TimelinePage.jsx
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PublicLayout from "@/shared/components/layout/PublicLayout";
import TimelineItem from "../components/TimelineItem";
import ProkerCalendar from "../components/ProkerCalendar";
import { useProkerList } from "../hooks/useProker";
import { useBidangOptions } from "../hooks/useJabatan"; // ⬅️ baru: sumber bidang sama seperti ProkerForm
import EmptyState from "@/shared/components/ui/EmptyState";
import { SkeletonLine } from "@/shared/components/ui/Skeleton";
import { formatMonthYear } from "@/shared/utils/formatDate";
import {
  STATUS_PROKER,
  STATUS_PROKER_LABELS,
} from "@/shared/constants/statusEnum";
import { useDesainSection } from "@/shared/hooks/useDesainPublic";

const STATUS_FILTERS = [
  { value: null,                       label: "Semua" },
  { value: STATUS_PROKER.AKAN_DATANG,  label: STATUS_PROKER_LABELS[STATUS_PROKER.AKAN_DATANG] },
  { value: STATUS_PROKER.BERLANGSUNG,  label: STATUS_PROKER_LABELS[STATUS_PROKER.BERLANGSUNG] },
  { value: STATUS_PROKER.SELESAI,      label: STATUS_PROKER_LABELS[STATUS_PROKER.SELESAI] },
];

export default function TimelinePage() {
  const [statusFilter, setStatusFilter] = useState(null);
  const [bidangFilter, setBidangFilter] = useState(null);
  const [viewMode, setViewMode] = useState("list"); // "list" | "calendar"
  const { section: desain } = useDesainSection("timeline");

  const { data, isLoading, isError } = useProkerList(
    statusFilter ? { status: statusFilter } : {}
  );

  // ⬅️ baru: opsi bidang diambil dari BE (sama seperti ProkerForm), bukan
  // enum statis — karena `proker.bidang` disimpan sebagai nama dari
  // profil-jabatan (b.nama), bukan slug BIDANG_PROKER.
  const { data: bidangData, isLoading: isBidangLoading } = useBidangOptions();
  const bidangOptions = bidangData?.data ?? [];

  // Filter bidang dilakukan di client — endpoint /proker/ saat ini belum
  // tentu mendukung query param bidang di server, jadi ini aman dipakai
  // berapa pun dukungan backend-nya. Kalau datanya sudah besar, ini bisa
  // dipindah jadi query param BE untuk efisiensi.
  const prokerList = useMemo(() => {
    const list = data?.data?.results ?? [];
    if (!bidangFilter) return list;
    return list.filter((p) => p.bidang === bidangFilter);
  }, [data, bidangFilter]);

  // Kelompokkan proker berurutan per bulan (butuh list yang sudah terurut
  // berdasarkan tanggal_mulai; proker tanpa tanggal_mulai dikumpulkan di
  // grup "Tanpa tanggal" di akhir).
  const groupedByMonth = useMemo(() => {
    const sorted = [...prokerList].sort((a, b) => {
      const da = a.tanggal_mulai ? new Date(a.tanggal_mulai) : null;
      const db = b.tanggal_mulai ? new Date(b.tanggal_mulai) : null;
      if (!da && !db) return 0;
      if (!da) return 1;
      if (!db) return -1;
      return da - db;
    });

    const groups = [];
    sorted.forEach((p) => {
      const label = p.tanggal_mulai ? formatMonthYear(p.tanggal_mulai) : "Tanpa tanggal";
      const lastGroup = groups[groups.length - 1];
      if (lastGroup && lastGroup.label === label) {
        lastGroup.items.push(p);
      } else {
        groups.push({ label, items: [p] });
      }
    });
    return groups;
  }, [prokerList]);

  return (
    <PublicLayout>
      <section className="relative bg-gradient-to-br from-brand-green-500 to-brand-green-700 pt-10 pb-16 overflow-hidden">
        {desain?.hero_image_url && (
          <>
            <img
              src={desain.hero_image_url}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-brand-green-900/70" />
          </>
        )}

        <div className="absolute bottom-0 inset-x-0 text-neutral-50 pointer-events-none leading-none">
          <svg viewBox="0 0 1440 48" className="w-full h-8 lg:h-10" preserveAspectRatio="none" aria-hidden="true">
            <path fill="currentColor" d="M0,24 C240,40 480,8 720,16 C960,24 1200,40 1440,20 L1440,48 L0,48 Z" />
          </svg>
        </div>

        <div className="container-site relative">
          <nav aria-label="Breadcrumb" className="text-xs text-brand-green-100 mb-3 flex items-center gap-1.5">
            <Link to="/" className="hover:text-white transition-colors">Beranda</Link>
            <span className="text-brand-green-300">/</span>
            <span className="text-white font-medium">Timeline</span>
          </nav>
          <h1 className="font-display font-bold text-white text-3xl lg:text-4xl mb-2 tracking-tight">
            {desain?.headline || "Program Kerja"}
          </h1>
          <p className="text-brand-green-50 text-sm max-w-xl">
            {desain?.subheadline || "Timeline kegiatan dan program kerja PW IPM Jawa Barat periode aktif."}
          </p>
        </div>
      </section>

      <section className="bg-neutral-50 section">
        <div className="container-site">
          <div className="max-w-3xl mx-auto">
            {/* Toggle mode tampilan — baris sendiri, SELALU rata kanan baik di
                mode Daftar maupun Kalender. Sebelumnya toggle ini berbagi satu
                flex-wrap row dengan blok filter: begitu blok filter kosong
                (mode Kalender) atau melebar lalu wrap (mode Daftar di layar
                sempit), posisi toggle ikut lompat kiri/kanan tergantung sisa
                ruang. Dipisah baris sendiri supaya posisinya konsisten. */}
            <div className="flex items-center justify-end mb-4">
              <div
                className="inline-flex rounded-lg border border-neutral-200 overflow-hidden shrink-0 bg-white"
                role="group"
                aria-label="Mode tampilan program kerja"
              >
                <button
                  onClick={() => setViewMode("list")}
                  aria-pressed={viewMode === "list"}
                  className={`px-4 py-2 text-sm font-semibold min-h-[44px] transition-colors duration-150
                    ${viewMode === "list" ? "bg-brand-green-500 text-white" : "text-neutral-600 hover:bg-neutral-100"}`}
                >
                  Daftar
                </button>
                <button
                  onClick={() => setViewMode("calendar")}
                  aria-pressed={viewMode === "calendar"}
                  className={`px-4 py-2 text-sm font-semibold min-h-[44px] transition-colors duration-150
                    ${viewMode === "calendar" ? "bg-brand-green-500 text-white" : "text-neutral-600 hover:bg-neutral-100"}`}
                >
                  Kalender
                </button>
              </div>
            </div>

            {/* Baris filter — cuma tampil di mode Daftar, baris sendiri juga
                supaya wrap-nya (di layar sempit) tidak menyeret posisi toggle
                di atas. */}
            {viewMode === "list" && (
              <div className="flex flex-wrap items-center gap-2 mb-10" role="group" aria-label="Filter program kerja">
                {STATUS_FILTERS.map(({ value, label }) => {
                  const active = statusFilter === value;
                  return (
                    <button
                      key={label}
                      onClick={() => setStatusFilter(value)}
                      aria-pressed={active}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 min-h-[44px]
                        ${active
                          ? "bg-brand-green-500 text-white shadow-sm shadow-brand-green-500/30"
                          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                        }`}
                    >
                      {label}
                    </button>
                  );
                })}

                <select
                  value={bidangFilter ?? ""}
                  onChange={(e) => setBidangFilter(e.target.value || null)}
                  aria-label="Filter bidang program kerja"
                  disabled={isBidangLoading}
                  className="min-h-[44px] px-4 rounded-lg border border-neutral-200 text-sm font-semibold text-neutral-600 bg-white
                    focus:outline-none focus:border-brand-green-500 focus:ring-2 focus:ring-brand-green-500/20 transition-colors duration-150
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">{isBidangLoading ? "Memuat bidang..." : "Semua bidang"}</option>
                  {bidangOptions.map((b) => (
                    <option key={b.id} value={b.nama}>{b.nama}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Mode Kalender tidak punya baris filter, jadi kasih jarak yang
                setara (mb-10 di filter row list ↔ mb-6 di sini) supaya jarak
                ke konten di bawah tetap konsisten antar mode. */}
            {viewMode === "calendar" && <div className="mb-6" />}

            {viewMode === "calendar" ? (
              <ProkerCalendar maxAgendaItems={8} />
            ) : (
              <>
                {isLoading && (
                  <div className="space-y-6">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex gap-6">
                        <div className="w-4 h-4 rounded-full bg-neutral-200 animate-pulse shrink-0 mt-1" />
                        <div className="bg-white border border-neutral-200 rounded-card p-5 flex-1 space-y-2">
                          <SkeletonLine className="w-2/3" />
                          <SkeletonLine className="w-full" />
                          <SkeletonLine className="w-1/3 h-3" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {isError && (
                  <EmptyState title="Gagal memuat program kerja" message="Terjadi kesalahan saat mengambil data." />
                )}

                {!isLoading && !isError && prokerList.length === 0 && (
                  <EmptyState title="Belum ada program kerja" message="Belum ada program kerja yang tersedia untuk filter ini." />
                )}

                {!isLoading && !isError && groupedByMonth.map((group) => (
                  <div key={group.label} className="mb-8">
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-4">
                      {group.label}
                    </p>
                    {group.items.map((proker, idx) => (
                      <TimelineItem key={proker.id} proker={proker} isLast={idx === group.items.length - 1} />
                    ))}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}