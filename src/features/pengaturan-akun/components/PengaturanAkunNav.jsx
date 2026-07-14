/**
 * PengaturanAkunNav — tab switcher antar section (Profil / Keamanan Akun).
 * Controlled dari parent: klik tab langsung mengganti section yang
 * ditampilkan (bukan scroll ke anchor), jadi tiap section terasa seperti
 * "halaman" tersendiri.
 *
 * Props:
 * - sections    : [{ id, label }]
 * - activeId    : id section yang sedang aktif
 * - onChange(id): dipanggil saat tab diklik
 * - accent      : "blue" | "green"
 */
export default function PengaturanAkunNav({ sections, activeId, onChange, accent = "blue" }) {
  const activeClasses =
    accent === "green"
      ? "border-brand-green-600 text-brand-green-700"
      : "border-brand-blue-600 text-brand-blue-700";

  return (
    <nav
      className="border-b border-neutral-200"
      aria-label="Navigasi bagian pengaturan akun"
    >
      <ul className="flex gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {sections.map(({ id, label }) => (
          <li key={id}>
            <button
              type="button"
              onClick={() => onChange(id)}
              aria-current={activeId === id ? "page" : undefined}
              className={`block whitespace-nowrap px-3 py-3 text-sm font-semibold border-b-2 transition-colors ${
                activeId === id
                  ? activeClasses
                  : "border-transparent text-neutral-400 hover:text-neutral-700"
              }`}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}