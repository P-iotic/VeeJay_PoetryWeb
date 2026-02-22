const KEY = {
  mood: "veejay.mood",
  drafts: "veejay.drafts",
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