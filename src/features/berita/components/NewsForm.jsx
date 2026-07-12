{/* frontend/features/berita/components/NewsForm.jsx (lengkap) */}
import { useState, useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { useQuery } from "@tanstack/react-query";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold, Italic, Heading2, Heading3, List, ListOrdered, Quote,
  ImagePlus, Link2, Video as YoutubeIcon, Newspaper, Undo2, Redo2,
} from "lucide-react";
import Button from "@/shared/components/ui/Button";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { slugify } from "@/shared/utils/slugify";
import { validateGambar } from "@/shared/utils/fileValidator";
import { beritaService } from "../services/beritaService";
import FigureImage from "../tiptap/FigureImage";
import YoutubeEmbed, { extractYoutubeId } from "../tiptap/YoutubeEmbed";
import BacaJugaPicker from "./BacaJugaPicker";
import TagInput from "@/shared/components/ui/TagInput";
import {
  KATEGORI_BERITA, KATEGORI_BERITA_LABELS, STATUS_BERITA,
} from "@/shared/constants/statusEnum";

const DEFAULT_VALUES = {
  judul:     "",
  slug:      "",
  ringkasan: "",
  kategori:  KATEGORI_BERITA.KEGIATAN,
  konten:    "",
  tags:      [],
};

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

