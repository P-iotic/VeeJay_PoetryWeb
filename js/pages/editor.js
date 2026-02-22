import { el, toast } from "../ui.js";
import { loadDraft, saveDraft } from "../store.js";

export default async function Editor() {
  const draft = loadDraft();

  const titleInput = el("input", { class:"input", placeholder:"Poem title…", value: draft.title || "" });
  const tagsInput = el("input", { class:"input", placeholder:"tags e.g. dark, mind, love", value: (draft.tags || "").toString() });
  const textArea = el("textarea", { class:"textarea", placeholder:"Write here…", }, []);
  textArea.value = draft.content || "";

  const previewTitle = el("div", { class:"pill", text: draft.title ? `Preview: ${draft.title}` : "Preview" });
  const previewText = el("div", { class:"poemText", text: draft.content || "Start writing… your preview appears here." });

  function sync() {
    const t = titleInput.value.trim();
    previewTitle.textContent = t ? `Preview: ${t}` : "Preview";
    previewText.textContent = textArea.value;

    saveDraft({
      title: titleInput.value,
      tags: tagsInput.value,
      content: textArea.value
    });
  }

  titleInput.addEventListener("input", sync);
  tagsInput.addEventListener("input", sync);
  textArea.addEventListener("input", sync);

  const exportBtn = el("button", { class:"btn primary", text:"Export Preview as Image" });
  exportBtn.addEventListener("click", async () => {
    if (!window.html2canvas) return toast("Export tool not loaded.");

    const area = document.getElementById("exportDraftArea");
    const canvas = await window.html2canvas(area, { backgroundColor: null, scale: 2 });
    const safeTitle = (titleInput.value || "draft").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const link = document.createElement("a");
    link.download = `${safeTitle || "draft"}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast("Exported PNG.");
  });

  const clearBtn = el("button", { class:"btn ghost", text:"Clear Draft" });
  clearBtn.addEventListener("click", () => {
    titleInput.value = "";
    tagsInput.value = "";
    textArea.value = "";
    sync();
    toast("Draft cleared.");
  });

  return el("section", { class:"grid" }, [
    el("div", { class:"card" }, [
      el("div", { class:"hd" }, [
        el("h2", { class:"poemTitle", text:"Editor" }),
        el("p", { class:"sub", text:"Drafts save automatically in your browser (localStorage)." }),
      ]),
      el("div", { class:"bd" }, [
        el("div", { class:"label", text:"Title" }),
        titleInput,
        el("div", { style:"height:12px" }),
        el("div", { class:"label", text:"Tags (comma separated)" }),
        tagsInput,
        el("div", { style:"height:12px" }),
        el("div", { class:"label", text:"Poem" }),
        textArea,
      ]),
      el("div", { class:"ft" }, [ exportBtn, clearBtn ])
    ]),
    el("div", { class:"card" }, [
      el("div", { class:"hd" }, [
        previewTitle,
        el("h2", { class:"poemTitle", text:"Live Preview" }),
        el("p", { class:"sub", text:"This is also the export frame." }),
      ]),
      el("div", { class:"bd" }, [
        el("div", { class:"exportFrame", id:"exportDraftArea" }, [
          el("div", { class:"pill", text:"Velaphi Poetry • Draft" }),
          el("hr", { class:"sep" }),
          previewText
        ])
      ])
    ])
  ]);
}