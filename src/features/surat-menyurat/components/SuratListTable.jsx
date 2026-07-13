{/* frontend/features/surat-menyurat/components/SuratListTable.jsx (lengkap) */}
// Tabel daftar surat, dipakai untuk tab "Masuk" maupun "Keluar", di sisi
// Pimpinan maupun Admin — cukup beda `mode` untuk menentukan kolom lawan
// bicara mana yang ditampilkan (pengirim untuk tab masuk, penerima untuk keluar).
import EmptyState from "@/shared/components/ui/EmptyState";
import Pagination from "@/shared/components/ui/Pagination";
import { SkeletonTableRows, SkeletonLine } from "@/shared/components/ui/Skeleton";
import { formatShort } from "@/shared/utils/formatDate";

export default function SuratListTable({
  mode, // "masuk" | "keluar"
  results = [],
  meta,
  isLoading,
  currentUid,
  onSelect,
  onPageChange,
}) {
  const lawanLabel = mode === "masuk" ? "Pengirim" : "Penerima";

  if (!isLoading && results.length === 0) {
    return (
      <div className="bg-white rounded-card border border-neutral-200">
        <EmptyState
          title={mode === "masuk" ? "Belum ada surat masuk" : "Belum ada surat keluar"}
          message={mode === "masuk" ? "Surat yang ditujukan ke Anda akan tampil di sini." : "Surat yang Anda kirim akan tampil di sini."}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-card border border-neutral-200 overflow-hidden">
      {/* ===== Tabel — desktop (md ke atas) ===== */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-5 py-3">Nomor Surat</th>
              <th className="text-left px-5 py-3">Perihal</th>
              <th className="text-left px-5 py-3">{lawanLabel}</th>
              <th className="text-left px-5 py-3">Tanggal</th>
              <th className="text-right px-5 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {isLoading && <SkeletonTableRows rows={5} cols={5} />}
            {!isLoading && results.map((s) => {
              const belumDibaca = currentUid && !s.dibaca_oleh?.includes(currentUid);
              return (
                <tr key={s.id} className={belumDibaca ? "bg-brand-green-50/40" : undefined}>
                  <td className="px-5 py-3 font-mono text-xs text-neutral-700 whitespace-nowrap">{s.nomor_surat}</td>
                  <td className="px-5 py-3">
                    <span className={`text-neutral-900 ${belumDibaca ? "font-semibold" : ""}`}>{s.perihal}</span>
                    {belumDibaca && <span className="ml-2 inline-block w-2 h-2 rounded-full bg-brand-green-500" title="Belum dibaca" />}
                  </td>
                  <td className="px-5 py-3 text-neutral-500">
                    {mode === "masuk" ? s.pengirim_label : s.penerima_label}
                  </td>
                  <td className="px-5 py-3 text-neutral-400 whitespace-nowrap">{formatShort(s.created_at)}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => onSelect(s)}
                      className="text-xs text-brand-blue-500 hover:text-brand-blue-600 font-semibold px-2 py-1 rounded hover:bg-brand-blue-500/10 transition-colors"
                    >
                      Lihat
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ===== Kartu — mobile & tablet kecil (di bawah md) =====
          Menghindari geser horizontal untuk melihat kolom Tanggal/Aksi. */}
      <div className="md:hidden divide-y divide-neutral-100">
        {isLoading && Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 space-y-2">
            <SkeletonLine className="w-2/3" />
            <SkeletonLine className="w-1/3" />
          </div>
        ))}

        {!isLoading && results.map((s) => {
          const belumDibaca = currentUid && !s.dibaca_oleh?.includes(currentUid);
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s)}
              className={`w-full text-left p-4 transition-colors active:bg-neutral-50 ${belumDibaca ? "bg-brand-green-50/40" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className={`text-sm text-neutral-900 ${belumDibaca ? "font-semibold" : "font-medium"}`}>
                    {belumDibaca && <span className="inline-block w-2 h-2 rounded-full bg-brand-green-500 mr-1.5 align-middle" title="Belum dibaca" />}
                    {s.perihal}
                  </p>
                  <p className="text-xs text-neutral-400 font-mono mt-1">{s.nomor_surat}</p>
                </div>
                <span className="text-xs text-neutral-400 shrink-0">{formatShort(s.created_at)}</span>
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                {lawanLabel}: <span className="text-neutral-700">{mode === "masuk" ? s.pengirim_label : s.penerima_label}</span>
              </p>
            </button>
          );
        })}
      </div>

      {meta && meta.total_pages > 1 && (
        <div className="px-5 py-4 border-t border-neutral-100">
          <Pagination meta={meta} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  );
}
