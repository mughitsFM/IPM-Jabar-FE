{/* frontend/features/artikel-pimpinan/pages/admin/AdminArtikelPimpinanPage.jsx (lengkap) */}
import { useEffect, useRef, useState } from "react";
import { hydrateYoutubeEmbeds } from "../../utils/hydrateYoutubeEmbeds";
import AdminLayout from "@/shared/components/layout/AdminLayout";
import Button from "@/shared/components/ui/Button";
import EmptyState from "@/shared/components/ui/EmptyState";
import Pagination from "@/shared/components/ui/Pagination";
import BottomSheetModal from "@/shared/components/ui/BottomSheetModal";
import { SkeletonTableRows, SkeletonLine } from "@/shared/components/ui/Skeleton";
import { formatShort } from "@/shared/utils/formatDate";
import { useTandaiNotifikasiEntitas } from "@/features/notifikasi/hooks/useNotifikasi";
import ArtikelStatusBadge from "../../components/ArtikelStatusBadge";

import {
  useArtikelPimpinanAdminList,
  useSetujuiArtikelPimpinan,
  useRevisiArtikelPimpinan,
  useTolakArtikelPimpinan,
  useNonaktifkanArtikelPimpinan,
  useAktifkanArtikelPimpinan,
} from "../../hooks/useArtikelPimpinan";

const TABS = [
  { value: "diajukan", label: "Perlu Direview" },
  { value: "disetujui", label: "Disetujui" },
  { value: "revisi", label: "Revisi" },
  { value: "ditolak", label: "Ditolak" },
  { value: "", label: "Semua" },
];

