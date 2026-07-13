import { useMemo, useState } from "react";
import AdminLayout from "@/shared/components/layout/AdminLayout";
import Button from "@/shared/components/ui/Button";
import EmptyState from "@/shared/components/ui/EmptyState";
import Pagination from "@/shared/components/ui/Pagination";
import { SkeletonTableRows } from "@/shared/components/ui/Skeleton";
import Modal from "@/shared/components/ui/Modal";
import PimpinanTable from "../components/PimpinanTable";
import FormGenerateAkunPimpinan from "../components/FormGenerateAkunPimpinan";
import FormEditPimpinan from "../components/FormEditPimpinan";
import ModalOverrideKredensial from "../components/ModalOverrideKredensial";
import ModalHasilGenerateAkun from "../components/ModalHasilGenerateAkun";
import { usePimpinanList, useGenerateAkunPimpinan, useUpdatePimpinan } from "../hooks/usePimpinanAdmin";
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

  const [generateModalOpen, setGenerateModalOpen]     = useState(false);
  const [hasilGenerate, setHasilGenerate]             = useState(null); // array akun hasil generate | null
  const [editTarget, setEditTarget]                   = useState(null); // data pimpinan | null
  const [kredensialTarget, setKredensialTarget]       = useState(null);
  const [confirmToggleTarget, setConfirmToggleTarget] = useState(null);
  const [togglingId, setTogglingId]                   = useState(null);

  const generateMutation = useGenerateAkunPimpinan();
  const updateMutation   = useUpdatePimpinan(editTarget?.uid);
  const toggleMutation   = useUpdatePimpinan(confirmToggleTarget?.uid);

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
          p.label_lengkap?.toLowerCase().includes(q) ||
          p.email?.toLowerCase().includes(q)
        )
      ) {
        return false;
      }
      return true;
    });
  }, [allList, filterLevel, filterStatus, search]);

  const totalPages = Math.max(1, Math.ceil(filteredList.length / PAGE_SIZE));
  const pagedList = filteredList.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleGenerate = async (jumlah) => {
    const res = await generateMutation.mutateAsync(jumlah);
    setGenerateModalOpen(false);
    setHasilGenerate(res?.data ?? []);
  };

  const handleSubmitEdit = async (payload) => {
    await updateMutation.mutateAsync(payload);
    setEditTarget(null);
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
        Kelola akun Pimpinan Daerah, Cabang, dan Ranting yang mengakses Panel Pimpinan. Nama, level,
        dan wilayah akun baru diisi oleh pimpinan sendiri saat onboarding pertama — admin cukup
        menentukan jumlah akun yang perlu dibuat.
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
          placeholder="Cari nama, wilayah, atau email..."
          className="input-field flex-1"
        />

        <Button onClick={() => setGenerateModalOpen(true)} className="whitespace-nowrap">
          + Generate Akun Pimpinan
        </Button>
      </div>

      {isLoading && (
        <>
          <div className="hidden lg:block bg-white rounded-card border border-neutral-200 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  {["Nama", "Label Lengkap", "Email", "Kredensial", "No. HP", "Status", "Aksi"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-neutral-700 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody><SkeletonTableRows rows={5} cols={7} /></tbody>
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
          message="Klik '+ Generate Akun Pimpinan' untuk membuat akun pertama."
        />
      )}

      {!isLoading && !isError && filteredList.length > 0 && (
        <>
          <PimpinanTable
            list={pagedList}
            currentUserRole={currentUser?.role}
            togglingId={togglingId}
            onEdit={(p) => setEditTarget(p)}
            onToggleActive={(p) => setConfirmToggleTarget(p)}
            onOverrideKredensial={(p) => setKredensialTarget(p)}
          />

          <Pagination meta={{ page, total_pages: totalPages }} onPageChange={setPage} />
        </>
      )}

      {/* Modal form: admin cuma isi jumlah akun yang mau digenerate */}
      <Modal
        open={generateModalOpen}
        title="Generate Akun Pimpinan"
        onClose={() => setGenerateModalOpen(false)}
      >
        <FormGenerateAkunPimpinan
          onSubmit={handleGenerate}
          onCancel={() => setGenerateModalOpen(false)}
          isSubmitting={generateMutation.isPending}
        />
        {generateMutation.isError && (
          <p className="form-error mt-3 text-center">Gagal generate akun. Coba lagi.</p>
        )}
      </Modal>

      {/* Modal hasil generate — tampil sekali, berisi email+password yang wajib dicatat admin */}
      <Modal
        open={!!hasilGenerate}
        title="Akun Berhasil Digenerate"
        onClose={() => setHasilGenerate(null)}
      >
        {hasilGenerate && (
          <ModalHasilGenerateAkun akunList={hasilGenerate} onClose={() => setHasilGenerate(null)} />
        )}
      </Modal>

      {/* Modal edit — koreksi manual oleh admin (nama/level/wilayah/no_hp/status), tidak menyentuh kredensial */}
      <Modal
        open={!!editTarget}
        title="Edit Akun Pimpinan"
        onClose={() => setEditTarget(null)}
      >
        {editTarget && (
          <FormEditPimpinan
            initialData={editTarget}
            onSubmit={handleSubmitEdit}
            onCancel={() => setEditTarget(null)}
            isSubmitting={updateMutation.isPending}
          />
        )}
        {updateMutation.isError && (
          <p className="form-error mt-3 text-center">Gagal menyimpan data. Coba lagi.</p>
        )}
      </Modal>

      <Modal
        open={!!confirmToggleTarget}
        title={confirmToggleTarget?.status_aktif ? "Nonaktifkan Akun?" : "Aktifkan Akun?"}
        onClose={() => setConfirmToggleTarget(null)}
      >
        {confirmToggleTarget && (
          <>
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
          </>
        )}
      </Modal>

      {kredensialTarget && (
        <ModalOverrideKredensial
          pimpinan={kredensialTarget}
          onClose={() => setKredensialTarget(null)}
        />
      )}
    </AdminLayout>
  );
}