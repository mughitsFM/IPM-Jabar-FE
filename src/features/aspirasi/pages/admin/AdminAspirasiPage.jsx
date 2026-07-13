{/* frontend/features/aspirasi/pages/admin/AdminAspirasiPage.jsx (lengkap) */}
import { useState } from "react";
import AdminLayout from "@/shared/components/layout/AdminLayout";
import EmptyState from "@/shared/components/ui/EmptyState";
import Pagination from "@/shared/components/ui/Pagination";
import { SkeletonTableRows, SkeletonLine } from "@/shared/components/ui/Skeleton";
import { formatShort } from "@/shared/utils/formatDate";
import AspirasiStatusBadge from "../../components/AspirasiStatusBadge";
import BalasAspirasiModal from "../../components/BalasAspirasiModal";
import { useAspirasiAdminList } from "../../hooks/useAspirasi";

const TABS = [
  { value: "terkirim", label: "Terkirim" },
  { value: "diproses", label: "Diproses" },
  { value: "dibalas", label: "Sudah Dibalas" },
  { value: "", label: "Semua" },
];

export default function AdminAspirasiPage() {
  const [status, setStatus] = useState("terkirim");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  const { data, isLoading } = useAspirasiAdminList({ page, limit: 10, status: status || undefined });
  const results = data?.data?.results ?? [];
  const meta = data?.data?.meta;

  return (
    <AdminLayout title="Aspirasi">
      <div className="mb-6">
        {/* <h2 className="font-display font-bold text-neutral-900 text-lg sm:text-xl">Aspirasi Masuk</h2> */}
        <p className="text-sm text-neutral-500 mt-1">
          Masukan dan aspirasi dari Pimpinan Daerah/Cabang/Ranting se-Jawa Barat.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => { setStatus(tab.value); setPage(1); }}
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors min-h-[44px] ${
              status === tab.value
                ? "bg-brand-blue-500 text-white"
                : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {!isLoading && results.length === 0 && (
        <div className="bg-white rounded-card border border-neutral-200">
          <EmptyState title="Tidak ada aspirasi" message="Belum ada aspirasi pada status ini." />
        </div>
      )}

      {(isLoading || results.length > 0) && (
        <div className="bg-white rounded-card border border-neutral-200 overflow-hidden">
          {/* ===== Tabel — desktop (md ke atas) ===== */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-5 py-3">Perihal</th>
                  <th className="text-left px-5 py-3">Pengirim</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-left px-5 py-3">Tanggal</th>
                  <th className="text-right px-5 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {isLoading && <SkeletonTableRows rows={5} cols={5} />}
                {!isLoading && results.map((a) => (
                  <tr key={a.id}>
                    <td className="px-5 py-3 font-medium text-neutral-900 max-w-xs truncate">{a.perihal}</td>
                    <td className="px-5 py-3 text-neutral-500">{a.pimpinan_label}</td>
                    <td className="px-5 py-3"><AspirasiStatusBadge status={a.status} /></td>
                    <td className="px-5 py-3 text-neutral-400 whitespace-nowrap">{formatShort(a.created_at)}</td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => setSelected(a)}
                        className="text-xs text-brand-blue-500 hover:text-brand-blue-600 font-semibold px-2 py-1 rounded hover:bg-brand-blue-500/10 transition-colors"
                      >
                        {a.status === "dibalas" ? "Lihat" : "Balas"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ===== Kartu — mobile & tablet kecil (di bawah md) ===== */}
          <div className="md:hidden divide-y divide-neutral-100">
            {isLoading && Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 space-y-2">
                <SkeletonLine className="w-2/3" />
                <SkeletonLine className="w-1/3" />
              </div>
            ))}
            {!isLoading && results.map((a) => (
              <button
                key={a.id}
                onClick={() => setSelected(a)}
                className="w-full text-left p-4 transition-colors active:bg-neutral-50"
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <p className="text-sm font-medium text-neutral-900 min-w-0">{a.perihal}</p>
                  <AspirasiStatusBadge status={a.status} className="shrink-0" />
                </div>
                <p className="text-xs text-neutral-500">{a.pimpinan_label} · {formatShort(a.created_at)}</p>
                <p className="text-xs text-brand-blue-500 font-semibold mt-2">
                  {a.status === "dibalas" ? "Lihat detail →" : "Balas aspirasi →"}
                </p>
              </button>
            ))}
          </div>

          {meta && meta.total_pages > 1 && (
            <div className="px-5 py-4 border-t border-neutral-100">
              <Pagination meta={meta} onPageChange={setPage} />
            </div>
          )}
        </div>
      )}

      {selected && <BalasAspirasiModal aspirasi={selected} onClose={() => setSelected(null)} />}
    </AdminLayout>
  );
}
