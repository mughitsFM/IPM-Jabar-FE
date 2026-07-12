import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import PublicLayout from "@/shared/components/layout/PublicLayout";
import ProfilCard from "../components/ProfilCard";
import { useProfil } from "../hooks/useProfil";
import { SkeletonCardGrid } from "@/shared/components/ui/Skeleton";
import EmptyState from "@/shared/components/ui/EmptyState";
import { useDesainSection } from "@/shared/hooks/useDesainPublic";

// Tinggi navbar (h-16 = 64px) + nav chip sticky (~56px) + sedikit jarak,
// dipakai untuk offset scroll-spy dan scroll-margin tiap section jabatan.
const STICKY_OFFSET_PX = 132;

export default function ProfilPage() {
  const { data, isLoading, isError } = useProfil();
  const { section: desain } = useDesainSection("profil");

  const jabatanList = data?.data ?? [];

  const [activeJabatanId, setActiveJabatanId] = useState(null);
  const sectionRefs = useRef({});

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

        <div className="absolute bottom-0 inset-x-0 text-neutral-50 pointer-events-none leading-none">
          <svg viewBox="0 0 1440 48" className="w-full h-8 lg:h-10" preserveAspectRatio="none" aria-hidden="true">
            <path fill="currentColor" d="M0,24 C240,40 480,8 720,16 C960,24 1200,40 1440,20 L1440,48 L0,48 Z" />
          </svg>
        </div>

        <div className="container-site relative">
          <nav aria-label="Breadcrumb" className="text-xs text-brand-green-100 mb-3 flex items-center gap-1.5">
            <Link to="/" className="hover:text-white transition-colors">Beranda</Link>
            <span className="text-brand-green-300">/</span>
            <span className="text-white font-medium">Profil</span>
          </nav>
          <h1 className="font-display font-bold text-white text-3xl lg:text-4xl mb-2 tracking-tight">
            {desain?.headline || "Profil Kepengurusan"}
          </h1>
          <p className="text-brand-green-50 text-sm max-w-xl">
            {desain?.subheadline || "Struktur pimpinan PW IPM Jawa Barat periode aktif."}
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
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 min-h-[44px]
                    ${active
                      ? "bg-brand-green-500 text-white shadow-sm shadow-brand-green-500/30"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                    }`}
                >
                  {jabatan.nama}
                </button>
              );
            })}
          </div>
        </nav>
      )}

      <section className="bg-neutral-50 section">
        <div className="container-site">
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
              {/* Judul kelompok jabatan — flag warna sebagai penanda visual grup,
                  bukan penomoran (urutan jabatan di sini tidak selalu berarti tingkatan). */}
              <div className="flex items-center gap-3 mb-6">
                <span className="w-1.5 h-6 rounded-full bg-brand-green-500 shrink-0" />
                <h2 className="font-display font-bold text-neutral-900 text-xl">{jabatan.nama}</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-neutral-200 to-transparent" />
              </div>

              {jabatan.anggota?.length === 0 ? (
                <p className="text-sm text-neutral-400 italic py-2">Belum ada anggota untuk jabatan ini.</p>
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
        </div>
      </section>
    </PublicLayout>
  );
}