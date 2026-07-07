{/* frontend/features/artikel-pimpinan/pages/admin/AdminArtikelPimpinanPage.jsx (lengkap) */}
import { useState } from "react";
import AdminLayout from "@/shared/components/layout/AdminLayout";
import Button from "@/shared/components/ui/Button";
import EmptyState from "@/shared/components/ui/EmptyState";
import Pagination from "@/shared/components/ui/Pagination";
import { SkeletonTableRows } from "@/shared/components/ui/Skeleton";
import { formatShort } from "@/shared/utils/formatDate";
import ArtikelStatusBadge from "../../components/ArtikelStatusBadge";
import {
  useArtikelPimpinanAdminList,
  useSetujuiArtikelPimpinan,
  useRevisiArtikelPimpinan,
  useTolakArtikelPimpinan,
} from "../../hooks/useArtikelPimpinan";

const TABS = [
  { value: "diajukan", label: "Perlu Direview" },
  { value: "disetujui", label: "Disetujui" },
  { value: "revisi", label: "Revisi" },
  { value: "ditolak", label: "Ditolak" },
  { value: "", label: "Semua" },
];

function ReviewModal({ artikel, onClose }) {
  const [mode, setMode] = useState(null); // "revisi" | "tolak" | null
  const [catatan, setCatatan] = useState("");

  const setujui = useSetujuiArtikelPimpinan();
  const revisi = useRevisiArtikelPimpinan();
  const tolak = useTolakArtikelPimpinan();

  const isBusy = setujui.isPending || revisi.isPending || tolak.isPending;

  const handleSetujui = () => setujui.mutate(artikel.id, { onSuccess: onClose });

  const handleKonfirmasi = () => {
    if (mode === "revisi") {
      if (!catatan.trim()) return;
      revisi.mutate({ id: artikel.id, catatan }, { onSuccess: onClose });
    } else if (mode === "tolak") {
      tolak.mutate({ id: artikel.id, catatan: catatan || undefined }, { onSuccess: onClose });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-2xl sm:rounded-card rounded-t-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 sticky top-0 bg-white">
          <div>
            <h3 className="font-display font-bold text-neutral-900">{artikel.judul}</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Kiriman {artikel.pimpinan_label} · {formatShort(artikel.diajukan_at ?? artikel.updated_at)}
            </p>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 text-xl leading-none px-2">×</button>
        </div>

        <div className="px-5 py-4">
          {artikel.thumbnail_url && (
            <img src={artikel.thumbnail_url} alt="" className="w-full aspect-video object-cover rounded-lg mb-4 border border-neutral-200" />
          )}
          <div className="prose-ipm text-sm max-w-none" dangerouslySetInnerHTML={{ __html: artikel.konten }} />
        </div>

        <div className="px-5 py-4 border-t border-neutral-100 bg-neutral-50 sticky bottom-0">
          {mode ? (
            <div className="space-y-3">
              <label className="form-label">
                {mode === "revisi" ? "Catatan revisi (wajib diisi)" : "Alasan penolakan (opsional)"}
              </label>
              <textarea
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                rows={4}
                className="input-field"
                placeholder={mode === "revisi" ? "Jelaskan bagian yang perlu diperbaiki…" : "Jelaskan alasan penolakan (opsional)…"}
              />
              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setMode(null)}>Batal</Button>
                <Button
                  onClick={handleKonfirmasi}
                  loading={isBusy}
                  disabled={mode === "revisi" && !catatan.trim()}
                >
                  {mode === "revisi" ? "Kirim Catatan Revisi" : "Tolak Artikel"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap justify-end gap-3">
              <Button variant="ghost" onClick={() => setMode("tolak")} disabled={isBusy}>Tolak</Button>
              <Button variant="outline" onClick={() => setMode("revisi")} disabled={isBusy}>Minta Revisi</Button>
              <Button onClick={handleSetujui} loading={setujui.isPending} disabled={isBusy}>
                Setujui & Publikasikan
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminArtikelPimpinanPage() {
  const [status, setStatus] = useState("diajukan");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  const { data, isLoading } = useArtikelPimpinanAdminList({ page, limit: 10, status: status || undefined });
  const results = data?.data?.results ?? [];
  const meta = data?.data?.meta;

  return (
    <AdminLayout title="Artikel Pimpinan">
      <div className="mb-6">
        <h2 className="font-display font-bold text-neutral-900 text-lg">Review Artikel Pimpinan</h2>
        <p className="text-sm text-neutral-500 mt-1">
          Artikel yang diajukan Pimpinan Daerah/Cabang/Ranting untuk dipublikasikan ke Berita.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => { setStatus(tab.value); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
              status === tab.value
                ? "bg-brand-green-500 text-white"
                : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-card border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-5 py-3">Judul</th>
                <th className="text-left px-5 py-3">Pengirim</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Diajukan</th>
                <th className="text-right px-5 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoading && <SkeletonTableRows rows={5} cols={5} />}
              {!isLoading && results.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    <EmptyState title="Tidak ada artikel" message="Belum ada artikel pada status ini." />
                  </td>
                </tr>
              )}
              {results.map((a) => (
                <tr key={a.id}>
                  <td className="px-5 py-3 font-medium text-neutral-900 max-w-xs truncate">{a.judul}</td>
                  <td className="px-5 py-3 text-neutral-500">{a.pimpinan_label}</td>
                  <td className="px-5 py-3"><ArtikelStatusBadge status={a.status} /></td>
                  <td className="px-5 py-3 text-neutral-400">{formatShort(a.diajukan_at ?? a.updated_at)}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => setSelected(a)}
                      className="text-xs text-brand-blue-500 hover:text-brand-blue-600 font-semibold"
                    >
                      Lihat & Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {meta && meta.total_pages > 1 && (
          <div className="px-5 py-4 border-t border-neutral-100">
            <Pagination meta={meta} onPageChange={setPage} />
          </div>
        )}
      </div>

      {selected && <ReviewModal artikel={selected} onClose={() => setSelected(null)} />}
    </AdminLayout>
  );
}
