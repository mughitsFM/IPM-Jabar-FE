{/* frontend/features/proker/pages/admin/AdminProkerPage.jsx (lengkap) */}
import { useState } from "react";
import AdminLayout from "@/shared/components/layout/AdminLayout";
import Button from "@/shared/components/ui/Button";
import Badge from "@/shared/components/ui/Badge";
import EmptyState from "@/shared/components/ui/EmptyState";
import Modal from "@/shared/components/ui/Modal";
import { SkeletonTableRows, SkeletonLine } from "@/shared/components/ui/Skeleton";
import ProkerForm from "../../components/ProkerForm";
import {
  useProkerList,
  useCreateProker,
  useUpdateProker,
  useDeleteProker,
} from "../../hooks/useProker";
import { formatShort } from "@/shared/utils/formatDate";
import {
  STATUS_PROKER_LABELS,
  STATUS_PROKER_COLORS,
  BIDANG_PROKER_LABELS,
} from "@/shared/constants/statusEnum";

export default function AdminProkerPage() {
  const [formModal,    setFormModal]    = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formError,    setFormError]    = useState(null);

  const { data, isLoading } = useProkerList();
  const prokerList = data?.data?.results ?? [];

  const createMutation = useCreateProker();
  const updateMutation = useUpdateProker(formModal?.data?.id);
  const deleteMutation = useDeleteProker();

  const handleSubmit = async (payload) => {
    setFormError(null);                                     // ⬅️ reset sebelum submit baru
    try {
      if (formModal.mode === "create") await createMutation.mutateAsync(payload);
      else await updateMutation.mutateAsync(payload);
      setFormModal(null);
    } catch (err) {                                          // ⬅️ baru: tangkap & tampilkan error
      const data = err?.response?.data;
      const detail =
        data?.errors?.non_field_errors?.[0] ||
        Object.values(data?.errors ?? {})?.[0]?.[0] ||
        data?.message ||
        "Gagal menyimpan program kerja. Silakan coba lagi.";
      setFormError(detail);
    }
  };

  const handleCloseFormModal = () => {                       // ⬅️ baru, biar error ikut ke-reset
    setFormModal(null);
    setFormError(null);
  };

  return (
    <AdminLayout title="Program Kerja">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          {/* <h2 className="font-display font-bold text-neutral-900 text-lg sm:text-xl">Program Kerja Wilayah</h2> */}
          <p className="text-sm text-neutral-500 mt-1">
            <span className="font-semibold text-neutral-700">{prokerList.length}</span> program kerja tercatat.
          </p>
        </div>
        <Button onClick={() => setFormModal({ mode: "create" })} className="shrink-0">+ Tambah Proker</Button>
      </div>

      {!isLoading && prokerList.length === 0 && (
        <div className="bg-white rounded-card border border-neutral-200">
          <EmptyState title="Belum ada program kerja" message="Klik '+ Tambah Proker' untuk memulai." />
        </div>
      )}

      {(isLoading || prokerList.length > 0) && (
        <div className="bg-white rounded-card border border-neutral-200 overflow-hidden">
          {/* ===== Tabel — desktop (md ke atas) ===== */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  {["Nama Program Kerja", "Bidang", "Tanggal", "Status", "Aksi"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-neutral-700 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading && <SkeletonTableRows rows={6} cols={5} />}

                {!isLoading && prokerList.map((p) => (
                  <tr key={p.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-neutral-900 max-w-xs">
                      <span className="line-clamp-2">{p.nama_kegiatan}</span>
                    </td>
                    <td className="px-4 py-3 text-neutral-600 whitespace-nowrap">{BIDANG_PROKER_LABELS[p.bidang] ?? p.bidang ?? "—"}</td>
                    <td className="px-4 py-3 text-neutral-600 text-xs whitespace-nowrap">
                      {p.tanggal_mulai ? formatShort(p.tanggal_mulai) : "—"}
                      {p.tanggal_selesai ? ` s/d ${formatShort(p.tanggal_selesai)}` : ""}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge label={STATUS_PROKER_LABELS[p.status] ?? p.status} colorClass={STATUS_PROKER_COLORS[p.status]} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setFormModal({ mode: "edit", data: p })}
                          className="text-brand-blue-500 hover:text-brand-blue-600 font-semibold text-xs px-2 py-1 rounded hover:bg-brand-blue-500/10 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(p.id)}
                          className="text-state-error font-semibold text-xs px-2 py-1 rounded hover:bg-red-50 transition-colors"
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

          {/* ===== Kartu — mobile & tablet kecil (di bawah md) ===== */}
          <div className="md:hidden divide-y divide-neutral-100">
            {isLoading && Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 space-y-2">
                <SkeletonLine className="w-2/3" />
                <SkeletonLine className="w-1/3" />
              </div>
            ))}

            {!isLoading && prokerList.map((p) => (
              <div key={p.id} className="p-4">
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <p className="text-sm font-medium text-neutral-900 line-clamp-2">{p.nama_kegiatan}</p>
                  <Badge label={STATUS_PROKER_LABELS[p.status] ?? p.status} colorClass={STATUS_PROKER_COLORS[p.status]} className="shrink-0" />
                </div>
                <p className="text-xs text-neutral-500">
                  {BIDANG_PROKER_LABELS[p.bidang] ?? p.bidang ?? "—"}
                  {p.tanggal_mulai && (
                    <>
                      {" · "}
                      {formatShort(p.tanggal_mulai)}
                      {p.tanggal_selesai ? ` s/d ${formatShort(p.tanggal_selesai)}` : ""}
                    </>
                  )}
                </p>
                <div className="flex items-center gap-1 mt-3 pt-3 border-t border-neutral-100">
                  <button
                    onClick={() => setFormModal({ mode: "edit", data: p })}
                    className="text-brand-blue-500 hover:bg-brand-blue-500/10 font-semibold text-xs px-2.5 py-1.5 rounded-lg transition-colors min-h-[36px]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget(p.id)}
                    className="text-state-error hover:bg-red-50 font-semibold text-xs px-2.5 py-1.5 rounded-lg transition-colors min-h-[36px]"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal
        open={!!formModal}
        onClose={handleCloseFormModal}
        title={formModal?.mode === "create" ? "Tambah Program Kerja" : "Edit Program Kerja"}
      >
        <ProkerForm
          initialData={formModal?.data ?? null}
          onSubmit={handleSubmit}
          onCancel={handleCloseFormModal}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          error={formError}
        />
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Hapus Program Kerja?" maxWidth="max-w-sm">
        <p className="text-sm text-neutral-600 mb-6">
          Program kerja yang dihapus tidak dapat dikembalikan. Yakin ingin melanjutkan?
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Batal</Button>
          <Button
            variant="danger"
            loading={deleteMutation.isPending}
            onClick={async () => {
              await deleteMutation.mutateAsync(deleteTarget);
              setDeleteTarget(null);
            }}
          >
            Hapus
          </Button>
        </div>
      </Modal>
    </AdminLayout>
  );
}
