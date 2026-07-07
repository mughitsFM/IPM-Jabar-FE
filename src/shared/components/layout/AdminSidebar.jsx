import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "@/app/providers/AuthProvider";
import { firebaseAuthService } from "@/features/auth/services/firebaseAuthService";
import { ROLES, ROLE_LABELS } from "@/shared/constants/roles";

// ── Ikon (dipisah supaya array NAV_GROUPS_* di bawah tetap ringkas) ─────────
const IconDashboard = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);
const IconBerita = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
  </svg>
);
const IconReviewArtikel = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const IconProfil = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const IconProker = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const IconSurat = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);
const IconAspirasi = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8-1.06 0-2.077-.16-3.02-.457L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);
const IconPimpinan = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);
const IconGear = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const IconAdminAccount = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);
const IconChevronDown = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

// ── Menu Admin (role "editor", ditampilkan sebagai "Admin") — file 12 §3 ───
// Dikelompokkan per kategori. `label: null` = grup tanpa judul (item lepas
// seperti Dashboard & Pengaturan Akun yang bukan bagian dari ketiga kategori,
// dan TIDAK dijadikan dropdown). Grup dengan `label` diisi akan otomatis
// dirender sebagai dropdown yang bisa dibuka/tutup.
const NAV_GROUPS_ADMIN = [
  {
    label: null,
    items: [
      { to: "/admin/dashboard", label: "Dashboard", icon: <IconDashboard /> },
    ],
  },
  {
    label: "Manajemen Konten",
    items: [
      { to: "/admin/profil",             label: "Profil Kepengurusan", icon: <IconProfil /> },
      { to: "/admin/berita",           label: "Berita",                  icon: <IconBerita /> },
      { to: "/admin/proker",           label: "Program Kerja",           icon: <IconProker /> },
    ],
  },
  {
    label: "Manajemen Publik",
    items: [

    ],
  },
  {
    label: "Manajemen Pimpinan",
    items: [
      { to: "/admin/manajemen-pimpinan", label: "Manajemen Pimpinan",  icon: <IconPimpinan /> },
      { to: "/admin/artikel-pimpinan", label: "Review Artikel Pimpinan", icon: <IconReviewArtikel /> },
    ],
  },
  {
    label: null,
    items: [
      { to: "/admin/surat",    label: "Surat Menyurat", icon: <IconSurat /> },
      { to: "/admin/aspirasi", label: "Aspirasi",       icon: <IconAspirasi /> },
      { to: "/admin/pengaturan", label: "Pengaturan Akun", icon: <IconGear /> },
    ],
  },
];

// ── Menu Superadmin — hanya 4 panel, dibiarkan flat (file 12 §4) ───────────
const NAV_GROUPS_SUPERADMIN = [
  {
    label: null,
    items: [
      { to: "/admin/dashboard-superadmin", label: "Dashboard",               icon: <IconDashboard /> },
      { to: "/admin/pengguna",             label: "Manajemen Akun Admin",    icon: <IconAdminAccount /> },
      { to: "/admin/manajemen-pimpinan",   label: "Manajemen Akun Pimpinan", icon: <IconPimpinan /> },
      { to: "/admin/pengaturan",           label: "Pengaturan Akun",         icon: <IconGear /> },
    ],
  },
];

export default function AdminSidebar({ onClose }) {
  const { user }   = useAuthContext();
  const navigate   = useNavigate();
  const location   = useLocation();

  const isSuperAdmin = user?.role === ROLES.SUPER_ADMIN;
  const groups = isSuperAdmin ? NAV_GROUPS_SUPERADMIN : NAV_GROUPS_ADMIN;

  // Grup berlabel = dropdown. Default: terbuka otomatis jika salah satu
  // link di dalamnya sedang aktif (sesuai path saat ini), selebihnya tertutup.
  const [openGroups, setOpenGroups] = useState(() => {
    const state = {};
    groups.forEach((group) => {
      if (!group.label) return;
      state[group.label] = group.items.some((item) =>
        location.pathname.startsWith(item.to)
      );
    });
    return state;
  });

  const toggleGroup = (label) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

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
            <p className="font-display font-bold text-white text-sm leading-tight">
              {isSuperAdmin ? "Panel Superadmin" : "Panel Admin"}
            </p>
            <p className="text-brand-blue-500/80 text-xs text-white/70">PW IPM Jawa Barat</p>
          </div>
        </div>
      </div>

      {/* Nav items, dikelompokkan per kategori. Grup berlabel = dropdown */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto" aria-label="Navigasi admin">
        {groups.map((group, groupIdx) => {
          // Grup kosong (mis. "Manajemen Publik" yang belum ada isinya) diskip
          if (group.items.length === 0) return null;

          const isDropdown = Boolean(group.label);
          const isOpen = isDropdown ? Boolean(openGroups[group.label]) : true;

          return (
            <div key={group.label ?? `group-${groupIdx}`} className={groupIdx > 0 ? "mt-5" : ""}>
              {isDropdown ? (
                <button
                  type="button"
                  onClick={() => toggleGroup(group.label)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between px-3 py-1 mb-1 text-xs font-semibold text-neutral-400 uppercase tracking-wide hover:text-neutral-600 transition-colors"
                >
                  <span>{group.label}</span>
                  <IconChevronDown
                    className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              ) : null}

              {isOpen && (
                <div className="space-y-1">
                  {group.items.map(({ to, label, icon }) => (
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
                </div>
              )}
            </div>
          );
        })}
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