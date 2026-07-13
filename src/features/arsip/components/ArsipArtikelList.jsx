import { useState } from "react";
import EmptyState from "@/shared/components/ui/EmptyState";
import Pagination from "@/shared/components/ui/Pagination";
import { SkeletonCardGrid } from "@/shared/components/ui/Skeleton";
// Hook list milik-sendiri sisi Pimpinan (sudah ada dari file 05) — tanpa
// param `status` berarti "semua status" (riwayat lengkap), sesuai
// 07-arsip-dan-rekap.md §4.3.
import { useArtikelPimpinanList } from "@/features/artikel-pimpinan/hooks/useArtikelPimpinan";

import {
  STATUS_ARTIKEL_PIMPINAN_LABELS,
  STATUS_ARTIKEL_PIMPINAN_COLORS,
} from "@/shared/constants/statusEnum";

function formatTanggal(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

export default function ArsipArtikelList() {
  const [page, setPage] = useState(1);

  // Tanpa filter status ("semua riwayat") — sesuai 07-arsip-dan-rekap.md §4.3
  const { data, isLoading } = useArtikelPimpinanList({ page, limit: 9 });

  const results = data?.data?.results ?? [];
  const meta = data?.data?.meta;

  if (isLoading) {
    return <SkeletonCardGrid count={6} />;
  }

  if (results.length === 0) {
    return (
      <EmptyState
        title="Belum ada artikel"
        message="Riwayat artikel yang pernah diajukan akan muncul di sini."
      />
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((a) => (
          <div key={a.id} className="bg-white border border-neutral-200 rounded-card p-4 flex flex-col min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="font-display font-bold text-neutral-900 text-sm leading-snug line-clamp-2">
                {a.judul}
              </h4>
              <span
                className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${STATUS_ARTIKEL_PIMPINAN_COLORS[a.status]}`}
              >
                {STATUS_ARTIKEL_PIMPINAN_LABELS[a.status]}
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-auto pt-3">{formatTanggal(a.updated_at)}</p>
            {a.status === "disetujui" && (
              <a
                href={`/berita/${a.slug}`}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center justify-center min-h-[36px] px-3 rounded-lg text-xs font-semibold border-2 border-brand-green-500 text-brand-green-500 hover:bg-brand-green-50 transition-colors"
              >
                Lihat di Web
              </a>
            )}
          </div>
        ))}
      </div>
      <Pagination meta={meta} onPageChange={setPage} />
    </div>
  );
}