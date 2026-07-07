{/* frontend/features/artikel-pimpinan/components/ArtikelForm.jsx (lengkap) */}
import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Button from "@/shared/components/ui/Button";
import { slugify } from "@/shared/utils/slugify";
import { validateGambar } from "@/shared/utils/fileValidator";
import { KATEGORI_BERITA, KATEGORI_BERITA_LABELS } from "@/shared/constants/statusEnum";
import CatatanRevisiBanner from "./CatatanRevisiBanner";

const DEFAULT_VALUES = {
  judul: "",
  slug: "",
  kategori: KATEGORI_BERITA.KEGIATAN,
  konten: "",
};

// Status yang mengunci form jadi read-only (sedang di tangan Wilayah / sudah selesai)
const LOCKED_STATUSES = ["diajukan", "disetujui"];

export default function ArtikelForm({ initialData = null, onSubmit, isSubmitting = false }) {
  const isLocked = initialData && LOCKED_STATUSES.includes(initialData.status);

  const [form, setForm] = useState(initialData ?? DEFAULT_VALUES);
  const [thumbFile, setThumbFile] = useState(null);
  const [thumbError, setThumbError] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(initialData?.thumbnail_url ?? null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Tulis isi artikel di sini…" }),
    ],
    content: initialData?.konten ?? "",
    editable: !isLocked,
    onUpdate: ({ editor: ed }) => setForm((prev) => ({ ...prev, konten: ed.getHTML() })),
  });

  useEffect(() => {
    if (!initialData) {
      setForm((prev) => ({ ...prev, slug: slugify(prev.judul) }));
    }
  }, [form.judul, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { valid, error } = validateGambar(file);
    if (!valid) { setThumbError(error); return; }
    setThumbError(null);
    setThumbFile(file);
    setThumbPreview(URL.createObjectURL(file));
  };

  const buildPayload = () => ({
    ...form,
    konten: editor?.getHTML() ?? form.konten,
    thumbnailFile: thumbFile,
  });

  // `action`: "draft" (simpan saja) | "ajukan" (simpan lalu langsung ajukan
  // ke Wilayah) — lihat 05-artikel-pimpinan.md §4.4.
  const handleSubmit = (e, action = "draft") => {
    e.preventDefault();
    onSubmit(buildPayload(), action);
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
      {initialData && (
        <CatatanRevisiBanner status={initialData.status} catatan={initialData.catatan_revisi} />
      )}

      <div>
        <label htmlFor="judul" className="form-label">Judul <span className="text-state-error">*</span></label>
        <input id="judul" name="judul" type="text" required disabled={isLocked}
          value={form.judul} onChange={handleChange}
          placeholder="Judul artikel" className="input-field" />
      </div>

      <div>
        <label htmlFor="slug" className="form-label">Slug URL</label>
        <input id="slug" name="slug" type="text" disabled={isLocked}
          value={form.slug} onChange={handleChange}
          className="input-field font-mono text-sm" />
        <p className="text-xs text-neutral-400 mt-1">Dibuat otomatis dari judul. Edit jika perlu.</p>
      </div>

      <div>
        <label htmlFor="kategori" className="form-label">Kategori <span className="text-state-error">*</span></label>
        <select id="kategori" name="kategori" value={form.kategori} onChange={handleChange}
          disabled={isLocked} className="input-field">
          {Object.entries(KATEGORI_BERITA_LABELS).map(([val, lbl]) => (
            <option key={val} value={val}>{lbl}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="form-label">Thumbnail</label>
        {thumbPreview && (
          <div className="aspect-video max-w-sm rounded-lg overflow-hidden mb-2 border border-neutral-200">
            <img src={thumbPreview} alt="Preview thumbnail" className="w-full h-full object-cover" />
          </div>
        )}
        {!isLocked && (
          <input type="file" accept="image/jpeg,image/png,image/webp"
            onChange={handleThumbChange}
            className="block text-sm text-neutral-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand-green-50 file:text-brand-green-500 file:font-semibold hover:file:bg-brand-green-100"
          />
        )}
        {thumbError && <p className="form-error">{thumbError}</p>}
      </div>

      <div>
        <label className="form-label">Konten Artikel <span className="text-state-error">*</span></label>
        {editor && !isLocked && (
          <div className="flex flex-wrap gap-1 p-2 bg-neutral-50 border border-neutral-200 border-b-0 rounded-t-lg">
            {[
              { label: "B", cmd: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold") },
              { label: "I", cmd: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic") },
              { label: "H2", cmd: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }) },
              { label: "H3", cmd: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive("heading", { level: 3 }) },
              { label: "UL", cmd: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive("bulletList") },
              { label: "OL", cmd: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive("orderedList") },
              { label: "\"\"", cmd: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive("blockquote") },
            ].map(({ label, cmd, active }) => (
              <button key={label} type="button" onClick={cmd}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${active ? "bg-brand-green-500 text-white" : "bg-white text-neutral-700 hover:bg-neutral-200 border border-neutral-200"}`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
        <div className={`border border-neutral-200 rounded-b-lg min-h-[300px] p-4 transition-colors ${isLocked ? "bg-neutral-50" : "focus-within:border-brand-green-500 focus-within:ring-2 focus-within:ring-brand-green-500/20"}`}>
          <EditorContent editor={editor} className="prose-ipm outline-none min-h-[280px]" />
        </div>
      </div>

      {!isLocked && (
        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
          <Button type="button" variant="ghost" onClick={() => window.history.back()}>Batal</Button>
          <Button type="submit" variant="outline" loading={isSubmitting === "draft"} onClick={(e) => handleSubmit(e, "draft")}>
            {initialData ? "Simpan Perubahan" : "Simpan sebagai Draft"}
          </Button>
          <Button type="submit" loading={isSubmitting === "ajukan"} onClick={(e) => handleSubmit(e, "ajukan")}>
            Ajukan ke Wilayah
          </Button>
        </div>
      )}
    </form>
  );
}
