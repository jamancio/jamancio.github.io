import { config } from "../../config/config.js";

const { createEl } = config;

export function Button(
  buttonText,
  buttonType,
  buttonUrl,
  extraClass = "",
) {
  return createEl(
    "a",
    { class: `btn ${buttonType} ${extraClass}`, href: buttonUrl },
    buttonText,
  );
}
