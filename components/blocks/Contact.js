import { config } from "../../config/config.js";
import { Tags } from "../snippets/Tags.js";
const { createEl, createFrag } = config;

export function Contact(content) {
  const upperRow = createEl("div", { class: "contact__upper-row" });
  const lowerRow = createEl("div", { class: "contact__lower-row" });

  content.map((contents) => {
    if (contents.row == "upper-row") {
      contents.content.map((items) => {
        upperRow.appendChild(
          createEl("div", { class: "contact__upper-row-content" }, [
            createEl(
              items.title.type,
              { class: "contact__title" },
              createFrag("span", items.title.content),
            ),
            items.content?.tags ? Tags(items.content.tags) : null,
          ]),
        );
      });
    }
    if (contents.row == "lower-row") {
      contents.content.map((items) => {
        lowerRow.appendChild(
          createEl("div", { class: "contact__lower-row-content" }, [
            items.title
              ? createEl(
                  items.title.type,
                  { class: "contact__title name" },
                  createFrag("span", items.title.content),
                )
              : "",
            items.subtitle
              ? createEl(
                  items.subtitle.type,
                  { class: "contact__subtitle" },
                  items.subtitle.content,
                )
              : "",
            items.content
              ? createEl(
                  "ul",
                  { class: "contact__links" },
                  items.content.urls.map((url) =>
                    createEl(
                      "li",
                      { class: "contact__link" },
                      createEl(
                        "a",
                        {
                          href: url.url,
                          target: "_blank",
                          rel: "noopener noreferrer",
                        },
                        url.text,
                      ),
                    ),
                  ),
                )
              : "",
          ]),
        );
      });
    }
  });

  return createEl(
    "section",
    {
      class: "content-container contact-container",
      id: "contact-me",
    },
    createEl("div", { class: "contact__wrapper max-width-xl" }, [
      upperRow,
      lowerRow,
    ]),
  );
}
