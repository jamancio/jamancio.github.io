import { config } from "../../config/config.js";

const { createEl, AnimeHelper } = config;

const animeHelper = AnimeHelper ? new AnimeHelper(window.anime) : null;

export function ComingSoon(type) {
  const title = createEl(
    "h1",
    { class: "coming-soon_title" },
    `${type} are coming soon`,
  );

  const description = createEl(
    "p",
    { class: "coming-soon_description" },
    "This page is currently under construction. Please check back soon!",
  );

  const progressBar = createEl("div", {
    class: "coming-soon_progress_bar",
  });
  const counterEl = createEl(
    "span",
    { class: "coming-soon_progress_counter" },
    "0%",
  );

  const progressBarContainer = createEl(
    "div",
    { class: "coming-soon_progress_bar_container" },
    [
      progressBar,
      createEl("p", { class: "coming-soon_progress_label" }, [
        createEl(
          "span",
          { class: "coming-soon_progress_label_text" },
          "Loading experience...",
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

  return createEl(
    "section",
    { class: "coming-soon-container", id: "coming-soon" },
    [
      createEl("div", { class: "coming-soon" }, [
        title,
        description,
        progressBarContainer,
      ]),
    ],
  );
}
