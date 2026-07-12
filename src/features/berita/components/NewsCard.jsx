import { Link } from "react-router-dom";
import Badge from "@/shared/components/ui/Badge";
import { formatShort } from "@/shared/utils/formatDate";
import { KATEGORI_BERITA_LABELS, STATUS_BERITA_COLORS } from "@/shared/constants/statusEnum";

/**
 * NewsCard — kartu preview berita untuk halaman daftar & beranda.
 * Thumbnail rasio 16:9, badge kategori mengambang di atas gambar, judul (2 baris), tanggal.
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
    <article className="card group flex flex-col h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
      {/* Thumbnail */}
      <Link to={`/berita/${slug}`} tabIndex={-1} aria-hidden="true">
        <div className="relative aspect-video bg-neutral-100 overflow-hidden">
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
          {/* Badge kategori mengambang di atas gambar */}
          <div className="absolute top-3 left-3">
            <Badge
              label={kategoriLabel}
              colorClass="bg-white/90 backdrop-blur-sm text-brand-green-600 shadow-sm"
            />
          </div>
        </div>
      </Link>

      {/* Konten */}
      <div className="p-4 flex flex-col flex-1 gap-2">
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
          <p className="inline-flex items-center gap-1.5 text-xs text-neutral-400 mt-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            {formatShort(published_at)}
          </p>
        )}
      </div>
    </article>
  );
}