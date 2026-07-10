/**
 * Dynamically imports modules from the given paths and merges their exports.
 *
 * @param {string[]} paths - Array of relative paths (e.g. ["./child/child.js"])
 * @param {string} baseUrl - The caller's base URL (always pass `import.meta.url`)
 * @returns {Promise<Object>} - An object with all merged exports
 */
export async function autoImport(paths, baseUrl) {
  const mergedExports = {};

  await Promise.all(
    paths.map(async (filePath) => {
      const url = new URL(filePath, baseUrl).href;
      const moduleExports = await import(url);
      Object.assign(mergedExports, moduleExports);
    }),
  );

  return mergedExports;
}
