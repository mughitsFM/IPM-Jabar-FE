import { useState } from "react";
import PimpinanSidebar from "./PimpinanSidebar";
import NotificationBell from "@/features/notifikasi/components/NotificationBell";

/**
 * Layout untuk halaman Pimpinan — sidebar di kiri, konten di kanan.
 * Struktur (drawer mobile, overlay, top-bar hamburger) SENGAJA identik
 * AdminLayout.jsx karena sudah proven & responsive — lihat
 * 02-login-dan-layout-pimpinan.md §7. Dipakai persis seperti AdminLayout:
 * <PimpinanLayout title="Dashboard">...</PimpinanLayout>
 *
 * NotificationBell dipindah kesini (bukan di PimpinanSidebar) supaya
 * strukturnya sama persis dengan AdminLayout — sebelumnya sidebar hanya
 * punya placeholder ikon statis, tidak benar-benar terhubung ke data.
 */
export default function PimpinanLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Overlay mobile — selalu ter-mount supaya opacity bisa transisi mulus,
          pointer-events dimatikan saat tertutup supaya tidak menghalangi klik. */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-30 lg:hidden transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar desktop (permanent) */}
      <div className="hidden lg:flex lg:shrink-0">
        <PimpinanSidebar />
      </div>

      {/* Sidebar mobile (drawer) */}
      <div
        className={`fixed inset-y-0 left-0 z-40 lg:hidden shadow-2xl transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <PimpinanSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Area konten */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar mobile */}
        <header className="lg:hidden sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-neutral-200 shadow-sm px-4 h-14 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Buka menu pimpinan"
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            {title && (
              <h1 className="font-display font-bold text-neutral-900 text-base truncate">{title}</h1>
            )}
          </div>
          <NotificationBell />
        </header>

        {/* Konten halaman */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="hidden lg:flex items-center justify-between pb-5 mb-6 border-b border-neutral-200">
            {title ? (
              <h1 className="font-display font-bold text-neutral-900 text-2xl">{title}</h1>
            ) : <div />}
            <NotificationBell />
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}