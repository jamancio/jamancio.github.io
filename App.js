export function App(selector, content = []) {
  const container = document.querySelector(`.${selector}`);
  container.innerHTML = "";
  content.forEach((data) => container.append(data));
}
