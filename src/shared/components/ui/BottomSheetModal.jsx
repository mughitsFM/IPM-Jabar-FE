/**
 * BottomSheetModal — dialog yang muncul sebagai bottom-sheet penuh lebar di
 * mobile (rounded-t-2xl, menempel ke bawah layar) dan dialog biasa di
 * desktop (rounded-card, di tengah layar).
 *
 * Diekstrak dari pola yang sebelumnya diulang 3× (AdminSuratPage,
 * PimpinanSuratPage, SuratDetailPanel) dengan markup identik. Perilaku
 * dipertahankan persis seperti sebelumnya: klik backdrop TIDAK menutup modal
 * (disengaja — beberapa pemanggil membungkus form yang belum disimpan),
 * hanya tombol × atau tombol eksplisit di dalam konten yang menutup.
 *
 * @param {boolean} open
 * @param {function} onClose
 * @param {string} title
 * @param {string} [maxWidth] - lebar maksimum di desktop, mis. "sm:max-w-lg"
 */
export default function BottomSheetModal({ open, onClose, title, subtitle, maxWidth = "sm:max-w-lg", children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4">
      <div className={`bg-white w-full ${maxWidth} sm:rounded-card rounded-t-2xl max-h-[90vh] flex flex-col`}>
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-neutral-100 shrink-0">
          <div className="min-w-0">
            <h3 className="font-display font-bold text-neutral-900 truncate">{title}</h3>
            {subtitle && <p className="text-xs text-neutral-500 mt-0.5 truncate">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="shrink-0 min-h-[44px] min-w-[44px] -mr-2 -mt-1 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-5 py-4 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
