/**
 * FilterTanggalArsip — filter rentang tanggal + tipe (Masuk/Keluar/Semua)
 * untuk sub-panel Arsip Surat.
 *
 * @param {object} filters              - { tanggalMulai, tanggalAkhir, tipe }
 * @param {function} onChange           - (patch: Partial<filters>) => void
 */
export default function FilterTanggalArsip({ filters, onChange }) {
  const { tanggalMulai, tanggalAkhir, tipe } = filters;

  const handleReset = () => {
    onChange({ tanggalMulai: "", tanggalAkhir: "", tipe: "semua" });
  };

  const isFilterAktif = tanggalMulai || tanggalAkhir || tipe !== "semua";

  return (
    <div className="bg-white border border-neutral-200 rounded-card p-4 mb-4">
      <div className="flex flex-col sm:flex-row sm:items-end gap-3">
        <div className="flex-1 min-w-0">
          <label htmlFor="tanggal-mulai" className="form-label">
            Dari tanggal
          </label>
          <input
            id="tanggal-mulai"
            type="date"
            className="input-field"
            value={tanggalMulai || ""}
            max={tanggalAkhir || undefined}
            onChange={(e) => onChange({ tanggalMulai: e.target.value })}
          />
        </div>

        <div className="flex-1 min-w-0">
          <label htmlFor="tanggal-akhir" className="form-label">
            Sampai tanggal
          </label>
          <input
            id="tanggal-akhir"
            type="date"
            className="input-field"
            value={tanggalAkhir || ""}
            min={tanggalMulai || undefined}
            onChange={(e) => onChange({ tanggalAkhir: e.target.value })}
          />
        </div>

        <div className="flex-1 min-w-0">
          <label htmlFor="tipe-surat" className="form-label">
            Tipe
          </label>
          <select
            id="tipe-surat"
            className="input-field"
            value={tipe}
            onChange={(e) => onChange({ tipe: e.target.value })}
          >
            <option value="semua">Semua</option>
            <option value="masuk">Surat Masuk</option>
            <option value="keluar">Surat Keluar</option>
          </select>
        </div>

        {isFilterAktif && (
          <button
            type="button"
            onClick={handleReset}
            className="text-sm font-semibold text-neutral-500 hover:text-neutral-700 min-h-[44px] px-2 shrink-0 self-end sm:self-center"
          >
            Reset filter
          </button>
        )}
      </div>
    </div>
  );
}