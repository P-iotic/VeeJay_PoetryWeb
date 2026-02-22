import { el } from "../ui.js";
import { getAllPoems, getCollections } from "../poems.repo.js";

export default async function Collections() {
  const poems = getAllPoems();
  const collections = getCollections(poems);

  const list = el("div", { class: "list" }, []);

  collections.forEach(c => {
    list.appendChild(el("a", {
      class: "item",
      href: `#/collection?name=${encodeURIComponent(c.name)}`
    }, [
      el("h3", { text: c.name }),
      el("div", { class: "metaRow" }, [
        el("span", { class: "pill", text: `${c.count} poem${c.count === 1 ? "" : "s"}` }),
        c.latestDate ? el("span", { class: "pill", text: `Latest: ${c.latestDate}` }) : el("span", { class: "pill", text: "Latest: —" }),
      ]),
      el("p", { text: c.tags.length ? `Tags: ${c.tags.join(", ")}` : "A collection for poems that belong together." })
    ]));
  });

  if (!collections.length) {
    list.appendChild(el("div", { class: "item" }, [
      el("h3", { text: "No collections yet" }),
      el("p", { text: "Submit poems from the Editor and assign them to collections." })
    ]));
  }

  return el("section", { class: "card" }, [
    el("div", { class: "hd" }, [
      el("h2", { class: "poemTitle", text: "Collections" }),
      el("p", { class: "sub", text: "Chapters for your mind. Open a collection to read the poems inside it." })
    ]),
    el("div", { class: "bd" }, [ list ]),
    el("div", { class: "ft" }, [
      el("a", { class: "btn", href: "#/editor", text: "Write + Submit" }),
      el("a", { class: "btn ghost", href: "#/library", text: "Go to Library" }),
    ])
  ]);
}