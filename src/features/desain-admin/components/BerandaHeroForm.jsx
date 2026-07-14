import { useState } from "react";
import Button from "@/shared/components/ui/Button";
import ImageUploadField from "./ImageUploadField";

const DEFAULT_STATS = [
  { label: "Kabupaten / Kota", value: "27+" },
  { label: "PC IPM Aktif",     value: "200+" },
  { label: "Bidang Kerja",     value: "12" },
  { label: "Tahun Berdiri",    value: "1961" },
];

const MIN_SLIDES = 1;
const MAX_SLIDES = 5;

// Layout kartu statistik di halaman publik tetap 4 kolom, jadi jumlahnya
// dikunci pas 4 (bukan dropdown add/remove) — biar tata letaknya konsisten.
function normalizeStats(stats) {
  const base = Array.isArray(stats) && stats.length === 4 ? stats : DEFAULT_STATS;
  return base.map((s) => ({ label: s?.label ?? "", value: s?.value ?? "" }));
}

// `_key` cuma dipakai lokal (React key stabil pas add/remove), gak pernah
// dikirim ke backend — dibuang lagi di handleSubmit.
function emptySlide() {
  return {
    _key: crypto.randomUUID(),
    image_url: null,
    headline: "",
    subheadline: "",
    cta_1_label: "",
    cta_1_href: "",
    cta_2_label: "",
    cta_2_href: "",
  };
}

function normalizeSlides(slides) {
  if (!Array.isArray(slides) || slides.length === 0) return [emptySlide()];
  return slides.slice(0, MAX_SLIDES).map((s) => ({
    _key: crypto.randomUUID(),
    image_url: s?.image_url ?? null,
    headline: s?.headline ?? "",
    subheadline: s?.subheadline ?? "",
    cta_1_label: s?.cta_1?.label ?? "",
    cta_1_href: s?.cta_1?.href ?? "",
    cta_2_label: s?.cta_2?.label ?? "",
    cta_2_href: s?.cta_2?.href ?? "",
  }));
}

export default function BerandaHeroForm({ initialData, onSubmit, isSubmitting }) {
  const [form, setForm] = useState(() => ({
    badge_text: initialData?.badge_text ?? "",
    slides: normalizeSlides(initialData?.hero_slides),
    stats: normalizeStats(initialData?.stats),
  }));

  const setField = (key, value) => setForm((p) => ({ ...p, [key]: value }));
  const setStat = (idx, key, value) =>
    setForm((p) => ({
      ...p,
      stats: p.stats.map((s, i) => (i === idx ? { ...s, [key]: value } : s)),
    }));

  const setSlideField = (idx, key, value) =>
    setForm((p) => ({
      ...p,
      slides: p.slides.map((s, i) => (i === idx ? { ...s, [key]: value } : s)),
    }));

  const addSlide = () =>
    setForm((p) =>
      p.slides.length >= MAX_SLIDES ? p : { ...p, slides: [...p.slides, emptySlide()] }
    );

  const removeSlide = (idx) =>
    setForm((p) =>
      p.slides.length <= MIN_SLIDES ? p : { ...p, slides: p.slides.filter((_, i) => i !== idx) }
    );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      badge_text: form.badge_text,
      hero_slides: form.slides.map((s) => ({
        image_url: s.image_url,
        headline: s.headline,
        subheadline: s.subheadline,
        cta_1: { label: s.cta_1_label, href: s.cta_1_href },
        cta_2: { label: s.cta_2_label, href: s.cta_2_href },
      })),
      stats: form.stats,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="form-label">Teks Badge (di atas judul — berlaku untuk semua slide)</label>
        <input className="input-field" maxLength={150}
          value={form.badge_text} onChange={(e) => setField("badge_text", e.target.value)} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="form-label mb-0">
            Slide Hero ({form.slides.length}/{MAX_SLIDES})
          </label>
          <button
            type="button"
            onClick={addSlide}
            disabled={form.slides.length >= MAX_SLIDES}
            className="shrink-0 btn-outline text-sm px-4 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            + Tambah Slide
          </button>
        </div>
        <p className="text-xs text-neutral-500 mb-4">
          1 slide = tampilan hero statis seperti biasa. Lebih dari 1 slide, hero otomatis
          jadi carousel (ganti tiap 6 detik + bisa dinavigasi manual) di halaman Beranda.
        </p>

        <div className="space-y-5">
          {form.slides.map((slide, idx) => (
            <div key={slide._key} className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-neutral-700">Slide {idx + 1}</span>
                <button
                  type="button"
                  onClick={() => removeSlide(idx)}
                  disabled={form.slides.length <= MIN_SLIDES}
                  className="text-xs font-semibold text-state-error disabled:opacity-40 disabled:cursor-not-allowed px-2 py-1 min-h-[36px]"
                >
                  Hapus Slide
                </button>
              </div>

              <ImageUploadField
                label={`Gambar Hero — Slide ${idx + 1}`}
                value={slide.image_url}
                onChange={(url) => setSlideField(idx, "image_url", url)}
                aspectHint="Disarankan rasio lebar (landscape), minimal 1600×600px."
              />

              <div>
                <label className="form-label">Judul (Headline)</label>
                <input className="input-field" maxLength={150}
                  value={slide.headline}
                  onChange={(e) => setSlideField(idx, "headline", e.target.value)} />
              </div>
              <div>
                <label className="form-label">Subjudul</label>
                <textarea className="input-field" rows={2} maxLength={300}
                  value={slide.subheadline}
                  onChange={(e) => setSlideField(idx, "subheadline", e.target.value)} />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Tombol 1 — Teks</label>
                  <input className="input-field" maxLength={50}
                    value={slide.cta_1_label}
                    onChange={(e) => setSlideField(idx, "cta_1_label", e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Tombol 1 — Link Tujuan</label>
                  <input className="input-field" placeholder="/profil atau https://..."
                    value={slide.cta_1_href}
                    onChange={(e) => setSlideField(idx, "cta_1_href", e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Tombol 2 — Teks</label>
                  <input className="input-field" maxLength={50}
                    value={slide.cta_2_label}
                    onChange={(e) => setSlideField(idx, "cta_2_label", e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Tombol 2 — Link Tujuan</label>
                  <input className="input-field" placeholder="/berita atau https://..."
                    value={slide.cta_2_href}
                    onChange={(e) => setSlideField(idx, "cta_2_href", e.target.value)} />
                </div>
              </div>
              <p className="text-xs text-neutral-500">
                Kosongkan teks tombol untuk menyembunyikan tombol tersebut pada slide ini.
              </p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="form-label mb-2">Statistik (kartu angka di bawah hero — berlaku untuk semua slide)</label>
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