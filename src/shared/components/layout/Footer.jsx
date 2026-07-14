import { Link } from "react-router-dom";
import { useDesainGlobal } from "@/shared/hooks/useDesainPublic";

// Ikon per platform — dirender kalau platform-nya ada di config.footer.sosmed
const SOSMED_ICONS = {
  instagram: (
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  ),
  facebook: (
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  ),
  tiktok: (
    <path d="M16.6 5.82c-1.007-.986-1.56-2.336-1.56-3.82h-3.28v13.6c0 1.65-1.34 3-3 3-1.65 0-3-1.35-3-3s1.35-3 3-3c.29 0 .57.05.83.12V9.34c-.27-.03-.55-.05-.83-.05-3.34 0-6.05 2.71-6.05 6.05s2.71 6.05 6.05 6.05 6.05-2.71 6.05-6.05V8.4a9.3 9.3 0 0 0 4.78 1.32V6.44c-.99 0-1.94-.24-2.77-.62-.05-.02-.11-.03-.16-.05z" />
  ),
  youtube: (
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  ),
};

const DEFAULT_SOSMED = [
  { platform: "instagram", url: "#" },
  { platform: "facebook", url: "#" },
];

function FooterHeading({ children }) {
  return (
    <h3 className="relative inline-block font-display font-semibold text-white mb-5 text-sm uppercase tracking-wide">
      {children}
      <span className="absolute -bottom-1.5 left-0 w-6 h-0.5 bg-brand-gold-500 rounded-full" />
    </h3>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  const { global } = useDesainGlobal();

  const deskripsi = global?.footer?.deskripsi ||
    "Pimpinan Wilayah Ikatan Pelajar Muhammadiyah Jawa Barat — pusat informasi resmi organisasi kepelajaran Muhammadiyah se-Jawa Barat.";
  const alamat = global?.footer?.alamat || "Jawa Barat, Indonesia";
  const email = global?.footer?.email || "ipmjabar@example.or.id";
  const copyrightSuffix = global?.footer?.copyright_suffix || "PW IPM Jawa Barat. Hak Cipta Dilindungi.";
  const sosmedList = global?.footer?.sosmed?.length ? global.footer.sosmed : DEFAULT_SOSMED;
  const logoUrl = global?.logo_url;

  return (
    <footer className="bg-neutral-900 text-neutral-400 font-body">
      {/* Garis aksen — echo tiga warna identitas (IPM hijau/emas + Jabar biru),
          jadi semacam "penutup" yang menggemakan warna Hero di awal halaman. */}
      <div className="h-1 bg-gradient-to-r from-brand-green-500 via-brand-gold-500 to-brand-blue-500" />

      <div className="container-site py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Tentang */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Logo PW IPM Jawa Barat"
                  className="w-9 h-9 object-cover shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-brand-gold-500 flex items-center justify-center text-neutral-900 font-bold text-sm shrink-0">
                  IPM
                </div>
              )}
              <span className="font-display font-bold text-white text-base">
                PW IPM Jawa Barat
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              {deskripsi}
            </p>
            <div className="flex gap-3 mt-4">
              {sosmedList.map(({ platform, url }) => {
                const icon = SOSMED_ICONS[platform];
                if (!icon) return null;
                const isExternal = url?.startsWith("http");
                return (
                  <a
                    key={platform}
                    href={url}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    aria-label={`${platform} PW IPM Jabar`}
                    className="p-2 rounded-lg text-neutral-400 hover:text-brand-gold-400 hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      {icon}
                    </svg>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigasi Cepat — TETAP fixed (bukan bagian editable Manajemen Desain,
              lihat 13-manajemen-desain.md §7 poin 2: navbar cuma relabel, footer
              nav-links di luar scope) */}
          <div>
            <FooterHeading>Navigasi</FooterHeading>
            <ul className="space-y-2 text-sm">
              {[
                { to: "/berita",    label: "Berita & Informasi" },
                { to: "/profil",    label: "Profil Kepengurusan" },
                { to: "/timeline",  label: "Program Kerja" },
                // { to: "/pengaduan", label: "Pengaduan / Surat" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <FooterHeading>Kontak</FooterHeading>
            <address className="not-italic text-sm space-y-2">
              <p>{alamat}</p>
              <p>
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                  {email}
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <p>© {year} {copyrightSuffix}</p>
          <p>Bidang Teknologi Informasi IPM Jabar</p>
        </div>
      </div>
    </footer>
  );
}