function toDatetimeLocalValue(isoOrDate) {
  if (!isoOrDate) return "";
  const d = new Date(isoOrDate);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromDatetimeLocalValue(value) {
  if (!value) return null;
  return new Date(value).toISOString();
}

export default function NewsForm({ initialData = null, createMutation, updateMutation, onDone }) {
  const initialStatus = initialData?.status ?? STATUS_BERITA.DRAFT;

  const [form, setForm]   = useState(() => pickFormFields(initialData));
  const [currentId, setCurrentId] = useState(initialData?.id ?? null);

  const [thumbFile, setThumbFile] = useState(null);
  const [thumbError, setThumbError] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(initialData?.thumbnail_url ?? null);

  const [bacaJuga, setBacaJuga] = useState([]); // [{id, judul, thumbnail_url, status}]
  const [bacaJugaOpen, setBacaJugaOpen] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({});
  const [scheduleOpen, setScheduleOpen] = useState(initialStatus === STATUS_BERITA.TERJADWAL);
  const [scheduledAt, setScheduledAt] = useState(
    initialStatus === STATUS_BERITA.TERJADWAL ? toDatetimeLocalValue(initialData.published_at) : ""
  );
  const [scheduleError, setScheduleError] = useState(null);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [videoError, setVideoError] = useState(null);
  const imageInputRef = useRef(null);

  const [manualPending, setManualPending] = useState(false);
  const finalizedRef = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Tulis isi berita di sini…" }),
      FigureImage,
      YoutubeEmbed,
    ],
    content: initialData?.konten ?? "",
    onUpdate: ({ editor: ed }) =>
      setForm((prev) => ({ ...prev, konten: ed.getHTML() })),
  });

  // ── Hidrasi "Baca Juga" saat edit (backend hanya simpan ID) ───────────────
  useEffect(() => {
    if (!initialData?.baca_juga?.length) return;
    let cancelled = false;
    beritaService.searchAdmin({ ids: initialData.baca_juga }).then((res) => {
      if (cancelled) return;
      const hydrated = res?.data ?? [];
      setBacaJuga(hydrated);
      // Refresh snapshot acuan autosave supaya tidak langsung trigger gara-gara
      // baca_juga baru saja selesai di-hydrate dari id → objek lengkap.
      lastSavedSnapshotRef.current = buildSnapshot({ bacaJugaIds: hydrated.map((b) => b.id) });
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      const res = await beritaService.uploadContentImage(file);
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
    if (!videoId) {
      setVideoError("URL YouTube tidak valid.");
      return;
    }
    setVideoError(null);
    editor.chain().focus().insertContent({ type: "youtubeEmbed", attrs: { videoId } }).run();
  };

  // ── Cek slug unik (live, debounced) ────────────────────────────────────────
  const debouncedSlug = useDebounce(form.slug, 500);
  const slugChanged = debouncedSlug && debouncedSlug !== (initialData?.slug ?? "");
  const { data: slugCheckData, isFetching: slugChecking } = useQuery({
    queryKey: ["berita", "cek-slug", debouncedSlug, initialData?.id],
    queryFn: () => beritaService.checkSlug(debouncedSlug, initialData?.id),
    enabled: !!slugChanged && debouncedSlug.length >= 3,
  });
  const slugTaken = slugChanged && slugCheckData && slugCheckData.data?.available === false;

  const validateCore = () => {
    const errs = {};
    if (!form.judul.trim()) errs.judul = "Judul wajib diisi.";
    if (!editor || editor.isEmpty) errs.konten = "Konten berita wajib diisi.";
    if (slugTaken) errs.slug = "Slug sudah dipakai, pilih yang lain.";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Payload builders ────────────────────────────────────────────────────────
  const buildAutosavePayload = () => ({
    judul:     form.judul,
    slug:      form.slug,
    ringkasan: form.ringkasan,
    kategori:  form.kategori,
    konten:    editor?.getHTML() ?? form.konten,
    tags:      form.tags,
    baca_juga: bacaJuga.map((b) => b.id),
    thumbnailFile: thumbFile,
  });

  const buildPayload = (status, publishedAtIso) => ({
    ...buildAutosavePayload(),
    status,
    ...(publishedAtIso !== undefined ? { published_at: publishedAtIso } : {}),
  });

  // ── Submit manual (Draft / Publikasikan / Jadwalkan / Jadikan Draft) ───────
  const submitManual = async (status, publishedAtIso) => {
    setManualPending(true);
    try {
      const payload = buildPayload(status, publishedAtIso);
      if (currentId) {
        await updateMutation.mutateAsync({ id: currentId, payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      finalizedRef.current = true;
      onDone();
    } finally {
      setManualPending(false);
    }
  };

  const handleSaveDraft = () => { if (validateCore()) submitManual(STATUS_BERITA.DRAFT); };
  const handlePublish   = () => { if (validateCore()) submitManual(STATUS_BERITA.DIPUBLIKASIKAN); };
  const handleUnpublish = () => submitManual(STATUS_BERITA.DRAFT);

  const handleConfirmSchedule = () => {
    if (!validateCore()) return;
    if (!scheduledAt) { setScheduleError("Tentukan tanggal & jam publikasi."); return; }
    const iso = fromDatetimeLocalValue(scheduledAt);
    if (new Date(iso) <= new Date()) { setScheduleError("Waktu publikasi harus di masa depan."); return; }
    setScheduleError(null);
    submitManual(STATUS_BERITA.TERJADWAL, iso);
  };

  // ── Autosave (sederhana, tanpa riwayat versi) ──────────────────────────────
  const buildSnapshot = (override = {}) => JSON.stringify({
    judul: form.judul, slug: form.slug, ringkasan: form.ringkasan,
    kategori: form.kategori, tags: form.tags,
    bacaJugaIds: bacaJuga.map((b) => b.id), konten: form.konten,
    hasNewThumb: !!thumbFile,
    ...override,
  });

  const autosaveSnapshot = buildSnapshot();
  const debouncedSnapshot = useDebounce(autosaveSnapshot, 4000);
  const lastSavedSnapshotRef = useRef(autosaveSnapshot);
  const [autosaveStatus, setAutosaveStatus] = useState("idle"); // idle | saving | saved | error
  const [lastSavedAt, setLastSavedAt] = useState(null);

  useEffect(() => {
    if (finalizedRef.current) return;
    if (debouncedSnapshot === lastSavedSnapshotRef.current) return;
    if (!form.judul.trim()) return;      // hindari draft sampah tanpa judul
    if (!editor || editor.isEmpty) return; // hindari draft sampah tanpa isi

    let cancelled = false;
    (async () => {
      setAutosaveStatus("saving");
      try {
        const payload = buildAutosavePayload();
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

  const plainText = editor?.getText() ?? "";
  const wordCount = plainText.trim() ? plainText.trim().split(/\s+/).length : 0;
  const readMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const toolbarGroups = editor ? [
    [
      { icon: Undo2, label: "Urungkan", cmd: () => editor.chain().focus().undo().run(), active: false, disabled: !editor.can().undo() },
      { icon: Redo2, label: "Ulangi",   cmd: () => editor.chain().focus().redo().run(), active: false, disabled: !editor.can().redo() },
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
      { icon: Link2,      label: "Tautan",          cmd: handleSetLink,                        active: editor.isActive("link") },
      { icon: ImagePlus,  label: "Sisipkan Gambar",  cmd: () => imageInputRef.current?.click(), active: false },
      { icon: YoutubeIcon, label: "Sisipkan Video YouTube", cmd: handleInsertVideo,             active: false },
    ],
  ] : [];

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="judul" className="form-label">Judul <span className="text-state-error">*</span></label>
        <input id="judul" name="judul" type="text"
          value={form.judul} onChange={handleChange}
          placeholder="Judul berita" className="input-field" />
        {fieldErrors.judul && <p className="form-error">{fieldErrors.judul}</p>}
      </div>

      <div>
        <label htmlFor="slug" className="form-label">Slug URL</label>
        <input id="slug" name="slug" type="text" value={form.slug} onChange={handleChange}
          className="input-field font-mono text-sm" />
        {slugChanged && debouncedSlug.length >= 3 && (
          <p className={`text-xs mt-1 ${slugChecking ? "text-neutral-400" : slugTaken ? "text-state-error" : "text-brand-green-600"}`}>
            {slugChecking ? "Memeriksa ketersediaan…" : slugTaken ? "✗ Slug sudah dipakai, pilih yang lain" : "✓ Slug tersedia"}
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
        <textarea id="ringkasan" name="ringkasan" rows={2} maxLength={300}
          value={form.ringkasan} onChange={handleChange}
          placeholder="Ringkasan singkat (1–2 kalimat) untuk kartu berita & hasil pencarian…"
          className="input-field resize-none" />
        <p className="text-xs text-neutral-400 mt-1">Idealnya 120–200 karakter.</p>
      </div>

      <div>
        <label htmlFor="kategori" className="form-label">Kategori <span className="text-state-error">*</span></label>
        <select id="kategori" name="kategori" value={form.kategori} onChange={handleChange} className="input-field">
          {Object.entries(KATEGORI_BERITA_LABELS).map(([val, lbl]) => (
            <option key={val} value={val}>{lbl}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="form-label">Tag</label>
        <TagInput value={form.tags} onChange={(tags) => setForm((prev) => ({ ...prev, tags }))} maxTags={10} />
        <p className="text-xs text-neutral-400 mt-1">Nama tokoh, tempat, atau isu terkait — untuk pencarian & kartu terkait.</p>
      </div>

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
        {thumbError && <p className="form-error">{thumbError}</p>}
      </div>

      <div>
        <label className="form-label">Konten Berita <span className="text-state-error">*</span></label>

        {editor && (
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

        <div className="border border-neutral-200 rounded-b-lg min-h-[300px] p-4 focus-within:border-brand-green-500 focus-within:ring-2 focus-within:ring-brand-green-500/20 transition-colors">
          <EditorContent editor={editor} className="prose-ipm outline-none min-h-[280px]" />
        </div>

        <div className="flex items-center justify-between text-xs mt-2">
          <span className="text-neutral-400">{wordCount} kata · ±{readMinutes} menit baca</span>
          <span className="text-state-error">{imageUploadError || videoError}</span>
        </div>
        {fieldErrors.konten && <p className="form-error">{fieldErrors.konten}</p>}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="form-label mb-0">Baca Juga</label>
          <button type="button" onClick={() => setBacaJugaOpen(true)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue-500 hover:text-brand-blue-600">
            <Newspaper className="w-4 h-4" /> Pilih berita terkait
          </button>
        </div>
        {bacaJuga.length === 0 ? (
          <p className="text-xs text-neutral-400">Belum ada berita terkait dipilih.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {bacaJuga.map((item) => (
              <span key={item.id} className="inline-flex items-center gap-1.5 bg-neutral-100 text-neutral-700 text-xs font-medium pl-2 pr-1 py-1 rounded-full">
                {item.judul}
                <button type="button" onClick={() => setBacaJuga((prev) => prev.filter((b) => b.id !== item.id))}
                  className="hover:bg-neutral-200 rounded-full p-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
        <BacaJugaPicker
          open={bacaJugaOpen}
          onClose={() => setBacaJugaOpen(false)}
          excludeId={currentId}
          selected={bacaJuga}
          onChange={setBacaJuga}
        />
      </div>

      {/* ── Action bar ────────────────────────────────────────────────────── */}
      <div className="sticky bottom-0 -mx-6 -mb-6 mt-8 border-t border-neutral-200 bg-white/95 backdrop-blur px-6 py-4">
        {scheduleOpen && (
          <div className="mb-4 flex flex-wrap items-end gap-3 rounded-lg bg-brand-blue-500/5 border border-brand-blue-500/20 p-3">
            <div className="flex-1 min-w-[220px]">
              <label htmlFor="scheduledAt" className="form-label">Jadwalkan tayang pada</label>
              <input id="scheduledAt" type="datetime-local"
                value={scheduledAt}
                min={toDatetimeLocalValue(new Date(Date.now() + 5 * 60000))}
                onChange={(e) => { setScheduledAt(e.target.value); setScheduleError(null); }}
                className="input-field" />
              {scheduleError && <p className="form-error">{scheduleError}</p>}
            </div>
            <Button type="button" variant="primary" onClick={handleConfirmSchedule} loading={manualPending}>
              {initialStatus === STATUS_BERITA.TERJADWAL ? "Perbarui Jadwal" : "Jadwalkan"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setScheduleOpen(false)}>Batal</Button>
          </div>
        )}

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
            {initialStatus === STATUS_BERITA.DIPUBLIKASIKAN ? (
              <>
                <Button type="button" variant="ghost" className="text-state-error hover:text-red-700"
                  onClick={handleUnpublish} disabled={manualPending}>
                  Jadikan Draft
                </Button>
                <Button type="button" variant="primary" onClick={handlePublish} loading={manualPending}>
                  Simpan Perubahan
                </Button>
              </>
            ) : (
              <>
                <Button type="button" variant="outline" onClick={handleSaveDraft} disabled={manualPending}>
                  Simpan sebagai Draft
                </Button>
                <button type="button" onClick={() => setScheduleOpen((v) => !v)}
                  className="text-sm font-semibold text-brand-blue-500 hover:text-brand-blue-600 px-3 py-2.5">
                  {scheduleOpen ? "Sembunyikan jadwal ▴" : "Jadwalkan publikasi ▾"}
                </button>
                <Button type="button" variant="primary" onClick={handlePublish}
                  loading={manualPending} disabled={scheduleOpen}>
                  Publikasikan Sekarang
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}