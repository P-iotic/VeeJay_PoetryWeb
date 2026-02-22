import Home from "./pages/home.js";
import Library from "./pages/library.js";
import Poem from "./pages/poem.js";
import Editor from "./pages/editor.js";
import Collections from "./pages/collections.js";
import Collection from "./pages/collection.js";

const routes = {
  "#/": Home,
  "#/library": Library,
  "#/poem": Poem,
  "#/editor": Editor,

  // NEW
  "#/collections": Collections,
  "#/collection": Collection, // expects ?name=
};

let mountEl = null;
let onRouteCb = null;

export function navigate(hash) {
  location.hash = hash;
}

function parseQuery(qs) {
  const out = {};
  const s = (qs || "").replace("?", "");
  if (!s) return out;
  for (const part of s.split("&")) {
    const [k,v] = part.split("=");
    out[decodeURIComponent(k)] = decodeURIComponent(v || "");
  }
  return out;
}

function current() {
  const raw = location.hash || "#/";
  const [path, qs] = raw.split("?");
  return { path, query: parseQuery(qs) };
}

export function initRouter({ mount, onRoute }) {
  mountEl = mount;
  onRouteCb = onRoute;

  async function render() {
    const { path, query } = current();
    const Page = routes[path] || Home;

    mountEl.innerHTML = "";
    const node = await Page({ query, navigate });
    mountEl.appendChild(node);

    if (onRouteCb) onRouteCb();
  }

  window.addEventListener("hashchange", render);
  render();
}