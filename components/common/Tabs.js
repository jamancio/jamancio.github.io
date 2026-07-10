import { config } from "../../config/config.js";
import { CaseStudies } from "../cards/CaseStudies.js";
import { RandD } from "../cards/RandD.js";

const { createEl, createFrag, AnimeHelper } = config;

const animeHelper = AnimeHelper
  ? new AnimeHelper(window.anime)
  : null;

export function Tabs(tab_content) {
  const tabButtons = tab_content.map((tab, index) => {
    return createEl(
      "button",
      {
        class: `tabs__button ${index === 0 ? "active" : ""}`,
        "data-target": tab.tab_name
          .replace(/\s+/g, "-")
          .toLowerCase(),
      },
      tab.tab_name,
      null,
      {
        click: (e) => {
          const tabsContainer = e.currentTarget.closest(".tabs");
          const targetId =
            e.currentTarget.getAttribute("data-target");

          tabsContainer
            .querySelectorAll(".tabs__button")
            .forEach((btn) => btn.classList.remove("active"));

          e.currentTarget.classList.add("active");

          tabsContainer
            .querySelectorAll(".tabs__panel")
            .forEach((panel) => {
              if (panel.id === targetId) {
                panel.classList.add("active");
                panel.style.display = "block";
              } else {
                panel.classList.remove("active");
                panel.style.display = "none";
              }
            });
        },
      },
    );
  });

  const headerContainer = createEl(
    "div",
    { class: "tabs__header" },
    tabButtons,
  );

  const tabPanels = tab_content.map((tab, index) => {
    const rows = [];

    if (
      tab.content &&
      tab.content.length > 0 &&
      tab.tab_name !== "R&D"
    ) {
      const featuredStudy = tab.content[0];
      const standardStudies = tab.content.slice(1);

      const featuredCard = CaseStudies(featuredStudy, 0);
      const standardCards = standardStudies.map((study, idx) =>
        CaseStudies(study, idx + 1),
      );

      if (animeHelper) {
        animeHelper.observe([featuredCard, ...standardCards], {
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
      }

      rows.push(
        createEl("div", { class: "featured_study_row" }, [
          featuredCard,
        ]),
      );

      if (standardCards.length > 0) {
        rows.push(
          createEl(
            "div",
            { class: "standard_study_row" },
            standardCards,
          ),
        );
      }
    } else {
      rows.push(
        createEl(
          "div",
          { class: "raand__container" },
          tab.content.map((study, index) => RandD(study, index)),
        ),
      );
    }

    return createEl(
      "div",
      {
        class: `tabs__panel ${index === 0 ? "active" : ""}`,
        id: tab.tab_name.replace(/\s+/g, "-").toLowerCase(),
        style: { display: index === 0 ? "block" : "none" },
      },
      rows,
    );
  });

  const bodyContainer = createEl(
    "div",
    { class: "tabs__body" },
    tabPanels,
  );

  return createEl("div", { class: "tabs" }, [
    headerContainer,
    bodyContainer,
  ]);
}
