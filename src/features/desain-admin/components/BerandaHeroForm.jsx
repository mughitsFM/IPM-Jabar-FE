import { useState } from "react";
import Button from "@/shared/components/ui/Button";
import ImageUploadField from "./ImageUploadField";

const DEFAULT_STATS = [
  { label: "Kabupaten / Kota", value: "27+" },
  { label: "PC IPM Aktif",     value: "200+" },
  { label: "Bidang Kerja",     value: "12" },
  { label: "Tahun Berdiri",    value: "1961" },
];

// Layout kartu statistik di halaman publik tetap 4 kolom, jadi jumlahnya
// dikunci pas 4 (bukan dropdown add/remove) — biar tata letaknya konsisten.
function normalizeStats(stats) {
  const base = Array.isArray(stats) && stats.length === 4 ? stats : DEFAULT_STATS;
  return base.map((s) => ({ label: s?.label ?? "", value: s?.value ?? "" }));
}

export default function BerandaHeroForm({ initialData, onSubmit, isSubmitting }) {
  const [form, setForm] = useState(() => ({
    hero_image_url: initialData?.hero_image_url ?? null,
    badge_text: initialData?.badge_text ?? "",
    headline: initialData?.headline ?? "",
    subheadline: initialData?.subheadline ?? "",
    cta_1_label: initialData?.cta_1?.label ?? "",
    cta_1_href: initialData?.cta_1?.href ?? "",
    cta_2_label: initialData?.cta_2?.label ?? "",
    cta_2_href: initialData?.cta_2?.href ?? "",
    stats: normalizeStats(initialData?.stats),
  }));

  const setField = (key, value) => setForm((p) => ({ ...p, [key]: value }));
  const setStat = (idx, key, value) =>
    setForm((p) => ({
      ...p,
      stats: p.stats.map((s, i) => (i === idx ? { ...s, [key]: value } : s)),
    }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      hero_image_url: form.hero_image_url,
      badge_text: form.badge_text,
      headline: form.headline,
      subheadline: form.subheadline,
      cta_1: { label: form.cta_1_label, href: form.cta_1_href },
      cta_2: { label: form.cta_2_label, href: form.cta_2_href },
      stats: form.stats,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ImageUploadField
        label="Gambar Hero — Beranda"
        value={form.hero_image_url}
        onChange={(url) => setField("hero_image_url", url)}
        aspectHint="Disarankan rasio lebar (landscape), minimal 1600×600px."
      />
      <div>
        <label className="form-label">Teks Badge (di atas judul)</label>
        <input className="input-field" maxLength={150}
          value={form.badge_text} onChange={(e) => setField("badge_text", e.target.value)} />
      </div>
      <div>
        <label className="form-label">Judul (Headline)</label>
        <input className="input-field" maxLength={150}
          value={form.headline} onChange={(e) => setField("headline", e.target.value)} />
      </div>
      <div>
        <label className="form-label">Subjudul</label>
        <textarea className="input-field" rows={2} maxLength={300}
          value={form.subheadline} onChange={(e) => setField("subheadline", e.target.value)} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
        <div>
          <label className="form-label">Tombol 1 — Teks</label>
          <input className="input-field" maxLength={50}
            value={form.cta_1_label} onChange={(e) => setField("cta_1_label", e.target.value)} />
        </div>
        <div>
          <label className="form-label">Tombol 1 — Link Tujuan</label>
          <input className="input-field" placeholder="/profil atau https://..."
            value={form.cta_1_href} onChange={(e) => setField("cta_1_href", e.target.value)} />
        </div>
        <div>
          <label className="form-label">Tombol 2 — Teks</label>
          <input className="input-field" maxLength={50}
            value={form.cta_2_label} onChange={(e) => setField("cta_2_label", e.target.value)} />
        </div>
        <div>
          <label className="form-label">Tombol 2 — Link Tujuan</label>
          <input className="input-field" placeholder="/berita atau https://..."
            value={form.cta_2_href} onChange={(e) => setField("cta_2_href", e.target.value)} />
        </div>
      </div>
      <p className="text-xs text-neutral-500">
        Kosongkan teks tombol untuk menyembunyikan tombol tersebut di halaman Beranda.
      </p>

      <div>
        <label className="form-label mb-2">Statistik (kartu angka di bawah hero)</label>
        <div className="grid sm:grid-cols-2 gap-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
          {form.stats.map((stat, idx) => (
            <div key={idx} className="flex items-end gap-2">
              <div className="flex-1">
                <label className="text-xs text-neutral-500 mb-1 block">Angka</label>
                <input
                  className="input-field" maxLength={20}
                  value={stat.value}
                  onChange={(e) => setStat(idx, "value", e.target.value)}
                  placeholder="27+"
                />
              </div>
              <div className="flex-[2]">
                <label className="text-xs text-neutral-500 mb-1 block">Label</label>
                <input
                  className="input-field" maxLength={50}
                  value={stat.label}
                  onChange={(e) => setStat(idx, "label", e.target.value)}
                  placeholder="Kabupaten / Kota"
                />
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-neutral-500 mt-2">
          Jumlah kartu tetap 4 (mengikuti tata letak), tapi angka & labelnya bebas diubah.
        </p>
      </div>

      <div className="flex justify-end pt-4 border-t border-neutral-100">
        <Button type="submit" loading={isSubmitting}>Simpan Beranda</Button>
      </div>
    </form>
  );
}
