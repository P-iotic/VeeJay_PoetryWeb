// /js/pages/poem.js
import { poems as seedPoems } from "../poems.data.js";
import { loadUserPoems } from "../store.js";
import { el, toast } from "../ui.js";

export default async function Poem({ query }) {
  // Combine user-submitted poems + built-in poems
  const poems = [...loadUserPoems(), ...seedPoems];
  const p = poems.find(x => x.id === query.id) || poems[0];

  // --- Read Mode helpers ---
  const root = document.documentElement;

  function setReadMode(on) {
    root.classList.toggle("readmode", !!on);
    // Update button label (if exists)
    if (readModeBtn) {
      readModeBtn.textContent = on ? "Exit Read Mode" : "Read Mode";
    }
  }

  function isReadMode() {
    return root.classList.contains("readmode");
  }

  function toggleReadMode() {
    setReadMode(!isReadMode());
    toast(isReadMode() ? "Read Mode: ON" : "Read Mode: OFF");
  }

  // Exit read mode on Escape
  function onKeyDown(e) {
    if (e.key === "Escape" && isReadMode()) {
      setReadMode(false);
      toast("Read Mode: OFF");
    }
  }
  window.addEventListener("keydown", onKeyDown);

  // --- Format selector (same as editor) ---
  const formatSelect = el("select", { class: "input", id: "formatSelect" }, []);
  [
    ["portrait", "Portrait 4:5 (1080×1350)"],
    ["square", "Square 1:1 (1080×1080)"],
    ["story", "Story 9:16 (1080×1920)"]
  ].forEach(([v, t]) => formatSelect.appendChild(el("option", { value: v, text: t })));
  formatSelect.value = "portrait";

  // --- Export area (resizable exportCard) ---
  const poemText = el("div", { class: "poemText", id: "poemText", text: p.content });

  const exportArea = el("div", {
    class: `exportCard ${formatSelect.value}`,
    id: "exportArea"
  }, [
    el("div", { class: "pill", text: "VeeJay Poetry • #VeeJayy" }),
    el("hr", { class: "sep" }),
    el("h2", { class: "poemTitle", id: "poemTitle", text: p.title }),
    el("div", { style: "height:10px" }),
    poemText
  ]);

  function applyFormat() {
    exportArea.classList.remove("square", "portrait", "story");
    exportArea.classList.add(formatSelect.value);
  }

  // Auto-fit font for export frame
  function fitTextToFrame() {
    poemText.style.fontSize = "22px";

    const paddingAllowance = 240; // room for pill + title + padding
    const maxLoops = 45;
    let loops = 0;

    while (poemText.scrollHeight > (exportArea.clientHeight - paddingAllowance) && loops < maxLoops) {
      const current = parseFloat(getComputedStyle(poemText).fontSize);
      const next = Math.max(12, current - 1);
      poemText.style.fontSize = next + "px";
      loops++;
      if (next === 12) break;
    }
  }

  // --- Buttons ---
  const exportBtn = el("button", { class: "btn primary", id: "exportBtn", text: "Export as Image" });
  const copyBtn = el("button", { class: "btn ghost", id: "copyBtn", text: "Copy Text" });
  const readModeBtn = el("button", { class: "btn", id: "readModeBtn", text: "Read Mode" });

  readModeBtn.addEventListener("click", toggleReadMode);

  copyBtn.addEventListener("click", async () => {
    await navigator.clipboard.writeText(`${p.title}\n\n${p.content}`);
    toast("Copied.");
  });

  exportBtn.addEventListener("click", async () => {
    if (!window.html2canvas) return toast("Export tool not loaded.");

    // Ensure correct format + fit before export
    applyFormat();
    fitTextToFrame();

    const canvas = await window.html2canvas(exportArea, {
      backgroundColor: null,
      scale: 2
    });

    const safeTitle = (p.title || "poem")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 50);

    const link = document.createElement("a");
    link.download = `${safeTitle || "poem"}-${formatSelect.value}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();

    toast("Exported PNG.");
  });

  formatSelect.addEventListener("change", () => {
    applyFormat();
    fitTextToFrame();
    toast(`Format: ${formatSelect.value}`);
  });

  // Initial fit after paint
  requestAnimationFrame(() => {
    applyFormat();
    fitTextToFrame();
  });

  // --- Page layout ---
  const node = el("section", { class: "card" }, [
    el("div", { class: "hd" }, [
      el("div", { class: "metaRow" }, [
        el("span", { class: "pill", text: p.date || "—" }),
        ...(p.tags || []).map(t => el("span", { class: "pill", text: t }))
      ]),
      el("h2", { class: "poemTitle", text: p.title }),
      el("p", { class: "sub", text: "Reading view — toggle Read Mode for a distraction-free experience." })
    ]),

    el("div", { class: "bd" }, [
      el("div", { class: "label", text: "Export Format" }),
      formatSelect,
      el("div", { style: "height:12px" }),
      exportArea
    ]),

    el("div", { class: "ft" }, [
      readModeBtn,
      exportBtn,
      el("a", { class: "btn", href: "#/library", text: "Back to Library" }),
      copyBtn
    ])
  ]);

  // Cleanup: when leaving this page, remove listeners + exit read mode
  // (Because router swaps DOM, we do a simple hashchange cleanup)
  const onLeave = () => {
    window.removeEventListener("keydown", onKeyDown);
    setReadMode(false);
    window.removeEventListener("hashchange", onLeave);
  };
  window.addEventListener("hashchange", onLeave);

  return node;
}