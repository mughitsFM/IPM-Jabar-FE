{/* frontend/features/proker/pages/TimelinePage.jsx (lengkap) */}
import { useState } from "react";
import PublicLayout from "@/shared/components/layout/PublicLayout";
import TimelineItem from "../components/TimelineItem";
import { useProkerList } from "../hooks/useProker";
import EmptyState from "@/shared/components/ui/EmptyState";
import { SkeletonLine } from "@/shared/components/ui/Skeleton";
import {
  STATUS_PROKER,
  STATUS_PROKER_LABELS,
} from "@/shared/constants/statusEnum";

const STATUS_FILTERS = [
  { value: null,                       label: "Semua" },
  { value: STATUS_PROKER.AKAN_DATANG,  label: STATUS_PROKER_LABELS[STATUS_PROKER.AKAN_DATANG] },
  { value: STATUS_PROKER.BERLANGSUNG,  label: STATUS_PROKER_LABELS[STATUS_PROKER.BERLANGSUNG] },
  { value: STATUS_PROKER.SELESAI,      label: STATUS_PROKER_LABELS[STATUS_PROKER.SELESAI] },
];

export default function TimelinePage() {
  const [statusFilter, setStatusFilter] = useState(null);
  const { data, isLoading, isError } = useProkerList(
    statusFilter ? { status: statusFilter } : {}
  );

  const prokerList = data?.data?.results ?? [];

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
          <div className="flex flex-wrap gap-2 mb-10" role="group" aria-label="Filter status program kerja">
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
          </div>

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

          {!isLoading && !isError && prokerList.length > 0 && (
            <div>
              {prokerList.map((proker, idx) => (
                <TimelineItem key={proker.id} proker={proker} isLast={idx === prokerList.length - 1} />
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}