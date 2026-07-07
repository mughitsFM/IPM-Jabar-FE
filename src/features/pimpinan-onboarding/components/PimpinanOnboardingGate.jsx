import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuthContext } from "@/app/providers/AuthProvider";

/**
 * Membungkus semua children route /pimpinan/* (lihat app/router.jsx §2 di
 * 02-login-dan-layout-pimpinan.md). ProtectedRoute di level parent sudah
 * memastikan user login & role === "pimpinan" sebelum sampai ke sini, jadi
 * `user` di sini seharusnya selalu ada.
 *
 * - Selama first_login_done === false: paksa redirect ke /pimpinan/onboarding
 *   untuk route mana pun selain onboarding itu sendiri.
 * - Begitu first_login_done === true: /pimpinan/onboarding tidak boleh
 *   diakses ulang, redirect ke dashboard.
 */
export default function PimpinanOnboardingGate() {
  const { user } = useAuthContext();
  const location = useLocation();

  if (!user) return null; // seharusnya tidak pernah kejadian (sudah dijaga ProtectedRoute)

  const isOnboardingRoute = location.pathname === "/pimpinan/onboarding";

  if (!user.first_login_done && !isOnboardingRoute) {
    return <Navigate to="/pimpinan/onboarding" replace />;
  }

  if (user.first_login_done && isOnboardingRoute) {
    return <Navigate to="/pimpinan/dashboard" replace />;
  }

  return <Outlet />;
}
