/**
 * NotifToast — notifikasi sukses mengambang di pojok kanan-atas.
 * Sengaja "position: fixed" (bukan block di atas konten) supaya kemunculan/
 * kehilangannya tidak mendorong-dorong layout card di bawahnya (layout shift).
 *
 * Animasi didefinisikan inline via <style> (bukan util Tailwind), supaya
 * tidak bergantung pada konfigurasi keyframes tambahan di tailwind.config.
 */
export default function NotifToast({ text }) {
  return (
    <div
      className="fixed top-4 right-4 z-50 max-w-sm"
      style={{ animation: "pengaturan-akun-toast-in 0.25s ease-out" }}
      role="status"
      aria-live="polite"
    >
      <style>{`
        @keyframes pengaturan-akun-toast-in {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div className="flex items-start gap-2.5 rounded-xl bg-white border border-brand-green-200 shadow-lg shadow-black/5 px-4 py-3.5">
        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-green-500 text-white">
          <IconCheck className="h-3 w-3" />
        </span>
        <p className="text-sm font-medium text-neutral-800 pt-0.5">{text}</p>
      </div>
    </div>
  );
}

function IconCheck({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}