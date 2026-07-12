import { useState } from "react";

/**
 * TagInput — input chip bebas (ketik → Enter/koma → jadi chip).
 * Prop `disabled` (baru) — dipakai ArtikelForm saat artikel berstatus
 * diajukan/disetujui (read-only). Tidak mengubah perilaku NewsForm yang
 * sudah ada (default false).
 */
export default function TagInput({ value = [], onChange, placeholder = "Ketik lalu tekan Enter…", maxTags = 10, disabled = false }) {
  const [draft, setDraft] = useState("");

  if (disabled) {
    return (
      <div className="input-field flex flex-wrap items-center gap-1.5 py-2 bg-neutral-50">
        {value.length === 0 ? (
          <span className="text-sm text-neutral-400">Tidak ada tag.</span>
        ) : (
          value.map((tag) => (
            <span key={tag} className="inline-flex items-center bg-neutral-200 text-neutral-600 text-xs font-semibold px-2.5 py-1 rounded-full">
              {tag}
            </span>
          ))
        )}
      </div>
    );
  }

  const addTag = (raw) => {
    const tag = raw.trim().replace(/,$/, "");
    if (!tag) return;
    if (value.some((t) => t.toLowerCase() === tag.toLowerCase())) { setDraft(""); return; }
    if (value.length >= maxTags) return;
    onChange([...value, tag]);
    setDraft("");
  };

  const removeTag = (tag) => onChange(value.filter((t) => t !== tag));

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(draft);
    } else if (e.key === "Backspace" && !draft && value.length) {
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <div className="input-field flex flex-wrap items-center gap-1.5 py-2">
      {value.map((tag) => (
        <span key={tag} className="inline-flex items-center gap-1 bg-brand-green-50 text-brand-green-600 text-xs font-semibold pl-2.5 pr-1 py-1 rounded-full">
          {tag}
          <button type="button" onClick={() => removeTag(tag)} aria-label={`Hapus tag ${tag}`}
            className="hover:bg-brand-green-100 rounded-full p-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      ))}
      {value.length < maxTags && (
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => addTag(draft)}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] border-none outline-none text-sm py-1 bg-transparent"
        />
      )}
    </div>
  );
}