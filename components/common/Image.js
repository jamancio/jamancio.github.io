import { config } from "../../config/config.js";

const { createEl } = config;

export function Image(
  src,
  alt = "",
  className = "",
  loading = "lazy",
) {
  return createEl(
    "div",
    { class: "image__image-container" },
    createEl("img", {
      src,
      alt,
      class: `image__image ${className}`,
      loading,
    }),
  );
}
