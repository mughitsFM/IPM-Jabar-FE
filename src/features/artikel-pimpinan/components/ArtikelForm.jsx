{/* frontend/features/artikel-pimpinan/components/ArtikelForm.jsx (lengkap) */}
import { useState, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { useQuery } from "@tanstack/react-query";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold, Italic, Heading2, Heading3, List, ListOrdered, Quote,
  ImagePlus, Link2, Video, Undo2, Redo2,
} from "lucide-react";
import Button from "@/shared/components/ui/Button";
import TagInput from "@/shared/components/ui/TagInput";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { slugify } from "@/shared/utils/slugify";
import { validateGambar } from "@/shared/utils/fileValidator";
import { KATEGORI_BERITA, KATEGORI_BERITA_LABELS } from "@/shared/constants/statusEnum";
import { artikelPimpinanService } from "../services/artikelPimpinanService";
import FigureImage from "../tiptap/FigureImage";
import YoutubeEmbed, { extractYoutubeId } from "../tiptap/YoutubeEmbed";
import CatatanRevisiBanner from "./CatatanRevisiBanner";

const DEFAULT_VALUES = {
  judul:     "",
  slug:      "",
  ringkasan: "",
  kategori:  KATEGORI_BERITA.KEGIATAN,
  konten:    "",
  tags:      [],
};

// Status yang mengunci form jadi read-only (sedang di tangan Wilayah / sudah selesai)
const LOCKED_STATUSES = ["diajukan", "disetujui"];

function pickFormFields(data) {
  if (!data) return DEFAULT_VALUES;
  return {
    judul:     data.judul ?? "",
    slug:      data.slug ?? "",
    ringkasan: data.ringkasan ?? "",
    kategori:  data.kategori ?? KATEGORI_BERITA.KEGIATAN,
    konten:    data.konten ?? "",
    tags:      data.tags ?? [],
  };
}

