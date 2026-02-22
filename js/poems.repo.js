import { poems as seedPoems } from "./poems.data.js";
import { loadUserPoems } from "./store.js";

export function getAllPoems() {
  const user = (() => {
    try { return loadUserPoems() || []; } catch { return []; }
  })();

  // user poems first (newest)
  return [...user, ...seedPoems];
}

export function normalizeCollectionName(name) {
  const s = (name || "").trim();
  return s || "Unsorted";
}

export function getCollections(poems) {
  const map = new Map();

  for (const p of poems) {
    const col = normalizeCollectionName(p.collection);
    if (!map.has(col)) {
      map.set(col, {
        name: col,
        count: 0,
        tags: new Set(),
        latestDate: p.date || "0000-00-00",
      });
    }
    const c = map.get(col);
    c.count++;
    (p.tags || []).forEach(t => c.tags.add(t));
    if ((p.date || "0000-00-00") > c.latestDate) c.latestDate = p.date;
  }

  // Convert to array + make tags pretty
  const arr = [...map.values()].map(c => ({
    ...c,
    tags: [...c.tags].slice(0, 4),
  }));

  // Sort by newest activity then name
  arr.sort((a, b) => (b.latestDate.localeCompare(a.latestDate)) || a.name.localeCompare(b.name));
  return arr;
}

export function filterByCollection(poems, collectionName) {
  const target = normalizeCollectionName(collectionName);
  return poems.filter(p => normalizeCollectionName(p.collection) === target);
}