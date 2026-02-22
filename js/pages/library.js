// /js/pages/library.js
import { poems as seedPoems } from "../poems.data.js";
import { loadUserPoems } from "../store.js";
import { el, excerpt } from "../ui.js";

export default async function Library() {
  const wrap = el("section", { class: "card" }, [
    el("div", { class: "hd" }, [
      el("h2", { class: "poemTitle", text: "Library" }),
      el("p", { class: "sub", text: "Your submitted poems (this device) + the built-in poems." }),
    ]),
    el("div", { class: "bd" }, [])
  ]);

  const bd = wrap.querySelector(".bd");

  // Safely load poems from localStorage + seed list
  const userPoems = (() => {
    try { return loadUserPoems() || []; }
    catch { return []; }
  })();

  const poems = [...userPoems, ...seedPoems];

  // Controls
  const search = el("input", { class: "input", placeholder: "Search title or text..." });

  const tagSelect = el("select", { class: "input" }, []);
  const allTags = Array.from(new Set(poems.flatMap(p => (p.tags || [])))).sort();

  tagSelect.appendChild(el("option", { value: "", text: "All tags" }));
  allTags.forEach(t => tagSelect.appendChild(el("option", { value: t, text: t })));

  // Small status row to show counts (helps debugging)
  const countsRow = el("div", { class: "metaRow", style: "margin-top:8px" }, [
    el("span", { class: "pill", text: `Submitted: ${userPoems.length}` }),
    el("span", { class: "pill", text: `Built-in: ${seedPoems.length}` }),
    el("span", { class: "pill", text: `Total: ${poems.length}` }),
  ]);

  bd.appendChild(el("div", { class:"grid", style:"grid-template-columns: 1fr 260px; align-items:end; gap:12px" }, [
    el("div", {}, [
      el("div", { class:"label", text:"Search" }),
      search
    ]),
    el("div", {}, [
      el("div", { class:"label", text:"Filter by tag" }),
      tagSelect
    ]),
  ]));

  bd.appendChild(countsRow);
  bd.appendChild(el("hr", { class:"sep" }));

  const list = el("div", { class:"list" }, []);
  bd.appendChild(list);

  function render() {
    list.innerHTML = "";

    const q = search.value.trim().toLowerCase();
    const tag = tagSelect.value;

    const filtered = poems.filter(p => {
      const title = (p.title || "").toLowerCase();
      const content = (p.content || "").toLowerCase();
      const hit = !q || (title.includes(q) || content.includes(q));
      const tags = p.tags || [];
      const tagOk = !tag || tags.includes(tag);
      return hit && tagOk;
    });

    filtered.forEach(p => {
      const tags = p.tags || [];
      list.appendChild(el("a", { class:"item", href:`#/poem?id=${encodeURIComponent(p.id)}` }, [
        el("h3", { text: p.title || "Untitled" }),
        el("div", { class:"metaRow" }, [
          el("span", { class:"pill", text: p.date || "—" }),
          ...tags.slice(0, 3).map(t => el("span", { class:"pill", text: t }))
        ]),
        el("p", { text: excerpt(p.content || "", 120) })
      ]));
    });

    if (!filtered.length) {
      list.appendChild(el("div", { class:"item" }, [
        el("h3", { text: "No poems found" }),
        el("p", { text: "Try another keyword or remove tag filtering. If Submitted shows 0, submit a poem in the Editor first." })
      ]));
    }
  }

  search.addEventListener("input", render);
  tagSelect.addEventListener("change", render);
  render();

  return wrap;
}