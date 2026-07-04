{/* frontend/features/proker/components/TimelineItem.jsx (lengkap) */}
import Badge from "@/shared/components/ui/Badge";
import { formatShort } from "@/shared/utils/formatDate";
import {
  STATUS_PROKER_LABELS,
  STATUS_PROKER_COLORS,
  STATUS_PROKER,
  BIDANG_PROKER_LABELS,
} from "@/shared/constants/statusEnum";

export default function TimelineItem({ proker, isLast = false }) {
  const {
    nama_kegiatan,
    deskripsi,
    bidang,
    tanggal_mulai,
    tanggal_selesai,
    status,
  } = proker;

  const dotColorClass =
    status === STATUS_PROKER.BERLANGSUNG
      ? "bg-brand-gold-500 ring-brand-gold-500"
      : status === STATUS_PROKER.SELESAI
      ? "bg-brand-green-500 ring-brand-green-500"
      : "bg-neutral-400 ring-neutral-400";

  return (
    <div className="relative flex gap-6 pb-10">
      <div className="flex flex-col items-center shrink-0 w-4">
        <div className={`w-4 h-4 rounded-full border-2 border-white shadow-sm ring-2 ring-offset-2 shrink-0 mt-1 ${dotColorClass}`} />
        {!isLast && <div className="w-0.5 flex-1 bg-neutral-200 mt-2" />}
      </div>

      <div className="bg-white rounded-card border border-neutral-200 p-5 flex-1 hover:shadow-md transition-shadow duration-200 mb-1">
        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
          <h3 className="font-display font-bold text-neutral-900 text-base leading-snug">
            {nama_kegiatan}
          </h3>
          <Badge label={STATUS_PROKER_LABELS[status] ?? status} colorClass={STATUS_PROKER_COLORS[status]} />
        </div>

        {bidang && (
          <p className="text-xs font-semibold text-brand-green-500 mb-2">
            {BIDANG_PROKER_LABELS[bidang] ?? bidang}
          </p>
        )}

        {deskripsi && (
          <p className="text-sm text-neutral-600 leading-relaxed mb-3">{deskripsi}</p>
        )}

        {(tanggal_mulai || tanggal_selesai) && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-400">
            {tanggal_mulai && (
              <span>Mulai: <span className="text-neutral-600 font-medium">{formatShort(tanggal_mulai)}</span></span>
            )}
            {tanggal_selesai && (
              <span>Selesai: <span className="text-neutral-600 font-medium">{formatShort(tanggal_selesai)}</span></span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}