import { useMemo, useState } from "react";
import AdminLayout from "@/shared/components/layout/AdminLayout";
import Button from "@/shared/components/ui/Button";
import EmptyState from "@/shared/components/ui/EmptyState";
import Pagination from "@/shared/components/ui/Pagination";
import { SkeletonTableRows } from "@/shared/components/ui/Skeleton";
import Modal from "../components/Modal";
import PimpinanTable from "../components/PimpinanTable";
import FormBuatPimpinan from "../components/FormBuatPimpinan";
import FormEditPimpinan from "../components/FormEditPimpinan";
import ModalOverrideKredensial from "../components/ModalOverrideKredensial";
import { usePimpinanList, useCreatePimpinan, useUpdatePimpinan } from "../hooks/usePimpinanAdmin";
import { useAuthContext } from "@/app/providers/AuthProvider";
import { LEVEL_PIMPINAN_LABELS } from "@/shared/constants/statusEnum";

const PAGE_SIZE = 10;

export default function AdminManajemenPimpinanPage() {
  const { user: currentUser } = useAuthContext();

  // [ASUMSI] Endpoint /api/admin/pimpinan/ (file 01 §8.2) tidak punya param
  // pencarian teks di kontraknya, hanya ?level=&status_aktif=&page=&limit=.
  // Supaya kombinasi search + filter + pagination tidak desync, satu batch
  // data diambil dengan limit longgar lalu SEMUA filtering & pagination
  // dilakukan client-side — opsi ini eksplisit diizinkan di file 11 §2.3
  // ("bisa client-side filter dulu bila data belum terlalu banyak").
  const { data, isLoading, isError } = usePimpinanList({ limit: 200 });
  const allList = data?.data?.results ?? [];

  const [filterLevel, setFilterLevel]   = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [search, setSearch]             = useState("");
  const [page, setPage]                 = useState(1);

  const [formModal, setFormModal]                     = useState(null); // { mode: "create" | "edit", data? }
  const [kredensialTarget, setKredensialTarget]       = useState(null);
  const [confirmToggleTarget, setConfirmToggleTarget] = useState(null);
  const [togglingId, setTogglingId]                   = useState(null);

  const createMutation = useCreatePimpinan();
  const updateMutation = useUpdatePimpinan(formModal?.data?.uid);
  const toggleMutation = useUpdatePimpinan(confirmToggleTarget?.uid);

  const filteredList = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allList.filter((p) => {
      if (filterLevel && p.level !== filterLevel) return false;
      if (filterStatus === "aktif" && !p.status_aktif) return false;
      if (filterStatus === "nonaktif" && p.status_aktif) return false;
      if (
        q &&
        !(
          p.nama?.toLowerCase().includes(q) ||
          p.nama_wilayah?.toLowerCase().includes(q) ||
          p.label_lengkap?.toLowerCase().includes(q)
        )
      ) {
        return false;
      }
      return true;
    });
  }, [allList, filterLevel, filterStatus, search]);

  const totalPages = Math.max(1, Math.ceil(filteredList.length / PAGE_SIZE));
  const pagedList = filteredList.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSubmitForm = async (payload) => {
    if (formModal.mode === "create") {
      await createMutation.mutateAsync(payload);
    } else {
      await updateMutation.mutateAsync(payload);
    }
    setFormModal(null);
  };

  const handleConfirmToggle = async () => {
    setTogglingId(confirmToggleTarget.uid);
    try {
      await toggleMutation.mutateAsync({ status_aktif: !confirmToggleTarget.status_aktif });
    } finally {
      setTogglingId(null);
      setConfirmToggleTarget(null);
    }
  };

  return (
    <AdminLayout title="Manajemen Pimpinan">
      <div className="mb-4 p-3 bg-brand-gold-50 border border-brand-gold-300 rounded-lg text-sm text-neutral-700">
        Kelola akun Pimpinan Daerah, Cabang, dan Ranting yang mengakses Panel Pimpinan.
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <select
          value={filterLevel}
          onChange={(e) => { setFilterLevel(e.target.value); setPage(1); }}
          className="input-field sm:w-48"
          aria-label="Filter level"
        >
          <option value="">Semua Level</option>
          {Object.entries(LEVEL_PIMPINAN_LABELS).map(([val, lbl]) => (
            <option key={val} value={val}>{lbl}</option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
          className="input-field sm:w-48"
          aria-label="Filter status"
        >
          <option value="">Semua Status</option>
          <option value="aktif">Aktif</option>
          <option value="nonaktif">Nonaktif</option>
        </select>

        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Cari nama atau wilayah..."
          className="input-field flex-1"
        />

        <Button onClick={() => setFormModal({ mode: "create" })} className="whitespace-nowrap">
          + Tambah Akun Pimpinan
        </Button>
      </div>

      {isLoading && (
        <>
          <div className="hidden lg:block bg-white rounded-card border border-neutral-200 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  {["Nama", "Label Lengkap", "Email", "No. HP", "Status", "Aksi"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-neutral-700 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody><SkeletonTableRows rows={5} cols={6} /></tbody>
            </table>
          </div>
          <div className="lg:hidden text-center text-sm text-neutral-500 py-10">Memuat data...</div>
        </>
      )}

      {isError && (
        <p className="form-error text-center py-10">
          Gagal memuat data akun pimpinan. Coba muat ulang halaman.
        </p>
      )}

      {!isLoading && !isError && filteredList.length === 0 && (
        <EmptyState
          title="Belum ada akun Pimpinan"
          message="Klik '+ Tambah Akun Pimpinan' untuk membuat akun pertama."
        />
      )}

      {!isLoading && !isError && filteredList.length > 0 && (
        <>
          <PimpinanTable
            list={pagedList}
            currentUserRole={currentUser?.role}
            togglingId={togglingId}
            onEdit={(p) => setFormModal({ mode: "edit", data: p })}
            onToggleActive={(p) => setConfirmToggleTarget(p)}
            onOverrideKredensial={(p) => setKredensialTarget(p)}
          />

          <Pagination meta={{ page, total_pages: totalPages }} onPageChange={setPage} />
        </>
      )}

      {formModal && (
        <Modal
          title={formModal.mode === "create" ? "Tambah Akun Pimpinan" : "Edit Akun Pimpinan"}
          onClose={() => setFormModal(null)}
        >
          {formModal.mode === "create" ? (
            <FormBuatPimpinan
              onSubmit={handleSubmitForm}
              onCancel={() => setFormModal(null)}
              isSubmitting={createMutation.isPending}
            />
          ) : (
            <FormEditPimpinan
              initialData={formModal.data}
              onSubmit={handleSubmitForm}
              onCancel={() => setFormModal(null)}
              isSubmitting={updateMutation.isPending}
            />
          )}
          {(createMutation.isError || updateMutation.isError) && (
            <p className="form-error mt-3 text-center">Gagal menyimpan data. Coba lagi.</p>
          )}
        </Modal>
      )}

      {confirmToggleTarget && (
        <Modal
          title={confirmToggleTarget.status_aktif ? "Nonaktifkan Akun?" : "Aktifkan Akun?"}
          onClose={() => setConfirmToggleTarget(null)}
        >
          <p className="text-sm text-neutral-600 mb-6">
            {confirmToggleTarget.status_aktif ? (
              <>Akun <strong>{confirmToggleTarget.label_lengkap}</strong> tidak akan bisa login ke Panel Pimpinan selama dinonaktifkan.</>
            ) : (
              <>Akun <strong>{confirmToggleTarget.label_lengkap}</strong> akan bisa login kembali ke Panel Pimpinan.</>
            )}
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setConfirmToggleTarget(null)}>Batal</Button>
            <Button
              variant={confirmToggleTarget.status_aktif ? "danger" : undefined}
              loading={togglingId === confirmToggleTarget.uid}
              onClick={handleConfirmToggle}
            >
              {confirmToggleTarget.status_aktif ? "Ya, Nonaktifkan" : "Ya, Aktifkan"}
            </Button>
          </div>
        </Modal>
      )}

      {kredensialTarget && (
        <ModalOverrideKredensial
          pimpinan={kredensialTarget}
          onClose={() => setKredensialTarget(null)}
        />
      )}
    </AdminLayout>
  );
}