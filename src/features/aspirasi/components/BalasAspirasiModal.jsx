{/* frontend/features/aspirasi/components/BalasAspirasiModal.jsx (lengkap) */}
import { useEffect, useState } from "react";
import Button from "@/shared/components/ui/Button";
import BottomSheetModal from "@/shared/components/ui/BottomSheetModal";
import { formatShort } from "@/shared/utils/formatDate";
import { useTandaiNotifikasiEntitas } from "@/features/notifikasi/hooks/useNotifikasi";
import { useBalasAspirasi, useUpdateStatusAspirasi } from "../hooks/useAspirasi";
import AspirasiStatusBadge from "./AspirasiStatusBadge";

export default function BalasAspirasiModal({ aspirasi, onClose }) {
  const [balasan, setBalasan] = useState(aspirasi.balasan ?? "");
  const balasMutation = useBalasAspirasi();
  const statusMutation = useUpdateStatusAspirasi();
  const tandaiNotif = useTandaiNotifikasiEntitas();

  // Modal ini dibuka lewat klik "Balas"/"Lihat" di AdminAspirasiPage TANPA
  // fetch detail terpisah (data sudah ada dari list) — jadi ini titik yang
  // tepat untuk tandai notifikasi "aspirasi_masuk" terbaca, supaya badge
  // lonceng ikut update walau admin tidak pernah buka dropdown notifikasi.
  useEffect(() => {
    if (aspirasi?.id) {
      tandaiNotif.mutate([{ tipe: "aspirasi_masuk", entity_id: aspirasi.id }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aspirasi?.id]);

  const sudahDibalas = aspirasi.status === "dibalas";

  const handleBalas = (e) => {
    e.preventDefault();
    if (!balasan.trim()) return;
    balasMutation.mutate({ id: aspirasi.id, balasan }, { onSuccess: onClose });
  };

  const handleTandaiDiproses = () => {
    statusMutation.mutate({ id: aspirasi.id, status: "diproses" });
  };

  return (
    <BottomSheetModal
      open={!!aspirasi}
      onClose={onClose}
      title={aspirasi.perihal}
      subtitle={`${aspirasi.pimpinan_label} · ${formatShort(aspirasi.created_at)}`}
      maxWidth="sm:max-w-xl"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <AspirasiStatusBadge status={aspirasi.status} />
          {aspirasi.status === "terkirim" && (
            <button
              onClick={handleTandaiDiproses}
              disabled={statusMutation.isPending}
              className="text-xs text-brand-blue-500 hover:text-brand-blue-600 font-semibold px-2 py-1 -mx-2 rounded hover:bg-brand-blue-500/10 transition-colors"
            >
              Tandai Diproses
            </button>
          )}
        </div>

        <div>
          <p className="text-xs text-neutral-400 uppercase tracking-wide mb-1">Detail Aspirasi</p>
          <p className="text-sm text-neutral-700 whitespace-pre-line">{aspirasi.detail}</p>
        </div>

        {aspirasi.lampiran_url && (
          <a
            href={aspirasi.lampiran_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline inline-flex items-center gap-2 text-sm py-2"
          >
            📎 Lihat Lampiran
          </a>
        )}

        <form onSubmit={handleBalas} className="space-y-3 pt-2 border-t border-neutral-100">
          <label className="form-label">
            {sudahDibalas ? "Balasan (sudah terkirim)" : "Tulis Balasan"} <span className="text-state-error">*</span>
          </label>
          <textarea
            value={balasan}
            onChange={(e) => setBalasan(e.target.value)}
            rows={5}
            className="input-field"
            placeholder="Tulis tanggapan Wilayah atas aspirasi ini…"
            disabled={sudahDibalas}
          />
          {sudahDibalas ? (
            <p className="text-xs text-neutral-400">
              Dibalas pada {formatShort(aspirasi.dibalas_at)}.
            </p>
          ) : (
            <div className="flex flex-wrap justify-end gap-3">
              <Button type="button" variant="ghost" onClick={onClose}>Batal</Button>
              <Button type="submit" loading={balasMutation.isPending} disabled={!balasan.trim()}>
                Kirim Balasan
              </Button>
            </div>
          )}
        </form>
      </div>
    </BottomSheetModal>
  );
}