export default function ArtikelForm({ initialData = null, createMutation, updateMutation, ajukanMutation, onDone }) {
  const isLocked = initialData && LOCKED_STATUSES.includes(initialData.status);

  const [form, setForm] = useState(() => pickFormFields(initialData));
  const [currentId, setCurrentId] = useState(initialData?.id ?? null);

  const [thumbFile, setThumbFile] = useState(null);
  const [thumbError, setThumbError] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(initialData?.thumbnail_url ?? null);

  const [fieldErrors, setFieldErrors] = useState({});
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [videoError, setVideoError] = useState(null);
  const imageInputRef = useRef(null);

  // "draft" | "ajukan" | false — dipakai utk tahu tombol mana yang loading
  const [pendingAction, setPendingAction] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const finalizedRef = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Tulis isi artikel di sini…" }),
      FigureImage,
      YoutubeEmbed,
    ],
    content: initialData?.konten ?? "",
    editable: !isLocked,
    onUpdate: ({ editor: ed }) => setForm((prev) => ({ ...prev, konten: ed.getHTML() })),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "judul" && !initialData) {
      setForm((prev) => ({ ...prev, slug: slugify(value) }));
    }
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

  const handleSetLink = () => {
    if (!editor) return;
    const prevUrl = editor.getAttributes("link").href || "";
    const url = window.prompt("Masukkan URL tautan:", prevUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const handleInsertImage = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !editor) return;
    const { valid, error } = validateGambar(file);
    if (!valid) { setImageUploadError(error); return; }
    setImageUploadError(null);
    setUploadingImage(true);
    try {
      const res = await artikelPimpinanService.uploadContentImage(file);
      const url = res?.data?.url;
      editor.chain().focus().insertContent({ type: "figureImage", attrs: { src: url, alt: "", caption: "" } }).run();
    } catch {
      setImageUploadError("Gagal mengunggah gambar. Coba lagi.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleInsertVideo = () => {
    if (!editor) return;
    const url = window.prompt("Tempel URL video YouTube:");
    if (!url) return;
    const videoId = extractYoutubeId(url);
    if (!videoId) { setVideoError("URL YouTube tidak valid."); return; }
    setVideoError(null);
    editor.chain().focus().insertContent({ type: "youtubeEmbed", attrs: { videoId } }).run();
  };

  // ── Cek slug (informatif — TIDAK memblokir submit, lihat catatan backend) ──
  const debouncedSlug = useDebounce(form.slug, 500);
  const slugChanged = debouncedSlug && debouncedSlug !== (initialData?.slug ?? "");
  const { data: slugCheckData, isFetching: slugChecking } = useQuery({
    queryKey: ["artikel-pimpinan", "cek-slug", debouncedSlug],
    queryFn: () => artikelPimpinanService.checkSlug(debouncedSlug),
    enabled: !!slugChanged && debouncedSlug.length >= 3 && !isLocked,
  });
  const slugTaken = slugChanged && slugCheckData && slugCheckData.data?.available === false;

  const validateCore = () => {
    const errs = {};
    if (!form.judul.trim()) errs.judul = "Judul wajib diisi.";
    if (!editor || editor.isEmpty) errs.konten = "Konten artikel wajib diisi.";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Payload builders ────────────────────────────────────────────────────────
  const buildPayload = () => ({
    judul:     form.judul,
    slug:      form.slug,
    ringkasan: form.ringkasan,
    kategori:  form.kategori,
    konten:    editor?.getHTML() ?? form.konten,
    tags:      form.tags,
    thumbnailFile: thumbFile,
  });

  // action: "draft" → simpan saja | "ajukan" → simpan lalu langsung ajukan
  const submitManual = async (action) => {
    if (!validateCore()) return;
    setPendingAction(action);
    setErrorMsg(null);
    try {
      const payload = buildPayload();
      let result;
      if (currentId) {
        result = await updateMutation.mutateAsync({ id: currentId, payload });
      } else {
        result = await createMutation.mutateAsync(payload);
        setCurrentId(result?.data?.id);
      }

      if (action === "ajukan") {
        const artikelId = currentId ?? result?.data?.id;
        try {
          await ajukanMutation.mutateAsync(artikelId);
        } catch (err) {
          setErrorMsg(err?.response?.data?.message ?? "Gagal mengajukan artikel. Draft sudah tersimpan.");
          setPendingAction(false);
          return;
        }
      }

      finalizedRef.current = true;
      onDone();
    } catch (err) {
      setErrorMsg(err?.response?.data?.message ?? "Terjadi kesalahan. Coba lagi.");
      setPendingAction(false);
    }
  };

  // ── Autosave (sederhana, tanpa riwayat versi — sama seperti Berita) ────────
  const buildSnapshot = () => JSON.stringify({
    judul: form.judul, slug: form.slug, ringkasan: form.ringkasan,
    kategori: form.kategori, tags: form.tags, konten: form.konten,
    hasNewThumb: !!thumbFile,
  });

  const autosaveSnapshot = buildSnapshot();
  const debouncedSnapshot = useDebounce(autosaveSnapshot, 4000);
  const lastSavedSnapshotRef = useRef(autosaveSnapshot);
  const [autosaveStatus, setAutosaveStatus] = useState("idle"); // idle | saving | saved | error
  const [lastSavedAt, setLastSavedAt] = useState(null);

  useState(() => {}); // no-op placeholder guard removed below via useEffect import pattern

  useDebounceAutosaveEffect({
    isLocked,
    finalizedRef,
    debouncedSnapshot,
    lastSavedSnapshotRef,
    form,
    editor,
    currentId,
    setCurrentId,
    setAutosaveStatus,
    setLastSavedAt,
    setThumbFile,
    setThumbPreview,
    thumbFile,
    buildPayload,
    createMutation,
    updateMutation,
  });

  const plainText = editor?.getText() ?? "";
  const wordCount = plainText.trim() ? plainText.trim().split(/\s+/).length : 0;
  const readMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const toolbarGroups = editor ? [
    [
      { icon: Undo2, label: "Urungkan", cmd: () => editor.chain().focus().undo().run(), disabled: !editor.can().undo() },
      { icon: Redo2, label: "Ulangi",   cmd: () => editor.chain().focus().redo().run(), disabled: !editor.can().redo() },
    ],
    [
      { icon: Bold,   label: "Tebal",  cmd: () => editor.chain().focus().toggleBold().run(),   active: editor.isActive("bold") },
      { icon: Italic, label: "Miring", cmd: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic") },
    ],
    [
      { icon: Heading2, label: "Judul Bagian", cmd: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }) },
      { icon: Heading3, label: "Sub-judul",    cmd: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive("heading", { level: 3 }) },
    ],
    [
      { icon: List,        label: "Daftar Poin",    cmd: () => editor.chain().focus().toggleBulletList().run(),  active: editor.isActive("bulletList") },
      { icon: ListOrdered, label: "Daftar Bernomor", cmd: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive("orderedList") },
      { icon: Quote,       label: "Kutipan",         cmd: () => editor.chain().focus().toggleBlockquote().run(),  active: editor.isActive("blockquote") },
    ],
    [
      { icon: Link2,     label: "Tautan",          cmd: handleSetLink,                        active: editor.isActive("link") },
      { icon: ImagePlus, label: "Sisipkan Gambar",  cmd: () => imageInputRef.current?.click(), active: false },
      { icon: Video,     label: "Sisipkan Video YouTube", cmd: handleInsertVideo,              active: false },
    ],
  ] : [];

  return (
    <div className="space-y-6">
      {initialData && (
        <CatatanRevisiBanner status={initialData.status} catatan={initialData.catatan_revisi} />
      )}

      {errorMsg && (
        <div className="p-3 rounded-lg bg-state-error/10 text-state-error text-sm">{errorMsg}</div>
      )}

      <div>
        <label htmlFor="judul" className="form-label">Judul <span className="text-state-error">*</span></label>
        <input id="judul" name="judul" type="text" disabled={isLocked}
          value={form.judul} onChange={handleChange}
          placeholder="Judul artikel" className="input-field" />
        {fieldErrors.judul && <p className="form-error">{fieldErrors.judul}</p>}
      </div>

      <div>
        <label htmlFor="slug" className="form-label">Slug URL</label>
        <input id="slug" name="slug" type="text" disabled={isLocked}
          value={form.slug} onChange={handleChange}
          className="input-field font-mono text-sm" />
        {slugChanged && debouncedSlug.length >= 3 && (
          <p className={`text-xs mt-1 ${slugChecking ? "text-neutral-400" : slugTaken ? "text-brand-gold-600" : "text-brand-green-600"}`}>
            {slugChecking
              ? "Memeriksa ketersediaan…"
              : slugTaken
                ? "⚠ Slug ini sudah dipakai berita lain — mungkin otomatis diberi angka tambahan saat disetujui nanti"
                : "✓ Slug tersedia"}
          </p>
        )}
        <p className="text-xs text-neutral-400 mt-1">Dibuat otomatis dari judul. Edit jika perlu.</p>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="ringkasan" className="form-label">Ringkasan</label>
          <span className={`text-xs ${form.ringkasan.length > 280 ? "text-state-error" : "text-neutral-400"}`}>
            {form.ringkasan.length}/300
          </span>
        </div>
        <textarea id="ringkasan" name="ringkasan" rows={2} maxLength={300} disabled={isLocked}
          value={form.ringkasan} onChange={handleChange}
          placeholder="Ringkasan singkat (1–2 kalimat) untuk kartu berita & hasil pencarian…"
          className="input-field resize-none" />
        <p className="text-xs text-neutral-400 mt-1">Idealnya 120–200 karakter.</p>
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
        <label className="form-label">Tag</label>
        <TagInput value={form.tags} onChange={(tags) => setForm((prev) => ({ ...prev, tags }))} maxTags={10} disabled={isLocked} />
        <p className="text-xs text-neutral-400 mt-1">Nama tokoh, tempat, atau isu terkait.</p>
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
          <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 p-2 bg-neutral-50/95 backdrop-blur border border-neutral-200 border-b-0 rounded-t-lg">
            {toolbarGroups.map((group, gi) => (
              <div key={gi} className="flex items-center gap-1 pr-1 mr-1 border-r border-neutral-200 last:border-r-0 last:pr-0 last:mr-0">
                {group.map(({ icon: Icon, label, cmd, active, disabled }) => (
                  <button key={label} type="button" title={label} onClick={cmd} disabled={disabled}
                    className={`p-2 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                      active ? "bg-brand-green-500 text-white" : "text-neutral-600 hover:bg-neutral-200"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            ))}
            {uploadingImage && <span className="text-xs text-neutral-400 ml-2">Mengunggah gambar…</span>}
          </div>
        )}

        <input ref={imageInputRef} type="file" accept="image/jpeg,image/png,image/webp"
          onChange={handleInsertImage} className="hidden" />

        <div className={`border border-neutral-200 rounded-b-lg min-h-[300px] p-4 transition-colors ${isLocked ? "bg-neutral-50" : "focus-within:border-brand-green-500 focus-within:ring-2 focus-within:ring-brand-green-500/20"}`}>
          <EditorContent editor={editor} className="prose-ipm outline-none min-h-[280px]" />
        </div>

        {!isLocked && (
          <div className="flex items-center justify-between text-xs mt-2">
            <span className="text-neutral-400">{wordCount} kata · ±{readMinutes} menit baca</span>
            <span className="text-state-error">{imageUploadError || videoError}</span>
          </div>
        )}
        {fieldErrors.konten && <p className="form-error">{fieldErrors.konten}</p>}
      </div>

      {!isLocked ? (
        <div className="sticky bottom-0 -mx-4 -mb-4 sm:-mx-6 sm:-mb-6 mt-8 border-t border-neutral-200 bg-white/95 backdrop-blur px-4 sm:px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button type="button" onClick={onDone} className="text-sm text-neutral-500 hover:text-neutral-700 font-medium">
                ← Batal
              </button>
              <span className="text-xs text-neutral-400">
                {autosaveStatus === "saving" && "Menyimpan…"}
                {autosaveStatus === "saved" && lastSavedAt && `Tersimpan otomatis · ${lastSavedAt.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`}
                {autosaveStatus === "error" && <span className="text-state-error">Gagal menyimpan otomatis</span>}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" variant="outline" loading={pendingAction === "draft"} onClick={() => submitManual("draft")}>
                {initialData ? "Simpan Perubahan" : "Simpan sebagai Draft"}
              </Button>
              <Button type="button" loading={pendingAction === "ajukan"} onClick={() => submitManual("ajukan")}>
                Ajukan ke Wilayah
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="sticky bottom-0 -mx-4 -mb-4 sm:-mx-6 sm:-mb-6 mt-8 border-t border-neutral-200 bg-white/95 backdrop-blur px-4 sm:px-6 py-4">
          <p className="text-sm text-neutral-500 text-center">
            {initialData.status === "diajukan"
              ? "Artikel sedang direview Wilayah dan tidak dapat diedit."
              : "Artikel ini sudah disetujui & dipublikasikan."}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Hook autosave internal ──────────────────────────────────────────────────
// Dipisah jadi fungsi tersendiri di bawah komponen (bukan inline) supaya
// badan ArtikelForm tidak makin panjang — tetap "hook" biasa (dipanggil di
// urutan tetap, tanpa kondisi), hanya diekstrak untuk keterbacaan.
import { useEffect } from "react";

function useDebounceAutosaveEffect({
  isLocked, finalizedRef, debouncedSnapshot, lastSavedSnapshotRef, form, editor,
  currentId, setCurrentId, setAutosaveStatus, setLastSavedAt,
  setThumbFile, setThumbPreview, thumbFile, buildPayload, createMutation, updateMutation,
}) {
  useEffect(() => {
    if (isLocked) return;
    if (finalizedRef.current) return;
    if (debouncedSnapshot === lastSavedSnapshotRef.current) return;
    if (!form.judul.trim()) return;
    if (!editor || editor.isEmpty) return;

    let cancelled = false;
    (async () => {
      setAutosaveStatus("saving");
      try {
        const payload = buildPayload();
        let result;
        if (currentId) {
          result = await updateMutation.mutateAsync({ id: currentId, payload });
        } else {
          result = await createMutation.mutateAsync(payload);
          if (!cancelled) setCurrentId(result?.data?.id);
        }
        if (cancelled || finalizedRef.current) return;
        if (thumbFile && result?.data?.thumbnail_url) {
          setThumbPreview(result.data.thumbnail_url);
          setThumbFile(null);
        }
        lastSavedSnapshotRef.current = debouncedSnapshot;
        setAutosaveStatus("saved");
        setLastSavedAt(new Date());
      } catch {
        if (!cancelled) setAutosaveStatus("error");
      }
    })();

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSnapshot]);
}