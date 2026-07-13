{/* frontend/features/aspirasi/pages/pimpinan/PimpinanAspirasiPage.jsx (lengkap) */}
import { useState, Fragment } from "react";
import PimpinanLayout from "@/shared/components/layout/PimpinanLayout";
import EmptyState from "@/shared/components/ui/EmptyState";
import Pagination from "@/shared/components/ui/Pagination";
import { SkeletonTableRows, SkeletonLine } from "@/shared/components/ui/Skeleton";
import { formatShort } from "@/shared/utils/formatDate";
import AspirasiForm from "../../components/AspirasiForm";
import AspirasiStatusBadge from "../../components/AspirasiStatusBadge";
import { useAspirasiList } from "../../hooks/useAspirasi";

export default function PimpinanAspirasiPage() {
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState(null);

  const { data, isLoading } = useAspirasiList({ page, limit: 10 });
  const results = data?.data?.results ?? [];
  const meta = data?.data?.meta;

  return (
    <PimpinanLayout title="Aspirasi ke Wilayah">
      <div className="mb-6">
        {/* <h2 className="font-display font-bold text-neutral-900 text-lg sm:text-xl">Aspirasi ke Wilayah</h2> */}
        <p className="text-sm text-neutral-500 mt-1">
          Sampaikan masukan, keluhan, atau usulan langsung ke PW IPM Jawa Barat.
        </p>
      </div>

      <div className="bg-white rounded-card border border-neutral-200 mb-6">
        <button
          onClick={() => setShowForm((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-4 text-left min-h-[44px]"
        >
          <span className="font-display font-bold text-neutral-900">Kirim Aspirasi Baru</span>
          <span className={`text-neutral-400 text-lg transition-transform duration-200 ${showForm ? "rotate-45" : ""}`}>+</span>
        </button>
        {showForm && (
          <div className="px-5 pb-5 border-t border-neutral-100 pt-5">
            <AspirasiForm onSuccess={() => setShowForm(false)} />
          </div>
        )}
      </div>

      <h3 className="font-display font-bold text-neutral-900 text-base mb-3">Riwayat Aspirasi</h3>

      {!isLoading && results.length === 0 && (
        <div className="bg-white rounded-card border border-neutral-200">
          <EmptyState title="Belum ada aspirasi" message="Aspirasi yang Anda kirim akan tampil di sini." />
        </div>
      )}

      {(isLoading || results.length > 0) && (
        <div className="bg-white rounded-card border border-neutral-200 overflow-hidden">
          {/* ===== Tabel akordeon — desktop (md ke atas) ===== */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-5 py-3">Perihal</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-left px-5 py-3">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {isLoading && <SkeletonTableRows rows={5} cols={3} />}
                {!isLoading && results.map((a) => (
                  <Fragment key={a.id}>
                    <tr
                      className="cursor-pointer hover:bg-neutral-50"
                      onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}
                    >
                      <td className="px-5 py-3 font-medium text-neutral-900">{a.perihal}</td>
                      <td className="px-5 py-3"><AspirasiStatusBadge status={a.status} /></td>
                      <td className="px-5 py-3 text-neutral-400 whitespace-nowrap">{formatShort(a.created_at)}</td>
                    </tr>
                    {expandedId === a.id && (
                      <tr>
                        <td colSpan={3} className="px-5 py-4 bg-neutral-50">
                          <DetailAspirasi a={a} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* ===== Kartu akordeon — mobile & tablet kecil (di bawah md) ===== */}
          <div className="md:hidden divide-y divide-neutral-100">
            {isLoading && Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 space-y-2">
                <SkeletonLine className="w-2/3" />
                <SkeletonLine className="w-1/3" />
              </div>
            ))}
            {!isLoading && results.map((a) => (
              <div key={a.id}>
                <button
                  onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}
                  className="w-full text-left p-4 transition-colors active:bg-neutral-50"
                >
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <p className="text-sm font-medium text-neutral-900 min-w-0">{a.perihal}</p>
                    <AspirasiStatusBadge status={a.status} className="shrink-0" />
                  </div>
                  <p className="text-xs text-neutral-400">{formatShort(a.created_at)}</p>
                </button>
                {expandedId === a.id && (
                  <div className="px-4 pb-4 bg-neutral-50">
                    <DetailAspirasi a={a} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {meta && meta.total_pages > 1 && (
            <div className="px-5 py-4 border-t border-neutral-100">
              <Pagination meta={meta} onPageChange={setPage} />
            </div>
          )}
        </div>
      )}
    </PimpinanLayout>
  );
}

function DetailAspirasi({ a }) {
  return (
    <div>
      <p className="text-xs text-neutral-400 uppercase tracking-wide mb-1">Detail</p>
      <p className="text-sm text-neutral-700 whitespace-pre-line mb-3">{a.detail}</p>
      {a.lampiran_url && (
        <a href={a.lampiran_url} target="_blank" rel="noopener noreferrer"
          className="text-xs text-brand-blue-500 hover:text-brand-blue-600 font-semibold">
          📎 Lihat Lampiran
        </a>
      )}
      {a.status === "dibalas" && (
        <div className="mt-3 p-3 rounded-lg bg-brand-green-50 border border-brand-green-500/20">
          <p className="text-xs font-semibold text-brand-green-700 mb-1">
            Balasan Wilayah · {formatShort(a.dibalas_at)}
          </p>
          <p className="text-sm text-neutral-700 whitespace-pre-line">{a.balasan}</p>
        </div>
      )}
    </div>
  );
}
