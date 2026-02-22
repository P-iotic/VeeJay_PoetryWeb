// /js/pages/editor.js
import { el, toast } from "../ui.js";
import { loadDraft, saveDraft, addUserPoem } from "../store.js";

export default async function Editor() {
  const draft = loadDraft();

  // --- Inputs ---
  const titleInput = el("input", {
    class: "input",
    placeholder: "Poem title…",
    value: draft.title || ""
  });

  const tagsInput = el("input", {
    class: "input",
    placeholder: "tags e.g. dark, mind, love",
    value: (draft.tags || "").toString()
  });

  const formatSelect = el("select", { class: "input", id: "formatSelect" }, []);
  [
    ["portrait", "Portrait 4:5 (1080×1350)"],
    ["square", "Square 1:1 (1080×1080)"],
    ["story", "Story 9:16 (1080×1920)"]
  ].forEach(([v, t]) => formatSelect.appendChild(el("option", { value: v, text: t })));

  // Default format (saveable if you want; for now just use draft.format if present)
  formatSelect.value = draft.format || "portrait";

  const textArea = el("textarea", { class: "textarea", placeholder: "Write here…" }, []);
  textArea.value = draft.content || "";

  // --- Preview elements ---
  const previewPill = el("div", { class: "pill", id: "previewPill", text: "Preview" });
  const previewTitle = el("h2", { class: "poemTitle", id: "previewTitle", text: draft.title || "Untitled" });
  const previewText = el("div", { class: "poemText", id: "previewText", text: draft.content || "Start writing… your preview appears here." });

  // Export area: wrap with a resizable class (square/portrait/story)
  const exportArea = el("div", {
    class: `exportCard ${formatSelect.value}`,
    id: "exportDraftArea"
  }, [
    el("div", { class: "pill", id: "exportBrand", text: "Velaphi Poetry • Draft" }),
    el("hr", { class: "sep" }),
    previewTitle,
    el("div", { style: "height:10px" }),
    previewText
  ]);

  // --- Helpers ---
  function applyFormat() {
    const area = exportArea;
    area.classList.remove("square", "portrait", "story");
    area.classList.add(formatSelect.value);
  }

  function syncDraft() {
    const title = titleInput.value.trim();
    const content = textArea.value;

    previewPill.textContent = title ? `Preview: ${title}` : "Preview";
    previewTitle.textContent = title || "Untitled";
    previewText.textContent = content || "Start writing… your preview appears here.";

    saveDraft({
      title: titleInput.value,
      tags: tagsInput.value,
      content: textArea.value,
      format: formatSelect.value
    });
  }

  // Auto-fit font so it always fits the chosen frame
  function fitTextToFrame() {
    const area = exportArea;

    // The poemText element is the one we resize
    const poemEl = previewText;

    // Reset to a comfortable size first
    poemEl.style.fontSize = "22px";

    // Leave room for brand pill + title + padding
    const paddingAllowance = 220; // safe space for header elements
    const maxLoops = 40;
    let loops = 0;

    // Shrink until it fits
    while (poemEl.scrollHeight > (area.clientHeight - paddingAllowance) && loops < maxLoops) {
      const current = parseFloat(getComputedStyle(poemEl).fontSize);
      const next = Math.max(12, current - 1);
      poemEl.style.fontSize = next + "px";
      loops++;
      if (next === 12) break;
    }
  }

  // --- Buttons ---
  const submitBtn = el("button", { class: "btn primary", text: "Submit Poem" });
  const exportBtn = el("button", { class: "btn primary", text: "Export Preview as Image" });
  const clearBtn = el("button", { class: "btn ghost", text: "Clear Draft" });

  submitBtn.addEventListener("click", () => {
    const title = titleInput.value.trim();
    const content = textArea.value.trim();
    const tags = tagsInput.value.split(",").map(s => s.trim()).filter(Boolean);

    if (!title || !content) return toast("Add a title and your poem text.");

    const id = `${Date.now()}-${title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40)}`;

    addUserPoem({
      id,
      title,
      date: new Date().toISOString().slice(0, 10),
      tags,
      content
    });

    toast("Poem submitted to your Library.");
  });

  clearBtn.addEventListener("click", () => {
    titleInput.value = "";
    tagsInput.value = "";
    textArea.value = "";
    // keep formatSelect as is
    syncDraft();
    applyFormat();
    fitTextToFrame();
    toast("Draft cleared.");
  });

  exportBtn.addEventListener("click", async () => {
    if (!window.html2canvas) return toast("Export tool not loaded.");

    // Ensure correct format + font fitting before export
    applyFormat();
    syncDraft();
    fitTextToFrame();

    const canvas = await window.html2canvas(exportArea, {
      backgroundColor: null,
      scale: 2
    });

    const safeTitle = (titleInput.value || "draft")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const link = document.createElement("a");
    link.download = `${safeTitle || "draft"}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast("Exported PNG.");
  });

  // --- Call updates whenever text changes and before export ---
  function updateEverything(showToast = false) {
    syncDraft();
    applyFormat();
    fitTextToFrame();
    if (showToast) toast("Updated.");
  }

  titleInput.addEventListener("input", () => updateEverything(false));
  tagsInput.addEventListener("input", () => syncDraft()); // tags don't affect preview sizing
  textArea.addEventListener("input", () => updateEverything(false));

  formatSelect.addEventListener("change", () => {
    updateEverything(false);
    toast(`Format: ${formatSelect.value}`);
  });

  // Initial render sync
  applyFormat();
  syncDraft();
  fitTextToFrame();

  // --- Layout ---
  return el("section", { class: "grid" }, [
    el("div", { class: "card" }, [
      el("div", { class: "hd" }, [
        el("h2", { class: "poemTitle", text: "Editor" }),
        el("p", { class: "sub", text: "Draft saves automatically in your browser. Submit adds it to your Library (on this device)." })
      ]),
      el("div", { class: "bd" }, [
        el("div", { class: "label", text: "Title" }),
        titleInput,
        el("div", { style: "height:12px" }),

        el("div", { class: "label", text: "Tags (comma separated)" }),
        tagsInput,
        el("div", { style: "height:12px" }),

        el("div", { class: "label", text: "Export Format" }),
        formatSelect,
        el("div", { style: "height:12px" }),

        el("div", { class: "label", text: "Poem" }),
        textArea
      ]),
      el("div", { class: "ft" }, [ submitBtn, exportBtn, clearBtn ])
    ]),

    el("div", { class: "card" }, [
      el("div", { class: "hd" }, [
        previewPill,
        el("h2", { class: "poemTitle", text: "Live Preview" }),
        el("p", { class: "sub", text: "This frame is what gets exported (auto-fits text)." })
      ]),
      el("div", { class: "bd" }, [ exportArea ])
    ])
  ]);
}