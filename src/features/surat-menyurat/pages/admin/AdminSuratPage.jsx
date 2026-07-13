{/* frontend/features/surat-menyurat/pages/admin/AdminSuratPage.jsx (lengkap) */}
// Struktur identik PimpinanSuratPage — dibungkus AdminLayout, dipakai role
// editor/super_admin. Backend membedakan perilaku lewat request.user.role
// (lihat surat_menyurat/services.py), bukan lewat endpoint terpisah.
//
// UPDATE (07-arsip-dan-rekap.md §4.4): menambahkan tombol "Unduh Semua (ZIP)"
// & "Unduh Rekap Excel" di atas tabel, mengikuti tipe tab yang sedang aktif
// (masuk/keluar). Tidak ada halaman Arsip terpisah untuk sisi Admin — cukup
// disambungkan ke endpoint /api/arsip/surat/... yang sama dipakai sisi
// Pimpinan.
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "@/shared/components/layout/AdminLayout";
import Button from "@/shared/components/ui/Button";
import BottomSheetModal from "@/shared/components/ui/BottomSheetModal";
import { useAuthContext } from "@/app/providers/AuthProvider";
import SuratListTable from "../../components/SuratListTable";
import SuratDetailPanel from "../../components/SuratDetailPanel";
import SuratForm from "../../components/SuratForm";
import { useSuratMasuk, useSuratKeluar, useKirimSurat, useSuratDetail } from "../../hooks/useSurat";
import { arsipService } from "@/features/arsip/services/arsipService";

export default function AdminSuratPage() {
  const { user } = useAuthContext();
  const { id: deepLinkId } = useParams(); // dari notifikasi: /admin/surat/<id>
  const navigate = useNavigate();

  const [tab, setTab] = useState("masuk");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [showCompose, setShowCompose] = useState(false);
  const [unduhState, setUnduhState] = useState({ zip: false, excel: false });
  const [unduhError, setUnduhError] = useState(null);

  const masuk = useSuratMasuk({ page, limit: 10 });
  const keluar = useSuratKeluar({ page, limit: 10 });
  const kirim = useKirimSurat();

  const { data: deepLinkData } = useSuratDetail(deepLinkId);
  useEffect(() => {
    if (deepLinkData?.data) setSelected(deepLinkData.data);
  }, [deepLinkData]);

  const active = tab === "masuk" ? masuk : keluar;
  const results = active.data?.data?.results ?? [];
  const meta = active.data?.data?.meta;

  // [ASUMSI] sama seperti sisi Pimpinan — dihitung dari halaman pertama yang
  // sudah termuat, karena "belum dibaca" di kotak masuk BERSAMA berarti
  // "belum dibaca OLEH AKUN INI", bukan status global surat.
  const unreadCount = (masuk.data?.data?.results ?? []).filter(
    (s) => user?.uid && !s.dibaca_oleh?.includes(user.uid)
  ).length;

  const handleKirim = (payload) => {
    kirim.mutate(payload, { onSuccess: () => setShowCompose(false) });
  };

  const handleCloseDetail = () => {
    setSelected(null);
    if (deepLinkId) navigate("/admin/surat", { replace: true });
  };

  // Rekap/ZIP mengikuti tab yang sedang aktif (Masuk/Keluar) — tanpa filter
  // tanggal di sisi Admin, sesuai cakupan minimal yang diminta (§4.4).
  const handleUnduh = async (jenis) => {
    setUnduhError(null);
    setUnduhState((s) => ({ ...s, [jenis]: true }));
    try {
      if (jenis === "zip") await arsipService.unduhZipSurat({ tipe: tab });
      else await arsipService.unduhRekapExcel({ tipe: tab });
    } catch (err) {
      setUnduhError(err.message);
    } finally {
      setUnduhState((s) => ({ ...s, [jenis]: false }));
    }
  };

  return (
    <AdminLayout title="Surat Menyurat">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
        <div>
          {/* <h2 className="font-display font-bold text-neutral-900 text-lg sm:text-xl">Surat Menyurat Wilayah</h2> */}
          <p className="text-sm text-neutral-500 mt-1">
            Kotak surat masuk/keluar antar pimpinan se-jawabarat
          </p>
        </div>
        <Button onClick={() => setShowCompose(true)} className="shrink-0">+ Tulis Surat</Button>
      </div>

      {/* <p className="text-xs text-neutral-400 italic mb-4">
        Surat ke Wilayah adalah kotak masuk bersama — dapat dilihat & dibalas oleh seluruh Admin/Superadmin PW IPM Jabar.
      </p> */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => { setTab("masuk"); setPage(1); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors min-h-[44px] ${
              tab === "masuk" ? "bg-brand-blue-500 text-white" : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            Surat Masuk
            {unreadCount > 0 && (
              <span className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold ${
                tab === "masuk" ? "bg-white text-brand-blue-600" : "bg-brand-blue-500 text-white"
              }`}>
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => { setTab("keluar"); setPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors min-h-[44px] ${
              tab === "keluar" ? "bg-brand-blue-500 text-white" : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            Surat Keluar
          </button>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" loading={unduhState.zip} onClick={() => handleUnduh("zip")} className="flex-1 sm:flex-none">
            Unduh Semua (ZIP)
          </Button>
          <Button loading={unduhState.excel} onClick={() => handleUnduh("excel")} className="flex-1 sm:flex-none">
            Unduh Rekap Excel
          </Button>
        </div>
      </div>

      {unduhError && (
        <p className="form-error mb-4" role="alert">{unduhError}</p>
      )}

      <SuratListTable
        mode={tab}
        results={results}
        meta={meta}
        isLoading={active.isLoading}
        currentUid={user?.uid}
        onSelect={setSelected}
        onPageChange={setPage}
      />

      {selected && (
        <SuratDetailPanel surat={selected} currentUid={user?.uid} onClose={handleCloseDetail} />
      )}

      {showCompose && (
        <BottomSheetModal open={showCompose} onClose={() => setShowCompose(false)} title="Tulis Surat Baru">
          <SuratForm onSubmit={handleKirim} onCancel={() => setShowCompose(false)} isSubmitting={kirim.isPending} />
        </BottomSheetModal>
      )}
    </AdminLayout>
  );
}