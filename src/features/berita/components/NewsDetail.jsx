import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Badge from "@/shared/components/ui/Badge";
import { formatDateTime } from "@/shared/utils/formatDate";
import { KATEGORI_BERITA_LABELS } from "@/shared/constants/statusEnum";
import { hydrateYoutubeEmbeds } from "../utils/hydrateYoutubeEmbeds";

/**
 * NewsDetail — tampilan konten berita lengkap.
 *
 * Konten HTML (dari TipTap/rich-text) di-render via dangerouslySetInnerHTML —
 * sanitasi sudah dilakukan di sisi Django (bleach), aman digunakan.
 *
 * Setelah konten ter-render, hydrateYoutubeEmbeds() mengubah placeholder
 * <div data-yt="VIDEO_ID"> (hasil sisip video di NewsForm admin) menjadi
 * <iframe> YouTube sungguhan. Video TIDAK disimpan sebagai iframe mentah
 * di database — lihat berita/services.py sanitize_html() untuk alasannya
 * (mencegah src iframe sembarangan lolos sanitizer / risiko XSS).
 */
export default function NewsDetail({ data }) {
  const {
    judul,
    thumbnail_url,
    kategori,
    konten,
    tags,
    published_at,
    user_nama,
    baca_juga_items,
  } = data;

  const contentRef = useRef(null);

  useEffect(() => {
    hydrateYoutubeEmbeds(contentRef.current);
  }, [konten]);

  const hasExtras = (tags?.length > 0) || (baca_juga_items?.length > 0);

  return (
    <article className="max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <nav className="text-sm text-neutral-500 mb-4 flex items-center gap-2">
        <Link to="/" className="hover:text-brand-green-500 transition-colors">Beranda</Link>
        <span className="text-neutral-300">/</span>
        <Link to="/berita" className="hover:text-brand-green-500 transition-colors">Berita</Link>
        <span className="text-neutral-300">/</span>
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
      <h1 className="font-display font-bold text-neutral-900 text-3xl leading-tight tracking-tight mb-4">
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
        <div className="aspect-video rounded-card overflow-hidden shadow-sm mb-8">
          <img
            src={thumbnail_url}
            alt={judul}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Konten rich-text (gambar bersisip + video YouTube ter-hidrasi) */}
      <div
        ref={contentRef}
        className="prose-ipm"
        dangerouslySetInnerHTML={{ __html: konten }}
      />

      {/* Tag & Baca Juga */}
      {hasExtras && (
        <div className="mt-8 pt-6 border-t border-neutral-200 space-y-8">
          {tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="text-xs font-medium text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {baca_juga_items?.length > 0 && (
            <div>
              <h2 className="font-display font-bold text-neutral-900 text-lg mb-4">Baca Juga</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {baca_juga_items.map((item) => (
                  <Link
                    key={item.id}
                    to={`/berita/${item.slug}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50 hover:shadow-sm transition-all duration-200 group"
                  >
                    <div className="w-20 h-14 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                      {item.thumbnail_url ? (
                        <img src={item.thumbnail_url} alt={item.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                      ) : (
                        <div className="w-full h-full bg-brand-green-50" />
                      )}
                    </div>
                    <p className="text-sm font-semibold text-neutral-800 line-clamp-2 group-hover:text-brand-green-500 transition-colors">
                      {item.judul}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Kembali */}
      <div className="mt-10 pt-6 border-t border-neutral-200">
        <Link
          to="/berita"
          className="group inline-flex items-center gap-2 text-brand-green-500 hover:text-brand-green-600 font-semibold text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Daftar Berita
        </Link>
      </div>
    </article>
  );
}