import { poems } from "../poems.data.js";
import { el, excerpt } from "../ui.js";

export default async function Library({ query }) {
  const wrap = el("section", { class: "card" }, [
    el("div", { class: "hd" }, [
      el("h2", { class: "poemTitle", text: "Library" }),
      el("p", { class: "sub", text: "Search your poems, filter by tag, then open the reading view." }),
    ]),
    el("div", { class: "bd" }, [])
  ]);

  const bd = wrap.querySelector(".bd");

  const search = el("input", { class: "input", placeholder: "Search title or text..." });
  const tagSelect = el("select", {}, []);
  const allTags = Array.from(new Set(poems.flatMap(p => p.tags))).sort();
  tagSelect.appendChild(el("option", { value:"", text:"All tags" }));
  allTags.forEach(t => tagSelect.appendChild(el("option", { value:t, text:t })));

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

  bd.appendChild(el("hr", { class:"sep" }));

  const list = el("div", { class:"list" }, []);
  bd.appendChild(list);

  function render() {
    list.innerHTML = "";
    const q = search.value.trim().toLowerCase();
    const tag = tagSelect.value;

    const filtered = poems.filter(p => {
      const hit = (p.title + " " + p.content).toLowerCase().includes(q);
      const tagOk = !tag || p.tags.includes(tag);
      return hit && tagOk;
    });

    filtered.forEach(p => {
      list.appendChild(el("a", { class:"item", href:`#/poem?id=${encodeURIComponent(p.id)}` }, [
        el("h3", { text: p.title }),
        el("div", { class:"metaRow" }, [
          el("span", { class:"pill", text: p.date }),
          ...p.tags.slice(0,2).map(t => el("span", { class:"pill", text: t }))
        ]),
        el("p", { text: excerpt(p.content, 120) })
      ]));
    });

    if (!filtered.length) {
      list.appendChild(el("div", { class:"item" }, [
        el("h3", { text: "No matches" }),
        el("p", { text: "Try a different keyword or remove the tag filter." })
      ]));
    }
  }

  search.addEventListener("input", render);
  tagSelect.addEventListener("change", render);
  render();

  return wrap;
}