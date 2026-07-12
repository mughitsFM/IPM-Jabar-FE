import { KATEGORI_BERITA, KATEGORI_BERITA_LABELS } from "@/shared/constants/statusEnum";

const ALL_FILTERS = [
  { value: null,                        label: "Semua"                     },
  { value: KATEGORI_BERITA.KEGIATAN,    label: KATEGORI_BERITA_LABELS[KATEGORI_BERITA.KEGIATAN]    },
  { value: KATEGORI_BERITA.UMUM,        label: KATEGORI_BERITA_LABELS[KATEGORI_BERITA.UMUM]        },
];

/**
 * NewsFilterBar — filter kategori berita (pill selector).
 *
 * @param {{ kategori: string|null }} value
 * @param {function} onChange - menerima { kategori }
 */
export default function NewsFilterBar({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter kategori berita">
      {ALL_FILTERS.map(({ value: v, label }) => {
        const active = value.kategori === v;
        return (
          <button
            key={label}
            onClick={() => onChange({ ...value, kategori: v, page: 1 })}
            aria-pressed={active}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 min-h-[44px]
              ${active
                ? "bg-brand-green-500 text-white shadow-sm shadow-brand-green-500/30"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}