import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "@/app/providers/AuthProvider";
import { LoadingScreen } from "@/shared/components/ui/Skeleton";
import { ROLES } from "@/shared/constants/roles";

// Role-role sisi Admin (dipakai sebagai default kalau tidak ada
// allowedRoles/requiredRole diberikan — proteksi umum grup /admin/*).
const ADMIN_SIDE_ROLES = [ROLES.SUPER_ADMIN, ROLES.EDITOR];

/** "Rumah" tiap role — dipakai saat role tidak diizinkan tapi user SUDAH
 * login (supaya tidak dilempar balik ke halaman login, melainkan ke
 * dashboard miliknya sendiri). */
function getHomePathForRole(role) {
  switch (role) {
    case ROLES.SUPER_ADMIN:
      return "/admin/dashboard-superadmin";
    case ROLES.EDITOR:
      return "/admin/dashboard";
    case ROLES.PIMPINAN:
      return "/pimpinan/dashboard";
    default:
      return "/";
  }
}

/**
 * ProtectedRoute — memproteksi route berdasar status login & role.
 * Dipakai untuk KEDUA grup: /admin/* (super_admin, editor) dan /pimpinan/*
 * (pimpinan) — lihat app/router.jsx.
 *
 * Props:
 * - `children`     : render children langsung (dipakai untuk nested
 *                     protected route berupa "element", mis. halaman
 *                     super_admin-only di dalam /admin). Tanpa `children`,
 *                     render <Outlet/> (dipakai sebagai layout route untuk
 *                     grup /admin atau /pimpinan sekaligus).
 * - `allowedRoles` : array role yang diizinkan, DAFTAR TERTUTUP — tidak ada
 *                     bypass super_admin implisit. Dipakai untuk pemisahan
 *                     Admin vs Pimpinan yang harus benar-benar eksklusif,
 *                     contoh: allowedRoles={[ROLES.PIMPINAN]} pada grup
 *                     /pimpinan (super_admin/editor TIDAK ikut lolos).
 *                     Kalau tidak diisi DAN requiredRole juga tidak diisi,
 *                     default ke [super_admin, editor] (proteksi umum
 *                     /admin/*, otomatis menolak role pimpinan).
 * - `requiredRole` : shortcut untuk satu role spesifik DI DALAM grup admin
 *                     (mis. requiredRole={ROLES.SUPER_ADMIN} untuk halaman
 *                     /admin/pengguna atau /admin/dashboard-superadmin).
 *                     super_admin SELALU ikut lolos di sini (bypass) —
 *                     sesuai keputusan file 12 §4: secara teknis super_admin
 *                     tetap punya hak akses penuh ke seluruh endpoint
 *                     IsAdminUser, jadi tidak dikunci di level FE juga.
 * - `loginPath`    : path redirect kalau BELUM login. Default "/admin/login".
 *                     Isi "/pimpinan/login" untuk grup /pimpinan.
 */
export default function ProtectedRoute({
  children,
  allowedRoles,
  requiredRole,
  loginPath = "/admin/login",
}) {
  const { user, loading } = useAuthContext();

  if (loading) return <LoadingScreen />;

  if (!user) {
    return <Navigate to={loginPath} replace />;
  }

  // Pola 1: requiredRole — satu role spesifik, super_admin selalu bypass.
  if (requiredRole) {
    const boleh = user.role === requiredRole || user.role === ROLES.SUPER_ADMIN;
    if (!boleh) return <Navigate to={getHomePathForRole(user.role)} replace />;
    return children ?? <Outlet />;
  }

  // Pola 2: allowedRoles — daftar tertutup, TIDAK ADA bypass super_admin.
  // Kalau tidak diberikan sama sekali, default proteksi umum sisi Admin.
  const roles = allowedRoles ?? ADMIN_SIDE_ROLES;
  if (!roles.includes(user.role)) {
    return <Navigate to={getHomePathForRole(user.role)} replace />;
  }

  return children ?? <Outlet />;
}