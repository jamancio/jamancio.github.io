import { config } from "../../config/config.js";
import { Button } from "../common/Button.js";

const { createEl, createFrag, AnimeHelper } = config;

export function Hero(content) {
  const titles = content.titles || [];

  const targetId = "hero-typing-text-dynamic";
  const targetSelector = `#${targetId}`;

  const dynamicTitleEl = createEl(
    "span",
    {
      class: "hero__content__title__item",
      id: targetId,
    },
    titles[0] || "",
  );

  const animeHelper = AnimeHelper
    ? new AnimeHelper(window.anime)
    : null;

  const eyebrowEl = createEl(
    "p",
    { class: "hero__content__eyebrow" },
    content.eyebrow,
  );

  const descriptionEl = createEl(
    "p",
    {
      class: "hero__content__description",
    },
    createFrag("span", content.description),
  );

  const buttonEl = createEl(
    "div",
    { class: "hero__content__buttons" },
    content.buttons.map((button) =>
      Button(button.text, button.type, button.url),
    ),
  );

  animeHelper.observe([eyebrowEl, descriptionEl], {
    preset: "slideUp",
    stagger: 600,
    params: {
      duration: 300,
      ease: "cubicBezier(0.22, 1, 0.36, 1)",
    },
  });

  animeHelper.observe([buttonEl], {
    preset: "slideUp",
    animateChild: true,
    stagger: 300,
    params: {
      delay: 600,
      duration: 300,
      ease: "cubicBezier(0.22, 1, 0.36, 1)",
    },
    initialState: {
      opacity: 0,
    },
  });

  if (titles.length > 0 && typeof window !== "undefined") {
    let currentIndex = 0;

    setTimeout(() => {
      const typeNext = () => {
        if (!animeHelper || !dynamicTitleEl) return;

        const currentText = titles[currentIndex];
        dynamicTitleEl.innerHTML = currentText;

        animeHelper.observe(targetSelector, {
          type: "splitText",
          splitBy: "chars",
          splitParams: {
            stagger: 60,
            distance: "0px",
          },
          params: {
            opacity: [0, 1],
            translateY: [0, 0],
            duration: 10,
            ease: "linear",
          },
        });

        const inDuration = currentText.length * 60 + 10;
        const displayDuration = 2500;

        setTimeout(() => {
          if (AnimeHelper && typeof AnimeHelper.kill === "function") {
            AnimeHelper.kill(targetSelector);
          }
          dynamicTitleEl.innerHTML = currentText;

          animeHelper.observe(targetSelector, {
            type: "splitText",
            splitBy: "chars",
            splitParams: {
              stagger: {
                value: 30,
                from: "last",
              },
              distance: "0px",
            },
            params: {
              opacity: [1, 0],
              translateY: [0, 0],
              duration: 10,
              ease: "linear",
            },
          });

          // Calculate exact time when OUT animation finishes
          const outDuration = currentText.length * 30 + 10;

          setTimeout(() => {
            if (
              AnimeHelper &&
              typeof AnimeHelper.kill === "function"
            ) {
              AnimeHelper.kill(targetSelector);
            }

            // 3. Move to next word and loop
            currentIndex = (currentIndex + 1) % titles.length;
            typeNext();
          }, outDuration + 100); // 100ms buffer after OUT finishes
        }, inDuration + displayDuration);
      };

      // Start the infinite sequence
      typeNext();
    }, 100);
  }

  return createEl("div", { class: "hero__content" }, [
    eyebrowEl,
    createEl(
      "h1",
      {
        class: "hero__content__title",
      },
      dynamicTitleEl,
    ),
    descriptionEl,
    buttonEl,
  ]);
}
