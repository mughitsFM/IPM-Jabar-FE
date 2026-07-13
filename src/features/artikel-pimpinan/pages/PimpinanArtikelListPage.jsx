{/* frontend/features/artikel-pimpinan/pages/PimpinanArtikelListPage.jsx (lengkap) */}
import { useState } from "react";
import { Link } from "react-router-dom";
import PimpinanLayout from "@/shared/components/layout/PimpinanLayout";
import Button from "@/shared/components/ui/Button";
import EmptyState from "@/shared/components/ui/EmptyState";
import Pagination from "@/shared/components/ui/Pagination";
import { SkeletonTableRows, SkeletonLine } from "@/shared/components/ui/Skeleton";
import { formatShort } from "@/shared/utils/formatDate";
import ArtikelStatusBadge from "../components/ArtikelStatusBadge";
import {
  useArtikelPimpinanList,
  useAjukanArtikelPimpinan,
  useTarikArtikelPimpinan,
  useDeleteArtikelPimpinan,
} from "../hooks/useArtikelPimpinan";

const TABS = [
  { value: "", label: "Semua" },
  { value: "draft", label: "Draft" },
  { value: "diajukan", label: "Diajukan" },
  { value: "revisi", label: "Perlu Revisi" },
  { value: "ditolak", label: "Ditolak" },
  { value: "disetujui", label: "Disetujui" },
];

export default function PimpinanArtikelListPage() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useArtikelPimpinanList({ page, limit: 10, status: status || undefined });
  const ajukan = useAjukanArtikelPimpinan();
  const tarik = useTarikArtikelPimpinan();
  const hapus = useDeleteArtikelPimpinan();

  const results = data?.data?.results ?? [];
  const meta = data?.data?.meta;

  const aksiHandlers = { ajukan, tarik, hapus };

  return (
    <PimpinanLayout title="Artikel & Berita">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          {/* <h2 className="font-display font-bold text-neutral-900 text-lg sm:text-xl">Artikel Saya</h2> */}
          <p className="text-sm text-neutral-500 mt-1">
            Ajukan artikel kegiatan atau informasi untuk direview & dipublikasikan Wilayah.
          </p>
        </div>
        <Link to="/pimpinan/artikel/baru" className="shrink-0">
          <Button className="w-full sm:w-auto">+ Tulis Artikel</Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => { setStatus(tab.value); setPage(1); }}
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors min-h-[44px] ${
              status === tab.value
                ? "bg-brand-green-500 text-white"
                : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {!isLoading && results.length === 0 && (
        <div className="bg-white rounded-card border border-neutral-200">
          <EmptyState title="Belum ada artikel" message="Mulai tulis artikel pertama Anda." />
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
                  <th className="text-left px-5 py-3">Kategori</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-left px-5 py-3">Terakhir Diubah</th>
                  <th className="text-right px-5 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {isLoading && <SkeletonTableRows rows={5} cols={5} />}
                {results.map((a) => (
                  <tr key={a.id}>
                    <td className="px-5 py-3 max-w-xs">
                      <p className="font-medium text-neutral-900 truncate">{a.judul}</p>
                      {["revisi", "ditolak"].includes(a.status) && a.catatan_revisi && (
                        <p className="text-xs text-neutral-400 truncate mt-0.5" title={a.catatan_revisi}>
                          Catatan: {a.catatan_revisi}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3 text-neutral-500 capitalize">{a.kategori?.replace("_", " ")}</td>
                    <td className="px-5 py-3"><ArtikelStatusBadge status={a.status} /></td>
                    <td className="px-5 py-3 text-neutral-400 whitespace-nowrap">{formatShort(a.updated_at)}</td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-3 flex-wrap">
                        <AksiArtikel artikel={a} {...aksiHandlers} />
                      </div>
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
              <div key={a.id} className="p-4">
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <p className="text-sm font-medium text-neutral-900 min-w-0">{a.judul}</p>
                  <ArtikelStatusBadge status={a.status} className="shrink-0" />
                </div>
                {["revisi", "ditolak"].includes(a.status) && a.catatan_revisi && (
                  <p className="text-xs text-neutral-400 line-clamp-2 mb-1">Catatan: {a.catatan_revisi}</p>
                )}
                <p className="text-xs text-neutral-500 capitalize">
                  {a.kategori?.replace("_", " ")} · {formatShort(a.updated_at)}
                </p>
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-neutral-100 flex-wrap">
                  <AksiArtikel artikel={a} {...aksiHandlers} />
                </div>
              </div>
            ))}
          </div>

          {meta && meta.total_pages > 1 && (
            <div className="px-5 py-4 border-t border-neutral-100">
              <Pagination meta={meta} onPageChange={setPage} />
            </div>
          )}
        </div>
      )}
    </PimpinanLayout>
  );
}

/** Tombol aksi per baris/kartu — sama untuk versi tabel & kartu, diekstrak
 * supaya logika status tidak dobel-tulis. */
function AksiArtikel({ artikel: a, ajukan, tarik, hapus }) {
  return (
    <>
      {["draft", "revisi", "ditolak"].includes(a.status) && (
        <>
          <Link to={`/pimpinan/artikel/${a.id}`} className="text-xs text-brand-blue-500 hover:text-brand-blue-600 font-semibold">
            {["revisi", "ditolak"].includes(a.status) ? "Perbaiki" : "Edit"}
          </Link>
          {a.status === "draft" && (
            <button
              onClick={() => ajukan.mutate(a.id)}
              disabled={ajukan.isPending}
              className="text-xs text-brand-green-500 hover:text-brand-green-600 font-semibold"
            >
              Ajukan
            </button>
          )}
        </>
      )}
      {a.status === "draft" && (
        <button
          onClick={() => { if (confirm("Hapus draft ini?")) hapus.mutate(a.id); }}
          className="text-xs text-state-error hover:opacity-75 font-semibold"
        >
          Hapus
        </button>
      )}
      {a.status === "diajukan" && (
        <button
          onClick={() => { if (confirm("Tarik kembali pengajuan ini?")) tarik.mutate(a.id); }}
          className="text-xs text-neutral-500 hover:text-neutral-700 font-semibold"
        >
          Tarik
        </button>
      )}
      {a.status === "disetujui" && (
        <span className="text-xs text-neutral-400 italic">Sudah dipublikasikan</span>
      )}
    </>
  );
}