import { config } from "../../config/config.js";
import { Button } from "../common/Button.js";
import { Tags } from "../snippets/Tags.js";

const { createEl, createFrag } = config;

export function RandD(
  { title, subtitle, tags, description, ctas },
  index,
) {
  return createEl(
    "article",
    { class: "randd", "data-index": index + 1 },
    createEl("div", { class: "randd__content" }, [
      createEl("header", { class: "randd__header" }, [
        createEl(
          "p",
          { class: "header_tag" },
          `[ PAPER ${index + 1} ]`,
        ),
        createEl("h2", { class: "title" }, createFrag("span", title)),
        createEl(
          "p",
          { class: "subtitle" },
          createFrag("span", subtitle),
        ),
        Tags(tags),
      ]),
      createEl("div", { class: "randd__body" }, [
        createEl(
          "h3",
          { class: "rand__abstract_label" },
          "// Abstract",
        ),
        createEl(
          "p",
          { class: "description" },
          createFrag("span", description),
        ),
      ]),
      createEl(
        "div",
        { class: "randd__footer" },
        ctas.map((cta) => Button(cta.label, cta.type, cta.url)),
      ),
    ]),
  );
}
