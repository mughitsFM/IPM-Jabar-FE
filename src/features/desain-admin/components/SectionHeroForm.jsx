import { useState } from "react";
import Button from "@/shared/components/ui/Button";
import ImageUploadField from "./ImageUploadField";

/**
 * SectionHeroForm — dipakai 3 section yang strukturnya sama:
 * Profil, Berita, Timeline (cuma hero image + headline + subheadline).
 * Beranda punya field tambahan (badge + 2 CTA) — lihat BerandaHeroForm.jsx.
 */
export default function SectionHeroForm({ initialData, onSubmit, isSubmitting, sectionLabel }) {
  const [form, setForm] = useState(() => ({
    hero_image_url: initialData?.hero_image_url ?? null,
    headline: initialData?.headline ?? "",
    subheadline: initialData?.subheadline ?? "",
  }));

  const setField = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ImageUploadField
        label={`Gambar Hero — ${sectionLabel}`}
        value={form.hero_image_url}
        onChange={(url) => setField("hero_image_url", url)}
        aspectHint="Disarankan rasio lebar (landscape), minimal 1600×600px."
      />
      <div>
        <label className="form-label">Judul (Headline)</label>
        <input
          className="input-field" maxLength={150}
          value={form.headline}
          onChange={(e) => setField("headline", e.target.value)}
        />
      </div>
      <div>
        <label className="form-label">Subjudul</label>
        <textarea
          className="input-field" rows={2} maxLength={300}
          value={form.subheadline}
          onChange={(e) => setField("subheadline", e.target.value)}
        />
      </div>
      <div className="flex justify-end pt-4 border-t border-neutral-100">
        <Button type="submit" loading={isSubmitting}>Simpan {sectionLabel}</Button>
      </div>
    </form>
  );
}
