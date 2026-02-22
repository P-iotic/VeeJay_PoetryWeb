const KEY = {
  mood: "veejay.mood",
  drafts: "veejay.drafts",
  userPoems: "veejay.userPoems"
};

export function getMood(){
  return localStorage.getItem(KEY.mood) || "violet";
}
export function setMood(v){
  localStorage.setItem(KEY.mood, v);
}

export function loadDraft(){
  try { return JSON.parse(localStorage.getItem(KEY.drafts) || "{}"); }
  catch { return {}; }
}
export function saveDraft(draft){
  localStorage.setItem(KEY.drafts, JSON.stringify(draft));
}

/** NEW: user poems library **/
export function loadUserPoems(){
  try { return JSON.parse(localStorage.getItem("veejay.userPoems") || "[]"); }
  catch { return []; }
}
export function saveUserPoems(poems){
  localStorage.setItem(KEY.userPoems, JSON.stringify(poems));
}
export function addUserPoem(poem){
  const poems = loadUserPoems();
  poems.unshift(poem); // newest first
  saveUserPoems(poems);
  return poems;
}