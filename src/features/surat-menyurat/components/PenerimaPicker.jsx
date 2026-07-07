{/* frontend/features/surat-menyurat/components/PenerimaPicker.jsx (lengkap) */}
// Dropdown searchable untuk memilih penerima surat, dikelompokkan:
//   - "PW IPM Jawa Barat" (Wilayah, satu entitas)
//   - "Pimpinan Daerah" / "Pimpinan Cabang" / "Pimpinan Ranting" (dari prefix
//     label_lengkap "PD"/"PC"/"PR" — lihat 00-overview-dan-lampiran.md §3)
import { useState, useMemo, useRef, useEffect } from "react";
import { useDirektoriPenerima } from "../hooks/useSurat";

const GROUP_LABELS = { PD: "Pimpinan Daerah", PC: "Pimpinan Cabang", PR: "Pimpinan Ranting" };

function groupDirektori(daftar) {
  const groups = { Wilayah: [], PD: [], PC: [], PR: [] };
  for (const item of daftar) {
    if (item.tipe === "wilayah") {
      groups.Wilayah.push(item);
      continue;
    }
    const prefix = item.label?.slice(0, 2);
    (groups[prefix] ?? groups.PR).push(item);
  }
  return groups;
}

export default function PenerimaPicker({ value, onChange, disabled = false }) {
  const { data, isLoading } = useDirektoriPenerima();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const daftar = data?.data ?? [];
  const grouped = useMemo(() => groupDirektori(daftar), [daftar]);

  const filtered = useMemo(() => {
    if (!query.trim()) return grouped;
    const q = query.toLowerCase();
    const filterGroup = (items) => items.filter((i) => i.label.toLowerCase().includes(q));
    return {
      Wilayah: filterGroup(grouped.Wilayah),
      PD: filterGroup(grouped.PD),
      PC: filterGroup(grouped.PC),
      PR: filterGroup(grouped.PR),
    };
  }, [grouped, query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    onChange(item);
    setQuery("");
    setOpen(false);
  };

  const groupOrder = [
    ["Wilayah", "PW IPM Jawa Barat"],
    ["PD", GROUP_LABELS.PD],
    ["PC", GROUP_LABELS.PC],
    ["PR", GROUP_LABELS.PR],
  ];

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="form-label">Kirim ke <span className="text-state-error">*</span></label>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className="input-field text-left flex items-center justify-between"
      >
        <span className={value ? "text-neutral-900" : "text-neutral-400"}>
          {value ? value.label : "Pilih penerima…"}
        </span>
        <span className="text-neutral-400">▾</span>
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-neutral-200 rounded-lg shadow-lg max-h-72 overflow-y-auto">
          <div className="p-2 border-b border-neutral-100 sticky top-0 bg-white">
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama wilayah…"
              className="input-field text-sm"
            />
          </div>
          {isLoading && <p className="px-4 py-3 text-sm text-neutral-400">Memuat direktori…</p>}
          {!isLoading && groupOrder.every(([key]) => filtered[key].length === 0) && (
            <p className="px-4 py-3 text-sm text-neutral-400">Tidak ditemukan.</p>
          )}
          {!isLoading && groupOrder.map(([key, label]) =>
            filtered[key].length > 0 && (
              <div key={key}>
                <p className="px-4 pt-2 pb-1 text-xs font-semibold text-neutral-400 uppercase tracking-wide">{label}</p>
                {filtered[key].map((item) => (
                  <button
                    key={item.uid ?? "wilayah"}
                    type="button"
                    onClick={() => handleSelect(item)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-brand-green-50 hover:text-brand-green-600 transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
