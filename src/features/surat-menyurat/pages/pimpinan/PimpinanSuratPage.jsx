{/* frontend/features/surat-menyurat/pages/pimpinan/PimpinanSuratPage.jsx (lengkap) */}
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PimpinanLayout from "@/shared/components/layout/PimpinanLayout";
import Button from "@/shared/components/ui/Button";
import { useAuthContext } from "@/app/providers/AuthProvider";
import SuratListTable from "../../components/SuratListTable";
import SuratDetailPanel from "../../components/SuratDetailPanel";
import SuratForm from "../../components/SuratForm";
import { useSuratMasuk, useSuratKeluar, useKirimSurat, useSuratDetail } from "../../hooks/useSurat";

export default function PimpinanSuratPage() {
  const { user } = useAuthContext();
  const { id: deepLinkId } = useParams(); // dari notifikasi: /pimpinan/surat/<id>
  const navigate = useNavigate();

  const [tab, setTab] = useState("masuk"); // "masuk" | "keluar"
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [showCompose, setShowCompose] = useState(false);

  const masuk = useSuratMasuk({ page, limit: 10 });
  const keluar = useSuratKeluar({ page, limit: 10 });
  const kirim = useKirimSurat();

  // Deep-link dari notifikasi: buka detail panel otomatis, list tetap
  // dirender di background (lihat 06-surat-menyurat.md §4.1).
  const { data: deepLinkData } = useSuratDetail(deepLinkId);
  useEffect(() => {
    if (deepLinkData?.data) setSelected(deepLinkData.data);
  }, [deepLinkData]);

  const active = tab === "masuk" ? masuk : keluar;
  const results = active.data?.data?.results ?? [];
  const meta = active.data?.data?.meta;

  // [ASUMSI] Badge unread dihitung dari halaman pertama Surat Masuk yang
  // sudah termuat (tidak ada endpoint hitung total tersendiri di spec ini).
  const unreadCount = (masuk.data?.data?.results ?? []).filter(
    (s) => user?.uid && !s.dibaca_oleh?.includes(user.uid)
  ).length;

  const handleKirim = (payload) => {
    kirim.mutate(payload, { onSuccess: () => setShowCompose(false) });
  };

  const handleCloseDetail = () => {
    setSelected(null);
    if (deepLinkId) navigate("/pimpinan/surat", { replace: true });
  };

  return (
    <PimpinanLayout title="Surat Menyurat">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h2 className="font-display font-bold text-neutral-900 text-lg">Surat Menyurat</h2>
          <p className="text-sm text-neutral-500 mt-1">
            Kirim & terima surat resmi ke/dari Wilayah atau sesama Pimpinan.
          </p>
        </div>
        <Button onClick={() => setShowCompose(true)}>+ Tulis Surat</Button>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => { setTab("masuk"); setPage(1); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            tab === "masuk" ? "bg-brand-green-500 text-white" : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
          }`}
        >
          Surat Masuk
          {unreadCount > 0 && (
            <span className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold ${
              tab === "masuk" ? "bg-white text-brand-green-600" : "bg-brand-green-500 text-white"
            }`}>
              {unreadCount}
            </span>
          )}
        </button>
        <button
          onClick={() => { setTab("keluar"); setPage(1); }}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            tab === "keluar" ? "bg-brand-green-500 text-white" : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
          }`}
        >
          Surat Keluar
        </button>
      </div>

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
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-lg sm:rounded-card rounded-t-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
              <h3 className="font-display font-bold text-neutral-900">Tulis Surat Baru</h3>
              <button onClick={() => setShowCompose(false)} className="text-neutral-400 hover:text-neutral-600 text-xl leading-none px-2">×</button>
            </div>
            <div className="px-5 py-4">
              <SuratForm onSubmit={handleKirim} onCancel={() => setShowCompose(false)} isSubmitting={kirim.isPending} />
            </div>
          </div>
        </div>
      )}
    </PimpinanLayout>
  );
}
