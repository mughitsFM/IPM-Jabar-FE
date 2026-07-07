import { useEffect, useRef, useState } from "react";
import PublicLayout from "@/shared/components/layout/PublicLayout";
import ProfilCard from "../components/ProfilCard";
import { useProfil } from "../hooks/useProfil";
import { SkeletonCardGrid } from "@/shared/components/ui/Skeleton";
import EmptyState from "@/shared/components/ui/EmptyState";

// Tinggi navbar (h-16 = 64px) + nav chip sticky (~56px) + sedikit jarak,
// dipakai untuk offset scroll-spy dan scroll-margin tiap section jabatan.
const STICKY_OFFSET_PX = 132;

export default function ProfilPage() {
  const { data, isLoading, isError } = useProfil();

  // data.data = array jabatan, tiap jabatan punya array anggota[]
  const jabatanList = data?.data ?? [];

  const [activeJabatanId, setActiveJabatanId] = useState(null);
  const sectionRefs = useRef({});

  // Scroll-spy: tandai chip jabatan yang section-nya sedang terlihat di viewport.
  useEffect(() => {
    if (jabatanList.length <= 1) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveJabatanId(Number(visible[0].target.dataset.jabatanId));
        }
      },
      { rootMargin: `-${STICKY_OFFSET_PX}px 0px -60% 0px`, threshold: 0 }
    );

    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [jabatanList]);

  const scrollToJabatan = (id) => {
    setActiveJabatanId(id);
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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

      {/* Navigasi cepat antar jabatan — hanya tampil kalau grupnya lebih dari satu,
          supaya tidak mubazir untuk struktur kepengurusan yang kecil. */}
      {!isLoading && !isError && jabatanList.length > 1 && (
        <nav
          aria-label="Navigasi cepat jabatan"
          className="sticky top-16 z-30 bg-white/95 backdrop-blur-sm border-b border-neutral-200 overflow-x-auto"
        >
          <div className="container-site flex gap-2 py-3">
            {jabatanList.map((jabatan) => {
              const active = activeJabatanId === jabatan.id;
              return (
                <button
                  key={jabatan.id}
                  onClick={() => scrollToJabatan(jabatan.id)}
                  aria-current={active ? "true" : undefined}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-150 min-h-[44px]
                    ${active ? "bg-brand-green-500 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"}`}
                >
                  {jabatan.nama}
                </button>
              );
            })}
          </div>
        </nav>
      )}

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
          <div
            key={jabatan.id}
            id={`jabatan-${jabatan.id}`}
            data-jabatan-id={jabatan.id}
            ref={(el) => { sectionRefs.current[jabatan.id] = el; }}
            className="mb-12 scroll-mt-[132px]"
          >
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