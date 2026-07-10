import { config } from "../../config/config.js";

const { createEl } = config;

export function Container(
  element,
  className = "",
  id = "",
  tag = "section",
) {
  return createEl(
    tag,
    { class: `container ${className}`, id: id },
    element,
  );
}
