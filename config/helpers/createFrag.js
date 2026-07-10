export function createFrag(tag, string) {
  let frag = document.createDocumentFragment(),
    el = document.createElement(tag);
  el.innerHTML = string;
  while (el.firstChild) {
    frag.appendChild(el.firstChild);
  }
  return frag;
}
