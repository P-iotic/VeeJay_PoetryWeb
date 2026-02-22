import { poems } from "../poems.data.js";
import { el, toast } from "../ui.js";

export default async function Poem({ query }) {
  const p = poems.find(x => x.id === query.id) || poems[0];

  const node = el("section", { class:"card" }, [
    el("div", { class:"hd" }, [
      el("div", { class:"metaRow" }, [
        el("span", { class:"pill", text: p.date }),
        ...p.tags.map(t => el("span", { class:"pill", text: t }))
      ]),
      el("h2", { class:"poemTitle", text: p.title }),
      el("p", { class:"sub", text: "Reading view — clean and quiet." })
    ]),
    el("div", { class:"bd" }, [
      el("div", { class:"exportFrame", id:"exportArea" }, [
        el("div", { class:"pill", text:"Velaphi Poetry • #Velaphi7" }),
        el("hr", { class:"sep" }),
        el("div", { class:"poemText", text: p.content })
      ])
    ]),
    el("div", { class:"ft" }, [
      el("button", {
        class:"btn primary",
        id:"exportBtn",
        text:"Export as Image"
      }),
      el("a", { class:"btn", href:"#/library", text:"Back to Library" }),
      el("button", { class:"btn ghost", id:"copyBtn", text:"Copy Text" })
    ])
  ]);

  node.querySelector("#copyBtn").addEventListener("click", async () => {
    await navigator.clipboard.writeText(`${p.title}\n\n${p.content}`);
    toast("Copied.");
  });

  node.querySelector("#exportBtn").addEventListener("click", async () => {
    const area = node.querySelector("#exportArea");
    if (!window.html2canvas) return toast("Export tool not loaded.");

    const canvas = await window.html2canvas(area, { backgroundColor: null, scale: 2 });
    const link = document.createElement("a");
    link.download = `${p.id}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast("Exported PNG.");
  });

  return node;
}