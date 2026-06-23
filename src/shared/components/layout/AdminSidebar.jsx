import { NavLink, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/app/providers/AuthProvider";
import { firebaseAuthService } from "@/features/auth/services/firebaseAuthService";
import { ROLES, ROLE_LABELS } from "@/shared/constants/roles";

const NAV_ITEMS = [
  {
    to:    "/admin/dashboard",
    label: "Dashboard",
    icon:  (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    to:    "/admin/berita",
    label: "Berita",
    icon:  (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
  },
  {
    to:    "/admin/profil",
    label: "Profil Kepengurusan",
    icon:  (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    to:    "/admin/proker",
    label: "Program Kerja",
    icon:  (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    to:    "/admin/pengaduan",
    label: "Pengaduan",
    icon:  (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    to:         "/admin/pengguna",
    label:      "Pengguna Admin",
    role:       ROLES.SUPER_ADMIN,  // hanya tampil untuk super_admin
    icon:  (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
];

export default function AdminSidebar({ onClose }) {
  const { user }   = useAuthContext();
  const navigate   = useNavigate();

  const handleLogout = async () => {
    await firebaseAuthService.logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-neutral-200 flex flex-col">
      {/* Header sidebar */}
      <div className="px-5 py-5 border-b border-neutral-200 bg-brand-blue-500">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-gold-500 flex items-center justify-center text-neutral-900 font-bold text-xs shrink-0">
            IPM
          </div>
          <div>
            <p className="font-display font-bold text-white text-sm leading-tight">Panel Admin</p>
            <p className="text-brand-blue-500/80 text-xs text-white/70">PW IPM Jawa Barat</p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Navigasi admin">
        {NAV_ITEMS.filter((item) =>
          !item.role || user?.role === item.role || user?.role === ROLES.SUPER_ADMIN
        ).map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-150 min-h-[44px]
              ${isActive
                ? "bg-brand-blue-500/10 text-brand-blue-500"
                : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
              }`
            }
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User info + logout */}
      <div className="px-4 py-4 border-t border-neutral-200">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-brand-blue-500/10 flex items-center justify-center text-brand-blue-500 font-bold text-xs shrink-0">
            {user?.nama?.charAt(0)?.toUpperCase() ?? "A"}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-neutral-900 truncate">{user?.nama ?? user?.email}</p>
            <p className="text-xs text-neutral-400">{ROLE_LABELS[user?.role] ?? user?.role}</p>
          </div>
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
