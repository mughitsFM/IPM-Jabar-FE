import PublicLayout from "@/shared/components/layout/PublicLayout";
import ProfilCard from "../components/ProfilCard";
import { useProfil } from "../hooks/useProfil";
import { SkeletonCardGrid } from "@/shared/components/ui/Skeleton";
import EmptyState from "@/shared/components/ui/EmptyState";

export default function ProfilPage() {
  const { data, isLoading, isError } = useProfil();

  // data.data = array jabatan, tiap jabatan punya array anggota[]
  const jabatanList = data?.data ?? [];

  return (
    <PublicLayout>
      {/* Header */}
      <section className="bg-brand-green-500 py-12">
        <div className="container-site">
          <h1 className="font-display font-bold text-white text-3xl mb-2">
            Profil Kepengurusan
          </h1>
          <p className="text-brand-green-50 text-sm">
            Struktur pimpinan PW IPM Jawa Barat periode aktif.
          </p>
        </div>
      </section>

      <section className="container-site section">
        {isLoading && <SkeletonCardGrid count={8} />}

        {isError && (
          <EmptyState
            title="Gagal memuat data"
            message="Terjadi kesalahan saat mengambil data kepengurusan."
          />
        )}

        {!isLoading && !isError && jabatanList.length === 0 && (
          <EmptyState
            title="Data kepengurusan belum tersedia"
            message="Data struktur kepengurusan sedang dipersiapkan."
          />
        )}

        {/* Render per jabatan/divisi */}
        {!isLoading && !isError && jabatanList.map((jabatan) => (
          <div key={jabatan.id} className="mb-12">
            {/* Judul kelompok jabatan */}
            <div className="flex items-center gap-4 mb-6">
              <h2 className="font-display font-bold text-neutral-900 text-xl">{jabatan.nama}</h2>
              <div className="flex-1 h-px bg-neutral-200" />
            </div>

            {jabatan.anggota?.length === 0 ? (
              <p className="text-sm text-neutral-400">Belum ada anggota untuk jabatan ini.</p>
            ) : (
              <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {jabatan.anggota
                  .sort((a, b) => a.urutan - b.urutan)
                  .map((anggota) => (
                    <ProfilCard key={anggota.id} anggota={anggota} />
                  ))}
              </div>
            )}
          </div>
        ))}
      </section>
    </PublicLayout>
  );
}
