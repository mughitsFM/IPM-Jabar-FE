import { useParams } from "react-router-dom";
import PublicLayout from "@/shared/components/layout/PublicLayout";
import NewsDetail from "../components/NewsDetail";
import { useBeritaDetail } from "../hooks/useBeritaDetail";
import { SkeletonLine } from "@/shared/components/ui/Skeleton";
import EmptyState from "@/shared/components/ui/EmptyState";

export default function BeritaDetailPage() {
  const { slug } = useParams();
  const { data, isLoading, isError } = useBeritaDetail(slug);

  return (
    <PublicLayout>
      <div className="container-site section">
        {isLoading && (
          <div className="max-w-3xl mx-auto space-y-4">
            <SkeletonLine className="w-1/4 h-5" />
            <SkeletonLine className="w-full h-9" />
            <SkeletonLine className="w-3/4 h-9" />
            <SkeletonLine className="w-1/3 h-4" />
            <div className="aspect-video bg-neutral-200 rounded-card animate-pulse mt-6" />
            <div className="space-y-3 mt-6">
              {[...Array(6)].map((_, i) => (
                <SkeletonLine key={i} className={i % 3 === 2 ? "w-3/4" : "w-full"} />
              ))}
            </div>
          </div>
        )}

        {isError && (
          <EmptyState
            title="Berita tidak ditemukan"
            message="Halaman yang Anda cari tidak tersedia atau sudah dihapus."
            action={{ label: "Kembali ke Berita", onClick: () => window.history.back() }}
          />
        )}

        {!isLoading && !isError && data?.data && (
          <NewsDetail data={data.data} />
        )}
      </div>
    </PublicLayout>
  );
}
