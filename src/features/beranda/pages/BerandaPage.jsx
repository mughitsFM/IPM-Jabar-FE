import { Link } from "react-router-dom";
import PublicLayout from "@/shared/components/layout/PublicLayout";
import NewsCard from "@/features/berita/components/NewsCard";
import TimelineItem from "@/features/proker/components/TimelineItem";
import { useBeritaList } from "@/features/berita/hooks/useBeritaList";
import { useProkerList } from "@/features/proker/hooks/useProker";
import { SkeletonCardGrid } from "@/shared/components/ui/Skeleton";
import { STATUS_PROKER } from "@/shared/constants/statusEnum";

// ── Section: Hero ────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative bg-brand-green-500 overflow-hidden">
      {/* Dekorasi background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-brand-gold-500 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-brand-green-300 -translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="container-site relative py-20 lg:py-28">
        <div className="max-w-2xl">
          {/* Tagline */}
          <div className="inline-flex items-center gap-2 bg-brand-gold-500/20 text-brand-gold-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-gold-500" />
            Pimpinan Wilayah Ikatan Pelajar Muhammadiyah
          </div>

          <h1 className="font-display font-bold text-white text-4xl lg:text-5xl leading-tight mb-6">
            Bergerak Bersama<br />
            untuk <span className="text-brand-gold-300">Pelajar</span> Jawa Barat
          </h1>

          <p className="text-brand-green-100 text-lg mb-8 leading-relaxed">
            PW IPM Jawa Barat hadir sebagai wadah perjuangan, kaderisasi, dan kontribusi
            nyata pelajar Muhammadiyah se-Jawa Barat.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link to="/profil" className="btn-secondary text-base px-6 py-3">
              Kenal Kami
            </Link>
            <Link to="/pengaduan" className="btn-outline border-white text-white hover:bg-white/10 text-base px-6 py-3">
              Sampaikan Aspirasi
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Section: Stats ringkasan ─────────────────────────────────────────────────
function StatsSection() {
  const stats = [
    { label: "Kabupaten / Kota",  value: "27+" },
    { label: "PC IPM Aktif",      value: "200+" },
    { label: "Bidang Kerja",      value: "12"   },
    { label: "Tahun Berdiri",     value: "1961" },
  ];
  return (
    <section className="bg-white border-b border-neutral-200">
      <div className="container-site py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value }) => (
            <div key={label} className="text-center p-4">
              <p className="font-display font-bold text-brand-green-500 text-3xl">{value}</p>
              <p className="text-sm text-neutral-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section: Berita terbaru ──────────────────────────────────────────────────
function BeritaSection() {
  const { data, isLoading } = useBeritaList({ page: 1, per_page: 3 });
  const beritaList = data?.results ?? [];

  return (
    <section className="section bg-neutral-50">
      <div className="container-site">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold text-brand-green-500 uppercase tracking-wide mb-1">
              Terkini
            </p>
            <h2 className="font-display font-bold text-neutral-900 text-2xl lg:text-3xl">
              Berita &amp; Informasi
            </h2>
          </div>
          <Link to="/berita" className="btn-outline text-sm hidden sm:inline-flex">
            Lihat Semua →
          </Link>
        </div>

        {isLoading && <SkeletonCardGrid count={3} />}

        {!isLoading && beritaList.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {beritaList.map((b) => (
              <NewsCard key={b.id} data={b} />
            ))}
          </div>
        )}

        {!isLoading && beritaList.length === 0 && (
          <p className="text-center text-neutral-400 text-sm py-8">
            Belum ada berita yang dipublikasikan.
          </p>
        )}

        <div className="sm:hidden text-center mt-6">
          <Link to="/berita" className="btn-outline">Lihat Semua Berita</Link>
        </div>
      </div>
    </section>
  );
}

// ── Section: Timeline proker berlangsung / akan datang ──────────────────────
function TimelineSection() {
  const { data, isLoading } = useProkerList({
    status: STATUS_PROKER.BERLANGSUNG,
    per_page: 3,
  });
  const prokerList = data?.data ?? [];

  return (
    <section className="section bg-white">
      <div className="container-site">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold text-brand-green-500 uppercase tracking-wide mb-1">
              Sedang Berjalan
            </p>
            <h2 className="font-display font-bold text-neutral-900 text-2xl lg:text-3xl">
              Program Kerja
            </h2>
          </div>
          <Link to="/timeline" className="btn-outline text-sm hidden sm:inline-flex">
            Lihat Semua →
          </Link>
        </div>

        <div className="max-w-2xl">
          {isLoading && (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-neutral-100 rounded-card animate-pulse" />
              ))}
            </div>
          )}

          {!isLoading && prokerList.length > 0 && prokerList.map((p, idx) => (
            <TimelineItem key={p.id} proker={p} isLast={idx === prokerList.length - 1} />
          ))}

          {!isLoading && prokerList.length === 0 && (
            <p className="text-neutral-400 text-sm">Belum ada program kerja yang sedang berlangsung.</p>
          )}
        </div>

        <div className="sm:hidden mt-4">
          <Link to="/timeline" className="btn-outline">Lihat Semua Proker</Link>
        </div>
      </div>
    </section>
  );
}

// ── Section: CTA Pengaduan ───────────────────────────────────────────────────
function CTASection() {
  return (
    <section className="bg-brand-green-900 section">
      <div className="container-site text-center max-w-xl mx-auto">
        <h2 className="font-display font-bold text-white text-2xl lg:text-3xl mb-4">
          Ada Aspirasi atau Pengaduan?
        </h2>
        <p className="text-brand-green-100 text-sm mb-8">
          Sampaikan langsung kepada kami. Identitas Anda terjaga dan setiap pengaduan
          akan ditindaklanjuti sesuai prosedur.
        </p>
        <Link to="/pengaduan" className="btn-secondary text-base px-8 py-3">
          Kirim Pengaduan Sekarang
        </Link>
      </div>
    </section>
  );
}

// ── Page Component ───────────────────────────────────────────────────────────
export default function BerandaPage() {
  return (
    <PublicLayout>
      <HeroSection />
      <StatsSection />
      <BeritaSection />
      <TimelineSection />
      <CTASection />
    </PublicLayout>
  );
}
