import { config } from "../../config/config.js";

const { createEl, createFrag, AnimeHelper } = config;

const animeHelper = AnimeHelper
  ? new AnimeHelper(window.anime)
  : null;

export function Skillset(skillsContent) {
  const skillTitle = createEl(
    "h2",
    { class: "skills_title" },
    createFrag("span", skillsContent.title),
  );

  const skillDescription = createEl(
    "div",
    { class: "skills_description" },
    createFrag("span", skillsContent.description),
  );

  animeHelper.observe([skillTitle, skillDescription], {
    preset: "slideUp",
    stagger: 600,
    params: {
      duration: 300,
      ease: "cubicBezier(0.22, 1, 0.36, 1)",
    },
    scrollParams: {
      enter: "80% top",
      leave: "top bottom",
      once: true,
    },
  });

  return createEl(
    "section",
    { class: "content-container skills-section" },
    [
      createEl("div", { class: "container" }, [
        createEl("div", { class: "skills_title-container" }, [
          skillTitle,
          skillDescription,
        ]),
        createEl(
          "div",
          { class: "skills_skill-set" },
          skillsContent.skills.map(({ title, description }) => {
            return createEl("div", { class: "skills_skill-item" }, [
              createEl("div", {
                class: "box",
              }),
              createEl(
                "p",
                {
                  class: "skills_skill-item-title",
                },
                title,
              ),
              createEl(
                "div",
                {
                  class: "skills_skill-item-description",
                },
                createFrag("span", description),
              ),
            ]);
          }),
        ),
      ]),
    ],
  );
}
