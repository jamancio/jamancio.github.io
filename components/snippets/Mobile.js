import { config } from "../../config/config.js";

const { createEl, AnimeHelper } = config;

const animeHelper = AnimeHelper
  ? new AnimeHelper(window.anime)
  : null;

export function Mobile() {
  const title = createEl(
    "h1",
    { class: "mobile_title" },
    "Mobile not yet ready",
  );

  const description = createEl(
    "p",
    { class: "mobile_description" },
    "Feel free to check back soon or visit using a desktop or laptop",
  );

  const progressBar = createEl("div", {
    class: "mobile_progress_bar",
  });
  const counterEl = createEl(
    "span",
    { class: "mobile_progress_counter" },
    "0%",
  );

  const progressBarContainer = createEl(
    "div",
    { class: "mobile_progress_bar_container" },
    [
      progressBar,
      createEl("p", { class: "mobile_progress_label" }, [
        createEl(
          "span",
          { class: "mobile_progress_label_text" },
          "Loading desktop...",
        ),
        counterEl,
      ]),
    ],
  );

  if (animeHelper) {
    animeHelper.observe([title, description], {
      preset: "slideUp",
      stagger: 400,
      params: {
        duration: 600,
        ease: "cubicBezier(0.22, 1, 0.36, 1)",
      },
      scrollParams: { enter: "100% top", once: true },
    });

    animeHelper.observe(progressBar, {
      params: {
        width: ["0%", "80%"],
        duration: 2000,
        delay: 600,
        ease: "easeInOutQuart",
        onUpdate: (anim) => {
          const pct = Math.round(anim.progress * 80);
          counterEl.textContent = `${pct}%`;
        },
      },
    });
  }

  return createEl("div", { class: "mobile-container" }, [
    createEl("div", { class: "mobile" }, [
      title,
      description,
      progressBarContainer,
    ]),
  ]);
}
