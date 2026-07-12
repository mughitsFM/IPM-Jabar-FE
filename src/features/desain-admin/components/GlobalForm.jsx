import { useState } from "react";
import Button from "@/shared/components/ui/Button";
import ColorPickerField from "./ColorPickerField";
import ImageUploadField from "./ImageUploadField";
import { FONT_OPTIONS } from "@/shared/constants/fontOptions";

const SOSMED_PLATFORMS = ["instagram", "facebook", "tiktok", "youtube"];
const SOSMED_LABELS = {
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  youtube: "YouTube",
};

function sosmedListToMap(sosmedList = []) {
  const map = Object.fromEntries(SOSMED_PLATFORMS.map((p) => [p, ""]));
  for (const item of sosmedList) {
    if (map[item.platform] !== undefined) map[item.platform] = item.url || "";
  }
  return map;
}

export default function GlobalForm({ initialData, onSubmit, isSubmitting }) {
  const [form, setForm] = useState(() => ({
    logo_url: initialData?.logo_url ?? null,
    warna_primer: initialData?.warna_primer ?? "#1B7A3D",
    warna_aksen: initialData?.warna_aksen ?? "#E8A800",
    font_display: initialData?.font_display ?? "Lexend",
    font_body: initialData?.font_body ?? "Plus Jakarta Sans",
    navbar: {
      label_beranda: initialData?.navbar?.label_beranda ?? "Beranda",
      label_berita: initialData?.navbar?.label_berita ?? "Berita",
      label_profil: initialData?.navbar?.label_profil ?? "Profil",
      label_timeline: initialData?.navbar?.label_timeline ?? "Timeline",
      label_cta_login_pimpinan: initialData?.navbar?.label_cta_login_pimpinan ?? "Login Pimpinan",
    },
    footer_deskripsi: initialData?.footer?.deskripsi ?? "",
    footer_alamat: initialData?.footer?.alamat ?? "",
    footer_email: initialData?.footer?.email ?? "",
    footer_copyright_suffix: initialData?.footer?.copyright_suffix ?? "",
    sosmed: sosmedListToMap(initialData?.footer?.sosmed),
  }));

  const setField = (key, value) => setForm((p) => ({ ...p, [key]: value }));
  const setNavbar = (key, value) => setForm((p) => ({ ...p, navbar: { ...p.navbar, [key]: value } }));
  const setSosmed = (platform, value) =>
    setForm((p) => ({ ...p, sosmed: { ...p.sosmed, [platform]: value } }));

  const handleSubmit = (e) => {
    e.preventDefault();

    const sosmedArray = SOSMED_PLATFORMS
      .filter((p) => form.sosmed[p]?.trim())
      .map((p) => ({ platform: p, url: form.sosmed[p].trim() }));

    onSubmit({
      logo_url: form.logo_url,
      warna_primer: form.warna_primer,
      warna_aksen: form.warna_aksen,
      font_display: form.font_display,
      font_body: form.font_body,
      navbar: form.navbar,
      footer: {
        deskripsi: form.footer_deskripsi,
        alamat: form.footer_alamat,
        email: form.footer_email,
        copyright_suffix: form.footer_copyright_suffix,
        sosmed: sosmedArray,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section>
        <h3 className="font-display font-bold text-lg text-neutral-900 mb-4">Logo</h3>
        <ImageUploadField
          label="Logo Situs"
          value={form.logo_url}
          onChange={(url) => setField("logo_url", url)}
          aspectHint="Disarankan gambar persegi atau landscape, latar transparan (PNG)."
        />
      </section>

      <section>
        <h3 className="font-display font-bold text-lg text-neutral-900 mb-4">Warna</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <ColorPickerField
            label="Warna Primer"
            value={form.warna_primer}
            onChange={(v) => setField("warna_primer", v)}
            warnContrastWithWhite
          />
          <ColorPickerField
            label="Warna Aksen"
            value={form.warna_aksen}
            onChange={(v) => setField("warna_aksen", v)}
            warnContrastWithWhite
          />
        </div>
        <p className="text-xs text-neutral-500 mt-2">
          Warna terang/gelap turunan (dipakai buat hover, latar tipis, dst.)
          dihitung otomatis dari 2 warna ini.
        </p>
      </section>

      <section>
        <h3 className="font-display font-bold text-lg text-neutral-900 mb-4">Font</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Font Judul (Display)</label>
            <select
              className="input-field"
              value={form.font_display}
              onChange={(e) => setField("font_display", e.target.value)}
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Font Isi (Body)</label>
            <select
              className="input-field"
              value={form.font_body}
              onChange={(e) => setField("font_body", e.target.value)}
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section>
        <h3 className="font-display font-bold text-lg text-neutral-900 mb-4">Navbar</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Label "Beranda"</label>
            <input className="input-field" value={form.navbar.label_beranda}
              onChange={(e) => setNavbar("label_beranda", e.target.value)} />
          </div>
          <div>
            <label className="form-label">Label "Berita"</label>
            <input className="input-field" value={form.navbar.label_berita}
              onChange={(e) => setNavbar("label_berita", e.target.value)} />
          </div>
          <div>
            <label className="form-label">Label "Profil"</label>
            <input className="input-field" value={form.navbar.label_profil}
              onChange={(e) => setNavbar("label_profil", e.target.value)} />
          </div>
          <div>
            <label className="form-label">Label "Timeline"</label>
            <input className="input-field" value={form.navbar.label_timeline}
              onChange={(e) => setNavbar("label_timeline", e.target.value)} />
          </div>
          <div>
            <label className="form-label">Label Tombol "Login Pimpinan"</label>
            <input className="input-field" value={form.navbar.label_cta_login_pimpinan}
              onChange={(e) => setNavbar("label_cta_login_pimpinan", e.target.value)} />
          </div>
        </div>
        <p className="text-xs text-neutral-500 mt-2">
          Cuma teks label yang bisa diubah — menu tidak bisa ditambah/dihapus
          karena terikat halaman yang sudah ada.
        </p>
      </section>

      <section>
        <h3 className="font-display font-bold text-lg text-neutral-900 mb-4">Footer</h3>
        <div className="space-y-4">
          <div>
            <label className="form-label">Deskripsi Organisasi</label>
            <textarea
              className="input-field" rows={3}
              value={form.footer_deskripsi}
              onChange={(e) => setField("footer_deskripsi", e.target.value)}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Alamat</label>
              <input className="input-field" value={form.footer_alamat}
                onChange={(e) => setField("footer_alamat", e.target.value)} />
            </div>
            <div>
              <label className="form-label">Email</label>
              <input type="email" className="input-field" value={form.footer_email}
                onChange={(e) => setField("footer_email", e.target.value)} />
            </div>
          </div>
          <div>
            <label className="form-label">Teks Copyright (setelah tahun otomatis)</label>
            <input
              className="input-field"
              value={form.footer_copyright_suffix}
              onChange={(e) => setField("footer_copyright_suffix", e.target.value)}
              placeholder="PW IPM Jawa Barat. Hak Cipta Dilindungi."
            />
          </div>
          <div>
            <label className="form-label">Sosial Media (kosongkan kalau tidak dipakai)</label>
            <div className="space-y-2">
              {SOSMED_PLATFORMS.map((p) => (
                <div key={p} className="flex items-center gap-3">
                  <span className="w-24 text-sm text-neutral-600 shrink-0">{SOSMED_LABELS[p]}</span>
                  <input
                    className="input-field flex-1"
                    placeholder={`https://${p}.com/...`}
                    value={form.sosmed[p]}
                    onChange={(e) => setSosmed(p, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-end pt-4 border-t border-neutral-100">
        <Button type="submit" loading={isSubmitting}>Simpan Perubahan Global</Button>
      </div>
    </form>
  );
}
