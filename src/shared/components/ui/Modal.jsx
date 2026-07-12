/**
 * Modal — dialog dasar reusable. Menggantikan modal inline
 * (mis. ConfirmDeleteModal di AdminBeritaPage) agar konsisten gayanya.
 */
export default function Modal({ open, onClose, title, children, maxWidth = "max-w-lg" }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className={`relative bg-white rounded-card shadow-xl w-full ${maxWidth} max-h-[85vh] flex flex-col`}>
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 shrink-0">
            <h2 className="font-display font-bold text-neutral-900 text-lg">{title}</h2>
            <button
              onClick={onClose}
              aria-label="Tutup"
              className="text-neutral-400 hover:text-neutral-700 p-1 rounded hover:bg-neutral-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="overflow-y-auto px-6 py-4">{children}</div>
      </div>
    </div>
  );
}