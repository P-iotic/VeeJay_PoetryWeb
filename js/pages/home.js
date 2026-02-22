import { el } from "../ui.js";

export default async function Home() {
  return el("section", { class: "grid" }, [
    el("div", { class: "card" }, [
      el("div", { class: "hd" }, [
        el("div", { class: "pill", text: "Dark Theme • Poetry • Editor • Export" }),
        el("h1", { class: "h1", text: "A cinematic space for your words." }),
        el("p", { class: "sub", text: "Write. Store drafts. Build a library. Export poems as images for Instagram/Facebook. Deployed on GitHub Pages." }),
      ]),
      el("div", { class: "bd" }, [
        el("hr", { class: "sep" }),
        el("p", { class: "sub", text: "This is your “theme” foundation. We’ll upgrade it with categories, collections, password-free profiles, and a clean public layout." }),
      ]),
      el("div", { class: "ft" }, [
        el("a", { class: "btn primary", href: "#/editor" , text: "Start Writing" }),
        el("a", { class: "btn", href: "#/library", text: "View Library" }),
      ])
    ]),
    el("div", { class: "card" }, [
      el("div", { class: "hd" }, [
        el("h2", { class: "poemTitle", text: "Theme Features (Phase 1)" }),
        el("p", { class: "sub", text: "What you already get from this starter:" }),
      ]),
      el("div", { class: "bd" }, [
        el("div", { class: "item" }, [
          el("h3", { text: "Poetry Library + Search" }),
          el("p", { text: "Browse poems, filter by tags, open a clean reading view." }),
        ]),
        el("div", { class: "item", style:"margin-top:12px" }, [
          el("h3", { text: "Editor + Live Preview" }),
          el("p", { text: "Write on the left, preview on the right. Save drafts locally." }),
        ]),
        el("div", { class: "item", style:"margin-top:12px" }, [
          el("h3", { text: "Export as Image" }),
          el("p", { text: "One click turns your poem card into a PNG (perfect for socials)." }),
        ]),
      ])
    ])
  ]);
}