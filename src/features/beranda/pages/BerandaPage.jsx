import { Link } from "react-router-dom";
import PublicLayout from "@/shared/components/layout/PublicLayout";
import NewsCard from "@/features/berita/components/NewsCard";
import EmptyState from "@/shared/components/ui/EmptyState";
import ProkerCalendar from "@/features/proker/components/ProkerCalendar";
import { useBeritaList } from "@/features/berita/hooks/useBeritaList";
import { SkeletonCardGrid } from "@/shared/components/ui/Skeleton";
import { useDesainSection } from "@/shared/hooks/useDesainPublic";

// Link tombol CTA — href bisa internal (route SPA) atau eksternal (http...),
// jadi dua kondisi ini perlu ditangani beda (Link vs <a>).
function CTALink({ href, className, children }) {
  const isExternal = href?.startsWith("http");
  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link to={href || "/"} className={className}>
      {children}
    </Link>
  );
}

// Ikon panah kecil dipakai di semua link "Lihat Semua" — konsisten & jadi
// penanda "ini link navigasi", beda bahasa visual dari tombol CTA solid.
function ArrowIcon({ className = "w-4 h-4" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

// ── Section: Hero ────────────────────────────────────────────────────────────
function HeroSection() {
  const { section } = useDesainSection("beranda");

  const heroImageUrl = section?.hero_image_url;
  const badgeText = section?.badge_text || "Pimpinan Wilayah Ikatan Pelajar Muhammadiyah";
  const headline = section?.headline || "Bergerak Bersama untuk Pelajar Jawa Barat";
  const subheadline = section?.subheadline ||
    "PW IPM Jawa Barat hadir sebagai wadah perjuangan, kaderisasi, dan kontribusi nyata pelajar Muhammadiyah se-Jawa Barat.";
  const cta1 = section?.cta_1;
  const cta2 = section?.cta_2;

  return (
    <section className="relative bg-brand-green-500 overflow-hidden">
      {heroImageUrl ? (
        <>
          <img
            src={heroImageUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Overlay gelap supaya teks putih tetap terbaca di atas foto apa pun */}
          <div className="absolute inset-0 bg-brand-green-900/70" />
        </>
      ) : (
        // Motif jaringan dekoratif — tampil kalau admin belum unggah gambar hero.
        // Dua simpul (hub) emas melambangkan PW sebagai pusat koordinasi,
        // terhubung ke simpul-simpul putih (PC/PR) di sekitarnya. Motif ini
        // diulang lagi (versi kecil) di CTA section sebagai benang merah visual.
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
      )}

      {/* Wave divider — transisi halus ke StatsSection (bg-neutral-50) di bawahnya */}
      <div className="absolute bottom-0 inset-x-0 text-neutral-50 pointer-events-none leading-none">
        <svg viewBox="0 0 1440 48" className="w-full h-8 lg:h-12" preserveAspectRatio="none" aria-hidden="true">
          <path fill="currentColor" d="M0,24 C240,40 480,8 720,16 C960,24 1200,40 1440,20 L1440,48 L0,48 Z" />
        </svg>
      </div>

      <div className="container-site relative py-20 lg:py-28">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 backdrop-blur-sm bg-brand-gold-500/15 border border-brand-gold-400/25 text-brand-gold-200 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-gold-400 animate-pulse" />
            {badgeText}
          </div>

          <h1 className="font-display font-bold text-white text-4xl lg:text-6xl leading-[1.08] tracking-tight mb-6">
            {headline}
          </h1>

          <p className="text-brand-green-100 text-lg mb-8 leading-relaxed max-w-xl">
            {subheadline}
          </p>

          <div className="flex flex-wrap gap-4">
            {cta1?.label && (
              <CTALink
                href={cta1.href}
                className="btn-secondary text-base px-6 py-3 shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
              >
                {cta1.label}
              </CTALink>
            )}
            {cta2?.label && (
              <CTALink
                href={cta2.href}
                className="btn-outline border-white text-white hover:bg-white/10 text-base px-6 py-3 hover:-translate-y-0.5 transition-all duration-200"
              >
                {cta2.label}
              </CTALink>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Section: Stats ringkasan ─────────────────────────────────────────────────
// Ikon & warna dipetakan berdasarkan urutan (posisi 1-4), bukan isi label —
// jadi tetap cocok walau admin ganti teks stat dari Manajemen Desain.
const STAT_ICONS = [
  // Kabupaten/Kota — map pin
  <svg key="pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>,
  // PC IPM Aktif — users
  <svg key="users" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.09 9.09 0 003.74-.48 3 3 0 00-4.68-2.72M15 6.75a3 3 0 11-6 0 3 3 0 016 0zM6 18.72a9.09 9.09 0 01-3.74-.48 3 3 0 014.68-2.72M12 12.75a5.99 5.99 0 00-5.06 2.77 8.99 8.99 0 003.75 1.98m2.62-4.75a5.99 5.99 0 015.06 2.77 8.99 8.99 0 01-3.75 1.98" />
  </svg>,
  // Bidang Kerja — grid
  <svg key="grid" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
  </svg>,
  // Tahun Berdiri — calendar
  <svg key="calendar" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  </svg>,
];

// Warna chip mengikuti identitas visual ganda: biru (Jabar) untuk data wilayah,
// hijau (IPM) untuk data organisasi, emas untuk pencapaian, netral untuk histori.
const STAT_CHIP_COLORS = [
  "bg-brand-blue-500/10 text-brand-blue-500",
  "bg-brand-green-50 text-brand-green-500",
  "bg-brand-gold-50 text-brand-gold-600",
  "bg-neutral-100 text-neutral-500",
];

function StatsSection() {
  const { section } = useDesainSection("beranda");
  const stats = section?.stats?.length === 4 ? section.stats : [
    { label: "Kabupaten / Kota",  value: "27+" },
    { label: "PC IPM Aktif",      value: "200+" },
    { label: "Bidang Kerja",      value: "12"   },
    { label: "Tahun Berdiri",     value: "1961" },
  ];
  return (
    <section className="relative bg-neutral-50 pb-10 lg:pb-14 ">
      <div className="container-site mx-auto max-w-7xl">
        <div className="relative z-10 -mt-10 lg:-mt-14 bg-white rounded-2xl shadow-lg border border-neutral-100 px-4 py-6 lg:px-8 lg:py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 lg:gap-y-0 lg:divide-x lg:divide-neutral-100">
            {stats.map(({ label, value }, idx) => (
              <div key={idx} className="group flex flex-col items-center text-center gap-2 px-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110 ${STAT_CHIP_COLORS[idx % 4]}`}>
                  {STAT_ICONS[idx % 4]}
                </div>
                <p className="font-display font-bold text-neutral-900 text-2xl lg:text-3xl">{value}</p>
                <p className="text-xs lg:text-sm text-neutral-500">{label}</p>
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
          <Link to="/berita" className="group btn-outline text-sm hidden sm:inline-flex items-center gap-1.5">
            Lihat Semua
            <ArrowIcon className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
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
          <EmptyState
            title="Belum Ada Berita"
            message="Belum ada berita yang dipublikasikan. Pantau terus halaman ini untuk update terbaru."
          />
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
          <Link to="/timeline" className="group btn-outline text-sm hidden sm:inline-flex items-center gap-1.5">
            Lihat Semua
            <ArrowIcon className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
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
    <section className="relative bg-brand-green-900 section overflow-hidden">
      {/* Echo kecil dari motif jaringan Hero — benang merah visual, bukan dekorasi baru */}
      <svg
        className="absolute inset-0 w-full h-full opacity-60"
        viewBox="0 0 800 300"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <g stroke="currentColor" className="text-white" strokeOpacity="0.12" strokeWidth="1">
          <line x1="400" y1="150" x2="330" y2="95" />
          <line x1="400" y1="150" x2="475" y2="100" />
          <line x1="400" y1="150" x2="460" y2="205" />
          <line x1="400" y1="150" x2="335" y2="200" />
        </g>
        <g className="text-white" fill="currentColor" fillOpacity="0.25">
          <circle cx="330" cy="95" r="2.5" />
          <circle cx="475" cy="100" r="2.5" />
          <circle cx="460" cy="205" r="2.5" />
          <circle cx="335" cy="200" r="2.5" />
        </g>
        <g className="text-brand-gold-300" fill="currentColor">
          <circle cx="400" cy="150" r="4" />
        </g>
      </svg>

      <div className="container-site relative text-center max-w-xl mx-auto">
        <h2 className="font-display font-bold text-white text-2xl lg:text-3xl mb-4">
          Ingin Mengenal PW IPM Jawa Barat Lebih Dekat?
        </h2>
        <p className="text-brand-green-100 text-sm mb-8">
          Pelajari struktur kepengurusan, bidang kerja, dan program-program kami
          di seluruh Jawa Barat.
        </p>
        <Link
          to="/profil"
          className="btn-secondary text-base px-8 py-3 shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 inline-flex items-center gap-2"
        >
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