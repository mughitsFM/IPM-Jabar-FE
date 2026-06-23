import { Link } from "react-router-dom";
import Badge from "@/shared/components/ui/Badge";
import { formatShort } from "@/shared/utils/formatDate";
import { KATEGORI_BERITA_LABELS, STATUS_BERITA_COLORS } from "@/shared/constants/statusEnum";

/**
 * NewsCard — kartu preview berita untuk halaman daftar & beranda.
 * Thumbnail rasio 16:9, badge kategori, judul (2 baris), tanggal.
 */
export default function NewsCard({ data }) {
  const {
    slug,
    judul,
    thumbnail_url,
    kategori,
    published_at,
    ringkasan,
  } = data;

  const kategoriLabel = KATEGORI_BERITA_LABELS[kategori] ?? kategori;

  return (
    <article className="card group flex flex-col h-full hover:shadow-md transition-shadow duration-200">
      {/* Thumbnail */}
      <Link to={`/berita/${slug}`} tabIndex={-1} aria-hidden="true">
        <div className="aspect-video bg-neutral-100 overflow-hidden">
          {thumbnail_url ? (
            <img
              src={thumbnail_url}
              alt={judul}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-brand-green-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-brand-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
      </Link>

      {/* Konten */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        {/* Badge kategori */}
        <Badge
          label={kategoriLabel}
          colorClass="bg-brand-green-50 text-brand-green-500"
        />

        {/* Judul */}
        <h3 className="font-display font-bold text-neutral-900 text-base leading-snug line-clamp-2">
          <Link
            to={`/berita/${slug}`}
            className="hover:text-brand-green-500 transition-colors focus-visible:text-brand-green-500"
          >
            {judul}
          </Link>
        </h3>

        {/* Ringkasan */}
        {ringkasan && (
          <p className="text-sm text-neutral-600 line-clamp-2 flex-1">{ringkasan}</p>
        )}

        {/* Tanggal */}
        {published_at && (
          <p className="text-xs text-neutral-400 mt-auto">
            {formatShort(published_at)}
          </p>
        )}
      </div>
    </article>
  );
}
