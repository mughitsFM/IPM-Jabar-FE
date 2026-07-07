import { Link } from "react-router-dom";
import PublicLayout from "@/shared/components/layout/PublicLayout";
import NewsCard from "@/features/berita/components/NewsCard";
import ProkerCalendar from "@/features/proker/components/ProkerCalendar";
import { useBeritaList } from "@/features/berita/hooks/useBeritaList";
import { SkeletonCardGrid } from "@/shared/components/ui/Skeleton";

// ── Section: Hero ────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative bg-brand-green-500 overflow-hidden">
      {/* Motif jaringan: dua simpul (hub) emas melambangkan PW sebagai pusat
          koordinasi, terhubung ke simpul-simpul putih (PC/PR) di sekitarnya —
          merepresentasikan struktur wilayah, bukan sekadar dekorasi lepas. */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 800 400"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <g stroke="currentColor" className="text-white" strokeOpacity="0.25" strokeWidth="1">
          <line x1="640" y1="130" x2="560" y2="70" />
          <line x1="640" y1="130" x2="720" y2="80" />
          <line x1="640" y1="130" x2="760" y2="180" />
          <line x1="640" y1="130" x2="700" y2="230" />
          <line x1="640" y1="130" x2="600" y2="220" />
          <line x1="640" y1="130" x2="680" y2="40" />
          <line x1="140" y1="320" x2="60" y2="280" />
          <line x1="140" y1="320" x2="90" y2="370" />
          <line x1="140" y1="320" x2="200" y2="350" />
          <line x1="140" y1="320" x2="170" y2="260" />
          <line x1="640" y1="130" x2="140" y2="320" strokeOpacity="0.12" />
        </g>
        <g className="text-white" fill="currentColor" fillOpacity="0.35">
          <circle cx="560" cy="70" r="3" />
          <circle cx="720" cy="80" r="3" />
          <circle cx="760" cy="180" r="3" />
          <circle cx="700" cy="230" r="3" />
          <circle cx="600" cy="220" r="3" />
          <circle cx="680" cy="40" r="3" />
          <circle cx="60" cy="280" r="3" />
          <circle cx="90" cy="370" r="3" />
          <circle cx="200" cy="350" r="3" />
          <circle cx="170" cy="260" r="3" />
        </g>
        <g className="text-brand-gold-300" fill="currentColor">
          <circle cx="640" cy="130" r="6" />
          <circle cx="140" cy="320" r="5" />
        </g>
      </svg>

      <div className="container-site relative py-20 lg:py-28">
        <div className="max-w-2xl">
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
            <Link to="/berita" className="btn-outline border-white text-white hover:bg-white/10 text-base px-6 py-3">
              Lihat Berita Terbaru
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
    <section className="relative bg-neutral-50 pb-10 lg:pb-14">
      <div className="container-site">
        <div className="relative z-10 -mt-10 lg:-mt-14 bg-white rounded-2xl shadow-lg border border-neutral-100 px-4 py-6 lg:px-8 lg:py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map(({ label, value }) => (
              <div key={label} className="text-center p-4">
                <p className="font-display font-bold text-brand-green-500 text-3xl">{value}</p>
                <p className="text-sm text-neutral-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Section: Berita terbaru ──────────────────────────────────────────────────
function BeritaSection() {
  const { data, isLoading } = useBeritaList({ page: 1, limit: 3 });
  // envelope BE: { status, message, data: { results, meta }, errors }
  const beritaList = data?.data?.results ?? [];

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

// ── Section: Kalender program kerja ──────────────────────────────────────────
function TimelineSection() {
  return (
    <section className="section bg-white">
      <div className="container-site">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold text-brand-green-500 uppercase tracking-wide mb-1">
              Agenda Organisasi
            </p>
            <h2 className="font-display font-bold text-neutral-900 text-2xl lg:text-3xl">
              Kalender Program Kerja
            </h2>
          </div>
          <Link to="/timeline" className="btn-outline text-sm hidden sm:inline-flex">
            Lihat Semua →
          </Link>
        </div>

        <div className="max-w-2xl mx-auto">
          <ProkerCalendar maxAgendaItems={5} />
        </div>

        <div className="sm:hidden mt-4">
          <Link to="/timeline" className="btn-outline">Lihat Semua Proker</Link>
        </div>
      </div>
    </section>
  );
}

// ── Section: CTA Bergabung (pengganti CTA Pengaduan yang sudah tidak dipakai) ─
function CTASection() {
  return (
    <section className="bg-brand-green-900 section">
      <div className="container-site text-center max-w-xl mx-auto">
        <h2 className="font-display font-bold text-white text-2xl lg:text-3xl mb-4">
          Ingin Mengenal PW IPM Jawa Barat Lebih Dekat?
        </h2>
        <p className="text-brand-green-100 text-sm mb-8">
          Pelajari struktur kepengurusan, bidang kerja, dan program-program kami
          di seluruh Jawa Barat.
        </p>
        <Link to="/profil" className="btn-secondary text-base px-8 py-3">
          Lihat Profil Organisasi
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