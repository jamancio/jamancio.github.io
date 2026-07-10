import { config } from "./config/config.js";
import "./config/animations/animations-presets.js";
import { App } from "./App.js";
import { components } from "./components/components.js";
import { Mobile } from "./components/snippets/Mobile.js";

import { ComingSoon } from "./page/coming-soon.js";

const { createEl, createFrag, fetchContent } = config;
const {
  Container,
  Navigation,
  Hero,
  Skillset,
  Tabs,
  Blogs,
  Contact,
} = components;

const links = await fetchContent("navigation");
const heroContent = await fetchContent("hero");
const skillsContent = await fetchContent("skills");
const tabsContent = await fetchContent("case_study_r_and_d");
const blogsContent = await fetchContent("blogs");
const contactContent = await fetchContent("contact");

function renderHomePage() {
  if (window.matchMedia("(max-width: 1023px)").matches) {
    App("main", [Mobile()]);
  } else {
    App("main", [
      Navigation(links),
      Container(Hero(heroContent), "hero-section"),
      Skillset(skillsContent),
      createEl(
        "section",
        { class: "tab-section", id: "cs-rnd" },
        Tabs(tabsContent),
      ),
      Container(Blogs(blogsContent), "blogs-section", "about-me"),
      Contact(contactContent),
    ]);
  }
}

function renderComingSoon(type = "Pages") {
  App("main", [ComingSoon(type)]);
}

function router() {
  const hash = window.location.hash;

  if (hash.startsWith("#coming-soon")) {
    let type = "Pages";

    if (hash.includes("-") && hash !== "#coming-soon") {
      const parts = hash.split("-").slice(2);
      if (parts.length > 0) {
        type = parts
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      }
    }

    renderComingSoon(type);
  } else {
    renderHomePage();
  }
}

window.addEventListener("hashchange", router);
window.addEventListener("resize", () => {
  if (window.location.hash !== "#coming-soon") {
    renderHomePage();
  }
});

router();
