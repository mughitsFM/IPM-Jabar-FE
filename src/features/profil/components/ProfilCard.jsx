import Badge from "@/shared/components/ui/Badge";

/**
 * ProfilCard — kartu foto + nama + jabatan anggota kepengurusan.
 */
export default function ProfilCard({ anggota }) {
  const { nama, jabatan_label, foto_url, bidang } = anggota;

  return (
    <div className="bg-white rounded-card border border-neutral-200 overflow-hidden text-center hover:shadow-lg hover:-translate-y-1 hover:border-brand-green-200 transition-all duration-200 group">
      {/* Foto */}
      <div className="relative aspect-square bg-brand-green-50 overflow-hidden">
        {foto_url ? (
          <img
            src={foto_url}
            alt={nama}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-green-400 to-brand-green-600">
            <span className="text-white font-display font-bold text-3xl">
              {nama?.charAt(0)?.toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-display font-bold text-neutral-900 text-sm leading-snug mb-1 line-clamp-2">
          {nama}
        </h3>
        <p className="text-xs font-semibold text-brand-green-500 mb-1.5">{jabatan_label}</p>
        {bidang && (
          <Badge label={bidang} colorClass="bg-neutral-100 text-neutral-500" />
        )}
      </div>
    </div>
  );
}