// frontend/features/artikel-pimpinan/tiptap/FigureImage.js
import { Node, mergeAttributes } from "@tiptap/core";

/**
 * Node kustom Tiptap: <figure><img /><figcaption>...</figcaption></figure>
 * Duplikasi dari features/berita/tiptap/FigureImage.js — lihat catatan
 * stopEvent di file tersebut untuk penjelasan lengkap fix bug "gambar
 * hilang saat isi keterangan".
 */
const FigureImage = Node.create({
  name: "figureImage",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: "" },
      caption: { default: "" },
    };
  },

  parseHTML() {
    return [
      {
        tag: "figure",
        getAttrs: (el) => {
          const img = el.querySelector("img");
          const figcaption = el.querySelector("figcaption");
          if (!img) return false;
          return {
            src: img.getAttribute("src"),
            alt: img.getAttribute("alt") || "",
            caption: figcaption?.textContent || "",
          };
        },
      },
    ];
  },

  renderHTML({ node }) {
    return [
      "figure",
      {},
      ["img", mergeAttributes({ src: node.attrs.src, alt: node.attrs.alt })],
      ["figcaption", {}, node.attrs.caption || ""],
    ];
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      const figure = document.createElement("figure");
      figure.className = "berita-figure";

      const img = document.createElement("img");
      img.src = node.attrs.src;
      img.alt = node.attrs.alt || "";
      figure.appendChild(img);

      const figcaption = document.createElement("figcaption");
      figcaption.textContent = node.attrs.caption || "";
      figcaption.contentEditable = editor.isEditable ? "true" : "false";
      figcaption.dataset.placeholder = "Tulis keterangan gambar (opsional)…";
      figcaption.className = "berita-figcaption";
      figure.appendChild(figcaption);

      figcaption.addEventListener("input", () => {
        if (typeof getPos !== "function") return;
        editor
          .chain()
          .command(({ tr }) => {
            tr.setNodeAttribute(getPos(), "caption", figcaption.textContent);
            return true;
          })
          .run();
      });

      figcaption.addEventListener("keydown", (e) => {
        if (e.key === "Enter") e.preventDefault();
      });

      return {
        dom: figure,
        ignoreMutation: () => true,
        // FIX BUG (sama seperti versi berita) — cegah ProseMirror menangkap
        // klik/ketik di dalam figcaption sebagai seleksi node yang lalu
        // terhapus saat mengetik huruf pertama.
        stopEvent: (event) => figcaption.contains(event.target),
        update: (updatedNode) => {
          if (updatedNode.type.name !== "figureImage") return false;
          if (img.src !== updatedNode.attrs.src) img.src = updatedNode.attrs.src;
          if (figcaption.textContent !== updatedNode.attrs.caption) {
            figcaption.textContent = updatedNode.attrs.caption || "";
          }
          return true;
        },
      };
    };
  },
});

export default FigureImage;