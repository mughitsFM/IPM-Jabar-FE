import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "@/shared/components/ProtectedRoute";
import { LoadingScreen } from "@/shared/components/ui/Skeleton";
import { ROLES } from "@/shared/constants/roles";
import PimpinanOnboardingGate from "@/features/pimpinan-onboarding/components/PimpinanOnboardingGate"; // logika penuh: file 03

// ── Lazy import semua halaman ────────────────────────────────────────────────
// Publik
const BerandaPage       = lazy(() => import("@/features/beranda/pages/BerandaPage"));
const BeritaListPage    = lazy(() => import("@/features/berita/pages/BeritaListPage"));
const BeritaDetailPage  = lazy(() => import("@/features/berita/pages/BeritaDetailPage"));
const ProfilPage        = lazy(() => import("@/features/profil/pages/ProfilPage"));
const TimelinePage      = lazy(() => import("@/features/proker/pages/TimelinePage"));
// const PengaduanPage     = lazy(() => import("@/features/pengaduan/pages/PengaduanPage"));

// Admin
const AdminLoginPage     = lazy(() => import("@/features/auth/pages/AdminLoginPage"));
const AdminDashboard     = lazy(() => import("@/features/dashboard/pages/admin/AdminDashboardPage"));
const SuperadminDashboardPage = lazy(() => import("@/features/dashboard/pages/admin/SuperadminDashboardPage")); // file 12 §5.2
const AdminBeritaPage    = lazy(() => import("@/features/berita/pages/admin/AdminBeritaPage"));
const AdminProfilPage    = lazy(() => import("@/features/profil/pages/admin/AdminProfilPage"));
const AdminProkerPage    = lazy(() => import("@/features/proker/pages/admin/AdminProkerPage"));
// const AdminPengaduanPage = lazy(() => import("@/features/pengaduan/pages/admin/AdminPengaduanPage"));
const AdminPenggunaPage  = lazy(() => import("@/features/pengguna-admin/pages/admin/AdminPenggunaPage"));
const AdminSuratPage = lazy(() => import("@/features/surat-menyurat/pages/admin/AdminSuratPage"));
const AdminAspirasiPage = lazy(() => import("@/features/aspirasi/pages/admin/AdminAspirasiPage"));
const AdminArtikelPimpinanPage = lazy(() => import("@/features/artikel-pimpinan/pages/admin/AdminArtikelPimpinanPage"));
const AdminManajemenPimpinanPage = lazy(() => import("@/features/pimpinan-admin/pages/AdminManajemenPimpinanPage")); // file 11
const AdminPengaturanPage = lazy(() => import("@/features/pengaturan-akun/pages/admin/PengaturanAkunPage")); // file 08

// Pimpinan (BARU)
const PimpinanLoginPage      = lazy(() => import("@/features/auth/pages/PimpinanLoginPage"));
const PimpinanOnboardingPage = lazy(() => import("@/features/pimpinan-onboarding/pages/OnboardingPage"));                // file 03
const PimpinanDashboard      = lazy(() => import("@/features/dashboard/pages/pimpinan/PimpinanDashboardPage"));          // file 04
const PimpinanArtikelListPage = lazy(() => import("@/features/artikel-pimpinan/pages/PimpinanArtikelListPage"));
const PimpinanArtikelFormPage = lazy(() => import("@/features/artikel-pimpinan/pages/PimpinanArtikelFormPage"));              // file 05
const PimpinanSuratPage      = lazy(() => import("@/features/surat-menyurat/pages/pimpinan/PimpinanSuratPage"));        // file 06
const PimpinanArsipPage      = lazy(() => import("@/features/arsip/pages/PimpinanArsipPage"));                          // file 07
const PimpinanAspirasiPage   = lazy(() => import("@/features/aspirasi/pages/pimpinan/PimpinanAspirasiPage"));           // file 09
const PimpinanPengaturanPage = lazy(() => import("@/features/pengaturan-akun/pages/pimpinan/PengaturanAkunPage"));      // file 08

const Fallback = () => <LoadingScreen />;

