/**
 * AuthShell — kerangka visual bersama untuk halaman login (Admin & Pimpinan).
 *
 * Desktop (lg+): dua kolom — panel brand (hijau, pola geometris bintang 8)
 * di kiri, panel form putih di kanan.
 * Mobile/tablet: panel brand menyusut jadi header pendek di atas, form penuh
 * di bawah — supaya identitas brand tetap terasa tanpa memakan tinggi layar.
 *
 * Props tidak mengubah kontrak LoginForm/useAuth — murni pembungkus tampilan.
 */
export default function AuthShell({
  eyebrow,
  panelTitle,
  panelDescription,
  logoUrl,
  orgName = "PW IPM Jawa Barat",
  formTitle,
  formSubtitle,
  children,
  footer,
}) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* ===== Panel brand ===== */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-green-600 via-brand-green-600 to-brand-green-900 lg:w-[42%] lg:min-h-screen shrink-0">
        {/* Pola geometris bintang 8 — motif dekoratif, opacity rendah */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.14]"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <pattern id="ipm-star8" width="72" height="72" patternUnits="userSpaceOnUse">
              <g transform="translate(36,36)" fill="none" stroke="white" strokeWidth="1.25">
                <rect x="-16" y="-16" width="32" height="32" />
                <rect x="-16" y="-16" width="32" height="32" transform="rotate(45)" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ipm-star8)" />
        </svg>

        {/* Blob cahaya lembut untuk kedalaman */}
        <div className="pointer-events-none absolute -top-24 -right-20 w-72 h-72 rounded-full bg-brand-gold-500/20 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />

        {/* Konten mobile: header ringkas */}
        <div className="relative lg:hidden flex items-center gap-3 px-5 pt-8 pb-7">
          <LogoBadge logoUrl={logoUrl} size="sm" />
          <div className="min-w-0">
            <p className="text-white/70 text-xs font-semibold tracking-wide uppercase">{eyebrow}</p>
            <p className="text-white font-display font-bold text-base truncate">{orgName}</p>
          </div>
        </div>

        {/* Konten desktop: penuh */}
        <div className="relative hidden lg:flex flex-col justify-between h-full px-12 py-12 xl:px-16">
          <div className="flex items-center gap-3">
            <LogoBadge logoUrl={logoUrl} size="md" />
            <div className="min-w-0">
              <p className="text-white/70 text-xs font-semibold tracking-wide uppercase">{eyebrow}</p>
              <p className="text-white font-display font-bold text-lg leading-tight truncate">{orgName}</p>
            </div>
          </div>

          <div className="max-w-sm">
            <div className="w-10 h-1 rounded-full bg-brand-gold-500 mb-6" />
            <h2 className="font-display font-bold text-white text-3xl xl:text-4xl leading-tight text-balance">
              {panelTitle}
            </h2>
            {panelDescription && (
              <p className="mt-4 text-white/75 text-sm leading-relaxed">{panelDescription}</p>
            )}
          </div>

          <p className="text-white/50 text-xs">
            &copy; {new Date().getFullYear()} Pimpinan Wilayah Ikatan Pelajar Muhammadiyah Jawa Barat
          </p>
        </div>
      </div>

      {/* ===== Panel form ===== */}
      <div className="flex-1 flex items-start lg:items-center justify-center px-4 pt-10 pb-10 sm:px-6 sm:pt-14 lg:px-10 lg:py-10">
        <div className="w-full max-w-sm">
          <div className="mb-7 text-center lg:text-left">
            <h1 className="font-display font-bold text-neutral-900 text-2xl sm:text-[1.75rem]">
              {formTitle}
            </h1>
            {formSubtitle && (
              <p className="text-sm text-neutral-500 mt-1.5">{formSubtitle}</p>
            )}
          </div>

          {children}

          {footer && <div className="mt-7 text-center lg:text-left">{footer}</div>}
        </div>
      </div>
    </div>
  );
}

function LogoBadge({ logoUrl, size = "md" }) {
  const dims = size === "sm" ? "w-11 h-11 text-base" : "w-14 h-14 text-xl";
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt="Logo PW IPM Jawa Barat"
        className={`${dims} rounded-full object-cover shrink-0 ring-2 ring-white/30`}
      />
    );
  }
  return (
    <div
      className={`${dims} rounded-full bg-white/15 backdrop-blur-sm ring-2 ring-white/30 flex items-center justify-center text-white font-display font-bold shrink-0`}
    >
      IPM
    </div>
  );
}
