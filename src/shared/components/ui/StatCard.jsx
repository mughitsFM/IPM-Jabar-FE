// frontend/shared/components/ui/StatCard.jsx (baru — diekstrak dari AdminDashboardPage.jsx
// supaya bisa dipakai ulang persis oleh PimpinanDashboardPage.jsx tanpa duplikasi)
import { Link } from "react-router-dom";

// Setiap warna: tint ikon + warna aksen garis atas (accentBar) senada.
const COLOR_MAP = {
  green:   { icon: "bg-brand-green-50 text-brand-green-500",   bar: "bg-brand-green-500" },
  blue:    { icon: "bg-brand-blue-500/10 text-brand-blue-500", bar: "bg-brand-blue-500" },
  gold:    { icon: "bg-brand-gold-50 text-brand-gold-600",     bar: "bg-brand-gold-500" },
  red:     { icon: "bg-brand-red-500/10 text-brand-red-500",   bar: "bg-brand-red-500" },
  neutral: { icon: "bg-neutral-100 text-neutral-500",          bar: "bg-neutral-300" },
};

export default function StatCard({ label, value, icon, color = "green", linkTo }) {
  const c = COLOR_MAP[color] ?? COLOR_MAP.green;

  const card = (
    <div className="group relative min-w-0 bg-white rounded-card border border-neutral-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
      {/* Aksen garis atas — bantu mata memindai kategori dengan cepat */}
      <div className={`h-1 ${c.bar}`} aria-hidden="true" />

      <div className="p-5 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${c.icon}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-display font-bold text-neutral-900 leading-tight">{value ?? "—"}</p>
          <p className="text-sm text-neutral-500 truncate">{label}</p>
        </div>

        {linkTo && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-neutral-300 shrink-0 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        )}
      </div>
    </div>
  );

  return linkTo ? (
    <Link to={linkTo} className="block min-w-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green-500 rounded-card">
      {card}
    </Link>
  ) : card;
}
