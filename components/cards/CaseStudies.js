import { config } from "../../config/config.js";
import { Tags } from "../snippets/Tags.js";
import { Button } from "../common/Button.js";

const { createEl, createFrag } = config;

export function CaseStudies(
  { title, subtitle, tags, description, ctas },
  index,
) {
  return createEl(
    "div",
    { class: "casestudies__content", "data-index": index + 1 },
    [
      createEl(
        "div",
        { class: "casestudies__content__title__container" },
        [
          createEl(
            "h2",
            { class: "casestudies__content__title" },
            createFrag("span", title),
          ),
          Tags(tags),
        ],
      ),

      createEl(
        "div",
        { class: "casestudies__content__body__container" },
        [
          createEl("div", { class: "casestudies__content__body" }, [
            createEl(
              "h3",
              { class: "casestudies__content__subtitle" },
              subtitle,
            ),
            createEl(
              "p",
              { class: "casestudies__content__description" },
              createFrag("span", description),
            ),
          ]),
          createEl(
            "div",
            { class: "casestudies__content__ctas" },
            ctas && ctas.length > 0
              ? createEl(
                  "div",
                  { class: "casestudies__content__ctas" },
                  ctas.map((cta) =>
                    Button(cta.label, cta.type, cta.url),
                  ),
                )
              : null,
          ),
        ],
      ),
    ],
  );
}
