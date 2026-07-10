import { config } from "../../config/config.js";
import { Button } from "./Button.js";
const { createEl } = config;

export function Navigation(links) {
  const nav = createEl(
    "nav",
    { class: "navbar" },
    links.map(({ name, url, type }) => {
      if (type === "logo") {
        return createEl(
          "a",
          { href: url, class: "navbar__logo" },
          name,
        );
      } else {
        return createEl(
          "div",
          {
            class: "navbar__list",
            id: "navbar__list",
          },
          url.map(({ name, url, type }) => {
            if (type === "cta") {
              return Button(name, "btn-accent", url);
            }
            return createEl(
              "a",
              {
                href: url,
                class: "navbar__link",
              },
              name,
            );
          }),
        );
      }
    }),
  );

  return nav;
}
