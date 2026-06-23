import { useState } from "react";
import AdminLayout from "@/shared/components/layout/AdminLayout";
import Button from "@/shared/components/ui/Button";
import EmptyState from "@/shared/components/ui/EmptyState";
import { SkeletonCardGrid } from "@/shared/components/ui/Skeleton";
import ProfilCard from "../../components/ProfilCard";
import AnggotaForm from "../../components/AnggotaForm";
import {
  useProfil,
  useCreateJabatan, useUpdateJabatan, useDeleteJabatan,
  useCreateAnggota, useUpdateAnggota, useDeleteAnggota,
} from "../../hooks/useProfil";

// Modal generik
function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-card shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-neutral-900 text-lg">{title}</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-neutral-100 text-neutral-500 min-h-[44px] min-w-[44px] flex items-center justify-center">
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

export default function AdminProfilPage() {
  const { data, isLoading } = useProfil();
  const jabatanList = data?.data ?? [];

  // Modal state
  const [jabatanModal, setJabatanModal] = useState(null); // null | { mode: "create"|"edit", data? }
  const [anggotaModal, setAnggotaModal] = useState(null); // null | { mode: "create"|"edit", jabatanId?, data? }
  const [deleteTarget, setDeleteTarget] = useState(null); // null | { type: "jabatan"|"anggota", id }

  const createJabatan = useCreateJabatan();
  const updateJabatan = useUpdateJabatan(jabatanModal?.data?.id);
  const deleteJabatan = useDeleteJabatan();
  const createAnggota = useCreateAnggota();
  const updateAnggota = useUpdateAnggota(anggotaModal?.data?.id);
  const deleteAnggota = useDeleteAnggota();

  const handleJabatanSubmit = async (payload) => {
    if (jabatanModal.mode === "create") await createJabatan.mutateAsync(payload);
    else await updateJabatan.mutateAsync(payload);
    setJabatanModal(null);
  };

  const handleAnggotaSubmit = async (payload) => {
    const finalPayload = anggotaModal.mode === "create"
      ? { ...payload, jabatan_id: anggotaModal.jabatanId }
      : payload;
    if (anggotaModal.mode === "create") await createAnggota.mutateAsync(finalPayload);
    else await updateAnggota.mutateAsync(finalPayload);
    setAnggotaModal(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === "jabatan") await deleteJabatan.mutateAsync(deleteTarget.id);
    else await deleteAnggota.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <AdminLayout title="Profil Kepengurusan">
      {/* Tombol tambah jabatan */}
      <div className="flex justify-end mb-6">
        <Button onClick={() => setJabatanModal({ mode: "create" })}>
          + Tambah Jabatan / Divisi
        </Button>
      </div>

      {isLoading && <SkeletonCardGrid count={6} />}

      {!isLoading && jabatanList.length === 0 && (
        <EmptyState
          title="Belum ada jabatan"
          message="Tambahkan jabatan/divisi terlebih dahulu, lalu isi anggotanya."
        />
      )}

      {/* Render per jabatan */}
      {!isLoading && jabatanList.map((jabatan) => (
        <div key={jabatan.id} className="mb-10">
          {/* Header jabatan */}
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-display font-bold text-neutral-900 text-lg">{jabatan.nama}</h2>
            <span className="text-xs text-neutral-400">urutan: {jabatan.urutan}</span>
            <div className="flex-1 h-px bg-neutral-200" />
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => setAnggotaModal({ mode: "create", jabatanId: jabatan.id })}
                className="text-xs text-brand-blue-500 font-semibold px-2 py-1 rounded hover:bg-brand-blue-500/10 transition-colors"
              >
                + Anggota
              </button>
              <button
                onClick={() => setJabatanModal({ mode: "edit", data: jabatan })}
                className="text-xs text-brand-blue-500 font-semibold px-2 py-1 rounded hover:bg-brand-blue-500/10 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => setDeleteTarget({ type: "jabatan", id: jabatan.id })}
                className="text-xs text-state-error font-semibold px-2 py-1 rounded hover:bg-red-50 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>

          {/* Grid anggota */}
          {jabatan.anggota?.length === 0 ? (
            <p className="text-sm text-neutral-400 italic">Belum ada anggota.</p>
          ) : (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {jabatan.anggota
                .sort((a, b) => a.urutan - b.urutan)
                .map((anggota) => (
                  <div key={anggota.id} className="relative group">
                    <ProfilCard anggota={anggota} />
                    {/* Overlay aksi */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-card flex flex-col items-center justify-center gap-2">
                      <button
                        onClick={() => setAnggotaModal({ mode: "edit", data: anggota })}
                        className="bg-white text-brand-blue-500 font-semibold text-xs px-3 py-1.5 rounded-lg hover:bg-neutral-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ type: "anggota", id: anggota.id })}
                        className="bg-white text-state-error font-semibold text-xs px-3 py-1.5 rounded-lg hover:bg-red-50"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      ))}

      {/* Modal Jabatan */}
      {jabatanModal && (
        <Modal
          title={jabatanModal.mode === "create" ? "Tambah Jabatan" : "Edit Jabatan"}
          onClose={() => setJabatanModal(null)}
        >
          <JabatanForm
            initialData={jabatanModal.data ?? null}
            onSubmit={handleJabatanSubmit}
            onCancel={() => setJabatanModal(null)}
            isSubmitting={createJabatan.isPending || updateJabatan.isPending}
          />
        </Modal>
      )}

      {/* Modal Anggota */}
      {anggotaModal && (
        <Modal
          title={anggotaModal.mode === "create" ? "Tambah Anggota" : "Edit Anggota"}
          onClose={() => setAnggotaModal(null)}
        >
          <AnggotaForm
            initialData={anggotaModal.data ?? null}
            jabatanList={jabatanList}
            onSubmit={handleAnggotaSubmit}
            onCancel={() => setAnggotaModal(null)}
            isSubmitting={createAnggota.isPending || updateAnggota.isPending}
          />
        </Modal>
      )}

      {/* Modal konfirmasi hapus */}
      {deleteTarget && (
        <Modal title="Konfirmasi Hapus" onClose={() => setDeleteTarget(null)}>
          <p className="text-sm text-neutral-600 mb-6">
            {deleteTarget.type === "jabatan"
              ? "Menghapus jabatan akan menghapus semua anggotanya. Lanjutkan?"
              : "Yakin ingin menghapus anggota ini?"}
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Batal</Button>
            <Button
              variant="danger"
              loading={deleteJabatan.isPending || deleteAnggota.isPending}
              onClick={handleDelete}
            >
              Hapus
            </Button>
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}

/** Form inline untuk jabatan (sederhana) */
function JabatanForm({ initialData, onSubmit, onCancel, isSubmitting }) {
  const [form, setForm] = useState(initialData ?? { nama: "", urutan: 0 });
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
      <div>
        <label className="form-label">Nama Jabatan / Divisi <span className="text-state-error">*</span></label>
        <input type="text" required value={form.nama}
          onChange={(e) => setForm((p) => ({ ...p, nama: e.target.value }))}
          placeholder="Misal: Ketua Umum, Bidang Kaderisasi"
          className="input-field"
        />
      </div>
      <div>
        <label className="form-label">Urutan Tampil</label>
        <input type="number" min="0" value={form.urutan}
          onChange={(e) => setForm((p) => ({ ...p, urutan: Number(e.target.value) }))}
          className="input-field w-28"
        />
      </div>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={onCancel}>Batal</Button>
        <Button type="submit" loading={isSubmitting}>
          {initialData ? "Simpan" : "Tambah"}
        </Button>
      </div>
    </form>
  );
}
