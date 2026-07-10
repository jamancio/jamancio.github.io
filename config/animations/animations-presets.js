/**
 * Animation Presets
 *
 * Project-specific animation presets registered with AnimeHelper.
 * Each preset is a function that receives the user's config object
 * and returns an anime.js params object.
 *
 * Usage in any init file:
 *   import './animations/animations-presets.js';
 *
 * Usage in observe():
 *   window.animeHelper.observe('.my-el', { preset: 'slideUp', params: { duration: 600 } });
 *
 * Adding a new preset:
 *   AnimeHelper.addPreset('myPreset', (config) => ({ ... }));
 *   - config is the full object passed to window.animeHelper.observe()
 *   - params inside observe() always override preset defaults
 */
import { AnimeHelper } from "../extensions/AnimeHelper.js";

/* ==================== REVEAL PRESETS ==================== */

/**
 * Slides and fades in from below with a subtle lift.
 * Good for: cards, section content, staggered lists.
 * 
 * @example
 * // HTML: <div class="card">Card Content</div>
 * window.animeHelper.observe('.card', { preset: 'slideUp' });
 */
AnimeHelper.addPreset("slideUp", () => ({
  opacity: [0, 1],
  translateY: [40, 0],
  ease: "easeOutExpo",
  duration: 800,
}));

/**
 * Slides and fades in from the left.
 * Good for: left-aligned headings, sidebar content.
 * 
 * @example
 * // HTML: <h2 class="title-left">Sidebar Title</h2>
 * window.animeHelper.observe('.title-left', { preset: 'slideInLeft' });
 */
AnimeHelper.addPreset("slideInLeft", () => ({
  opacity: [0, 1],
  translateX: [-50, 0],
  ease: "easeOutExpo",
  duration: 700,
}));

/**
 * Slides and fades in from the right.
 * Good for: right-aligned content, images.
 * 
 * @example
 * // HTML: <img src="boat.jpg" class="image-right" />
 * window.animeHelper.observe('.image-right', { preset: 'slideInRight' });
 */
AnimeHelper.addPreset("slideInRight", () => ({
  opacity: [0, 1],
  translateX: [50, 0],
  ease: "easeOutExpo",
  duration: 700,
}));

/**
 * Simple fade without movement.
 * Good for: overlays, background images, subtle reveals.
 * 
 * @example
 * // HTML: <div class="overlay"></div>
 * window.animeHelper.observe('.overlay', { preset: 'fade' });
 */
AnimeHelper.addPreset("fade", () => ({
  opacity: [0, 1],
  ease: "easeOutQuad",
  duration: 600,
}));

/**
 * Scales up from slightly below 1 while fading in.
 * Good for: hero images, featured cards, modal entrances.
 * 
 * @example
 * // HTML: <div class="hero-image"></div>
 * // Uses default start scale of 0.92
 * window.animeHelper.observe('.hero-image', { preset: 'zoomIn' });
 * 
 * // Overriding the start scale
 * window.animeHelper.observe('.hero-image', { preset: 'zoomIn', from: 0.8 });
 */
AnimeHelper.addPreset("zoomIn", (config) => ({
  opacity: [0, 1],
  scale: [config.from ?? 0.92, 1],
  ease: "easeOutQuart",
  duration: 700,
}));

/* ==================== ATTENTION PRESETS ==================== */

/**
 * Horizontal shake. Good for: form validation errors, invalid actions.
 * config.intensity — pixels to shake (default: 8)
 * 
 * @example
 * // HTML: <div class="error-msg">Invalid Email</div>
 * // Set reusable: true so it can be triggered multiple times (e.g. on click)
 * const anim = window.animeHelper.observe('.error-msg', { preset: 'shake', intensity: 10, reusable: true });
 * anim.play();
 */
AnimeHelper.addPreset("shake", (config) => {
  const i = config.intensity ?? 8;
  return {
    translateX: [
      { to: -i,      duration: 60,  ease: "easeInOutQuad" },
      { to:  i,      duration: 60,  ease: "easeInOutQuad" },
      { to: -i * .5, duration: 60,  ease: "easeInOutQuad" },
      { to:  i * .5, duration: 60,  ease: "easeInOutQuad" },
      { to:  0,      duration: 120, ease: "easeOutQuad"   },
    ],
    duration: 360,
  };
});

