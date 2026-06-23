import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "@/app/providers/AuthProvider";
import { LoadingScreen } from "@/shared/components/ui/Skeleton";

/**
 * ProtectedRoute — memproteksi semua halaman /admin/*.
 *
 * Props:
 * - `children` : render children langsung (untuk nested protected, misal super_admin only)
 * - `requiredRole` : jika diset, hanya role tersebut (atau super_admin) yang boleh masuk
 *
 * Tanpa `children`, render <Outlet> untuk nested route biasa.
 */
export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuthContext();

  if (loading) return <LoadingScreen />;

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole && user.role !== "super_admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children ?? <Outlet />;
}
