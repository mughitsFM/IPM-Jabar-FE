{/* frontend/features/surat-menyurat/components/SuratDetailPanel.jsx (lengkap) */}
import { useEffect, useState } from "react";
import Button from "@/shared/components/ui/Button";
import BottomSheetModal from "@/shared/components/ui/BottomSheetModal";
import { formatShort } from "@/shared/utils/formatDate";
import { useTandaiNotifikasiEntitas } from "@/features/notifikasi/hooks/useNotifikasi";
import { useTandaiSuratDibaca, useKirimSurat } from "../hooks/useSurat";
import SuratForm from "./SuratForm";

export default function SuratDetailPanel({ surat, currentUid, onClose }) {
  const [showBalas, setShowBalas] = useState(false);
  const tandaiDibaca = useTandaiSuratDibaca();
  const kirimBalasan = useKirimSurat();
  const tandaiNotif = useTandaiNotifikasiEntitas();

  useEffect(() => {
    if (surat && currentUid && !surat.dibaca_oleh?.includes(currentUid)) {
      tandaiDibaca.mutate(surat.id);
    }
    // Selain menandai surat itu sendiri terbaca (di atas), tandai juga
    // notifikasi "surat_masuk" terkait terbaca — mencakup baik surat yang
    // dibuka langsung dari list maupun lewat deep-link notifikasi.
    if (surat?.id) {
      tandaiNotif.mutate([{ tipe: "surat_masuk", entity_id: surat.id }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surat?.id]);

  if (!surat) return null;

  // Lawan bicara untuk dibalas = pihak yang BUKAN diri sendiri (dikunci di SuratForm)
  const lawanBicara =
    surat.pengirim_uid === currentUid
      ? { tipe: surat.tipe_penerima, uid: surat.penerima_uid, label: surat.penerima_label }
      : { tipe: surat.tipe_pengirim, uid: surat.pengirim_uid, label: surat.pengirim_label };

  const handleKirimBalasan = (payload) => {
    kirimBalasan.mutate(payload, { onSuccess: () => setShowBalas(false) });
  };

  return (
    <BottomSheetModal open={!!surat} onClose={onClose} title={surat.perihal} subtitle={surat.nomor_surat} maxWidth="sm:max-w-xl">
      {!showBalas ? (
        <>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-neutral-400 uppercase tracking-wide mb-0.5">Dari</p>
                <p className="text-neutral-900 font-medium">{surat.pengirim_label}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 uppercase tracking-wide mb-0.5">Kepada</p>
                <p className="text-neutral-900 font-medium">{surat.penerima_label}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 uppercase tracking-wide mb-0.5">Tanggal</p>
                <p className="text-neutral-700">{formatShort(surat.created_at)}</p>
              </div>
            </div>

            {surat.isi_ringkas && (
              <div>
                <p className="text-xs text-neutral-400 uppercase tracking-wide mb-1">Isi Ringkas</p>
                <p className="text-sm text-neutral-700 whitespace-pre-line">{surat.isi_ringkas}</p>
              </div>
            )}

            <div>
              <p className="text-xs text-neutral-400 uppercase tracking-wide mb-1">Lampiran</p>
              <iframe
                src={surat.lampiran_url}
                title={`Lampiran surat ${surat.nomor_surat}`}
                className="w-full h-64 rounded-lg border border-neutral-200 mb-2"
              />
              <div className="flex flex-wrap gap-3">
                <a href={surat.lampiran_url} target="_blank" rel="noopener noreferrer" className="btn-outline text-sm py-2">
                  Buka PDF
                </a>
                <a href={surat.lampiran_url} download className="btn-outline text-sm py-2">
                  Unduh
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-3 pt-4 mt-4 border-t border-neutral-100">
            <Button variant="ghost" onClick={onClose}>Tutup</Button>
            <Button onClick={() => setShowBalas(true)}>Balas Surat</Button>
          </div>
        </>
      ) : (
        <div>
          <p className="text-sm text-neutral-500 mb-4">
            Membalas surat ke <span className="font-semibold text-neutral-700">{lawanBicara.label}</span>
          </p>
          <SuratForm
            balasanDariSuratId={surat.id}
            prefillPenerima={lawanBicara}
            prefillPerihal={`RE: ${surat.perihal}`}
            onSubmit={handleKirimBalasan}
            onCancel={() => setShowBalas(false)}
            isSubmitting={kirimBalasan.isPending}
          />
        </div>
      )}
    </BottomSheetModal>
  );
}