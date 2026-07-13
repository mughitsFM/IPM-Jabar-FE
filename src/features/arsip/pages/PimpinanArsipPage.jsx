import { useMemo, useState } from "react";
import PimpinanLayout from "@/shared/components/layout/PimpinanLayout";
import Button from "@/shared/components/ui/Button";
import FilterTanggalArsip from "../components/FilterTanggalArsip";
import ArsipSuratTable from "../components/ArsipSuratTable";
import ArsipArtikelList from "../components/ArsipArtikelList";
import { arsipService } from "../services/arsipService";
// Hook surat yang SUDAH ADA (file 06) — dipakai ulang, tidak ada endpoint
// list baru khusus arsip (lihat 07-arsip-dan-rekap.md §3).
import { useSuratMasuk, useSuratKeluar } from "@/features/surat-menyurat/hooks/useSurat";

const PAGE_SIZE = 10;
// [ASUMSI] Limit pengambilan mentah cukup besar supaya seluruh riwayat ikut
// difilter tanggal secara client-side (sama semangatnya dengan
// ArsipService.kumpulkan_surat yang menarik limit=10_000 di backend).
const RAW_LIMIT = 1000;

function keAwalHari(tanggalStr) {
  if (!tanggalStr) return null;
  const d = new Date(`${tanggalStr}T00:00:00`);
  return d;
}
function keAkhirHari(tanggalStr) {
  if (!tanggalStr) return null;
  const d = new Date(`${tanggalStr}T23:59:59.999`);
  return d;
}

export default function PimpinanArsipPage() {
  const [tabUtama, setTabUtama] = useState("surat"); // "surat" | "artikel"
  const [filters, setFilters] = useState({ tanggalMulai: "", tanggalAkhir: "", tipe: "semua" });
  const [page, setPage] = useState(1);
  const [unduhState, setUnduhState] = useState({ zip: false, excel: false });
  const [unduhError, setUnduhError] = useState(null);

  const butuhMasuk = filters.tipe === "masuk" || filters.tipe === "semua";
  const butuhKeluar = filters.tipe === "keluar" || filters.tipe === "semua";

  const masuk = useSuratMasuk({ page: 1, limit: RAW_LIMIT });
  const keluar = useSuratKeluar({ page: 1, limit: RAW_LIMIT });

  const isLoading = (butuhMasuk && masuk.isLoading) || (butuhKeluar && keluar.isLoading);

  const gabungan = useMemo(() => {
    const mulai = keAwalHari(filters.tanggalMulai);
    const akhir = keAkhirHari(filters.tanggalAkhir);

    let hasil = [];
    if (butuhMasuk) {
      hasil = hasil.concat(
        (masuk.data?.data?.results ?? []).map((s) => ({ ...s, _arah: "masuk" }))
      );
    }
    if (butuhKeluar) {
      hasil = hasil.concat(
        (keluar.data?.data?.results ?? []).map((s) => ({ ...s, _arah: "keluar" }))
      );
    }

    if (mulai) hasil = hasil.filter((s) => new Date(s.created_at) >= mulai);
    if (akhir) hasil = hasil.filter((s) => new Date(s.created_at) <= akhir);

    return hasil.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [masuk.data, keluar.data, butuhMasuk, butuhKeluar, filters.tanggalMulai, filters.tanggalAkhir]);

  const totalItems = gabungan.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const halamanAktif = Math.min(page, totalPages);
  const hasilTerpotong = gabungan.slice((halamanAktif - 1) * PAGE_SIZE, halamanAktif * PAGE_SIZE);
  const meta = { page: halamanAktif, total_pages: totalPages, total_count: totalItems, per_page: PAGE_SIZE };

  const handleFilterChange = (patch) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(1);
  };

  const paramsUnduh = {
    tipe: filters.tipe,
    ...(filters.tanggalMulai ? { tanggal_mulai: filters.tanggalMulai } : {}),
    ...(filters.tanggalAkhir ? { tanggal_akhir: filters.tanggalAkhir } : {}),
  };

  const handleUnduh = async (jenis) => {
    setUnduhError(null);
    setUnduhState((s) => ({ ...s, [jenis]: true }));
    try {
      if (jenis === "zip") await arsipService.unduhZipSurat(paramsUnduh);
      else await arsipService.unduhRekapExcel(paramsUnduh);
    } catch (err) {
      setUnduhError(err.message);
    } finally {
      setUnduhState((s) => ({ ...s, [jenis]: false }));
    }
  };

  return (
    <PimpinanLayout title="Arsip">
      <div className="mb-6">
        {/* <h2 className="font-display font-bold text-neutral-900 text-lg sm:text-xl">Arsip</h2> */}
        <p className="text-sm text-neutral-500 mt-1">
          Riwayat surat dan artikel yang pernah dikirim/diajukan oleh Pimpinan Anda.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        <button
          onClick={() => setTabUtama("surat")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors min-h-[44px] ${
            tabUtama === "surat" ? "bg-brand-green-500 text-white" : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
          }`}
        >
          Arsip Surat
        </button>
        <button
          onClick={() => setTabUtama("artikel")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors min-h-[44px] ${
            tabUtama === "artikel" ? "bg-brand-green-500 text-white" : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
          }`}
        >
          Arsip Artikel
        </button>
      </div>

      {tabUtama === "surat" ? (
        <>
          <FilterTanggalArsip filters={filters} onChange={handleFilterChange} />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <p className="text-sm text-neutral-500">
              {totalItems} surat ditemukan{filters.tipe !== "semua" ? ` (${filters.tipe})` : ""}.
            </p>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                loading={unduhState.zip}
                onClick={() => handleUnduh("zip")}
                className="flex-1 sm:flex-none"
              >
                Unduh Semua (ZIP)
              </Button>
              <Button
                loading={unduhState.excel}
                onClick={() => handleUnduh("excel")}
                className="flex-1 sm:flex-none"
              >
                Unduh Rekap Excel
              </Button>
            </div>
          </div>

          {unduhError && (
            <p className="form-error mb-4" role="alert">{unduhError}</p>
          )}

          <ArsipSuratTable
            results={hasilTerpotong}
            meta={meta}
            isLoading={isLoading}
            onPageChange={setPage}
            showArah={filters.tipe === "semua"}
          />
        </>
      ) : (
        <ArsipArtikelList />
      )}
    </PimpinanLayout>
  );
}