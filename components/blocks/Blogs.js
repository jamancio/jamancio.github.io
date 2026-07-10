import { config } from "../../config/config.js";
import { Button } from "../common/Button.js";
import { Tags } from "../snippets/Tags.js";
import { Image } from "../common/Image.js";

const { createEl, createFrag, initSplide, getImage } = config;

export function Blogs({ title, subtitle, blogs = [] }) {
  initSplide(".splide", {
    type: "loop",
    perPage: 1,
    autoplay: true,
    interval: 4000,
    gap: "2rem",
    arrows: false,
    drag: true,
    pagination: false,
  }).then((splideInstance) => {
    const bar = splideInstance.root.querySelector(".progress-bar");

    splideInstance.on("mounted move", function () {
      var end = splideInstance.Components.Controller.getEnd() + 1;
      var rate = Math.min((splideInstance.index + 1) / end, 1);
      bar.style.width = String(100 * rate) + "%";
    });
  });

  return createEl("div", { class: "blogs__container" }, [
    createEl("div", { class: "blogs__title__container" }, [
      createEl(
        "h2",
        { class: "blogs__title" },
        createFrag("span", title),
      ),
      createEl("p", { class: "blogs__subtitle" }, subtitle),
    ]),
    createEl(
      "div",
      { class: "splide blogs__container__blog__list" },
      [
        createEl("div", { class: "splide__track" }, [
          createEl(
            "ul",
            { class: "splide__list" },
            blogs.map(({ image_cover, title, tags, teaser_text }) => {
              return createEl(
                "li",
                { class: "splide__slide" },
                createEl(
                  "article",
                  { class: "blogs__card__container" },
                  [
                    Image(getImage(image_cover), title),
                    createEl(
                      "header",
                      { class: "blogs__card__container__header" },
                      [
                        createEl(
                          "h3",
                          {
                            class:
                              "blogs__card__container__header__title",
                          },
                          title,
                        ),
                        Tags(tags),
                      ],
                    ),
                    createEl(
                      "div",
                      { class: "blogs__card__container__body" },
                      [
                        createEl(
                          "p",
                          {
                            class:
                              "blogs__card__container__body__text",
                          },
                          teaser_text,
                        ),
                        Button(
                          "Read Blog ↗",
                          "btn-primary blogs__card__container__body__cta",
                          "#coming-soon-blogs",
                        ),
                      ],
                    ),
                  ],
                ),
              );
            }),
          ),
          createEl(
            "div",
            { class: "progress-bar-container" },
            createEl("div", {
              class: "progress-bar",
              style: {
                width: `${100 / blogs.length}%`,
              },
            }),
          ),
        ]),
      ],
    ),
  ]);
}
