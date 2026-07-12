{/* frontend/features/berita/pages/BeritaListPage.jsx (lengkap) */}
import { useState } from "react";
import { Link } from "react-router-dom";
import PublicLayout from "@/shared/components/layout/PublicLayout";
import NewsCard from "../components/NewsCard";
import NewsFilterBar from "../components/NewsFilterBar";
import Pagination from "@/shared/components/ui/Pagination";
import EmptyState from "@/shared/components/ui/EmptyState";
import { SkeletonCardGrid } from "@/shared/components/ui/Skeleton";
import { useBeritaList } from "../hooks/useBeritaList";
import { useDesainSection } from "@/shared/hooks/useDesainPublic";

export default function BeritaListPage() {
  const [filters, setFilters] = useState({ page: 1, kategori: null });
  const { data, isLoading, isError } = useBeritaList(filters);
  const { section: desain } = useDesainSection("berita");

  return (
    <PublicLayout>
      <section className="relative bg-gradient-to-br from-brand-green-500 to-brand-green-700 pt-10 pb-16 overflow-hidden">
        {desain?.hero_image_url && (
          <>
            <img
              src={desain.hero_image_url}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-brand-green-900/70" />
          </>
        )}

        {/* Wave divider — transisi halus ke bg-neutral-50 di bawahnya */}
        <div className="absolute bottom-0 inset-x-0 text-neutral-50 pointer-events-none leading-none">
          <svg viewBox="0 0 1440 48" className="w-full h-8 lg:h-10" preserveAspectRatio="none" aria-hidden="true">
            <path fill="currentColor" d="M0,24 C240,40 480,8 720,16 C960,24 1200,40 1440,20 L1440,48 L0,48 Z" />
          </svg>
        </div>

        <div className="container-site relative">
          <nav aria-label="Breadcrumb" className="text-xs text-brand-green-100 mb-3 flex items-center gap-1.5">
            <Link to="/" className="hover:text-white transition-colors">Beranda</Link>
            <span className="text-brand-green-300">/</span>
            <span className="text-white font-medium">Berita</span>
          </nav>
          <h1 className="font-display font-bold text-white text-3xl lg:text-4xl mb-2 tracking-tight">
            {desain?.headline || "Berita & Informasi"}
          </h1>
          <p className="text-brand-green-50 text-sm max-w-xl">
            {desain?.subheadline || "Informasi kegiatan, pengumuman, dan sebaran surat resmi PW IPM Jawa Barat."}
          </p>
        </div>
      </section>

      <section className="bg-neutral-50 py-10 lg:py-14">
        <div className="container-site">
          <NewsFilterBar value={filters} onChange={setFilters} />

          {isLoading && <SkeletonCardGrid count={6} />}

          {isError && (
            <EmptyState
              title="Gagal memuat berita"
              message="Terjadi kesalahan saat mengambil data. Silakan coba lagi."
              action={{ label: "Coba Lagi", onClick: () => window.location.reload() }}
            />
          )}

          {!isLoading && !isError && data?.data?.results?.length === 0 && (
            <EmptyState title="Belum ada berita" message="Belum ada berita yang dipublikasikan untuk kategori ini." />
          )}

          {!isLoading && !isError && data?.data?.results?.length > 0 && (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {data.data.results.map((berita) => (
                  <NewsCard key={berita.id} data={berita} />
                ))}
              </div>

              <Pagination
                meta={data.data.meta}
                onPageChange={(page) => {
                  setFilters((prev) => ({ ...prev, page }));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}