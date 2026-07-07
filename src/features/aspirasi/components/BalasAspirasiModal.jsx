{/* frontend/features/aspirasi/components/BalasAspirasiModal.jsx (lengkap) */}
import { useState } from "react";
import Button from "@/shared/components/ui/Button";
import { formatShort } from "@/shared/utils/formatDate";
import { useBalasAspirasi, useUpdateStatusAspirasi } from "../hooks/useAspirasi";
import AspirasiStatusBadge from "./AspirasiStatusBadge";

export default function BalasAspirasiModal({ aspirasi, onClose }) {
  const [balasan, setBalasan] = useState(aspirasi.balasan ?? "");
  const balasMutation = useBalasAspirasi();
  const statusMutation = useUpdateStatusAspirasi();

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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-xl sm:rounded-card rounded-t-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 sticky top-0 bg-white">
          <div>
            <h3 className="font-display font-bold text-neutral-900">{aspirasi.perihal}</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              {aspirasi.pimpinan_label} · {formatShort(aspirasi.created_at)}
            </p>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 text-xl leading-none px-2">×</button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <div className="flex items-center gap-2">
            <AspirasiStatusBadge status={aspirasi.status} />
            {aspirasi.status === "terkirim" && (
              <button
                onClick={handleTandaiDiproses}
                disabled={statusMutation.isPending}
                className="text-xs text-brand-blue-500 hover:text-brand-blue-600 font-semibold"
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
              <div className="flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={onClose}>Batal</Button>
                <Button type="submit" loading={balasMutation.isPending} disabled={!balasan.trim()}>
                  Kirim Balasan
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
