import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "@/shared/components/ProtectedRoute";
import { LoadingScreen } from "@/shared/components/ui/Skeleton";

// ── Lazy import semua halaman ────────────────────────────────────────────────
// Publik
const BerandaPage       = lazy(() => import("@/features/beranda/pages/BerandaPage"));
const BeritaListPage    = lazy(() => import("@/features/berita/pages/BeritaListPage"));
const BeritaDetailPage  = lazy(() => import("@/features/berita/pages/BeritaDetailPage"));
const ProfilPage        = lazy(() => import("@/features/profil/pages/ProfilPage"));
const TimelinePage      = lazy(() => import("@/features/proker/pages/TimelinePage"));
const PengaduanPage     = lazy(() => import("@/features/pengaduan/pages/PengaduanPage"));

// Admin
const AdminLoginPage    = lazy(() => import("@/features/auth/pages/AdminLoginPage"));
const AdminDashboard    = lazy(() => import("@/features/dashboard/pages/admin/AdminDashboardPage"));
const AdminBeritaPage   = lazy(() => import("@/features/berita/pages/admin/AdminBeritaPage"));
const AdminProfilPage   = lazy(() => import("@/features/profil/pages/admin/AdminProfilPage"));
const AdminProkerPage   = lazy(() => import("@/features/proker/pages/admin/AdminProkerPage"));
const AdminPengaduanPage = lazy(() => import("@/features/pengaduan/pages/admin/AdminPengaduanPage"));
const AdminPenggunaPage = lazy(() => import("@/features/pengguna-admin/pages/admin/AdminPenggunaPage"));

const Fallback = () => <LoadingScreen />;

export const routes = [
  // ── Halaman Publik ──────────────────────────────────────────────────────
  { path: "/",             element: <Suspense fallback={<Fallback />}><BerandaPage /></Suspense> },
  { path: "/berita",       element: <Suspense fallback={<Fallback />}><BeritaListPage /></Suspense> },
  { path: "/berita/:slug", element: <Suspense fallback={<Fallback />}><BeritaDetailPage /></Suspense> },
  { path: "/profil",       element: <Suspense fallback={<Fallback />}><ProfilPage /></Suspense> },
  { path: "/timeline",     element: <Suspense fallback={<Fallback />}><TimelinePage /></Suspense> },
  { path: "/pengaduan",    element: <Suspense fallback={<Fallback />}><PengaduanPage /></Suspense> },

  // ── Login Admin (tidak perlu ProtectedRoute) ────────────────────────────
  { path: "/admin/login",  element: <Suspense fallback={<Fallback />}><AdminLoginPage /></Suspense> },

  // ── Halaman Admin (Protected) ───────────────────────────────────────────
  {
    path: "/admin",
    element: <ProtectedRoute />,
    children: [
      { index: true,          element: <Navigate to="/admin/dashboard" replace /> },
      { path: "dashboard",    element: <Suspense fallback={<Fallback />}><AdminDashboard /></Suspense> },
      { path: "berita",       element: <Suspense fallback={<Fallback />}><AdminBeritaPage /></Suspense> },
      { path: "profil",       element: <Suspense fallback={<Fallback />}><AdminProfilPage /></Suspense> },
      { path: "proker",       element: <Suspense fallback={<Fallback />}><AdminProkerPage /></Suspense> },
      { path: "pengaduan",    element: <Suspense fallback={<Fallback />}><AdminPengaduanPage /></Suspense> },
      {
        path: "pengguna",
        element: (
          <ProtectedRoute requiredRole="super_admin">
            <Suspense fallback={<Fallback />}><AdminPenggunaPage /></Suspense>
          </ProtectedRoute>
        ),
      },
    ],
  },

  // ── Fallback 404 ────────────────────────────────────────────────────────
  { path: "*", element: <Navigate to="/" replace /> },
];
