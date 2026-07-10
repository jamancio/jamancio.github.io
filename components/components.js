import { autoImport } from "../modules/filesystem/autoImport.js";

const fileQueue = [
  "./blocks/Container.js",
  "./blocks/Hero.js",
  "./blocks/Skillset.js",
  "./blocks/Blogs.js",
  "./blocks/Contact.js",
  "./common/Tabs.js",
  "./common/Navigation.js",
  "./common/Image.js",
  "./cards/CaseStudies.js",
  "./cards/RandD.js",
];

export const components = await autoImport(
  fileQueue,
  import.meta.url,
);
