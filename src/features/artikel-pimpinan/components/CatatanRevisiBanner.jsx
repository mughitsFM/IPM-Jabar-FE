{/* frontend/features/artikel-pimpinan/components/CatatanRevisiBanner.jsx (lengkap) */}
// Banner peringatan yang tampil di form/detail artikel saat status "revisi"
// atau "ditolak", menampilkan catatan dari Wilayah supaya Pimpinan tahu apa
// yang perlu diperbaiki sebelum mengajukan ulang.

export default function CatatanRevisiBanner({ status, catatan }) {
  if (status !== "revisi" && status !== "ditolak") return null;

  const isRevisi = status === "revisi";
  const wrapperClass = isRevisi
    ? "bg-brand-gold-50 border-brand-gold-500/40 text-brand-gold-700"
    : "bg-state-error/10 border-state-error/30 text-state-error";

  return (
    <div className={`rounded-card border px-4 py-3 mb-6 ${wrapperClass}`}>
      <p className="text-sm font-semibold mb-1">
        {isRevisi ? "Wilayah meminta revisi artikel ini" : "Artikel ini ditolak Wilayah"}
      </p>
      {catatan ? (
        <p className="text-sm leading-relaxed whitespace-pre-line">{catatan}</p>
      ) : (
        <p className="text-sm italic opacity-75">Tidak ada catatan tambahan dari Wilayah.</p>
      )}
      {isRevisi && (
        <p className="text-xs mt-2 opacity-75">
          Perbaiki artikel sesuai catatan di atas, lalu ajukan kembali.
        </p>
      )}
    </div>
  );
}
