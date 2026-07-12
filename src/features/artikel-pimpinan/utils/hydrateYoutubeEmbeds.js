// Duplikasi dari features/berita/utils/hydrateYoutubeEmbeds.js — dipakai
// juga oleh ReviewModal Admin supaya Wilayah bisa preview video sebelum approve.
export function hydrateYoutubeEmbeds(container) {
  if (!container) return;
  const nodes = container.querySelectorAll("div[data-yt]");
  nodes.forEach((node) => {
    const videoId = node.getAttribute("data-yt");
    if (!/^[A-Za-z0-9_-]{11}$/.test(videoId)) return;

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