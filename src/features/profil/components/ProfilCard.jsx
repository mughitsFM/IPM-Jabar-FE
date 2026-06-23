/**
 * ProfilCard — kartu foto + nama + jabatan anggota kepengurusan.
 */
export default function ProfilCard({ anggota }) {
  const { nama, jabatan_label, foto_url, bidang } = anggota;

  return (
    <div className="bg-white rounded-card border border-neutral-200 overflow-hidden text-center hover:shadow-md transition-shadow duration-200 group">
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
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-brand-green-200 flex items-center justify-center text-brand-green-600 font-display font-bold text-3xl">
              {nama?.charAt(0)?.toUpperCase()}
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-display font-bold text-neutral-900 text-sm leading-snug mb-1 line-clamp-2">
          {nama}
        </h3>
        <p className="text-xs font-semibold text-brand-green-500 mb-0.5">{jabatan_label}</p>
        {bidang && (
          <p className="text-xs text-neutral-400">{bidang}</p>
        )}
      </div>
    </div>
  );
}
