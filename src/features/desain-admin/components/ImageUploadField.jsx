import { useRef, useState } from "react";
import Button from "@/shared/components/ui/Button";
import { useUploadGambarDesain } from "../hooks/useDesainAdmin";

/**
 * ImageUploadField — upload gambar (hero/logo) via
 * POST /api/admin/desain/upload-gambar/, lalu simpan URL hasil upload
 * ke state form induk lewat `onChange`.
 */
export default function ImageUploadField({ label, value, onChange, aspectHint }) {
  const inputRef = useRef(null);
  const [error, setError] = useState("");
  const uploadMutation = useUploadGambarDesain();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");

    try {
      const res = await uploadMutation.mutateAsync(file);
      onChange(res?.data?.url ?? null);
    } catch (err) {
      setError(err?.response?.data?.message || "Gagal mengunggah gambar. Coba lagi.");
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <label className="form-label">{label}</label>
      {aspectHint && <p className="text-xs text-neutral-500 mb-2">{aspectHint}</p>}

      {value ? (
        <div className="relative rounded-lg overflow-hidden border border-neutral-200 mb-3">
          <img src={value} alt={label} className="w-full h-40 object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 bg-white/90 text-neutral-700 text-xs font-semibold px-2.5 py-1.5 rounded-md hover:bg-white transition-colors"
          >
            Hapus
          </button>
        </div>
      ) : (
        <div className="h-40 rounded-lg border-2 border-dashed border-neutral-200 flex items-center justify-center text-neutral-400 text-sm mb-3">
          Belum ada gambar
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFile}
        className="hidden"
        id={`upload-${label}`}
      />
      <Button
        type="button"
        variant="outline"
        loading={uploadMutation.isPending}
        onClick={() => inputRef.current?.click()}
      >
        {value ? "Ganti Gambar" : "Unggah Gambar"}
      </Button>

      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
