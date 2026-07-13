{/* frontend/features/berita/pages/admin/AdminBeritaPage.jsx (lengkap) */}
import { useState } from "react";
import AdminLayout from "@/shared/components/layout/AdminLayout";
import Button from "@/shared/components/ui/Button";
import Badge from "@/shared/components/ui/Badge";
import EmptyState from "@/shared/components/ui/EmptyState";
import Modal from "@/shared/components/ui/Modal";
import Pagination from "@/shared/components/ui/Pagination";
import { SkeletonTableRows, SkeletonLine } from "@/shared/components/ui/Skeleton";
import NewsForm from "../../components/NewsForm";
import { useBeritaAdminList } from "../../hooks/useBeritaList";
import {
  useCreateBerita,
  useUpdateBerita,
  useDeleteBerita,
} from "../../hooks/useBeritaMutations";
import { formatShort } from "@/shared/utils/formatDate";
import {
  STATUS_BERITA_LABELS,
  STATUS_BERITA_COLORS,
  KATEGORI_BERITA_LABELS,
} from "@/shared/constants/statusEnum";

export default function AdminBeritaPage() {
  const [view,     setView]     = useState("list");
  const [editData, setEditData] = useState(null);
  const [page,     setPage]     = useState(1);
  const [deleteId, setDeleteId] = useState(null);

  // BUG FIX: sebelumnya useBeritaList (endpoint publik) — lihat catatan
  // lengkap di hooks/useBeritaList.js.
  const { data, isLoading } = useBeritaAdminList({ page, limit: 10 });

  const createMutation = useCreateBerita();
  const updateMutation = useUpdateBerita();
  const deleteMutation = useDeleteBerita();

  const closeForm = () => { setView("list"); setEditData(null); };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteMutation.mutateAsync(deleteId);
    setDeleteId(null);
  };

  if (view === "create" || view === "edit") {
    return (
      <AdminLayout title={view === "create" ? "Tambah Berita" : "Edit Berita"}>
        <div className="max-w-3xl">
          <button
            onClick={closeForm}
            className="flex items-center gap-1 text-sm text-brand-blue-500 hover:text-brand-blue-600 font-semibold mb-6 min-h-[44px]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Daftar
          </button>
          <div className="bg-white rounded-card border border-neutral-200 p-4 sm:p-6">
            <NewsForm
              initialData={view === "edit" ? editData : null}
              createMutation={createMutation}
              updateMutation={updateMutation}
              onDone={closeForm}
            />
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Manajemen Berita">
      <div className="flex items-center justify-between gap-3 mb-6">
        <p className="text-sm text-neutral-500">
          <span className="font-semibold text-neutral-700">{data?.data?.meta?.total ?? 0}</span> total berita
        </p>
        <Button onClick={() => setView("create")}>+ Tambah Berita</Button>
      </div>

      {/* Kosong / loading di luar tabel supaya konsisten untuk mobile & desktop */}
      {!isLoading && data?.data?.results?.length === 0 && (
        <div className="bg-white rounded-card border border-neutral-200">
          <EmptyState title="Belum ada berita" message="Klik 'Tambah Berita' untuk membuat berita pertama." />
        </div>
      )}

      {(isLoading || data?.data?.results?.length > 0) && (
        <>
          {/* ===== Tampilan tabel — desktop (md ke atas) ===== */}
          <div className="hidden md:block bg-white rounded-card border border-neutral-200 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  {["Judul", "Kategori", "Status", "Dipublikasikan", "Aksi"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-neutral-700 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading && <SkeletonTableRows rows={8} cols={5} />}

                {!isLoading && data?.data?.results?.map((b) => (
                  <tr key={b.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-neutral-900 max-w-xs">
                      <span className="line-clamp-2">{b.judul}</span>
                      <span className="text-xs text-neutral-400 font-normal block">{b.slug}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-neutral-600">
                      {KATEGORI_BERITA_LABELS[b.kategori] ?? b.kategori}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge label={STATUS_BERITA_LABELS[b.status] ?? b.status} colorClass={STATUS_BERITA_COLORS[b.status]} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-neutral-600">
                      {b.published_at ? formatShort(b.published_at) : "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { setEditData(b); setView("edit"); }}
                          className="text-brand-blue-500 hover:text-brand-blue-600 font-semibold text-xs px-2 py-1 rounded hover:bg-brand-blue-500/10 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteId(b.id)}
                          className="text-state-error hover:text-red-700 font-semibold text-xs px-2 py-1 rounded hover:bg-red-50 transition-colors"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ===== Tampilan kartu — mobile & tablet kecil (di bawah md) =====
              Tabel mentah butuh geser horizontal di layar sempit — kartu ini
              menampilkan info yang sama tanpa perlu scroll ke samping. */}
          <div className="md:hidden space-y-3">
            {isLoading && Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-card border border-neutral-200 p-4 space-y-3">
                <SkeletonLine className="w-3/4" />
                <SkeletonLine className="w-1/3" />
              </div>
            ))}

            {!isLoading && data?.data?.results?.map((b) => (
              <div key={b.id} className="bg-white rounded-card border border-neutral-200 p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0">
                    <p className="font-medium text-neutral-900 text-sm line-clamp-2">{b.judul}</p>
                    <p className="text-xs text-neutral-400 truncate mt-0.5">{b.slug}</p>
                  </div>
                  <Badge label={STATUS_BERITA_LABELS[b.status] ?? b.status} colorClass={STATUS_BERITA_COLORS[b.status]} className="shrink-0" />
                </div>
                <div className="flex items-center justify-between text-xs text-neutral-500 mt-3 pt-3 border-t border-neutral-100">
                  <span>{KATEGORI_BERITA_LABELS[b.kategori] ?? b.kategori} · {b.published_at ? formatShort(b.published_at) : "Belum terbit"}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => { setEditData(b); setView("edit"); }}
                      className="text-brand-blue-500 hover:bg-brand-blue-500/10 font-semibold px-2.5 py-1.5 rounded-lg transition-colors min-h-[36px]"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteId(b.id)}
                      className="text-state-error hover:bg-red-50 font-semibold px-2.5 py-1.5 rounded-lg transition-colors min-h-[36px]"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Pagination meta={data?.data?.meta} onPageChange={setPage} />

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Hapus Berita?" maxWidth="max-w-sm">
        <p className="text-sm text-neutral-600 mb-6">
          Berita yang dihapus tidak dapat dikembalikan. Yakin ingin melanjutkan?
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleteId(null)} disabled={deleteMutation.isPending}>Batal</Button>
          <Button variant="danger" onClick={handleDelete} loading={deleteMutation.isPending}>Hapus</Button>
        </div>
      </Modal>
    </AdminLayout>
  );
}