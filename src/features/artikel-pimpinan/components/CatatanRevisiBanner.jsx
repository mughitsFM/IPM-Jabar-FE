{/* frontend/features/artikel-pimpinan/components/CatatanRevisiBanner.jsx (lengkap) */}
// Banner peringatan yang tampil di form/detail artikel. Untuk status "revisi"
// / "ditolak" menampilkan catatan dari Wilayah. Untuk status "disetujui"
// (poin 1: Pimpinan boleh edit artikel yang sudah tayang) memberi tahu bahwa
// menyimpan perubahan akan mengirim artikel kembali ke antrean review —
// keputusan publikasi tetap di tangan admin.

export default function CatatanRevisiBanner({ status, catatan }) {
  if (status === "disetujui") {
    return (
      <div className="rounded-card border px-4 py-3 mb-6 bg-brand-blue-500/5 border-brand-blue-500/30 text-brand-blue-700">
        <p className="text-sm font-semibold mb-1">Artikel ini sudah dipublikasikan</p>
        <p className="text-sm leading-relaxed">
          Menyimpan perubahan akan mengirim artikel ini kembali ke Wilayah untuk direview.
          Versi yang tayang saat ini tidak berubah sampai disetujui ulang.
        </p>
      </div>
    );
  }

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