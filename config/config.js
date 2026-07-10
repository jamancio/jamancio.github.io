import { autoImport } from "../modules/filesystem/autoImport.js";

const fileQueue = [
  "./helpers/helpers.js", 
  "./extensions/extensions.js"
];

export const config = await autoImport(fileQueue, import.meta.url);
