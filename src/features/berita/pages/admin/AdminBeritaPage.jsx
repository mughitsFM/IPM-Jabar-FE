import { useState } from "react";
import AdminLayout from "@/shared/components/layout/AdminLayout";
import Button from "@/shared/components/ui/Button";
import Badge from "@/shared/components/ui/Badge";
import EmptyState from "@/shared/components/ui/EmptyState";
import Pagination from "@/shared/components/ui/Pagination";
import { SkeletonTableRows } from "@/shared/components/ui/Skeleton";
import NewsForm from "../../components/NewsForm";
import { useBeritaList } from "../../hooks/useBeritaList";
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

// Sub-view: "list" | "create" | "edit"
export default function AdminBeritaPage() {
  const [view,     setView]     = useState("list");
  const [editData, setEditData] = useState(null);
  const [page,     setPage]     = useState(1);
  const [deleteId, setDeleteId] = useState(null);

  // Ambil semua status (admin bisa lihat draft/terjadwal/dipublikasikan)
  const { data, isLoading } = useBeritaList({ page, per_page: 10, all_status: true });

  const createMutation = useCreateBerita();
  const updateMutation = useUpdateBerita(editData?.id);
  const deleteMutation = useDeleteBerita();

  const handleCreate = async (payload) => {
    await createMutation.mutateAsync(payload);
    setView("list");
  };

  const handleUpdate = async (payload) => {
    await updateMutation.mutateAsync(payload);
    setView("list");
    setEditData(null);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteMutation.mutateAsync(deleteId);
    setDeleteId(null);
  };

  // ── Form view ────────────────────────────────────────────────────────────
  if (view === "create" || view === "edit") {
    return (
      <AdminLayout title={view === "create" ? "Tambah Berita" : "Edit Berita"}>
        <div className="max-w-3xl">
          <button
            onClick={() => { setView("list"); setEditData(null); }}
            className="flex items-center gap-1 text-sm text-brand-blue-500 hover:text-brand-blue-600 font-semibold mb-6"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Daftar
          </button>
          <div className="bg-white rounded-card border border-neutral-200 p-6">
            <NewsForm
              initialData={view === "edit" ? editData : null}
              onSubmit={view === "create" ? handleCreate : handleUpdate}
              isSubmitting={createMutation.isPending || updateMutation.isPending}
            />
          </div>
        </div>
      </AdminLayout>
    );
  }

  // ── List view ────────────────────────────────────────────────────────────
  return (
    <AdminLayout title="Manajemen Berita">
      {/* Header aksi */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-neutral-500">
          {data?.meta?.total_count ?? 0} total berita
        </p>
        <Button onClick={() => setView("create")}>
          + Tambah Berita
        </Button>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-card border border-neutral-200 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50">
              {["Judul", "Kategori", "Status", "Dipublikasikan", "Aksi"].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-semibold text-neutral-700 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading && <SkeletonTableRows rows={8} cols={5} />}

            {!isLoading && data?.results?.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12">
                  <EmptyState
                    title="Belum ada berita"
                    message="Klik 'Tambah Berita' untuk membuat berita pertama."
                  />
                </td>
              </tr>
            )}

            {!isLoading && data?.results?.map((b) => (
              <tr key={b.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                <td className="px-4 py-3 font-medium text-neutral-900 max-w-xs">
                  <span className="line-clamp-2">{b.judul}</span>
                  <span className="text-xs text-neutral-400 font-normal block">{b.slug}</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-neutral-600">
                  {KATEGORI_BERITA_LABELS[b.kategori] ?? b.kategori}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <Badge
                    label={STATUS_BERITA_LABELS[b.status] ?? b.status}
                    colorClass={STATUS_BERITA_COLORS[b.status]}
                  />
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

      {/* Pagination */}
      <Pagination
        meta={data?.meta}
        onPageChange={setPage}
      />

      {/* Modal konfirmasi hapus */}
      {deleteId && (
        <ConfirmDeleteModal
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          isLoading={deleteMutation.isPending}
        />
      )}
    </AdminLayout>
  );
}

function ConfirmDeleteModal({ onConfirm, onCancel, isLoading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-card shadow-xl p-6 max-w-sm w-full">
        <h2 className="font-display font-bold text-neutral-900 text-lg mb-2">Hapus Berita?</h2>
        <p className="text-sm text-neutral-600 mb-6">
          Berita yang dihapus tidak dapat dikembalikan. Yakin ingin melanjutkan?
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onCancel} disabled={isLoading}>Batal</Button>
          <Button variant="danger" onClick={onConfirm} loading={isLoading}>Hapus</Button>
        </div>
      </div>
    </div>
  );
}
