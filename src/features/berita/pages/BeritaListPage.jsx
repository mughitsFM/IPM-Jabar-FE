{/* frontend/features/berita/pages/BeritaListPage.jsx (lengkap) */}
import { useState } from "react";
import PublicLayout from "@/shared/components/layout/PublicLayout";
import NewsCard from "../components/NewsCard";
import NewsFilterBar from "../components/NewsFilterBar";
import Pagination from "@/shared/components/ui/Pagination";
import EmptyState from "@/shared/components/ui/EmptyState";
import { SkeletonCardGrid } from "@/shared/components/ui/Skeleton";
import { useBeritaList } from "../hooks/useBeritaList";

export default function BeritaListPage() {
  const [filters, setFilters] = useState({ page: 1, kategori: null });
  const { data, isLoading, isError } = useBeritaList(filters);

  return (
    <PublicLayout>
      <section className="bg-brand-green-500 py-12">
        <div className="container-site">
          <h1 className="font-display font-bold text-white text-3xl mb-2">Berita &amp; Informasi</h1>
          <p className="text-brand-green-50 text-sm">
            Informasi kegiatan, pengumuman, dan sebaran surat resmi PW IPM Jawa Barat.
          </p>
        </div>
      </section>

      <section className="container-site py-10">
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
      </section>
    </PublicLayout>
  );
}