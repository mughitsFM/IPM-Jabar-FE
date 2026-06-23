import { useState } from "react";
import AdminLayout from "@/shared/components/layout/AdminLayout";
import Button from "@/shared/components/ui/Button";
import Badge from "@/shared/components/ui/Badge";
import EmptyState from "@/shared/components/ui/EmptyState";
import { SkeletonTableRows } from "@/shared/components/ui/Skeleton";
import ProkerForm from "../../components/ProkerForm";
import {
  useProkerList,
  useCreateProker,
  useUpdateProker,
  useUpdateStatusProker,
  useDeleteProker,
} from "../../hooks/useProker";
import { formatShort } from "@/shared/utils/formatDate";
import {
  STATUS_PROKER_LABELS,
  STATUS_PROKER_COLORS,
  STATUS_PROKER,
} from "@/shared/constants/statusEnum";

// Modal generik (sama pola dengan AdminProfilPage)
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

export default function AdminProkerPage() {
  const [formModal,    setFormModal]    = useState(null); // null | { mode, data? }
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [statusTarget, setStatusTarget] = useState(null); // { id, currentStatus }

  const { data, isLoading } = useProkerList();
  const prokerList = data?.data ?? [];

  const createMutation = useCreateProker();
  const updateMutation = useUpdateProker(formModal?.data?.id);
  const statusMutation = useUpdateStatusProker(statusTarget?.id);
  const deleteMutation = useDeleteProker();

  const handleSubmit = async (payload) => {
    if (formModal.mode === "create") await createMutation.mutateAsync(payload);
    else await updateMutation.mutateAsync(payload);
    setFormModal(null);
  };

  const handleStatusChange = async (e) => {
    await statusMutation.mutateAsync(e.target.value);
    setStatusTarget(null);
  };

  return (
    <AdminLayout title="Program Kerja">
      {/* Header aksi */}
      <div className="flex justify-end mb-6">
        <Button onClick={() => setFormModal({ mode: "create" })}>
          + Tambah Proker
        </Button>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-card border border-neutral-200 overflow-x-auto">
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

            {!isLoading && prokerList.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12">
                  <EmptyState title="Belum ada program kerja" message="Klik '+ Tambah Proker' untuk memulai." />
                </td>
              </tr>
            )}

            {!isLoading && prokerList.map((p) => (
              <tr key={p.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                <td className="px-4 py-3 font-medium text-neutral-900 max-w-xs">
                  <span className="line-clamp-2">{p.nama}</span>
                </td>
                <td className="px-4 py-3 text-neutral-600 whitespace-nowrap">{p.bidang || "—"}</td>
                <td className="px-4 py-3 text-neutral-600 text-xs whitespace-nowrap">
                  {p.tanggal_mulai ? formatShort(p.tanggal_mulai) : "—"}
                  {p.tanggal_selesai ? ` s/d ${formatShort(p.tanggal_selesai)}` : ""}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {/* Status bisa diubah langsung via dropdown inline */}
                  {statusTarget?.id === p.id ? (
                    <select
                      defaultValue={p.status}
                      onChange={handleStatusChange}
                      onBlur={() => setStatusTarget(null)}
                      autoFocus
                      className="input-field py-1 text-xs w-36"
                    >
                      {Object.entries(STATUS_PROKER_LABELS).map(([val, lbl]) => (
                        <option key={val} value={val}>{lbl}</option>
                      ))}
                    </select>
                  ) : (
                    <button
                      onClick={() => setStatusTarget({ id: p.id, currentStatus: p.status })}
                      title="Klik untuk ubah status"
                    >
                      <Badge
                        label={STATUS_PROKER_LABELS[p.status] ?? p.status}
                        colorClass={STATUS_PROKER_COLORS[p.status]}
                        className="cursor-pointer hover:opacity-80"
                      />
                    </button>
                  )}
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

      {/* Modal form */}
      {formModal && (
        <Modal
          title={formModal.mode === "create" ? "Tambah Program Kerja" : "Edit Program Kerja"}
          onClose={() => setFormModal(null)}
        >
          <ProkerForm
            initialData={formModal.data ?? null}
            onSubmit={handleSubmit}
            onCancel={() => setFormModal(null)}
            isSubmitting={createMutation.isPending || updateMutation.isPending}
          />
        </Modal>
      )}

      {/* Modal hapus */}
      {deleteTarget && (
        <Modal title="Hapus Program Kerja?" onClose={() => setDeleteTarget(null)}>
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
      )}
    </AdminLayout>
  );
}
