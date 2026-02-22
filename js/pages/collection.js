import { el, excerpt } from "../ui.js";
import { getAllPoems, filterByCollection, normalizeCollectionName } from "../poems.repo.js";

export default async function Collection({ query }) {
  const name = normalizeCollectionName(query.name);
  const poems = getAllPoems();
  const inside = filterByCollection(poems, name);

  // Sort newest first
  inside.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  const list = el("div", { class: "list" }, []);
  inside.forEach(p => {
    list.appendChild(el("a", { class: "item", href: `#/poem?id=${encodeURIComponent(p.id)}` }, [
      el("h3", { text: p.title || "Untitled" }),
      el("div", { class: "metaRow" }, [
        el("span", { class: "pill", text: p.date || "—" }),
        ...(p.tags || []).slice(0, 3).map(t => el("span", { class: "pill", text: t }))
      ]),
      el("p", { text: excerpt(p.content || "", 130) })
    ]));
  });

  if (!inside.length) {
    list.appendChild(el("div", { class: "item" }, [
      el("h3", { text: "Empty collection" }),
      el("p", { text: "No poems here yet. Submit from the Editor and select this collection name." })
    ]));
  }

  return el("section", { class: "card" }, [
    el("div", { class: "hd" }, [
      el("div", { class: "pill", text: "Collection" }),
      el("h2", { class: "poemTitle", text: name }),
      el("p", { class: "sub", text: `${inside.length} poem${inside.length === 1 ? "" : "s"} inside.` })
    ]),
    el("div", { class: "bd" }, [ list ]),
    el("div", { class: "ft" }, [
      el("a", { class: "btn", href: "#/collections", text: "Back to Collections" }),
      el("a", { class: "btn ghost", href: "#/editor", text: "Write + Submit" }),
    ])
  ]);
}