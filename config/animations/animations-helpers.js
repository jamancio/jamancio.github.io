/**
 * Animations Helper
 *
 * Shared AnimeHelper singleton and page-level animation utilities.
 * Since this project does not use ES modules, these helpers are attached
 * to the `window` object so they can be used in any feature file.
 *
 * Usage:
 *   // No imports needed
 *   window.animeHelper.observe('.my-section', {
 *     preset: 'slideUp',
 *     scrollParams: { enter: 'start 85%', once: true },
 *     params: { duration: 700 },
 *   });
 */

/**
 * @type {AnimeHelper}
 * Shared AnimeHelper instance for the entire theme.
 * AnimeHelper is loaded globally via the compiled animations bundle
 * and references window.AnimeHelper set by AnimeHelper.js.
 * 
 * @example
 * // Basic usage
 * // HTML: <div class="my-element">Content</div>
 * window.animeHelper.observe('.my-element', { preset: 'fade' });
 * 
 * // Text split with scroll trigger
 * // HTML: <h1 class="title">Welcome to Ankor</h1>
 * window.animeHelper.observe('.title', { 
 *   type: 'splitText', 
 *   splitBy: 'words',
 *   preset: 'textBlurIn',
 *   scrollParams: { enter: 'start 85%', once: true }
 * });
 */
window.animeHelper = new AnimeHelper(window.anime);

/**
 * Convenience: observe a group of elements with scroll reveal,
 * applying animations independently per element.
 *
 * @param {string|string[]} selectors - CSS selector(s) to observe.
 * @param {object} [overrides={}] - Override any default config properties.
 *
 * @example
 * // HTML:
 * // <h2 class="section-title">Heading</h2>
 * // <div class="card">Content</div>
 * window.revealOnScroll('.card', { params: { duration: 500 } });
 * window.revealOnScroll(['.card', '.section-title']);
 */
window.revealOnScroll = function(selectors, overrides = {}) {
  const targets = Array.isArray(selectors) ? selectors : [selectors];

  targets.forEach((selector) => {
    window.animeHelper.observe(selector, {
      preset: "slideUp",
      scrollParams: {
        enter: "start 88%",
        once: true,
      },
      params: {
        duration: 750,
        ease: "easeOutExpo",
      },
      ...overrides,
    });
  });
}

/**
 * Convenience: apply a staggered reveal to multiple child elements
 * when the parent enters the viewport.
 *
 * @param {string} parentSelector  - CSS selector for the scroll observer (the container).
 * @param {string} childSelector   - CSS selector for the elements to animate (inside the container).
 * @param {number} [stagger=80]    - Stagger delay in milliseconds between each child.
 * @param {object} [overrides={}]  - Override any default config properties.
 *
 * @example
 * // HTML:
 * // <div class="cards-grid">
 * //   <div class="card">Card 1</div>
 * //   <div class="card">Card 2</div>
 * // </div>
 * window.staggerReveal('.cards-grid', '.card');
 * window.staggerReveal('.team-list', '.team-member', 60);
 */
window.staggerReveal = function(parentSelector, childSelector, stagger = 80, overrides = {}) {
  window.animeHelper.observe(parentSelector, {
    animationTarget: childSelector,
    type: "scroll",
    scrollParams: {
      enter: "start 85%",
      once: true,
    },
    params: {
      opacity: [0, 1],
      translateY: [30, 0],
      delay: window.animeHelper.anime.stagger(stagger),
      duration: 700,
      ease: "easeOutExpo",
    },
    ...overrides,
  });
}
