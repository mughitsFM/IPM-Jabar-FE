// frontend/features/berita/tiptap/YoutubeEmbed.js
import { Node, mergeAttributes } from "@tiptap/core";

/**
 * Node kustom Tiptap: <div data-yt="VIDEO_ID"></div>
 *
 * Kita SENGAJA tidak menyimpan <iframe> mentah ke database — src iframe
 * dikontrol frontend saat render publik (lihat utils/hydrateYoutubeEmbeds.js),
 * bukan dari konten yang disimpan, supaya sanitizer backend tidak perlu
 * mengizinkan iframe/atribut src bebas (risiko XSS). Lihat validasi
 * 'data-yt' di berita/services.py.
 */
const YOUTUBE_ID_RE = /^[A-Za-z0-9_-]{11}$/;

export function extractYoutubeId(input) {
  const trimmed = input.trim();
  if (YOUTUBE_ID_RE.test(trimmed)) return trimmed; // sudah berupa ID langsung
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([A-Za-z0-9_-]{11})/,
    /(?:youtu\.be\/)([A-Za-z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const m = trimmed.match(re);
    if (m) return m[1];
  }
  return null;
}

const YoutubeEmbed = Node.create({
  name: "youtubeEmbed",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return { videoId: { default: null } };
  },

  parseHTML() {
    return [{ tag: "div[data-yt]", getAttrs: (el) => ({ videoId: el.getAttribute("data-yt") }) }];
  },

  renderHTML({ node }) {
    return ["div", mergeAttributes({ "data-yt": node.attrs.videoId })];
  },

  addNodeView() {
    return ({ node, editor, getPos }) => {
      const wrapper = document.createElement("div");
      wrapper.className = "berita-yt-wrapper";
      wrapper.contentEditable = "false";

      const thumb = document.createElement("img");
      thumb.src = `https://img.youtube.com/vi/${node.attrs.videoId}/hqdefault.jpg`;
      thumb.alt = "Pratinjau video YouTube";
      thumb.className = "berita-yt-thumb";
      wrapper.appendChild(thumb);

      const playIcon = document.createElement("div");
      playIcon.className = "berita-yt-play";
      playIcon.textContent = "▶";
      wrapper.appendChild(playIcon);

      if (editor.isEditable) {
        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.textContent = "Hapus video";
        removeBtn.className = "berita-yt-remove";
        removeBtn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (typeof getPos === "function") {
            editor.chain().focus().deleteRange({ from: getPos(), to: getPos() + node.nodeSize }).run();
          }
        });
        wrapper.appendChild(removeBtn);
      }

      return { dom: wrapper };
    };
  },
});

export default YoutubeEmbed;