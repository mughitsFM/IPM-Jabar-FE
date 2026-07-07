// frontend/features/proker/pages/TimelinePage.jsx
import { useMemo, useState } from "react";
import PublicLayout from "@/shared/components/layout/PublicLayout";
import TimelineItem from "../components/TimelineItem";
import ProkerCalendar from "../components/ProkerCalendar";
import { useProkerList } from "../hooks/useProker";
import EmptyState from "@/shared/components/ui/EmptyState";
import { SkeletonLine } from "@/shared/components/ui/Skeleton";
import { formatMonthYear } from "@/shared/utils/formatDate";
import {
  STATUS_PROKER,
  STATUS_PROKER_LABELS,
  BIDANG_PROKER_LABELS,
} from "@/shared/constants/statusEnum";

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

  const { data, isLoading, isError } = useProkerList(
    statusFilter ? { status: statusFilter } : {}
  );

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
      <section className="bg-brand-green-500 py-12">
        <div className="container-site">
          <h1 className="font-display font-bold text-white text-3xl mb-2">Program Kerja</h1>
          <p className="text-brand-green-50 text-sm">
            Timeline kegiatan dan program kerja PW IPM Jawa Barat periode aktif.
          </p>
        </div>
      </section>

      <section className="container-site section">
        <div className="max-w-3xl mx-auto">
          {/* Baris filter + toggle tampilan */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-10">
            {viewMode === "list" ? (
              <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter program kerja">
                {STATUS_FILTERS.map(({ value, label }) => {
                  const active = statusFilter === value;
                  return (
                    <button
                      key={label}
                      onClick={() => setStatusFilter(value)}
                      aria-pressed={active}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-150 min-h-[44px]
                        ${active ? "bg-brand-green-500 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"}`}
                    >
                      {label}
                    </button>
                  );
                })}

                <select
                  value={bidangFilter ?? ""}
                  onChange={(e) => setBidangFilter(e.target.value || null)}
                  aria-label="Filter bidang program kerja"
                  className="min-h-[44px] px-4 rounded-lg border border-neutral-200 text-sm font-semibold text-neutral-600 bg-white
                    focus:outline-none focus:border-brand-green-500 focus:ring-2 focus:ring-brand-green-500/20 transition-colors duration-150"
                >
                  <option value="">Semua bidang</option>
                  {Object.entries(BIDANG_PROKER_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div />
            )}

            <div
              className="inline-flex rounded-lg border border-neutral-200 overflow-hidden shrink-0"
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
      </section>
    </PublicLayout>
  );
}