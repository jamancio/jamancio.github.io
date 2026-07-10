import { AnimeHelper } from "../extensions/AnimeHelper.js";

export function createEl(
  tag,
  attr = {},
  contents,
  animation = null,
  eventListener = null,
) {
  const element = document.createElement(tag);
  if (attr) {
    Object.entries(attr).map(([key, value]) => {
      typeof value === "object"
        ? Object.entries(value).map(
            ([innerKey, innerValue]) =>
              (element[key][innerKey] = innerValue),
          )
        : element.setAttributeNS("", key, value);
    });
  }

  if (eventListener)
    Object.entries(eventListener).map(([key, value]) =>
      element.addEventListener(key, value),
    );

  if (animation) {
    const animeHelper = AnimeHelper
      ? new AnimeHelper(window.anime)
      : null;

    animeHelper.observe(element, animation);
  }

  if (contents == null) return element;
  let append = (items) => {
    if (items === "" || items == null) return;
    element.append(items);
  };
  Array.isArray(contents)
    ? contents.map((data) => append(data))
    : append(contents);

  return element;
}
