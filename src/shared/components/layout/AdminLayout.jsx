import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import NotificationBell from "@/features/notifikasi/components/NotificationBell";
import { useAuthContext } from "@/app/providers/AuthProvider";
import { ROLES } from "@/shared/constants/roles";

/**
 * Layout untuk halaman admin — sidebar biru di kiri, konten di kanan.
 * Di mobile: sidebar tersembunyi, bisa dibuka via tombol hamburger.
 *
 * Notifikasi (NotificationBell) sengaja disembunyikan untuk super_admin —
 * super_admin tidak mengelola konten operasional (berita/surat/aspirasi/dll)
 * jadi tidak ada notif yang relevan untuknya. Lihat perbaikan role guard
 * di router.jsx/ProtectedRoute.jsx.
 */
export default function AdminLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuthContext();
  const isSuperAdmin = user?.role === ROLES.SUPER_ADMIN;

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
        <AdminSidebar />
      </div>

      {/* Sidebar mobile (drawer) */}
      <div
        className={`fixed inset-y-0 left-0 z-40 lg:hidden transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AdminSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Area konten */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar mobile */}
        <header className="lg:hidden sticky top-0 z-20 bg-white border-b border-neutral-200 px-4 h-14 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Buka menu admin"
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
          {!isSuperAdmin && <NotificationBell />}
        </header>

        {/* Konten halaman */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="hidden lg:flex items-center justify-between mb-6">
            {title ? (
              <h1 className="font-display font-bold text-neutral-900 text-2xl">{title}</h1>
            ) : <div />}
            {!isSuperAdmin && <NotificationBell />}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}