/**
 * EmptyState — tampilan kosong ketika tidak ada data.
 */
export default function EmptyState({
  title   = "Tidak ada data",
  message = "Belum ada konten yang tersedia.",
  action,      // { label, onClick } opsional
  icon,        // React node opsional
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-4 text-neutral-300">
        {icon ?? (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )}
      </div>
      <h3 className="font-display font-bold text-neutral-900 text-lg mb-1">{title}</h3>
      <p className="text-sm text-neutral-600 max-w-sm">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="btn-primary mt-6"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