export const routes = [
  // ── Halaman Publik ──────────────────────────────────────────────────────
  { path: "/",             element: <Suspense fallback={<Fallback />}><BerandaPage /></Suspense> },
  { path: "/berita",       element: <Suspense fallback={<Fallback />}><BeritaListPage /></Suspense> },
  { path: "/berita/:slug", element: <Suspense fallback={<Fallback />}><BeritaDetailPage /></Suspense> },
  { path: "/profil",       element: <Suspense fallback={<Fallback />}><ProfilPage /></Suspense> },
  { path: "/timeline",     element: <Suspense fallback={<Fallback />}><TimelinePage /></Suspense> },
  // { path: "/pengaduan",    element: <Suspense fallback={<Fallback />}><PengaduanPage /></Suspense> },

  // ── Login Admin (tidak perlu ProtectedRoute) ────────────────────────────
  { path: "/admin/login",  element: <Suspense fallback={<Fallback />}><AdminLoginPage /></Suspense> },

  // ── Halaman Admin (Protected) ────────────────────────────────────────────
  // Wrapper ini hanya gerbang login+"apakah sisi admin" (super_admin ATAU
  // editor). Pemisahan HAK AKSES per halaman (editor-only vs superadmin-only
  // vs bersama) dilakukan di tiap child lewat allowedRoles/requiredRole —
  // super_admin TIDAK lagi otomatis lolos ke halaman khusus editor.
  {
    path: "/admin",
    element: <ProtectedRoute />,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },

      // ── Khusus editor (admin) — super_admin ditolak, dilempar ke
      //    dashboard-superadmin lewat getHomePathForRole ───────────────────
      {
        path: "dashboard",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.EDITOR]}>
            <Suspense fallback={<Fallback />}><AdminDashboard /></Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "berita",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.EDITOR]}>
            <Suspense fallback={<Fallback />}><AdminBeritaPage /></Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "profil",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.EDITOR]}>
            <Suspense fallback={<Fallback />}><AdminProfilPage /></Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "proker",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.EDITOR]}>
            <Suspense fallback={<Fallback />}><AdminProkerPage /></Suspense>
          </ProtectedRoute>
        ),
      },
      // { path: "pengaduan", element: (<ProtectedRoute allowedRoles={[ROLES.EDITOR]}><Suspense fallback={<Fallback />}><AdminPengaduanPage /></Suspense></ProtectedRoute>) },
      {
        path: "artikel-pimpinan",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.EDITOR]}>
            <Suspense fallback={<Fallback/>}><AdminArtikelPimpinanPage/></Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "surat",
        element: <ProtectedRoute allowedRoles={[ROLES.EDITOR]} />,
        children: [
          { index: true, element: <Suspense fallback={<Fallback/>}><AdminSuratPage/></Suspense> },
          { path: ":id", element: <Suspense fallback={<Fallback/>}><AdminSuratPage/></Suspense> },
        ],
      },
      {
        path: "aspirasi",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.EDITOR]}>
            <Suspense fallback={<Fallback/>}><AdminAspirasiPage/></Suspense>
          </ProtectedRoute>
        ),
      },

      // ── Khusus super_admin ───────────────────────────────────────────────
      {
        path: "dashboard-superadmin",
        element: (
          <ProtectedRoute requiredRole={ROLES.SUPER_ADMIN}>
            <Suspense fallback={<Fallback />}><SuperadminDashboardPage /></Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "pengguna",
        element: (
          <ProtectedRoute requiredRole={ROLES.SUPER_ADMIN}>
            <Suspense fallback={<Fallback />}><AdminPenggunaPage /></Suspense>
          </ProtectedRoute>
        ),
      },

      // ── Bersama (super_admin & editor) — pakai default 2-role ───────────
      { path: "manajemen-pimpinan", element: <Suspense fallback={<Fallback/>}><AdminManajemenPimpinanPage/></Suspense> },
      { path: "pengaturan",         element: <Suspense fallback={<Fallback />}><AdminPengaturanPage /></Suspense> },
    ],
  },

  // ── Login Pimpinan (publik) ──────────────────────────────────────────────
  {
    path: "/pimpinan/login",
    element: <Suspense fallback={<Fallback />}><PimpinanLoginPage /></Suspense>,
  },

  // ── Halaman Pimpinan (Protected, role EKSKLUSIF "pimpinan") ─────────────
  {
    path: "/pimpinan",
    element: <ProtectedRoute allowedRoles={[ROLES.PIMPINAN]} loginPath="/pimpinan/login" />,
    children: [
      {
        element: <PimpinanOnboardingGate />,
        children: [
          { index: true,        element: <Navigate to="/pimpinan/dashboard" replace /> },
          { path: "onboarding", element: <Suspense fallback={<Fallback />}><PimpinanOnboardingPage /></Suspense> },
          { path: "dashboard",  element: <Suspense fallback={<Fallback />}><PimpinanDashboard /></Suspense> },
          {
            path: "artikel",
            children: [
              { index: true, element: <Suspense fallback={<Fallback/>}><PimpinanArtikelListPage/></Suspense> },
              { path: "baru", element: <Suspense fallback={<Fallback/>}><PimpinanArtikelFormPage/></Suspense> },
              { path: ":id", element: <Suspense fallback={<Fallback/>}><PimpinanArtikelFormPage/></Suspense> },
            ],
          },
          {
            path: "surat",
            children: [
              { index: true, element: <Suspense fallback={<Fallback/>}><PimpinanSuratPage/></Suspense> },
              { path: ":id", element: <Suspense fallback={<Fallback/>}><PimpinanSuratPage/></Suspense> },
            ],
          },
          { path: "arsip",      element: <Suspense fallback={<Fallback />}><PimpinanArsipPage /></Suspense> },
          { path: "aspirasi", element: <Suspense fallback={<Fallback/>}><PimpinanAspirasiPage/></Suspense> },
          { path: "pengaturan", element: <Suspense fallback={<Fallback />}><PimpinanPengaturanPage /></Suspense> },
        ],
      },
    ],
  },

  // ── Fallback 404 ────────────────────────────────────────────────────────
  { path: "*", element: <Navigate to="/" replace /> },
];