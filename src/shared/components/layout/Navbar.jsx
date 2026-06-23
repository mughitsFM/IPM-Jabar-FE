import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const NAV_LINKS = [
  { to: "/",          label: "Beranda"   },
  { to: "/berita",    label: "Berita"    },
  { to: "/profil",    label: "Profil"    },
  { to: "/timeline",  label: "Timeline"  },
  { to: "/pengaduan", label: "Pengaduan" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-brand-green-500 shadow-md">
      <div className="container-site">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-white font-display font-bold text-lg shrink-0"
            aria-label="PW IPM Jawa Barat — Beranda"
          >
            {/* Placeholder logo — ganti dengan <img> logo resmi */}
            <div className="w-9 h-9 rounded-full bg-brand-gold-500 flex items-center justify-center text-brand-green-900 font-bold text-sm shrink-0">
              IPM
            </div>
            <span className="hidden sm:block leading-tight">
              PW IPM<br />
              <span className="text-xs font-body font-normal text-brand-green-50">Jawa Barat</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label }) => (
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

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            {menuOpen ? (
              // X icon
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Hamburger icon
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div id="mobile-menu" className="md:hidden bg-brand-green-600 pb-4">
          <ul className="container-site flex flex-col gap-1 pt-2">
            {NAV_LINKS.map(({ to, label }) => (
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
        </div>
      )}
    </header>
  );
}
