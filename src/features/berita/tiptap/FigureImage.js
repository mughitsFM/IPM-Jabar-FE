// frontend/features/berita/tiptap/FigureImage.js
import { Node, mergeAttributes } from "@tiptap/core";

/**
 * Node kustom Tiptap: <figure><img /><figcaption>...</figcaption></figure>
 * Dipakai untuk menyisipkan gambar + keterangan di dalam konten berita,
 * konsisten dengan tag yang diizinkan backend (lihat berita/services.py
 * ALLOWED_TAGS: figure, figcaption, img).
 *
 * Node ini "atom" (tidak dikelola ProseMirror sebagai konten biasa) — teks
 * figcaption diedit langsung lewat contentEditable pada DOM node view, lalu
 * disinkronkan ke attrs Tiptap tiap kali ada input.
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

      // Enter di keterangan gambar tidak perlu bikin baris baru
      figcaption.addEventListener("keydown", (e) => {
        if (e.key === "Enter") e.preventDefault();
      });

      return {
        dom: figure,
        // Beri tahu ProseMirror untuk tidak ikut campur mengubah DOM di
        // dalam node ini — kita kelola sendiri lewat listener di atas.
        ignoreMutation: () => true,
        // FIX BUG: tanpa ini, klik ke figcaption ditangkap ProseMirror dan
        // dianggap "pilih seluruh node gambar ini" (NodeSelection). Begitu
        // user mulai mengetik huruf pertama keterangan, perilaku default
        // ProseMirror saat mengetik di atas NodeSelection adalah MENGHAPUS
        // node yang terpilih lalu menggantinya dengan teks yang diketik —
        // itulah sebabnya gambar tiba-tiba hilang. Dengan stopEvent ini,
        // semua event yang asalnya dari dalam figcaption (klik, ketik,
        // backspace, dst) dibiarkan ditangani native oleh browser sebagai
        // contentEditable biasa, tidak disentuh ProseMirror sama sekali.
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