import { isLowContrastWithWhite } from "@/shared/utils/colorShades";

/**
 * ColorPickerField — <input type="color"> + input hex teks, disinkron dua arah.
 * `warnContrastWithWhite` kasih peringatan HALUS (bukan blocking) kalau warna
 * ini bakal susah dibaca dipakai bareng teks putih (tombol/hero) — relevan
 * karena admin bebas pilih hex apa saja (bukan preset).
 */
export default function ColorPickerField({ label, value, onChange, warnContrastWithWhite = false }) {
  const isValidHex = /^#[0-9A-Fa-f]{6}$/.test(value || "");
  const showWarning = warnContrastWithWhite && isValidHex && isLowContrastWithWhite(value);

  return (
    <div>
      <label className="form-label">{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={isValidHex ? value : "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-11 rounded-lg border border-neutral-200 cursor-pointer shrink-0"
          aria-label={`Pilih warna ${label}`}
        />
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#1B7A3D"
          maxLength={7}
          className="input-field flex-1 font-mono uppercase"
        />
      </div>
      {!isValidHex && value && (
        <p className="form-error">Format harus hex 6-digit, contoh: #1B7A3D</p>
      )}
      {showWarning && (
        <p className="text-xs text-brand-gold-600 mt-1.5">
          Kontras warna ini rendah kalau dipakai dengan teks putih (mis. tombol/hero).
          Pertimbangkan warna yang sedikit lebih gelap.
        </p>
      )}
    </div>
  );
}
