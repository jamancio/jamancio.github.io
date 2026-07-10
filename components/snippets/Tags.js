import { config } from "../../config/config.js";

const { createEl } = config;

export function Tags(tags) {
  return createEl(
    "div",
    { class: "content_tags" },
    tags.map((tag) => createEl("p", { class: "tag" }, `[ ${tag} ]`)),
  );
}