/**
 * Single soft pulse (scale up → back).
 * Good for: CTA buttons, notification badges, icon highlights.
 * config.scale — peak scale value (default: 1.08)
 * 
 * @example
 * // HTML: <button class="cta-btn">Book Now</button>
 * window.animeHelper.observe('.cta-btn', { preset: 'pulse', scale: 1.15, reusable: true });
 */
AnimeHelper.addPreset("pulse", (config) => ({
  scale: [1, config.scale ?? 1.08, 1],
  ease: "easeInOutSine",
  duration: 500,
}));

/* ==================== SCROLL SCRUB PRESETS ==================== */

/**
 * Parallax drift — element moves slower than the scroll speed.
 * Pair with type: 'scroll' and scrollParams: { sync: true }.
 * config.distance — translateY travel distance (default: '-80px')
 * 
 * @example
 * // HTML: <div class="parallax-bg"></div>
 * window.animeHelper.observe('.parallax-bg', {
 *   type: 'scroll',
 *   preset: 'parallax',
 *   distance: '-150px',
 *   scrollParams: { sync: true }
 * });
 */
AnimeHelper.addPreset("parallax", (config) => ({
  translateY: [0, config.distance ?? "-80px"],
  ease: "linear",
}));

/* ==================== TEXT PRESETS ==================== */

/**
 * Elegant text blur-in. Good for luxury headings and titles.
 * Animates elements/words by fading and unblurring them with a gentle lift.
 * 
 * @example
 * // HTML: <h1 class="luxury-title">Experience True Luxury</h1>
 * window.animeHelper.observe('.luxury-title', { 
 *   type: 'splitText', 
 *   splitBy: 'words',
 *   preset: 'textBlurIn' 
 * });
 */
AnimeHelper.addPreset("textBlurIn", () => ({
  opacity: [0, 1],
  filter: ["blur(10px)", "blur(0px)"],
  translateY: [15, 0],
  duration: 900,
  ease: "easeOutQuart",
}));

/**
 * Editorial text 3D tilt reveal. Good for main hero titles.
 * Rotates elements on the X-axis (tilting forward to flat) as they lift and fade in.
 * 
 * @example
 * // HTML: <h1 class="hero-title">A NEW ERA</h1>
 * window.animeHelper.observe('.hero-title', { 
 *   type: 'splitText', 
 *   splitBy: 'chars',
 *   preset: 'textTiltIn',
 *   angle: 80 
 * });
 */
AnimeHelper.addPreset("textTiltIn", (config) => ({
  opacity: [0, 1],
  rotateX: [config.angle ?? 65, 0],
  translateY: [35, 0],
  duration: 1000,
  ease: "easeOutQuart",
}));

/**
 * Liquid text wave entrance.
 * Staggers elements with a slight counter-clockwise rotation and gentle bounce.
 * 
 * @example
 * // HTML: <h2 class="creative-title">Creative Space</h2>
 * window.animeHelper.observe('.creative-title', { 
 *   type: 'splitText', 
 *   splitBy: 'chars',
 *   preset: 'textWave' 
 * });
 */
AnimeHelper.addPreset("textWave", (config) => ({
  opacity: [0, 1],
  translateY: [30, 0],
  rotate: [config.angle ?? -8, 0],
  duration: 800,
  ease: "easeOutBack",
}));

/**
 * Creative typographic text flicker. Good for high-fashion or tech aesthetics.
 * Simulates a light-up sign or screen flicker before settling solid.
 * 
 * @example
 * // HTML: <h2 class="neon-text">Cyberpunk 2077</h2>
 * window.animeHelper.observe('.neon-text', { 
 *   type: 'splitText', 
 *   splitBy: 'chars',
 *   preset: 'textFlicker' 
 * });
 */
AnimeHelper.addPreset("textFlicker", () => ({
  opacity: [0, 0.4, 0.1, 0.8, 0.3, 1],
  scale: [0.98, 1.01, 0.99, 1],
  duration: 650,
  ease: "linear",
}));
