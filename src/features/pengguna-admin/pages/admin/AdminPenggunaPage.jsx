import { useState } from "react";
import AdminLayout from "@/shared/components/layout/AdminLayout";
import Button from "@/shared/components/ui/Button";
import Badge from "@/shared/components/ui/Badge";
import EmptyState from "@/shared/components/ui/EmptyState";
import { SkeletonTableRows } from "@/shared/components/ui/Skeleton";
import {
  usePenggunaList,
  useCreatePengguna,
  useUpdatePengguna,
  useDeletePengguna,
} from "../../hooks/usePengguna";
import { penggunaService } from "../../services/penggunaService";
import { ROLES, ROLE_LABELS } from "@/shared/constants/roles";
import { formatDateTime } from "@/shared/utils/formatDate";
import { useAuthContext } from "@/app/providers/AuthProvider";
import { useQueryClient } from "@tanstack/react-query";

// ── Modal generik ────────────────────────────────────────────────────────────
function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-card shadow-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-neutral-900 text-lg">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="p-1 rounded hover:bg-neutral-100 min-h-[44px] min-w-[44px] flex items-center justify-center text-neutral-500"
          >
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

// ── Form tambah / edit pengguna admin ────────────────────────────────────────
const DEFAULT_FORM = { nama: "", email: "", password: "", role: ROLES.EDITOR };

