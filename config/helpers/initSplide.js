export function initSplide(selector, options = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const splide = new Splide(selector, options);
      splide.mount();
      resolve(splide);
    }, 0);
  });
}
