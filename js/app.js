import { initRouter, navigate } from "./router.js";
import { setMood, getMood } from "./store.js";
import { toast } from "./ui.js";

document.getElementById("year").textContent = new Date().getFullYear();

const themeToggle = document.getElementById("themeToggle");
document.documentElement.dataset.mood = getMood();

themeToggle.addEventListener("click", () => {
  const next = document.documentElement.dataset.mood === "ember" ? "violet" : "ember";
  setMood(next);
  document.documentElement.dataset.mood = next;
  toast(`Mood: ${next}`);
});

// highlight active nav
function syncNav() {
  const links = [...document.querySelectorAll("[data-nav]")];
  links.forEach(a => a.classList.remove("active"));
  const hash = location.hash || "#/";
  const found = links.find(a => a.getAttribute("href") === hash.split("?")[0]);
  if (found) found.classList.add("active");
}

window.addEventListener("hashchange", syncNav);
syncNav();

initRouter({
  mount: document.getElementById("app"),
  onRoute: () => syncNav()
});

// default route
if (!location.hash) navigate("#/");