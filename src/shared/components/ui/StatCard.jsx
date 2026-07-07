// frontend/shared/components/ui/StatCard.jsx (baru — diekstrak dari AdminDashboardPage.jsx
// supaya bisa dipakai ulang persis oleh PimpinanDashboardPage.jsx tanpa duplikasi)
import { Link } from "react-router-dom";

const COLOR_MAP = {
  green:   "bg-brand-green-50 text-brand-green-500",
  blue:    "bg-brand-blue-500/10 text-brand-blue-500",
  gold:    "bg-brand-gold-50 text-brand-gold-600",
  red:     "bg-brand-red-500/10 text-brand-red-500",
  neutral: "bg-neutral-100 text-neutral-500",
};

export default function StatCard({ label, value, icon, color = "green", linkTo }) {
  const card = (
    <div className="bg-white rounded-card border border-neutral-200 p-5 flex items-center gap-4 hover:shadow-md transition-shadow duration-200">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${COLOR_MAP[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-display font-bold text-neutral-900">{value ?? "—"}</p>
        <p className="text-sm text-neutral-500">{label}</p>
      </div>
    </div>
  );

  return linkTo ? <Link to={linkTo}>{card}</Link> : card;
}