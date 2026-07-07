import { useState } from "react";
import PimpinanSidebar from "./PimpinanSidebar";

/**
 * Layout untuk halaman Pimpinan — sidebar di kiri, konten di kanan.
 * Struktur (drawer mobile, overlay, top-bar hamburger) SENGAJA identik
 * AdminLayout.jsx karena sudah proven & responsive — lihat
 * 02-login-dan-layout-pimpinan.md §7. Dipakai persis seperti AdminLayout:
 * <PimpinanLayout title="Dashboard">...</PimpinanLayout>
 */
export default function PimpinanLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar desktop (permanent) */}
      <div className="hidden lg:flex lg:shrink-0">
        <PimpinanSidebar />
      </div>

      {/* Sidebar mobile (drawer) */}
      <div
        className={`fixed inset-y-0 left-0 z-40 lg:hidden transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <PimpinanSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Area konten */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar mobile */}
        <header className="lg:hidden sticky top-0 z-20 bg-white border-b border-neutral-200 px-4 h-14 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Buka menu pimpinan"
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {title && (
            <h1 className="font-display font-bold text-neutral-900 text-base truncate">{title}</h1>
          )}
        </header>

        {/* Konten halaman */}
        <main className="flex-1 p-4 lg:p-8">
          {title && (
            <h1 className="hidden lg:block font-display font-bold text-neutral-900 text-2xl mb-6">
              {title}
            </h1>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}