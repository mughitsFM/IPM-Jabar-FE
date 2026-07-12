import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useDesainGlobal } from "@/shared/hooks/useDesainPublic";

const NAV_LINKS_BASE = [
  { to: "/",          key: "label_beranda",  fallback: "Beranda"  },
  { to: "/berita",    key: "label_berita",   fallback: "Berita"   },
  { to: "/profil",    key: "label_profil",   fallback: "Profil"   },
  { to: "/timeline",  key: "label_timeline", fallback: "Timeline" },
  // { to: "/pengaduan", label: "Pengaduan" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { global } = useDesainGlobal();

  // Shadow lebih tegas begitu halaman discroll — bikin navbar terasa "hidup",
  // bukan panel hijau statis yang nempel di atas.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Label & logo dinamis dari Manajemen Desain — fallback ke teks/placeholder
  // lama kalau config belum ke-load (mis. API lagi fetching atau down).
  const navLinks = NAV_LINKS_BASE.map(({ to, key, fallback }) => ({
    to,
    label: global?.navbar?.[key] || fallback,
  }));
  const loginLabel = global?.navbar?.label_cta_login_pimpinan || "Login Pimpinan";
  const logoUrl = global?.logo_url;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-brand-green-600 shadow-lg" : "bg-brand-green-500 shadow-md"
      }`}
    >
      <div className="container-site">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-white font-display font-bold shrink-0 hover:opacity-90 transition-opacity"
            aria-label="PW IPM Jawa Barat — Beranda"
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Logo PW IPM Jawa Barat"
                className="w-9 h-9 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-brand-gold-500 flex items-center justify-center text-brand-green-900 font-bold text-sm shrink-0">
                IPM
              </div>
            )}
            <span className="hidden sm:block leading-tight">
              <span className="text-sm">Pimpinan Wilayah Ikatan Pelajar Muhammadiyah</span><br />
              <span className="text-xs font-body font-normal text-brand-green-50">Jawa Barat</span>
            </span>
          </Link>

          {/* Desktop Nav + CTA Login Pimpinan */}
          <div className="hidden md:flex items-center gap-3">
            <ul className="flex items-center gap-1">
              {navLinks.map(({ to, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={to === "/"}
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-150 min-h-[44px] flex items-center
                      ${isActive
                        ? "bg-white/20 text-white"
                        : "text-brand-green-50 hover:bg-white/10 hover:text-white"
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Tombol CTA terpisah — sengaja TIDAK dimasukkan ke NAV_LINKS supaya
                tidak terlihat sebagai halaman publik biasa. Gunakan <Link>, bukan
                <a href>, supaya SPA routing tetap berlaku. */}
            <Link
              to="/pimpinan/login"
              className="inline-flex items-center gap-1.5 border border-white/40 text-white hover:bg-white/10 hover:border-white/60 rounded-lg px-4 py-2 text-sm font-semibold min-h-[44px] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              {loginLabel}
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            {menuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </nav>
      </div>

      {/* Mobile Menu — selalu di-render, dibuka/tutup lewat max-height + opacity
          supaya transisinya halus (bukan langsung muncul/hilang). */}
      <div
        id="mobile-menu"
        className={`md:hidden bg-brand-green-600 overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="container-site flex flex-col gap-1 pt-2 pb-4">
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === "/"}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg text-sm font-semibold transition-colors duration-150 min-h-[44px]
                  ${isActive
                    ? "bg-white/20 text-white"
                    : "text-brand-green-50 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Divider + tombol Login Pimpinan, ditonjolkan beda dari NavLink biasa */}
        <div className="container-site pt-3 pb-4 border-t border-white/10">
          <Link
            to="/pimpinan/login"
            onClick={() => setMenuOpen(false)}
            className="block text-center bg-brand-gold-500 text-brand-green-900 rounded-lg px-4 py-3 text-sm font-bold min-h-[44px] flex items-center justify-center"
          >
            {loginLabel}
          </Link>
        </div>
      </div>
    </header>
  );
}