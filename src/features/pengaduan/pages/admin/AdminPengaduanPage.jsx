{/* frontend/features/pengaduan/pages/admin/AdminPengaduanPage.jsx (lengkap) */}
import { useState } from "react";
import AdminLayout from "@/shared/components/layout/AdminLayout";
import Badge from "@/shared/components/ui/Badge";
import Button from "@/shared/components/ui/Button";
import Pagination from "@/shared/components/ui/Pagination";
import EmptyState from "@/shared/components/ui/EmptyState";
import { SkeletonTableRows } from "@/shared/components/ui/Skeleton";
import {
  usePengaduanList,
  usePengaduanDetail,
  useUpdateStatusPengaduan,
} from "../../hooks/usePengaduan";
import {
  STATUS_PENGADUAN_LABELS,
  STATUS_PENGADUAN_COLORS,
} from "@/shared/constants/statusEnum";
import { formatDateTime } from "@/shared/utils/formatDate";

/**
 * Sisipkan flag fl_attachment ke URL Cloudinary supaya file langsung
 * di-download oleh browser (Content-Disposition: attachment), bukan
 * dibuka di tab baru. Aman dipakai untuk resource_type apa pun
 * (image/raw) karena fl_attachment adalah flag delivery, bukan transformasi
 * konten.
 */
function toCloudinaryDownloadUrl(url) {
  if (!url) return url;
  if (url.includes("fl_attachment")) return url;
  return url.replace("/upload/", "/upload/fl_attachment/");
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-card shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-neutral-900 text-lg">{title}</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-neutral-100 min-h-[44px] min-w-[44px] flex items-center justify-center text-neutral-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function DetailPanel({ id, onClose }) {
  const { data, isLoading } = usePengaduanDetail(id);
  const pengaduan = data?.data;
  const updateStatus = useUpdateStatusPengaduan(id);

  return (
    <div className="space-y-4">
      {isLoading && <p className="text-sm text-neutral-500">Memuat…</p>}

      {pengaduan && (
        <>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <InfoRow label="Kode" value={<span className="font-mono font-bold text-brand-green-500">{pengaduan.kode_unik}</span>} />
            <InfoRow label="Perihal" value={pengaduan.perihal} />
            <InfoRow label="Asal Pimpinan" value={pengaduan.asal_pimpinan} />
            <InfoRow label="Email" value={<a href={`mailto:${pengaduan.email}`} className="text-brand-blue-500 underline">{pengaduan.email}</a>} />
            <InfoRow label="Dikirim" value={formatDateTime(pengaduan.created_at)} />
          </div>

          <div>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">Isi</p>
            <p className="text-sm text-neutral-800 bg-neutral-50 rounded-lg p-3 leading-relaxed whitespace-pre-wrap">
              {pengaduan.isi}
            </p>
          </div>

          {pengaduan.lampiran_url && (
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">Lampiran</p>
              <a
                href={toCloudinaryDownloadUrl(pengaduan.lampiran_url)}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-flex items-center gap-2 text-sm text-brand-blue-500 hover:text-brand-blue-600 underline"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                Download Lampiran
              </a>
            </div>
          )}

          <div className="h-px bg-neutral-100" />

          <div>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">Status Pengaduan</p>
            <div className="flex items-center gap-3 flex-wrap">
              {Object.entries(STATUS_PENGADUAN_LABELS).map(([val, lbl]) => (
                <button
                  key={val}
                  disabled={pengaduan.status === val || updateStatus.isPending}
                  onClick={async () => {
                    await updateStatus.mutateAsync(val);
                    onClose();
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors min-h-[44px] border-2
                    ${pengaduan.status === val
                      ? "border-brand-green-500 bg-brand-green-50 text-brand-green-500"
                      : "border-neutral-200 text-neutral-600 hover:border-brand-green-500 hover:text-brand-green-500"
                    } disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {lbl}
                </button>
              ))}
            </div>
            {updateStatus.isPending && <p className="text-xs text-neutral-400 mt-1">Menyimpan…</p>}
          </div>
        </>
      )}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <p className="text-xs text-neutral-400">{label}</p>
      <div className="font-medium text-neutral-900">{value}</div>
    </div>
  );
}

export default function AdminPengaduanPage() {
  const [page,        setPage]        = useState(1);
  const [statusFilter,setStatusFilter]= useState(null);
  const [detailId,    setDetailId]    = useState(null);

  const { data, isLoading } = usePengaduanList({
    page,
    limit: 15,
    ...(statusFilter ? { status: statusFilter } : {}),
  });

  const list = data?.data?.results ?? [];

  return (
    <AdminLayout title="Manajemen Pengaduan">
      <div className="flex flex-wrap gap-2 mb-6">
        {[{ value: null, label: "Semua" }, ...Object.entries(STATUS_PENGADUAN_LABELS).map(([v, l]) => ({ value: v, label: l }))].map(({ value, label }) => (
          <button
            key={label}
            onClick={() => { setStatusFilter(value); setPage(1); }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors min-h-[44px]
              ${statusFilter === value
                ? "bg-brand-blue-500 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-card border border-neutral-200 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50">
              {["Kode", "Asal Pimpinan", "Perihal", "Dikirim", "Status", "Aksi"].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-semibold text-neutral-700 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading && <SkeletonTableRows rows={8} cols={6} />}

            {!isLoading && list.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12">
                  <EmptyState title="Belum ada pengaduan" message="Belum ada pengaduan yang masuk." />
                </td>
              </tr>
            )}

            {!isLoading && list.map((p) => (
              <tr key={p.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                <td className="px-4 py-3 font-mono font-bold text-brand-green-500 text-xs">{p.kode_unik}</td>
                <td className="px-4 py-3 font-medium text-neutral-900">{p.asal_pimpinan}</td>
                <td className="px-4 py-3 text-neutral-600 whitespace-nowrap max-w-xs">
                  <span className="line-clamp-1">{p.perihal}</span>
                </td>
                <td className="px-4 py-3 text-neutral-600 whitespace-nowrap text-xs">{formatDateTime(p.created_at)}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <Badge
                    label={STATUS_PENGADUAN_LABELS[p.status] ?? p.status}
                    colorClass={STATUS_PENGADUAN_COLORS[p.status]}
                  />
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setDetailId(p.id)}
                    className="text-brand-blue-500 hover:text-brand-blue-600 font-semibold text-xs px-2 py-1 rounded hover:bg-brand-blue-500/10 transition-colors"
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination meta={data?.data?.meta} onPageChange={setPage} />

      {detailId && (
        <Modal title="Detail Pengaduan" onClose={() => setDetailId(null)}>
          <DetailPanel id={detailId} onClose={() => setDetailId(null)} />
        </Modal>
      )}
    </AdminLayout>
  );
}