import Card from "@/shared/components/ui/Card";

/**
 * SectionCard — pembungkus seragam untuk tiap blok form di halaman
 * Pengaturan Akun. Header berisi ikon + judul + deskripsi singkat supaya
 * user paham konteks section SEBELUM mengisi form, bukan menebak dari label
 * input saja.
 *
 * Props:
 * - id          : dipakai target anchor nav (id section, ditaruh di wrapper luar)
 * - icon        : elemen ikon (svg component)
 * - title       : judul section
 * - description : 1 kalimat penjelasan konteks/tujuan section
 * - tone        : "default" | "sensitive" — sensitive dipakai utk ganti password/email
 *                 (border kiri aksen tipis, tanpa perlu warna scary/merah)
 * - accent      : "blue" | "green"
 * - children    : isi form
 */
export default function SectionCard({ icon, title, description, tone = "default", accent = "blue", children }) {
  const accentText = accent === "green" ? "text-brand-green-600" : "text-brand-blue-600";
  const accentBg = accent === "green" ? "bg-brand-green-500/10" : "bg-brand-blue-500/10";

  return (
    <Card className={`p-5 sm:p-6 ${tone === "sensitive" ? "border-l-[3px] !border-l-neutral-300" : ""}`}>
      <div className="flex items-start gap-3.5 mb-5">
        <span className={`shrink-0 h-9 w-9 rounded-lg ${accentBg} ${accentText} flex items-center justify-center`}>
          {icon}
        </span>
        <div className="min-w-0 pt-0.5">
          <h2 className="font-display font-semibold text-neutral-900 leading-tight">{title}</h2>
          {description && <p className="text-sm text-neutral-500 mt-0.5">{description}</p>}
        </div>
      </div>
      {children}
    </Card>
  );
}