function ReviewModal({ artikel, onClose }) {
  const [mode, setMode] = useState(null);
  const [catatan, setCatatan] = useState("");
  const contentRef = useRef(null);
  const tandaiNotif = useTandaiNotifikasiEntitas();

  useEffect(() => {
    hydrateYoutubeEmbeds(contentRef.current);
  }, [artikel.konten]);

  // Modal ini dibuka lewat klik "Lihat & Review" di list TANPA fetch detail
  // terpisah (data sudah ada dari list) — jadi ini titik yang tepat untuk
  // tandai notifikasi "artikel_diajukan" terbaca, supaya badge lonceng ikut
  // update walau admin tidak pernah buka dropdown notifikasi.
  useEffect(() => {
    if (artikel?.id) {
      tandaiNotif.mutate([{ tipe: "artikel_diajukan", entity_id: artikel.id }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artikel?.id]);

  const setujui = useSetujuiArtikelPimpinan();
  const revisi = useRevisiArtikelPimpinan();
  const tolak = useTolakArtikelPimpinan();
  const nonaktifkan = useNonaktifkanArtikelPimpinan();
  const aktifkan = useAktifkanArtikelPimpinan();

  const isBusy =
    setujui.isPending || revisi.isPending || tolak.isPending ||
    nonaktifkan.isPending || aktifkan.isPending;

  // Poin 2 & 3: admin masih bisa merevisi/menolak/menonaktifkan artikel yang
  // SUDAH dipublikasikan (status 'disetujui'), tidak cuma yang masih
  // 'diajukan' seperti sebelumnya — tombol digating berdasarkan status ini
  // supaya tidak menampilkan aksi yang pasti ditolak backend (400).
  const bisaDireview = artikel.status === "diajukan";
  const sudahTayang = artikel.status === "disetujui";
  const publikasiAktif = artikel.berita_status !== "dinonaktifkan";

  const handleSetujui = () => setujui.mutate(artikel.id, { onSuccess: onClose });

  const handleKonfirmasi = () => {
    if (mode === "revisi") {
      if (!catatan.trim()) return;
      revisi.mutate({ id: artikel.id, catatan }, { onSuccess: onClose });
    } else if (mode === "tolak") {
      tolak.mutate({ id: artikel.id, catatan: catatan || undefined }, { onSuccess: onClose });
    }
  };

  const handleNonaktifkan = () => {
    if (confirm("Nonaktifkan publikasi artikel ini dari halaman Berita publik?")) {
      nonaktifkan.mutate(artikel.id, { onSuccess: onClose });
    }
  };

  const handleAktifkan = () => aktifkan.mutate(artikel.id, { onSuccess: onClose });

  return (
    <BottomSheetModal
      open={!!artikel}
      onClose={onClose}
      title={artikel.judul}
      subtitle={`Kiriman ${artikel.pimpinan_label} · ${formatShort(artikel.diajukan_at ?? artikel.updated_at)}`}
      maxWidth="sm:max-w-2xl"
      footer={
        mode ? (
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
            <div className="flex flex-wrap justify-end gap-3">
              <Button variant="ghost" onClick={() => setMode(null)} disabled={isBusy}>Batal</Button>
              <Button
                onClick={handleKonfirmasi}
                loading={isBusy}
                disabled={mode === "revisi" && !catatan.trim()}
              >
                {mode === "revisi" ? "Kirim Catatan Revisi" : "Tolak Artikel"}
              </Button>
            </div>
          </div>
        ) : bisaDireview ? (
          <div className="flex flex-wrap justify-end gap-3">
            <Button variant="ghost" onClick={() => setMode("tolak")} disabled={isBusy}>Tolak</Button>
            <Button variant="outline" onClick={() => setMode("revisi")} disabled={isBusy}>Minta Revisi</Button>
            <Button onClick={handleSetujui} loading={setujui.isPending} disabled={isBusy}>
              Setujui & Publikasikan
            </Button>
          </div>
        ) : sudahTayang ? (
          <div className="flex flex-wrap justify-end gap-3">
            <Button variant="outline" onClick={() => setMode("revisi")} disabled={isBusy}>
              Minta Revisi
            </Button>
            {publikasiAktif ? (
              <Button
                variant="ghost"
                className="text-state-error"
                onClick={handleNonaktifkan}
                loading={nonaktifkan.isPending}
                disabled={isBusy}
              >
                Nonaktifkan Publikasi
              </Button>
            ) : (
              <Button onClick={handleAktifkan} loading={aktifkan.isPending} disabled={isBusy}>
                Aktifkan Kembali
              </Button>
            )}
          </div>
        ) : null
      }
    >
      {sudahTayang && !publikasiAktif && (
        <div className="rounded-card border border-state-error/30 bg-state-error/10 text-state-error px-4 py-3 mb-4 text-sm font-semibold">
          Publikasi artikel ini sedang dinonaktifkan — tidak tampil di halaman Berita publik.
        </div>
      )}
      {artikel.thumbnail_url && (
        <img src={artikel.thumbnail_url} alt="" className="w-full aspect-video object-cover rounded-lg mb-4 border border-neutral-200" />
      )}
      {artikel.ringkasan && (
        <p className="text-sm text-neutral-600 italic mb-4 pb-4 border-b border-neutral-100">{artikel.ringkasan}</p>
      )}
      <div ref={contentRef} className="prose-ipm text-sm max-w-none" dangerouslySetInnerHTML={{ __html: artikel.konten }} />
      {artikel.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-neutral-100">
          {artikel.tags.map((tag) => (
            <span key={tag} className="text-xs font-medium text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full">#{tag}</span>
          ))}
        </div>
      )}
    </BottomSheetModal>
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
    <AdminLayout title="Review Artikel Pimpinan">
      <div className="mb-6">
        <p className="text-sm text-neutral-500 mt-1">
          Artikel yang diajukan Pimpinan Daerah/Cabang/Ranting untuk dipublikasikan ke Berita.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => { setStatus(tab.value); setPage(1); }}
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors min-h-[44px] ${
              status === tab.value
                ? "bg-brand-blue-500 text-white"
                : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {!isLoading && results.length === 0 && (
        <div className="bg-white rounded-card border border-neutral-200">
          <EmptyState title="Tidak ada artikel" message="Belum ada artikel pada status ini." />
        </div>
      )}

      {(isLoading || results.length > 0) && (
        <div className="bg-white rounded-card border border-neutral-200 overflow-hidden">
          {/* ===== Tabel — desktop (md ke atas) ===== */}
          <div className="hidden md:block overflow-x-auto">
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
                {results.map((a) => (
                  <tr key={a.id}>
                    <td className="px-5 py-3 font-medium text-neutral-900 max-w-xs truncate">{a.judul}</td>
                    <td className="px-5 py-3 text-neutral-500">{a.pimpinan_label}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <ArtikelStatusBadge status={a.status} />
                        {a.status === "disetujui" && a.berita_status === "dinonaktifkan" && (
                          <span className="text-xs text-state-error font-semibold">(nonaktif)</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-neutral-400 whitespace-nowrap">{formatShort(a.diajukan_at ?? a.updated_at)}</td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => setSelected(a)}
                        className="text-xs text-brand-blue-500 hover:text-brand-blue-600 font-semibold px-2 py-1 rounded hover:bg-brand-blue-500/10 transition-colors"
                      >
                        Lihat & Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ===== Kartu — mobile & tablet kecil (di bawah md) ===== */}
          <div className="md:hidden divide-y divide-neutral-100">
            {isLoading && Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 space-y-2">
                <SkeletonLine className="w-2/3" />
                <SkeletonLine className="w-1/3" />
              </div>
            ))}
            {results.map((a) => (
              <button
                key={a.id}
                onClick={() => setSelected(a)}
                className="w-full text-left p-4 transition-colors active:bg-neutral-50"
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <p className="text-sm font-medium text-neutral-900 min-w-0">{a.judul}</p>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <ArtikelStatusBadge status={a.status} />
                    {a.status === "disetujui" && a.berita_status === "dinonaktifkan" && (
                      <span className="text-xs text-state-error font-semibold">(nonaktif)</span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-neutral-500">
                  {a.pimpinan_label} · {formatShort(a.diajukan_at ?? a.updated_at)}
                </p>
                <p className="text-xs text-brand-blue-500 font-semibold mt-2">Lihat & Review →</p>
              </button>
            ))}
          </div>

          {meta && meta.total_pages > 1 && (
            <div className="px-5 py-4 border-t border-neutral-100">
              <Pagination meta={meta} onPageChange={setPage} />
            </div>
          )}
        </div>
      )}

      {selected && <ReviewModal artikel={selected} onClose={() => setSelected(null)} />}
    </AdminLayout>
  );
}