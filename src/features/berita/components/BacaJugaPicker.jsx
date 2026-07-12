import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Modal from "@/shared/components/ui/Modal";
import Button from "@/shared/components/ui/Button";
import Badge from "@/shared/components/ui/Badge";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { beritaService } from "../services/beritaService";
import { STATUS_BERITA_LABELS, STATUS_BERITA_COLORS } from "@/shared/constants/statusEnum";

export default function BacaJugaPicker({ open, onClose, excludeId, selected, onChange, maxItems = 4 }) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);
  const trimmedQuery = debouncedQuery.trim();

  const { data, isFetching } = useQuery({
    queryKey: ["berita", "admin-search", trimmedQuery, excludeId],
    queryFn: () => beritaService.searchAdmin({ q: trimmedQuery, excludeId }),
    enabled: open && trimmedQuery.length >= 2,
  });

  const results = data?.data ?? [];
  const selectedIds = new Set(selected.map((s) => s.id));

  const toggle = (item) => {
    if (selectedIds.has(item.id)) {
      onChange(selected.filter((s) => s.id !== item.id));
    } else {
      if (selected.length >= maxItems) return;
      onChange([...selected, item]);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Pilih Berita Terkait (Baca Juga)" maxWidth="max-w-xl">
      <p className="text-xs text-neutral-400 mb-3">Maksimal {maxItems} berita terkait.</p>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari judul berita…"
        className="input-field mb-4"
        autoFocus
      />

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-neutral-200">
          {selected.map((item) => (
            <span key={item.id} className="inline-flex items-center gap-1.5 bg-neutral-100 text-neutral-700 text-xs font-medium pl-2 pr-1 py-1 rounded-full">
              {item.judul}
              <button type="button" onClick={() => toggle(item)} className="hover:bg-neutral-200 rounded-full p-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="space-y-1 max-h-80 overflow-y-auto">
        {trimmedQuery.length < 2 && (
          <p className="text-sm text-neutral-400 text-center py-8">Ketik minimal 2 karakter untuk mencari…</p>
        )}
        {isFetching && <p className="text-sm text-neutral-400 text-center py-4">Mencari…</p>}
        {!isFetching && trimmedQuery.length >= 2 && results.length === 0 && (
          <p className="text-sm text-neutral-400 text-center py-8">Tidak ada berita ditemukan.</p>
        )}
        {results.map((item) => {
          const isSelected = selectedIds.has(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggle(item)}
              disabled={!isSelected && selected.length >= maxItems}
              className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                isSelected ? "bg-brand-green-50 ring-1 ring-brand-green-500/30" : "hover:bg-neutral-50"
              }`}
            >
              <div className="w-14 h-10 rounded bg-neutral-100 overflow-hidden shrink-0">
                {item.thumbnail_url && <img src={item.thumbnail_url} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-neutral-900 truncate">{item.judul}</p>
                <Badge label={STATUS_BERITA_LABELS[item.status] ?? item.status} colorClass={STATUS_BERITA_COLORS[item.status]} />
              </div>
              {isSelected && (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-brand-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex justify-end pt-4 mt-4 border-t border-neutral-200">
        <Button type="button" onClick={onClose}>Selesai</Button>
      </div>
    </Modal>
  );
}