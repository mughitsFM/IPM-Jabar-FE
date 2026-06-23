import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Button from "@/shared/components/ui/Button";
import { slugify } from "@/shared/utils/slugify";
import { validateGambar } from "@/shared/utils/fileValidator";
import {
  KATEGORI_BERITA, KATEGORI_BERITA_LABELS,
  STATUS_BERITA, STATUS_BERITA_LABELS,
} from "@/shared/constants/statusEnum";
import { beritaService } from "../services/beritaService";

const DEFAULT_VALUES = {
  judul:       "",
  slug:        "",
  kategori:    KATEGORI_BERITA.KEGIATAN,
  status:      STATUS_BERITA.DRAFT,
  published_at:"",
  thumbnail_url:"",
  konten:      "",
};

/**
 * NewsForm — form buat/edit berita di panel admin.
 *
 * @param {object}   initialData  - Data awal saat mode edit (null = mode buat)
 * @param {function} onSubmit     - Dipanggil dengan payload siap kirim ke API
 * @param {boolean}  isSubmitting - Tombol submit state loading
 */
export default function NewsForm({ initialData = null, onSubmit, isSubmitting = false }) {
  const [form, setForm]   = useState(initialData ?? DEFAULT_VALUES);
  const [thumbFile, setThumbFile] = useState(null);
  const [thumbError, setThumbError] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(initialData?.thumbnail_url ?? null);
  const [uploadingThumb, setUploadingThumb] = useState(false);

  // TipTap editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Tulis isi berita di sini…" }),
    ],
    content: initialData?.konten ?? "",
    onUpdate: ({ editor: ed }) =>
      setForm((prev) => ({ ...prev, konten: ed.getHTML() })),
  });

  // Auto-generate slug dari judul (hanya saat mode buat)
  useEffect(() => {
    if (!initialData) {
      setForm((prev) => ({ ...prev, slug: slugify(prev.judul) }));
    }
  }, [form.judul, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { valid, error } = validateGambar(file);
    if (!valid) { setThumbError(error); return; }
    setThumbError(null);
    setThumbFile(file);
    setThumbPreview(URL.createObjectURL(file));

    // Upload segera, simpan URL
    try {
      setUploadingThumb(true);
      const { thumbnail_url } = await beritaService.uploadThumbnail(file);
      setForm((prev) => ({ ...prev, thumbnail_url }));
    } catch {
      setThumbError("Gagal mengunggah gambar. Coba lagi.");
    } finally {
      setUploadingThumb(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, konten: editor?.getHTML() ?? form.konten });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Judul */}
      <div>
        <label htmlFor="judul" className="form-label">Judul <span className="text-state-error">*</span></label>
        <input id="judul" name="judul" type="text" required
          value={form.judul} onChange={handleChange}
          placeholder="Judul berita"
          className="input-field"
        />
      </div>

      {/* Slug */}
      <div>
        <label htmlFor="slug" className="form-label">Slug URL</label>
        <input id="slug" name="slug" type="text"
          value={form.slug} onChange={handleChange}
          className="input-field font-mono text-sm"
        />
        <p className="text-xs text-neutral-400 mt-1">Dibuat otomatis dari judul. Edit jika perlu.</p>
      </div>

      {/* Kategori + Status (2 kolom) */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="kategori" className="form-label">Kategori <span className="text-state-error">*</span></label>
          <select id="kategori" name="kategori" value={form.kategori} onChange={handleChange} className="input-field">
            {Object.entries(KATEGORI_BERITA_LABELS).map(([val, lbl]) => (
              <option key={val} value={val}>{lbl}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="status" className="form-label">Status <span className="text-state-error">*</span></label>
          <select id="status" name="status" value={form.status} onChange={handleChange} className="input-field">
            {Object.entries(STATUS_BERITA_LABELS).map(([val, lbl]) => (
              <option key={val} value={val}>{lbl}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Waktu publikasi (hanya jika terjadwal) */}
      {form.status === STATUS_BERITA.TERJADWAL && (
        <div>
          <label htmlFor="published_at" className="form-label">Waktu Publikasi</label>
          <input id="published_at" name="published_at" type="datetime-local"
            value={form.published_at} onChange={handleChange}
            className="input-field"
          />
        </div>
      )}

      {/* Thumbnail */}
      <div>
        <label className="form-label">Thumbnail</label>
        {thumbPreview && (
          <div className="aspect-video max-w-sm rounded-lg overflow-hidden mb-2 border border-neutral-200">
            <img src={thumbPreview} alt="Preview thumbnail" className="w-full h-full object-cover" />
          </div>
        )}
        <input type="file" accept="image/jpeg,image/png,image/webp"
          onChange={handleThumbChange}
          className="block text-sm text-neutral-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand-green-50 file:text-brand-green-500 file:font-semibold hover:file:bg-brand-green-100"
        />
        {uploadingThumb && <p className="text-xs text-brand-blue-500 mt-1">Mengunggah gambar…</p>}
        {thumbError && <p className="form-error">{thumbError}</p>}
      </div>

      {/* Rich Text Editor */}
      <div>
        <label className="form-label">Konten Berita <span className="text-state-error">*</span></label>
        {/* Toolbar TipTap sederhana */}
        {editor && (
          <div className="flex flex-wrap gap-1 p-2 bg-neutral-50 border border-neutral-200 border-b-0 rounded-t-lg">
            {[
              { label: "B",   cmd: () => editor.chain().focus().toggleBold().run(),          active: editor.isActive("bold")         },
              { label: "I",   cmd: () => editor.chain().focus().toggleItalic().run(),        active: editor.isActive("italic")       },
              { label: "H2",  cmd: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }) },
              { label: "H3",  cmd: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive("heading", { level: 3 }) },
              { label: "UL",  cmd: () => editor.chain().focus().toggleBulletList().run(),    active: editor.isActive("bulletList")   },
              { label: "OL",  cmd: () => editor.chain().focus().toggleOrderedList().run(),   active: editor.isActive("orderedList")  },
              { label: "\"\"", cmd: () => editor.chain().focus().toggleBlockquote().run(),   active: editor.isActive("blockquote")   },
            ].map(({ label, cmd, active }) => (
              <button key={label} type="button" onClick={cmd}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${active ? "bg-brand-green-500 text-white" : "bg-white text-neutral-700 hover:bg-neutral-200 border border-neutral-200"}`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
        <div className="border border-neutral-200 rounded-b-lg min-h-[300px] p-4 focus-within:border-brand-green-500 focus-within:ring-2 focus-within:ring-brand-green-500/20 transition-colors">
          <EditorContent editor={editor} className="prose-ipm outline-none min-h-[280px]" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
        <Button type="button" variant="ghost" onClick={() => window.history.back()}>
          Batal
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {initialData ? "Simpan Perubahan" : "Publikasikan"}
        </Button>
      </div>
    </form>
  );
}
