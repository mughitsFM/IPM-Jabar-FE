import { useDesainRiwayat, useRollbackDesain } from "../hooks/useDesainAdmin";

const SCOPE_LABELS = {
  global: "Global",
  beranda: "Beranda",
  profil: "Profil",
  berita: "Berita",
  timeline: "Timeline",
};

function formatWaktu(iso) {
  try {
    return new Date(iso).toLocaleString("id-ID", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

/**
 * RiwayatPanel — daftar riwayat perubahan untuk 1 scope (tab aktif), dengan
 * tombol "Kembalikan" per entri. Rollback di backend otomatis bikin
 * snapshot baru juga dari kondisi sebelum rollback — jadi aman dicoba,
 * masih bisa "dibatalkan" lagi kalau ternyata salah pilih versi.
 *
 * CATATAN: "diubah oleh" masih tampilkan UID mentah (bukan nama admin) —
 * belum ada endpoint buat resolve UID -> nama di modul ini.
 */
export default function RiwayatPanel({ scope, onClose, onRolledBack }) {
  const { data, isLoading, isError } = useDesainRiwayat(scope);
  const rollbackMutation = useRollbackDesain();

  const entries = data?.data ?? [];
  console.log(entries);

  const handleRollback = (entry) => {
    const konfirmasi = window.confirm(
      `Kembalikan ${SCOPE_LABELS[scope] ?? scope} ke kondisi pada ${formatWaktu(entry.created_at)}?\n\n` +
      "Kondisi saat ini akan otomatis disimpan juga sebagai riwayat, jadi masih bisa dibatalkan kalau berubah pikiran."
    );
    if (!konfirmasi) return;

    rollbackMutation.mutate(entry.id, {
      onSuccess: () => onRolledBack?.(),
    });
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <h2 className="font-display font-bold text-neutral-900">
            Riwayat — {SCOPE_LABELS[scope] ?? scope}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 text-xl leading-none min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Tutup"
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto p-5 space-y-3">
          {isLoading && (
            <p className="text-sm text-neutral-500 text-center py-6">Memuat riwayat…</p>
          )}

          {isError && (
            <p className="text-sm text-state-error text-center py-6">Gagal memuat riwayat.</p>
          )}

          {!isLoading && !isError && entries.length === 0 && (
            <p className="text-sm text-neutral-400 text-center py-6">
              Belum ada riwayat perubahan untuk bagian ini.
            </p>
          )}

          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between gap-3 p-3 border border-neutral-200 rounded-lg"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-neutral-900">{formatWaktu(entry.created_at)}</p>
                {entry.changed_by && (
                  <p className="text-xs text-neutral-400 truncate">
                    Sebelum diubah oleh{" "}
                    <span className="font-medium text-neutral-600">
                      {entry.changed_by.nama}
                    </span>
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleRollback(entry)}
                disabled={rollbackMutation.isPending}
                className="shrink-0 text-sm font-semibold text-brand-green-600 hover:text-brand-green-700 disabled:opacity-50 px-3 py-2 min-h-[44px]"
              >
                Kembalikan
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