function PenggunaForm({ initialData, onSubmit, onCancel, isSubmitting }) {
  const isEdit = Boolean(initialData);
  const [form, setForm] = useState(
    isEdit
      ? { nama: initialData.nama, role: initialData.role }
      : DEFAULT_FORM
  );
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
      {/* Nama */}
      <div>
        <label className="form-label">
          Nama Lengkap <span className="text-state-error">*</span>
        </label>
        <input
          name="nama"
          type="text"
          required
          value={form.nama}
          onChange={handleChange}
          placeholder="Nama admin"
          className="input-field"
        />
      </div>

      {/* Email — hanya saat buat akun baru */}
      {!isEdit && (
        <div>
          <label className="form-label">
            Email <span className="text-state-error">*</span>
          </label>
          <input
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="admin@ipmjabar.or.id"
            className="input-field"
          />
        </div>
      )}

      {/* Password — hanya saat buat akun baru */}
      {!isEdit && (
        <div>
          <label className="form-label">
            Password Awal <span className="text-state-error">*</span>
          </label>
          <div className="relative">
            <input
              name="password"
              type={showPass ? "text" : "password"}
              required
              minLength={8}
              value={form.password}
              onChange={handleChange}
              placeholder="Minimal 8 karakter"
              className="input-field pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPass((p) => !p)}
              aria-label={showPass ? "Sembunyikan password" : "Tampilkan password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {showPass
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  : <>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </>
                }
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Role */}
      <div>
        <label className="form-label">
          Role <span className="text-state-error">*</span>
        </label>
        <select name="role" value={form.role} onChange={handleChange} className="input-field">
          {Object.entries(ROLE_LABELS).map(([val, lbl]) => (
            <option key={val} value={val}>{lbl}</option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Batal</Button>
        <Button type="submit" loading={isSubmitting}>
          {isEdit ? "Simpan" : "Buat Akun"}
        </Button>
      </div>
    </form>
  );
}

// ── Page utama ───────────────────────────────────────────────────────────────
export default function AdminPenggunaPage() {
  const { user: currentUser } = useAuthContext();
  const qc = useQueryClient();

  const { data, isLoading }    = usePenggunaList();
  const list = data?.data ?? [];

  const [formModal,     setFormModal]     = useState(null);  // null | { mode, data? }
  const [deleteTarget,  setDeleteTarget]  = useState(null);  // id
  const [togglingId,    setTogglingId]    = useState(null);  // id sedang proses toggle

  const createMutation = useCreatePengguna();
  const updateMutation = useUpdatePengguna(formModal?.data?.id);
  const deleteMutation = useDeletePengguna();

  // Toggle aktif/nonaktif — langsung pakai service, lalu invalidate
  const handleToggleActive = async (pengguna) => {
    setTogglingId(pengguna.id);
    try {
      await penggunaService.toggleActive(pengguna.id, !pengguna.is_active);
      qc.invalidateQueries({ queryKey: ["pengguna", "list"] });
    } finally {
      setTogglingId(null);
    }
  };

  const handleSubmit = async (payload) => {
    if (formModal.mode === "create") await createMutation.mutateAsync(payload);
    else await updateMutation.mutateAsync(payload);
    setFormModal(null);
  };

  return (
    <AdminLayout title="Manajemen Pengguna Admin">
      {/* Info akses */}
      <div className="mb-4 p-3 bg-brand-gold-50 border border-brand-gold-300 rounded-lg text-sm text-neutral-700">
        Halaman ini hanya dapat diakses oleh{" "}
        <strong>Super Admin</strong>. Kelola akun editor dan admin di sini.
      </div>

      {/* Tombol tambah */}
      <div className="flex justify-end mb-6">
        <Button onClick={() => setFormModal({ mode: "create" })}>
          + Tambah Admin
        </Button>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-card border border-neutral-200 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50">
              {["Nama", "Email", "Role", "Terakhir Masuk", "Status", "Aksi"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left font-semibold text-neutral-700 whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading && <SkeletonTableRows rows={5} cols={6} />}

            {!isLoading && list.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10">
                  <EmptyState
                    title="Belum ada pengguna admin"
                    message="Klik '+ Tambah Admin' untuk membuat akun pertama."
                  />
                </td>
              </tr>
            )}

            {!isLoading && list.map((p) => {
              const isSelf       = p.uid === currentUser?.uid;
              const isToggling   = togglingId === p.id;

              return (
                <tr
                  key={p.id}
                  className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
                >
                  {/* Nama */}
                  <td className="px-4 py-3 font-medium text-neutral-900">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-brand-blue-500/10 flex items-center justify-center text-brand-blue-500 font-bold text-xs shrink-0">
                        {p.nama?.charAt(0)?.toUpperCase()}
                      </div>
                      <span>{p.nama}</span>
                      {isSelf && (
                        <span className="text-xs text-neutral-400">(Anda)</span>
                      )}
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-4 py-3 text-neutral-600">{p.email}</td>

                  {/* Role */}
                  <td className="px-4 py-3">
                    <Badge
                      label={ROLE_LABELS[p.role] ?? p.role}
                      colorClass={
                        p.role === ROLES.SUPER_ADMIN
                          ? "bg-brand-red-500/10 text-brand-red-500"
                          : "bg-brand-blue-500/10 text-brand-blue-500"
                      }
                    />
                  </td>

                  {/* Last sign-in */}
                  <td className="px-4 py-3 text-neutral-600 text-xs whitespace-nowrap">
                    {p.last_sign_in ? formatDateTime(p.last_sign_in) : "Belum pernah"}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <Badge
                      label={p.is_active ? "Aktif" : "Nonaktif"}
                      colorClass={
                        p.is_active
                          ? "bg-brand-green-50 text-brand-green-500"
                          : "bg-neutral-200 text-neutral-500"
                      }
                    />
                  </td>

                  {/* Aksi */}
                  <td className="px-4 py-3">
                    <div className="flex gap-2 whitespace-nowrap">
                      {/* Edit */}
                      <button
                        disabled={isSelf}
                        onClick={() => setFormModal({ mode: "edit", data: p })}
                        className="text-brand-blue-500 hover:text-brand-blue-600 font-semibold text-xs px-2 py-1 rounded hover:bg-brand-blue-500/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Edit
                      </button>

                      {/* Toggle aktif */}
                      <button
                        disabled={isSelf || isToggling}
                        onClick={() => handleToggleActive(p)}
                        className="text-brand-gold-600 hover:text-brand-gold-700 font-semibold text-xs px-2 py-1 rounded hover:bg-brand-gold-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {isToggling
                          ? "…"
                          : p.is_active ? "Nonaktifkan" : "Aktifkan"}
                      </button>

                      {/* Hapus */}
                      <button
                        disabled={isSelf}
                        onClick={() => setDeleteTarget(p.id)}
                        className="text-state-error font-semibold text-xs px-2 py-1 rounded hover:bg-red-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal form tambah / edit */}
      {formModal && (
        <Modal
          title={formModal.mode === "create" ? "Tambah Admin Baru" : "Edit Admin"}
          onClose={() => setFormModal(null)}
        >
          <PenggunaForm
            initialData={formModal.data ?? null}
            onSubmit={handleSubmit}
            onCancel={() => setFormModal(null)}
            isSubmitting={createMutation.isPending || updateMutation.isPending}
          />
          {(createMutation.isError || updateMutation.isError) && (
            <p className="form-error mt-3 text-center">
              Gagal menyimpan data. Coba lagi.
            </p>
          )}
        </Modal>
      )}

      {/* Modal konfirmasi hapus */}
      {deleteTarget && (
        <Modal title="Hapus Akun Admin?" onClose={() => setDeleteTarget(null)}>
          <p className="text-sm text-neutral-600 mb-6">
            Akun yang dihapus tidak dapat dikembalikan. Admin tersebut tidak
            akan dapat login lagi.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
              Batal
            </Button>
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
          {deleteMutation.isError && (
            <p className="form-error mt-3 text-center">
              Gagal menghapus akun. Coba lagi.
            </p>
          )}
        </Modal>
      )}
    </AdminLayout>
  );
}
