/**
 * Badge — pil status kecil dengan warna semantik.
 * Warna harus dari statusEnum constants agar konsisten.
 *
 * @param {string} label   - Teks label
 * @param {string} colorClass - Tailwind class warna (dari statusEnum.js)
 */
export default function Badge({ label, colorClass = "bg-neutral-200 text-neutral-600", className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${colorClass} ${className}`}
    >
      {label}
    </span>
  );
}
