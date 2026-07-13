import { NavLink, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/app/providers/AuthProvider";
import { firebaseAuthService } from "@/features/auth/services/firebaseAuthService";
import { ROLE_LABELS } from "@/shared/constants/roles";
import { useDesainGlobal } from "@/shared/hooks/useDesainPublic";

const IconGear = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const IconClose = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// ── Pengaturan Akun sudah TIDAK di sini lagi, pindah ke footer ─────────────
const NAV_ITEMS = [
  {
    to:    "/pimpinan/dashboard",
    label: "Dashboard",
    icon:  (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    to:    "/pimpinan/artikel",
    label: "Artikel & Berita",
    icon:  (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h4m3 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    to:    "/pimpinan/surat",
    label: "Surat Menyurat",
    icon:  (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    to:    "/pimpinan/arsip",
    label: "Arsip",
    icon:  (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l1.5-4h15L21 7M3 7v11a2 2 0 002 2h14a2 2 0 002-2V7M3 7h18M10 11h4" />
      </svg>
    ),
  },
  {
    to:    "/pimpinan/aspirasi",
    label: "Aspirasi ke Wilayah",
    icon:  (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
];

/**
 * Placeholder lonceng notifikasi — implementasi penuh (fetch unread count,
 * dropdown daftar notifikasi) ada di 10-notifikasi.md. Untuk saat ini hanya
 * slot ikon statis supaya tata letak header sudah final lebih awal.
 */
function NotificationBell() {
  return (
    <button
      type="button"
      aria-label="Notifikasi"
      className="relative p-2 rounded-lg text-white/85 hover:bg-white/15 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      {/* TODO(file 10): badge angka unread ditambahkan di sini */}
    </button>
  );
}

export default function PimpinanSidebar({ onClose }) {
  const { user }   = useAuthContext();
  const navigate   = useNavigate();
  const { global } = useDesainGlobal();
  const logoUrl = global?.logo_url;

  const handleLogout = async () => {
    await firebaseAuthService.logout();
    navigate("/pimpinan/login", { replace: true });
  };

  return (
    <aside className="w-64 h-screen sticky top-0 bg-white border-r border-neutral-200 flex flex-col overflow-hidden">
      {/* Header sidebar — shrink-0 supaya tidak ikut "diperas" flexbox */}
      <div className="relative px-5 py-5 border-b border-neutral-200 bg-gradient-to-br from-brand-green-500 to-brand-green-600 shrink-0">
        <div className="flex items-center gap-2.5">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Logo PW IPM Jawa Barat"
              className="w-9 h-9 rounded-full object-cover shrink-0 ring-2 ring-white/25"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm ring-2 ring-white/25 flex items-center justify-center text-white font-display font-bold text-sm shrink-0">
              IPM
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="font-display font-bold text-white text-sm leading-tight truncate">
              {user?.label_lengkap ?? "Panel Pimpinan"}
            </p>
            <p className="text-xs text-white/70 truncate">PW IPM Jawa Barat</p>
          </div>
          <NotificationBell />
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup menu"
              className="shrink-0 -mr-1 w-9 h-9 flex items-center justify-center rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              <IconClose className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Nav items — flex-1 min-h-0 overflow-y-auto = scroll sendiri, terpisah dari footer */}
      <nav className="flex-1 min-h-0 overflow-y-auto px-3 py-4 space-y-1" aria-label="Navigasi pimpinan">
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 pl-2.5 pr-3 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-150 min-h-[44px] border-l-[3px]
              ${isActive
                ? "bg-brand-green-500/10 text-brand-green-500 border-brand-green-500"
                : "border-transparent text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
              }`
            }
          >
            <span className="shrink-0">{icon}</span>
            <span className="leading-snug">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User info (dengan tombol Pengaturan Akun) + logout — shrink-0, selalu nempel di bawah */}
      <div className="px-4 py-4 border-t border-neutral-200 shrink-0">
        <div className="flex items-center gap-2 mb-3 bg-neutral-50 rounded-xl p-2">
          {user?.foto_profil_url ? (
            <img
              src={user.foto_profil_url}
              alt={user?.nama ?? "Foto profil"}
              className="w-8 h-8 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-brand-green-500/10 flex items-center justify-center text-brand-green-500 font-bold text-xs shrink-0">
              {user?.nama?.charAt(0)?.toUpperCase() ?? "P"}
            </div>
          )}

          <div className="overflow-hidden flex-1">
            <p className="text-sm font-semibold text-neutral-900 truncate">{user?.nama ?? user?.email}</p>
            <p className="text-xs text-neutral-400 truncate">{ROLE_LABELS[user?.role] ?? user?.role}</p>
          </div>

          <NavLink
            to="/pimpinan/pengaturan"
            onClick={onClose}
            aria-label="Pengaturan Akun"
            title="Pengaturan Akun"
            className={({ isActive }) =>
              `shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-colors duration-150
              ${isActive
                ? "bg-brand-green-500/10 text-brand-green-500"
                : "text-neutral-400 hover:bg-white hover:text-neutral-900"
              }`
            }
          >
            <IconGear />
          </NavLink>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-state-error hover:bg-red-50 transition-colors min-h-[44px]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Keluar
        </button>
      </div>
    </aside>
  );
}