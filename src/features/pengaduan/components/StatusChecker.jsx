{/* frontend/features/pengaduan/components/StatusChecker.jsx (lengkap) */}
import { useState } from "react";
import Button from "@/shared/components/ui/Button";
import Badge from "@/shared/components/ui/Badge";
import { useCheckStatusPengaduan } from "../hooks/usePengaduan";
import {
  STATUS_PENGADUAN_LABELS,
  STATUS_PENGADUAN_COLORS,
} from "@/shared/constants/statusEnum";
import { formatDateTime } from "@/shared/utils/formatDate";

export default function StatusChecker() {
  const [inputKode, setInputKode] = useState("");
  const [activeKode, setActiveKode] = useState(null);

  const { data, isLoading, isError, error } = useCheckStatusPengaduan(activeKode);
  const pengaduan = data?.data;

  const handleCheck = (e) => {
    e.preventDefault();
    if (inputKode.trim()) setActiveKode(inputKode.trim().toUpperCase());
  };

  return (
    <div>
      <form onSubmit={handleCheck} className="flex gap-3 mb-6">
        <input
          type="text"
          value={inputKode}
          onChange={(e) => setInputKode(e.target.value)}
          placeholder="Masukkan kode pengaduan Anda"
          className="input-field flex-1 font-mono tracking-widest uppercase"
          maxLength={12}
        />
        <Button type="submit" loading={isLoading} className="shrink-0">Cek</Button>
      </form>

      {isError && (
        <div className="px-4 py-3 bg-red-50 border border-state-error/30 rounded-lg text-sm text-state-error">
          {error?.response?.status === 404
            ? "Kode pengaduan tidak ditemukan. Periksa kembali kode Anda."
            : "Terjadi kesalahan. Silakan coba lagi."}
        </div>
      )}

      {!isLoading && !isError && pengaduan && (
        <div className="bg-white border border-neutral-200 rounded-card p-5 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <p className="text-xs text-neutral-400 mb-0.5">Kode Pengaduan</p>
              <p className="font-mono font-bold text-brand-green-500 text-lg tracking-widest">
                {pengaduan.kode_unik}
              </p>
            </div>
            <Badge
              label={STATUS_PENGADUAN_LABELS[pengaduan.status] ?? pengaduan.status}
              colorClass={STATUS_PENGADUAN_COLORS[pengaduan.status]}
            />
          </div>

          <div className="h-px bg-neutral-100" />

          <div className="grid gap-2 sm:grid-cols-2 text-sm">
            <div>
              <p className="text-xs text-neutral-400">Perihal</p>
              <p className="font-medium text-neutral-900">{pengaduan.perihal}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-400">Dikirim</p>
              <p className="font-medium text-neutral-900">{formatDateTime(pengaduan.created_at)}</p>
            </div>
          </div>

          {pengaduan.isi && (
            <div>
              <p className="text-xs text-neutral-400 mb-1">Isi</p>
              <p className="text-sm text-neutral-700 bg-neutral-50 rounded-lg p-3 leading-relaxed">
                {pengaduan.isi}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}