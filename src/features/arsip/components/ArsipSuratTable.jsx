import EmptyState from "@/shared/components/ui/EmptyState";
import Pagination from "@/shared/components/ui/Pagination";
import { SkeletonTableRows } from "@/shared/components/ui/Skeleton";

/** Label & warna badge arah surat (masuk/keluar) — hanya relevan saat tipe filter = "semua" */
const ARAH_BADGE = {
  masuk: "bg-brand-blue-500/10 text-brand-blue-600",
  keluar: "bg-brand-gold-50 text-brand-gold-600",
};
const ARAH_LABEL = { masuk: "Masuk", keluar: "Keluar" };

function lawanBicara(surat) {
  return surat._arah === "masuk" ? surat.pengirim_label : surat.penerima_label;
}

function formatTanggal(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

function TombolUnduhBaris({ surat }) {
  return (
    <a
      href={surat.lampiran_url}
      target="_blank"
      rel="noreferrer"
      download
      className="inline-flex items-center justify-center gap-1.5 min-h-[36px] px-3 rounded-lg text-xs font-semibold border-2 border-brand-green-500 text-brand-green-500 hover:bg-brand-green-50 transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Unduh
    </a>
  );
}

export default function ArsipSuratTable({ results, meta, isLoading, onPageChange, showArah = true }) {
  if (isLoading) {
    return (
      <div className="bg-white border border-neutral-200 rounded-card overflow-hidden">
        <table className="w-full">
          <tbody>
            <SkeletonTableRows rows={5} cols={5} />
          </tbody>
        </table>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <EmptyState
        title="Belum ada surat"
        message="Tidak ada surat pada rentang tanggal/tipe yang dipilih."
      />
    );
  }

  return (
    <div>
      {/* Desktop: tabel dengan scroll horizontal */}
      <div className="hidden sm:block bg-white border border-neutral-200 rounded-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100 text-left text-neutral-500">
              <th className="px-4 py-3 font-semibold whitespace-nowrap">Nomor Surat</th>
              <th className="px-4 py-3 font-semibold whitespace-nowrap">Perihal</th>
              <th className="px-4 py-3 font-semibold whitespace-nowrap">Lawan Bicara</th>
              <th className="px-4 py-3 font-semibold whitespace-nowrap">Tanggal</th>
              <th className="px-4 py-3 font-semibold whitespace-nowrap text-right">Lampiran</th>
            </tr>
          </thead>
          <tbody>
            {results.map((s) => (
              <tr key={s.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                <td className="px-4 py-3 font-semibold text-neutral-900 whitespace-nowrap">{s.nomor_surat}</td>
                <td className="px-4 py-3 text-neutral-700 max-w-xs truncate">{s.perihal}</td>
                <td className="px-4 py-3 text-neutral-700 whitespace-nowrap">
                  {lawanBicara(s)}
                  {showArah && (
                    <span className={`ml-2 inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${ARAH_BADGE[s._arah]}`}>
                      {ARAH_LABEL[s._arah]}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-neutral-500 whitespace-nowrap">{formatTanggal(s.created_at)}</td>
                <td className="px-4 py-3 text-right">
                  <TombolUnduhBaris surat={s} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: card-list */}
      <div className="sm:hidden space-y-3">
        {results.map((s) => (
          <div key={s.id} className="bg-white border border-neutral-200 rounded-card p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="font-semibold text-neutral-900 text-sm">{s.nomor_surat}</p>
              {showArah && (
                <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold ${ARAH_BADGE[s._arah]}`}>
                  {ARAH_LABEL[s._arah]}
                </span>
              )}
            </div>
            <p className="text-sm text-neutral-700 mb-1">{s.perihal}</p>
            <p className="text-xs text-neutral-500 mb-3">
              {lawanBicara(s)} · {formatTanggal(s.created_at)}
            </p>
            <TombolUnduhBaris surat={s} />
          </div>
        ))}
      </div>

      <Pagination meta={meta} onPageChange={onPageChange} />
    </div>
  );
}