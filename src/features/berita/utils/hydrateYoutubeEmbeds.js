/**
 * Ubah semua <div data-yt="VIDEO_ID"></div> di dalam sebuah container DOM
 * menjadi <iframe> YouTube sungguhan. Dipanggil di halaman publik SETELAH
 * konten berita (field `konten`, sudah lolos sanitize_html backend)
 * di-render via dangerouslySetInnerHTML.
 *
 * Cara pakai di halaman detail berita publik (contoh, sesuaikan nama file):
 *   const contentRef = useRef(null);
 *   useEffect(() => { hydrateYoutubeEmbeds(contentRef.current); }, [berita.konten]);
 *   <div ref={contentRef} className="prose-ipm" dangerouslySetInnerHTML={{ __html: berita.konten }} />
 */
export function hydrateYoutubeEmbeds(container) {
  if (!container) return;
  const nodes = container.querySelectorAll("div[data-yt]");
  nodes.forEach((node) => {
    const videoId = node.getAttribute("data-yt");
    if (!/^[A-Za-z0-9_-]{11}$/.test(videoId)) return; // jaga-jaga, walau backend sudah validasi

    const wrapper = document.createElement("div");
    wrapper.className = "berita-yt-wrapper berita-yt-wrapper--public";

    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}`;
    iframe.title = "Video YouTube";
    iframe.frameBorder = "0";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    iframe.loading = "lazy";

    wrapper.appendChild(iframe);
    node.replaceWith(wrapper);
  });
}