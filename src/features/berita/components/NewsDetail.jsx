import { Link } from "react-router-dom";
import Badge from "@/shared/components/ui/Badge";
import { formatDateTime } from "@/shared/utils/formatDate";
import { KATEGORI_BERITA_LABELS } from "@/shared/constants/statusEnum";

/**
 * NewsDetail — tampilan konten berita lengkap.
 * Konten HTML (dari TipTap/rich-text) di-render via dangerouslySetInnerHTML —
 * sanitasi sudah dilakukan di sisi Django (bleach), aman digunakan.
 */
export default function NewsDetail({ data }) {
  const {
    judul,
    thumbnail_url,
    kategori,
    konten,
    published_at,
    user_nama,
  } = data;

  return (
    <article className="max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <nav className="text-sm text-neutral-500 mb-4 flex items-center gap-2">
        <Link to="/" className="hover:text-brand-green-500">Beranda</Link>
        <span>/</span>
        <Link to="/berita" className="hover:text-brand-green-500">Berita</Link>
        <span>/</span>
        <span className="text-neutral-900 truncate max-w-[200px]">{judul}</span>
      </nav>

      {/* Badge */}
      <div className="mb-3">
        <Badge
          label={KATEGORI_BERITA_LABELS[kategori] ?? kategori}
          colorClass="bg-brand-green-50 text-brand-green-500"
        />
      </div>

      {/* Judul */}
      <h1 className="font-display font-bold text-neutral-900 text-3xl leading-tight mb-4">
        {judul}
      </h1>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-500 mb-6">
        {published_at && (
          <time dateTime={published_at}>{formatDateTime(published_at)}</time>
        )}
        {user_nama && <span>Oleh: <span className="font-semibold text-neutral-700">{user_nama}</span></span>}
      </div>

      {/* Thumbnail */}
      {thumbnail_url && (
        <div className="aspect-video rounded-card overflow-hidden mb-8">
          <img
            src={thumbnail_url}
            alt={judul}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Konten rich-text */}
      <div
        className="prose-ipm"
        dangerouslySetInnerHTML={{ __html: konten }}
      />

      {/* Kembali */}
      <div className="mt-10 pt-6 border-t border-neutral-200">
        <Link
          to="/berita"
          className="inline-flex items-center gap-2 text-brand-green-500 hover:text-brand-green-600 font-semibold text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Daftar Berita
        </Link>
      </div>
    </article>
  );
}
